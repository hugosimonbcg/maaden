import { useId } from 'react'
import { useNavigate } from 'react-router-dom'
import type { VerticalId } from '../../data/types'
import { actions } from '../../data/seed'
import { formatSarM } from '../../lib/format'
import { findPresetById } from '../../lib/aiMatch'
import { useShellStore } from '../../store/shellStore'
import { AiButton } from '../ai/AiButton'
import { Button } from '../ui/Button'

function statusLabel(status: string) {
  return status.replace('_', ' ')
}

export function ActionTrackerPanel({ vertical }: { vertical: VerticalId | 'all' }) {
  const navigate = useNavigate()
  const panelId = useId()
  const headingId = useId()
  const openAiPreset = useShellStore((s) => s.openAiPreset)
  const collapsed = useShellStore((s) => s.actionTrackerCollapsed)
  const setCollapsed = useShellStore((s) => s.setActionTrackerCollapsed)

  const rows = vertical === 'all' ? actions : actions.filter((a) => a.verticalId === vertical)

  return (
    <section
      aria-labelledby={headingId}
      className="border-t border-white/10 bg-ma-charcoal text-white"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-3">
        <h2
          id={headingId}
          className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ma-gold"
        >
          Action tracker · decision follow-through
        </h2>
        <button
          type="button"
          aria-expanded={!collapsed}
          aria-controls={panelId}
          aria-label={collapsed ? 'Expand action tracker table' : 'Collapse action tracker table'}
          onClick={() => setCollapsed(!collapsed)}
          className="min-h-10 min-w-[5.5rem] shrink-0 rounded-sm px-3 py-2 text-[12px] font-medium text-white/80 transition-colors hover:bg-white/[0.06] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ma-gold/70"
        >
          <span aria-hidden="true">{collapsed ? 'Expand' : 'Collapse'}</span>
        </button>
      </div>

      <div
        id={panelId}
        hidden={collapsed}
        className="overflow-x-auto px-6 pb-4"
      >
        <table className="w-full min-w-[720px] border-collapse text-left text-[12px]">
          <caption className="sr-only">
            Decision follow-through actions. Each row includes owner, value at stake, due date, status, and shortcuts to
            open the linked view or ask the AI copilot.
          </caption>
          <thead>
            <tr className="border-b border-white/15 text-[10px] uppercase tracking-wide text-white/75">
              <th scope="col" className="py-2 pr-4 font-semibold">
                Action
              </th>
              <th scope="col" className="py-2 pr-4 font-semibold">
                Owner
              </th>
              <th scope="col" className="py-2 pr-4 font-semibold">
                Value at stake
              </th>
              <th scope="col" className="py-2 pr-4 font-semibold">
                Due
              </th>
              <th scope="col" className="py-2 pr-4 font-semibold">
                Status
              </th>
              <th scope="col" className="py-2 text-right font-semibold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((a) => (
              <tr key={a.id} className="border-b border-white/[0.06]">
                <th scope="row" className="py-2 pr-4 text-left font-medium text-white">
                  {a.title}
                </th>
                <td className="py-2 pr-4 text-white/85">{a.owner}</td>
                <td className="py-2 pr-4 tabular-nums text-white">{formatSarM(a.valueAtStakeSarM)}</td>
                <td className="py-2 pr-4 text-white/85">{a.dueDate}</td>
                <td className="py-2 pr-4">
                  <span
                    className={`inline-flex rounded-sm border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                      a.status === 'done'
                        ? 'border-emerald-300/50 bg-emerald-950/70 text-emerald-50'
                        : a.status === 'blocked'
                          ? 'border-red-300/45 bg-red-950/70 text-red-50'
                          : a.status === 'in_progress'
                            ? 'border-amber-300/50 bg-amber-950/70 text-amber-50'
                            : 'border-white/30 bg-white/12 text-white'
                    }`}
                  >
                    {statusLabel(a.status)}
                  </span>
                </td>
                <td className="py-2">
                  <div className="flex flex-wrap justify-end gap-2">
                    <Button
                      variant="secondary"
                      className="border-white/20 bg-transparent text-white hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50"
                      aria-label={`Open benchmark view for action: ${a.title}`}
                      onClick={() => navigate(`${a.linkedRoute}?vertical=${a.verticalId}`)}
                    >
                      Open
                    </Button>
                    <AiButton
                      showMeter={false}
                      className="!border-white/30 !bg-transparent !text-white !shadow-none hover:!bg-white/10 focus-visible:!outline focus-visible:!outline-2 focus-visible:!outline-offset-2 focus-visible:!outline-white/50"
                      aria-label={`Ask AI about action: ${a.title}`}
                      onClick={() => {
                        const p = findPresetById(a.suggestedPromptId)
                        if (p) openAiPreset(p)
                      }}
                    >
                      Ask AI
                    </AiButton>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
