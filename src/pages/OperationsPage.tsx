import { useMemo, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Card } from '../components/ui/Card'
import { AiButton } from '../components/ai/AiButton'
import { Skeleton } from '../components/ui/Skeleton'
import { DrillDrawer } from '../components/ui/DrillDrawer'
import { useUrlFilters } from '../hooks/useUrlFilters'
import { usePersonaCopy } from '../hooks/usePersonaCopy'
import { useSimulatedLoad } from '../hooks/useSimulatedLoad'
import { assets } from '../data/seed'
import { downtimeParetoForAsset, funnelForAsset } from '../data/seed/operations'
import { findPresetById } from '../lib/aiMatch'
import { formatNumber, formatPct, peerTierLabel } from '../lib/format'
import { filterOps, filterOpsTrend } from '../lib/selectors'
import { useShellStore } from '../store/shellStore'

export function OperationsPage() {
  const f = useUrlFilters()
  const loading = useSimulatedLoad()
  const openAiPreset = useShellStore((s) => s.openAiPreset)
  const copy = usePersonaCopy(f.persona, 'operations')

  const rows = useMemo(() => filterOps(f.filterState), [f.filterState])
  const trendRows = useMemo(() => filterOpsTrend(f.filterState), [f.filterState])
  const [drill, setDrill] = useState<string | null>(null)

  const primary = rows[0]
  const assetForFunnel =
    f.asset !== 'all'
      ? f.asset
      : primary?.assetId ?? assets.find((a) => f.vertical === 'all' || a.verticalId === f.vertical)?.id ?? 'ph_waad'

  const funnel = funnelForAsset(assetForFunnel)
  const pareto = downtimeParetoForAsset(assetForFunnel)

  const peerCompare = useMemo(() => {
    if (!primary) return []
    const peerKey = f.cohort === 'maaden' ? 'peer_median' : f.cohort
    const peerYield =
      primary.peerYieldPct[peerKey as keyof typeof primary.peerYieldPct] ?? primary.peerYieldPct.peer_median
    return [
      { name: 'Maaden', yield: primary.yieldPct, oee: primary.oee, util: primary.utilization },
      { name: peerTierLabel(f.cohort), yield: peerYield, oee: primary.oee - 1.2, util: primary.utilization - 2 },
      { name: 'Best-in-world band', yield: primary.peerYieldPct.best_in_world, oee: 91, util: 94 },
    ]
  }, [primary, f.cohort])

  const trendChart = useMemo(() => {
    const byYear = new Map<number, typeof trendRows>()
    trendRows.forEach((r) => {
      const list = byYear.get(r.year) ?? []
      list.push(r)
      byYear.set(r.year, list)
    })
    return [2023, 2024, 2025, 2030].map((y) => {
      const list = byYear.get(y) ?? []
      const avg = (k: 'yieldPct' | 'oee' | 'energyGjPerTon') =>
        list.length ? list.reduce((s, r) => s + r[k], 0) / list.length : null
      return {
        year: String(y) + (y === 2030 ? ' A' : ''),
        yield: avg('yieldPct'),
        oee: avg('oee'),
        energy: avg('energyGjPerTon'),
      }
    })
  }, [trendRows])

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (!primary) {
    return (
      <Card title="No operational rows">
        <p className="text-[14px] text-ma-muted">Widen filters — try a specific asset and year with actuals.</p>
      </Card>
    )
  }

  const kpis = [
    { label: 'Recovery', value: formatPct(primary.recoveryPct, 1), hint: 'Mass balance reconciled' },
    { label: 'Yield', value: formatPct(primary.yieldPct, 1), hint: 'Finished product basis' },
    { label: 'OEE', value: formatPct(primary.oee, 1), hint: 'Overall equipment effectiveness' },
    { label: 'Utilization', value: formatPct(primary.utilization, 1), hint: 'Calendar time utilization' },
    {
      label: 'Downtime (unplanned)',
      value: `${formatNumber(primary.downtimeUnplannedHrs, 0)} hrs`,
      hint: 'CMMS classified',
    },
    {
      label: 'Energy intensity',
      value: `${formatNumber(primary.energyGjPerTon, 1)} GJ/t`,
      hint: 'Scope 1 & 2 allocated',
    },
    {
      label: 'Water intensity',
      value: `${formatNumber(primary.waterM3PerTon, 2)} m³/t`,
      hint: 'Withdrawal normalized',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-ma-muted">
          Operational performance & yield
        </p>
        <h2 className="mt-1 text-[22px] font-semibold tracking-tight text-ma-ink">{copy.headline}</h2>
        <p className="mt-2 max-w-[720px] text-[14px] leading-relaxed text-ma-muted">{copy.sub}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k) => (
          <button
            key={k.label}
            type="button"
            onClick={() => setDrill(k.label)}
            className="rounded-sm border border-ma-line bg-ma-elevated p-4 text-left transition-colors hover:border-ma-teal/40"
          >
            <p className="text-[10px] font-semibold uppercase tracking-wide text-ma-muted">{k.label}</p>
            <p className="mt-2 text-[20px] font-semibold tabular-nums text-ma-ink">{k.value}</p>
            <p className="mt-1 text-[11px] text-ma-muted">{k.hint}</p>
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card
          title="Yield funnel — loss tree"
          subtitle={`Asset context: ${assets.find((a) => a.id === assetForFunnel)?.name ?? assetForFunnel}`}
        >
          <div className="space-y-3">
            {funnel.map((s) => (
              <div key={s.stage} className="flex items-center gap-3">
                <div className="w-36 shrink-0 text-[12px] font-medium text-ma-graphite">{s.stage}</div>
                <div className="h-8 flex-1 rounded-sm bg-ma-surface">
                  <div
                    className="h-full rounded-sm bg-ma-graphite"
                    style={{ width: `${s.value}%` }}
                    title={`${s.value}%`}
                  />
                </div>
                <div className="w-14 text-right text-[12px] tabular-nums text-ma-muted">{s.value}%</div>
                {s.lossToNext != null && (
                  <button
                    type="button"
                    className="text-[11px] font-semibold text-ma-teal hover:underline"
                    onClick={() => openAiPreset(findPresetById('ai_ops_root')!)}
                  >
                    −{s.lossToNext}% loss
                  </button>
                )}
              </div>
            ))}
          </div>
        </Card>

        <Card title="Downtime Pareto" subtitle="Unplanned hours — reliability focus areas.">
          <div className="h-[240px] w-full min-w-0 min-h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={pareto}
                layout="vertical"
                margin={{ top: 4, right: 8, left: 120, bottom: 4 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--ma-line)" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: 'var(--ma-muted)' }} />
                <YAxis type="category" dataKey="category" width={110} tick={{ fontSize: 10, fill: 'var(--ma-muted)' }} />
                <Tooltip />
                <Bar dataKey="hours" fill="var(--ma-teal)" radius={[0, 2, 2, 0]} name="Hours" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <AiButton className="mt-3" showMeter={false} onClick={() => openAiPreset(findPresetById('ai_downtime')!)}>
            Ask AI — Pareto narrative
          </AiButton>
        </Card>
      </div>

      <Card title="Benchmark bands — yield · OEE · utilization" subtitle="Maaden vs cohort vs best-in-world band.">
        <div className="h-[280px] w-full min-w-0 min-h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={peerCompare} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--ma-line)" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--ma-muted)' }} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--ma-muted)' }} domain={[70, 100]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="yield" name="Yield %" fill="var(--ma-graphite)" radius={[2, 2, 0, 0]} />
              <Bar dataKey="oee" name="OEE %" fill="var(--ma-gold)" radius={[2, 2, 0, 0]} />
              <Bar dataKey="util" name="Util. %" fill="var(--ma-teal)" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card
        title="Trajectory — 2023–2025 actuals and 2030 ambition"
        subtitle="Averages across filtered assets; ambition row is strategic target envelope."
      >
        <div className="h-[300px] w-full min-w-0 min-h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendChart} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--ma-line)" />
              <XAxis dataKey="year" tick={{ fontSize: 11, fill: 'var(--ma-muted)' }} />
              <YAxis yAxisId="left" tick={{ fontSize: 11, fill: 'var(--ma-muted)' }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: 'var(--ma-muted)' }} />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="yield" name="Yield %" stroke="var(--ma-graphite)" strokeWidth={2} dot />
              <Line yAxisId="left" type="monotone" dataKey="oee" name="OEE %" stroke="var(--ma-teal)" strokeWidth={2} dot />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="energy"
                name="Energy GJ/t"
                stroke="var(--ma-gold)"
                strokeWidth={2}
                dot
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <AiButton onClick={() => openAiPreset(findPresetById('ai_ops_root')!)}>AI root-cause narrative</AiButton>
          <AiButton showMeter={false} onClick={() => openAiPreset(findPresetById('ai_c1_quartile')!)}>
            Link to cost position
          </AiButton>
          <AiButton showMeter={false} onClick={() => openAiPreset(findPresetById('ai_alloc_tradeoff')!)}>
            Link to capital tradeoffs
          </AiButton>
        </div>
      </Card>

      <DrillDrawer open={!!drill} title={drill ?? ''} onClose={() => setDrill(null)}>
        <p className="text-[13px] text-ma-muted">
          Detailed historian traces, mass balance exports, and maintenance work orders would populate this drawer in
          production. KPI: {drill}.
        </p>
      </DrillDrawer>
    </div>
  )
}
