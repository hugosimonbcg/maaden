import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { matchPresetFromQuery } from '../../lib/aiMatch'
import { useShellStore } from '../../store/shellStore'
import { AiBarMeter } from './AiBarMeter'
import { AiButton } from './AiButton'
import { AiOrb } from './AiOrb'
import { AiPanel } from './AiPanel'

function routeTag(pathname: string): 'cost' | 'operations' | 'portfolio' | 'strategy' {
  if (pathname.startsWith('/operations')) return 'operations'
  if (pathname.startsWith('/portfolio')) return 'portfolio'
  if (pathname.startsWith('/strategy')) return 'strategy'
  return 'cost'
}

function phaseLabel(phase: string) {
  switch (phase) {
    case 'listening':
      return 'Listening'
    case 'thinking':
      return 'Computing'
    case 'speaking':
      return 'Output ready'
    default:
      return 'Idle'
  }
}

export function QueryBar() {
  const { pathname } = useLocation()
  const [q, setQ] = useState('')
  const openAiPreset = useShellStore((s) => s.openAiPreset)
  const setAiPhase = useShellStore((s) => s.setAiPhase)
  const aiPhase = useShellStore((s) => s.aiPhase)
  const drawerOpen = useShellStore((s) => s.aiDrawerOpen)

  const submit = () => {
    const trimmed = q.trim()
    if (!trimmed) return
    setAiPhase('thinking')
    window.setTimeout(() => {
      const preset = matchPresetFromQuery(trimmed, routeTag(pathname))
      openAiPreset({ ...preset, prompt: trimmed })
    }, 200)
  }

  return (
    <AiPanel className="border-b-0 rounded-none">
      <div className="flex flex-wrap items-stretch gap-4 px-6 py-4">
        <div className="flex shrink-0 items-center gap-3">
          <AiOrb phase={aiPhase} className="h-10 w-10" />
          <div className="hidden min-w-[120px] flex-col justify-center sm:flex">
            <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[color:var(--ai-text-muted)]">
              {phaseLabel(aiPhase)}
            </span>
            <AiBarMeter phase={aiPhase} className="mt-1 h-5 max-w-[100px]" />
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <label className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:var(--ai-text-muted)]">
            Interrogate the fact base
          </label>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-end">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && submit()}
              onFocus={() => {
                const s = useShellStore.getState()
                if (s.aiPhase === 'idle') s.setAiPhase('listening')
              }}
              onBlur={() => {
                requestAnimationFrame(() => {
                  const s = useShellStore.getState()
                  if (!s.aiDrawerOpen && s.aiPhase !== 'thinking' && s.aiPhase !== 'speaking') {
                    s.setAiPhase('idle')
                  }
                })
              }}
              placeholder="Ask a precise question — costs, yield, capital allocation, strategic position…"
              className="h-11 w-full rounded-sm border border-[color:var(--ai-edge)] bg-[color:var(--ai-panel-elevated)] px-4 text-[14px] text-[color:var(--ai-text)] placeholder:text-[color:var(--ai-text-muted)] focus:border-[color:var(--ai-accent)] focus:outline-none focus:ring-1 focus:ring-[color:var(--ai-accent)]"
            />
            <AiButton
              onClick={submit}
              showMeter={!drawerOpen}
              className="h-11 shrink-0 px-5 sm:min-w-[140px]"
            >
              Run analysis
            </AiButton>
          </div>
        </div>
      </div>
    </AiPanel>
  )
}
