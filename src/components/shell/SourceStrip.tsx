import { sourceFreshness } from '../../data/seed'
import { Badge } from '../ui/Badge'

const labels: Record<string, string> = {
  erp: 'ERP',
  historian: 'Historian',
  investor_filings: 'Investor filings',
  capital_iq: 'Capital IQ',
  woodmac: 'WoodMac',
  public: 'Public sources',
  bloomberg: 'Bloomberg',
}

export function SourceStrip() {
  const internal = sourceFreshness.filter((s) => s.kind === 'internal')
  const external = sourceFreshness.filter((s) => s.kind === 'external')

  return (
    <div className="flex flex-wrap items-center gap-3 border-b border-ma-line bg-ma-surface px-6 py-2">
      <span className="text-[10px] font-semibold uppercase tracking-wide text-ma-muted">Sources</span>
      <div className="flex flex-wrap gap-2">
        {sourceFreshness.map((s) => (
          <span
            key={s.source}
            className="inline-flex items-center gap-1 rounded-sm border border-ma-line bg-ma-elevated px-2 py-1 text-[11px] text-ma-graphite"
          >
            {labels[s.source] ?? s.label}
            <Badge tone={s.status === 'current' ? 'teal' : s.status === 'stale' ? 'risk' : 'muted'}>
              {s.status}
            </Badge>
          </span>
        ))}
      </div>
      <div className="ml-auto flex flex-wrap gap-2 text-[11px] text-ma-muted">
        <span>
          Internal actuals:{' '}
          <strong className="text-ma-teal">
            {internal.every((x) => x.status === 'current') ? 'Current' : 'Check'}
          </strong>
        </span>
        <span className="text-ma-line">|</span>
        <span>
          External peer:{' '}
          <strong className="text-ma-amber-warn">
            {external.some((x) => x.status === 'stale') ? 'Partial refresh' : 'Synchronized'}
          </strong>
        </span>
      </div>
    </div>
  )
}
