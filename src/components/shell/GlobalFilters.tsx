import type { GeographyFilter, PeerTier, PerformanceDimension, PersonaId, VerticalId, YearKey } from '../../data/types'
import { verticals } from '../../data/seed'
import { assetsForVertical } from '../../lib/selectors'

const years: YearKey[] = [2021, 2023, 2024, 2025, 2030]
const cohorts: { id: PeerTier; label: string }[] = [
  { id: 'peer_median', label: 'Peer median' },
  { id: 'top_quartile', label: 'Top quartile' },
  { id: 'best_in_world', label: 'Best-in-world' },
]
const geos: { id: GeographyFilter; label: string }[] = [
  { id: 'all', label: 'All geographies' },
  { id: 'ksa', label: 'KSA' },
  { id: 'gcc', label: 'GCC exposure' },
  { id: 'export_markets', label: 'Export markets' },
]
const dims: { id: PerformanceDimension | 'all'; label: string }[] = [
  { id: 'all', label: 'All dimensions' },
  { id: 'd1_assets', label: 'D1 · Assets & endowment' },
  { id: 'd2_operations', label: 'D2 · Operations & productivity' },
  { id: 'd3_cost_capital', label: 'D3 · Cost & capital efficiency' },
  { id: 'd4_marketing_mix', label: 'D4 · Marketing & mix' },
  { id: 'd5_org_enablers', label: 'D5 · Organisation & enablers' },
]

const personas: { id: PersonaId; label: string }[] = [
  { id: 'strategy', label: 'Strategy' },
  { id: 'performance', label: 'Performance' },
  { id: 'business_units', label: 'Business units' },
]

export function GlobalFilters({
  vertical,
  asset,
  year,
  cohort,
  geo,
  metricDim,
  persona,
  onVertical,
  onAsset,
  onYear,
  onCohort,
  onGeo,
  onMetricDim,
  onPersona,
}: {
  vertical: VerticalId | 'all'
  asset: string | 'all'
  year: YearKey
  cohort: PeerTier
  geo: GeographyFilter
  metricDim: PerformanceDimension | 'all'
  persona: PersonaId
  onVertical: (v: VerticalId | 'all') => void
  onAsset: (a: string | 'all') => void
  onYear: (y: YearKey) => void
  onCohort: (c: PeerTier) => void
  onGeo: (g: GeographyFilter) => void
  onMetricDim: (d: PerformanceDimension | 'all') => void
  onPersona: (p: PersonaId) => void
}) {
  const assetList = assetsForVertical(vertical)

  return (
    <div className="flex flex-wrap items-end gap-3 border-b border-ma-line bg-ma-bg px-6 py-3">
      <label className="flex flex-col gap-1 text-[10px] font-semibold uppercase tracking-wide text-ma-muted">
        Persona
        <select
          className="h-9 min-w-[140px] rounded-sm border border-ma-line bg-ma-elevated px-2 text-[13px] font-medium text-ma-ink"
          value={persona}
          onChange={(e) => onPersona(e.target.value as PersonaId)}
        >
          {personas.map((p) => (
            <option key={p.id} value={p.id}>
              {p.label}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1 text-[10px] font-semibold uppercase tracking-wide text-ma-muted">
        Vertical
        <select
          className="h-9 min-w-[160px] rounded-sm border border-ma-line bg-ma-elevated px-2 text-[13px] font-medium text-ma-ink"
          value={vertical}
          onChange={(e) => onVertical((e.target.value === 'all' ? 'all' : e.target.value) as VerticalId | 'all')}
        >
          <option value="all">All verticals</option>
          {verticals.map((v) => (
            <option key={v.id} value={v.id}>
              {v.label}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1 text-[10px] font-semibold uppercase tracking-wide text-ma-muted">
        Asset
        <select
          className="h-9 min-w-[200px] rounded-sm border border-ma-line bg-ma-elevated px-2 text-[13px] font-medium text-ma-ink"
          value={asset}
          onChange={(e) => onAsset(e.target.value as string | 'all')}
        >
          <option value="all">All assets</option>
          {assetList.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1 text-[10px] font-semibold uppercase tracking-wide text-ma-muted">
        Year
        <select
          className="h-9 min-w-[100px] rounded-sm border border-ma-line bg-ma-elevated px-2 text-[13px] font-medium text-ma-ink"
          value={year}
          onChange={(e) => onYear(Number(e.target.value) as YearKey)}
        >
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
              {y === 2030 ? ' · ambition' : ''}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1 text-[10px] font-semibold uppercase tracking-wide text-ma-muted">
        Peer cohort
        <select
          className="h-9 min-w-[140px] rounded-sm border border-ma-line bg-ma-elevated px-2 text-[13px] font-medium text-ma-ink"
          value={cohort}
          onChange={(e) => onCohort(e.target.value as PeerTier)}
        >
          {cohorts.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1 text-[10px] font-semibold uppercase tracking-wide text-ma-muted">
        Geography
        <select
          className="h-9 min-w-[150px] rounded-sm border border-ma-line bg-ma-elevated px-2 text-[13px] font-medium text-ma-ink"
          value={geo}
          onChange={(e) => onGeo(e.target.value as GeographyFilter)}
        >
          {geos.map((g) => (
            <option key={g.id} value={g.id}>
              {g.label}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1 text-[10px] font-semibold uppercase tracking-wide text-ma-muted">
        Metric lens
        <select
          className="h-9 min-w-[220px] rounded-sm border border-ma-line bg-ma-elevated px-2 text-[13px] font-medium text-ma-ink"
          value={metricDim}
          onChange={(e) => onMetricDim(e.target.value as PerformanceDimension | 'all')}
        >
          {dims.map((d) => (
            <option key={d.id} value={d.id}>
              {d.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  )
}
