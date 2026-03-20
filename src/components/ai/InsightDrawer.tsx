import { findPresetById } from '../../lib/aiMatch'
import { useShellStore } from '../../store/shellStore'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'
import { AiBarMeter } from './AiBarMeter'
import { AiOrb } from './AiOrb'
import { AiPanel } from './AiPanel'

const sourceLabels: Record<string, string> = {
  erp: 'ERP',
  historian: 'Historian',
  investor_filings: 'Filings',
  capital_iq: 'Capital IQ',
  woodmac: 'WoodMac',
  public: 'Public',
  bloomberg: 'Bloomberg',
}

export function InsightDrawer() {
  const { aiDrawerOpen, aiActivePreset, setAiDrawerOpen, openAiPreset, aiPhase } = useShellStore()

  if (!aiDrawerOpen || !aiActivePreset) return null

  return (
    <aside className="fixed right-0 top-0 z-40 flex h-full w-[min(420px,100vw)] max-w-full flex-col border-l border-[color:var(--ai-edge)] bg-[color:var(--ai-panel-bg)] shadow-[-8px_0_0_0_rgba(0,0,0,0.25)]">
      <AiPanel className="flex flex-col rounded-none border-0 border-b border-[color:var(--ai-edge)] shadow-none">
        <div className="flex items-start justify-between gap-3 px-5 py-4">
          <div className="flex min-w-0 flex-1 items-start gap-3">
            <AiOrb phase={aiPhase} className="h-9 w-9 shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[color:var(--ai-text-muted)]">
                Agent output
              </p>
              <p className="mt-2 text-[13px] font-medium leading-snug text-[color:var(--ai-text)]">
                {aiActivePreset.prompt}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            className="shrink-0 border border-[color:var(--ai-edge)] bg-[color:var(--ai-panel-elevated)] text-[color:var(--ai-text-muted)] hover:text-[color:var(--ai-text)]"
            onClick={() => setAiDrawerOpen(false)}
          >
            Close
          </Button>
        </div>
        <div className="flex items-center justify-between border-t border-[color:var(--ai-edge)] px-5 py-2">
          <span className="text-[9px] font-semibold uppercase tracking-wider text-[color:var(--ai-text-muted)]">
            Signal
          </span>
          <AiBarMeter phase={aiPhase} className="h-4 w-24" />
        </div>
      </AiPanel>
      <div className="flex flex-1 flex-col overflow-y-auto bg-[color:var(--ai-panel-bg)] px-5 py-4">
        <div className="relative overflow-hidden">
          <span
            className="pointer-events-none absolute inset-y-0 left-0 z-[1] w-px bg-[color:var(--ai-accent)] ai-cursor-scan opacity-80 motion-reduce:animate-none"
            aria-hidden
          />
          <p className="relative text-[14px] leading-relaxed text-[color:var(--ai-text)]">
            {aiActivePreset.response.summary}
          </p>
        </div>
        <h3 className="mt-6 text-[11px] font-semibold uppercase tracking-wide text-[color:var(--ai-text-muted)]">
          Reasoning trace
        </h3>
        <ul className="mt-2 list-disc space-y-2 pl-4 text-[13px] leading-snug text-[color:var(--ai-text)] opacity-90">
          {aiActivePreset.response.reasoning.map((r, i) => (
            <li key={i}>{r}</li>
          ))}
        </ul>
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-semibold uppercase text-[color:var(--ai-text-muted)]">Confidence</span>
          <span className="rounded-sm border border-[color:var(--ai-edge)] bg-[color:var(--ai-panel-elevated)] px-2 py-0.5 text-[11px] font-semibold tabular-nums text-[color:var(--ai-accent)]">
            {Math.round(aiActivePreset.response.confidence * 100)}%
          </span>
        </div>
        <h3 className="mt-6 text-[11px] font-semibold uppercase tracking-wide text-[color:var(--ai-text-muted)]">
          Source lineage
        </h3>
        <div className="mt-2 flex flex-wrap gap-2">
          {aiActivePreset.response.sources.map((s) => (
            <Badge key={s} tone="gold">
              {sourceLabels[s] ?? s}
            </Badge>
          ))}
        </div>
        <ul className="mt-3 space-y-1 text-[12px] text-[color:var(--ai-text-muted)]">
          {aiActivePreset.response.lineage.map((l, i) => (
            <li key={i}>{l}</li>
          ))}
        </ul>
        <h3 className="mt-6 text-[11px] font-semibold uppercase tracking-wide text-[color:var(--ai-text-muted)]">
          Suggested next actions
        </h3>
        <div className="mt-2 flex flex-col gap-2">
          {aiActivePreset.response.followUps.map((fu) => (
            <button
              key={fu.promptId}
              type="button"
              onClick={() => {
                const p = findPresetById(fu.promptId)
                if (p) openAiPreset(p)
              }}
              className="rounded-sm border border-[color:var(--ai-edge)] bg-[color:var(--ai-panel-elevated)] px-3 py-2.5 text-left text-[13px] font-medium text-[color:var(--ai-accent)] transition-[transform,opacity] duration-150 ease-out hover:border-[color:var(--ai-accent)] hover:translate-x-0.5"
            >
              {fu.label}
            </button>
          ))}
        </div>
      </div>
    </aside>
  )
}
