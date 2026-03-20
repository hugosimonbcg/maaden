import { useMemo, useState } from 'react'
import { DapMinusWaterfall } from '../components/charts/DapMinusWaterfall'
import { SectorCostCurve } from '../components/charts/SectorCostCurve'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { AiButton } from '../components/ai/AiButton'
import { Button } from '../components/ui/Button'
import { Skeleton } from '../components/ui/Skeleton'
import { DrillDrawer } from '../components/ui/DrillDrawer'
import { useUrlFilters } from '../hooks/useUrlFilters'
import { usePersonaCopy } from '../hooks/usePersonaCopy'
import { useSimulatedLoad } from '../hooks/useSimulatedLoad'
import { assets, buildSectorCostCurve, costLevers } from '../data/seed'
import { findPresetById } from '../lib/aiMatch'
import { formatPct, formatSarM, formatUsdPerTon, peerTierLabel, quartileLabel } from '../lib/format'
import { overheadScenarioEbitdaSarM, scenarioTargetRatio } from '../lib/scenarios'
import { filterCosts } from '../lib/selectors'
import { useShellStore } from '../store/shellStore'
import type { YearKey } from '../data/types'

const scenarioModes = ['median', 'upper_quartile', 'best_in_world'] as const

const filterYears: YearKey[] = [2021, 2023, 2024, 2025, 2030]

export function CostBenchmarkPage() {
  const f = useUrlFilters()
  const loading = useSimulatedLoad()
  const openAiPreset = useShellStore((s) => s.openAiPreset)
  const copy = usePersonaCopy(f.persona, 'cost')

  const rows = useMemo(() => filterCosts(f.filterState), [f.filterState])
  const [drillTitle, setDrillTitle] = useState<string | null>(null)
  const [scenarioIdx, setScenarioIdx] = useState(1)

  const primary = rows[0]
  const avgQuartile = useMemo(() => {
    if (!rows.length) return 2
    const q = Math.round(rows.reduce((s, r) => s + r.quartile, 0) / rows.length)
    return Math.min(4, Math.max(1, q)) as 1 | 2 | 3 | 4
  }, [rows])

  const chartData = useMemo(() => {
    return rows
      .filter((r) => r.c1UsdPerTon > 0)
      .map((r) => {
        const a = assets.find((x) => x.id === r.assetId)
        const peerKey = f.cohort === 'maaden' ? 'peer_median' : f.cohort
        const peer =
          f.cohort === 'maaden'
            ? r.peerC1UsdPerTon.peer_median
            : r.peerC1UsdPerTon[peerKey as keyof typeof r.peerC1UsdPerTon]
        return {
          name: a?.shortCode ?? r.assetId,
          full: a?.name ?? r.assetId,
          maaden: r.c1UsdPerTon,
          peer,
          gap: r.c1UsdPerTon - peer,
        }
      })
  }, [rows, f.cohort])

  const sectorCurve = useMemo(() => buildSectorCostCurve(f.vertical, f.year, rows), [f.vertical, f.year, rows])

  const cohortBenchmarkUsd =
    primary && primary.c1UsdPerTon > 0 && f.cohort !== 'maaden'
      ? primary.peerC1UsdPerTon[f.cohort]
      : null

  const waterfall = useMemo(() => {
    const r = rows.find((x) => x.c1UsdPerTon > 0) ?? rows[0]
    if (!r) return []
    const b = r.breakdown
    const parts = [
      { label: 'Ore & mining', v: b.oreAndMining },
      { label: 'Reagents', v: b.reagents },
      { label: 'Energy', v: b.energy },
      { label: 'Labour', v: b.labour },
      { label: 'Maintenance', v: b.maintenance },
      { label: 'Other', v: b.other },
    ]
    let acc = 0
    return parts.map((p) => {
      const start = acc
      acc += p.v
      return { ...p, start, end: acc }
    })
  }, [rows])

  const heatmapRows = useMemo(() => {
    return rows
      .filter((r) => r.c1UsdPerTon > 0)
      .map((r) => {
        const a = assets.find((x) => x.id === r.assetId)
        const drivers = [
          { k: 'Ore', v: r.breakdown.oreAndMining },
          { k: 'Reagents', v: r.breakdown.reagents },
          { k: 'Energy', v: r.breakdown.energy },
          { k: 'Labour', v: r.breakdown.labour },
          { k: 'Maint.', v: r.breakdown.maintenance },
        ]
        const max = Math.max(...drivers.map((d) => d.v), 1)
        return {
          asset: a?.shortCode ?? r.assetId,
          cells: drivers.map((d) => ({ ...d, intensity: d.v / max })),
        }
      })
  }, [rows])

  const revenueProxySarM = 18500
  const scenarioMode = scenarioModes[scenarioIdx]
  const targetOh = primary
    ? scenarioTargetRatio(primary.overheadRatio, scenarioMode)
    : 0.12
  const ebitdaImpact = primary
    ? overheadScenarioEbitdaSarM({
        currentOverheadRatio: primary.overheadRatio,
        targetOverheadRatio: targetOh,
        revenueSarM: revenueProxySarM,
      })
    : 0

  const leverRows = costLevers.filter(
    (l) => f.vertical === 'all' || l.verticalId === f.vertical,
  )

  const valueAtStake = Math.round(chartData.reduce((s, d) => s + Math.max(0, d.gap) * 0.32, 0))

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    )
  }

  if (!rows.length) {
    return (
      <Card title="No rows for current filters">
        <p className="text-[14px] text-ma-muted">
          Adjust vertical, asset, year, or geography. Corporate overhead analytics often requires selecting the
          corporate platform asset explicitly.
        </p>
        <Button className="mt-4" variant="primary" onClick={() => f.setVertical('phosphate')}>
          Reset to phosphate vertical
        </Button>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-ma-muted">Cost competitiveness</p>
        <h2 className="mt-1 text-[22px] font-semibold tracking-tight text-ma-ink">{copy.headline}</h2>
        <p className="mt-2 max-w-[720px] text-[14px] leading-relaxed text-ma-muted">{copy.sub}</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-sm border border-ma-line bg-gradient-to-br from-ma-elevated to-ma-surface p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-ma-muted">Cost position</p>
              <p className="mt-2 text-[28px] font-semibold tabular-nums text-ma-ink">
                {primary && primary.c1UsdPerTon > 0 ? formatUsdPerTon(primary.c1UsdPerTon) : 'G&A view'}
              </p>
              <p className="mt-1 text-[13px] text-ma-muted">
                {primary && primary.c1UsdPerTon > 0
                  ? `Versus ${peerTierLabel(f.cohort)} on C1 cash cost — ${f.year}`
                  : `Overhead ratio ${formatPct((primary?.overheadRatio ?? 0) * 100, 2)} — ${f.year}`}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-ma-muted">Quartile (blend)</p>
              <p className="mt-2 text-[22px] font-semibold text-ma-teal">{quartileLabel(avgQuartile)}</p>
              <p className="mt-1 text-[13px] text-ma-muted">Value at stake (illustr.)</p>
              <p className="text-[18px] font-semibold tabular-nums text-ma-gold-dim">{formatSarM(valueAtStake)}</p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <AiButton onClick={() => openAiPreset(findPresetById('ai_c1_quartile')!)}>
              AI summary — quartile movement
            </AiButton>
            <AiButton onClick={() => openAiPreset(findPresetById('ai_overhead_ebitda')!)}>
              Overhead → EBITDA bridge
            </AiButton>
          </div>
        </div>
        <Card title="Suggested interrogations" subtitle="Structured prompts — no chat theatrics.">
          <ul className="space-y-2 text-[13px] leading-snug text-ma-graphite">
            <li>
              <button
                type="button"
                className="text-left font-medium text-ma-teal hover:underline"
                onClick={() => openAiPreset(findPresetById('ai_c1_quartile')!)}
              >
                Show Maaden C1 cost vs peer quartiles for 2023–2025
              </button>
            </li>
            <li>
              <button
                type="button"
                className="text-left font-medium text-ma-teal hover:underline"
                onClick={() => openAiPreset(findPresetById('ai_overhead_ebitda')!)}
              >
                If overhead ratio closes to top quartile, what is EBITDA impact?
              </button>
            </li>
            <li>
              <button
                type="button"
                className="text-left font-medium text-ma-teal hover:underline"
                onClick={() => openAiPreset(findPresetById('ai_cost_waterfall')!)}
              >
                Decompose C1 movement into drivers for the selected asset
              </button>
            </li>
          </ul>
        </Card>
      </div>

      <Card
        title="Sector cost curve — C1 cash cost"
        subtitle={
          sectorCurve
            ? `${sectorCurve.verticalLabel} · bars ordered low-cost → high-cost; width ∝ illustrative capacity, height ∝ unit C1. Maaden assets highlighted. Red dashed = merit-order envelope; amber line = ${peerTierLabel(f.cohort)} reference for the primary filtered row. External actors are synthetic for prototype narrative.`
            : 'Select an operating vertical to view a sector merit-order curve.'
        }
      >
        {!sectorCurve ? (
          <p className="text-[13px] text-ma-muted">
            Cost curves are available for phosphate, aluminum, and gold & base metals. Corporate-only views use
            overhead analytics elsewhere on this page.
          </p>
        ) : (
          <div className="w-full min-w-0">
            <SectorCostCurve
              model={sectorCurve}
              benchmarkUsdPerTon={cohortBenchmarkUsd}
              benchmarkLabel={
                cohortBenchmarkUsd != null ? `${peerTierLabel(f.cohort)} ref. (${f.year})` : undefined
              }
              onMaadenClick={(s) => {
                if (s.fullName) setDrillTitle(s.fullName)
              }}
            />
          </div>
        )}
      </Card>

      {(f.vertical === 'phosphate' || f.vertical === 'all') && (
        <Card
          title="DAP minus — indicative phosphate cost structure"
          subtitle="DAP-minus bridge in US$/t DAP P₂O₅ equivalent: market price less processing and input charges to implied margin. Same illustrative logic as executive phosphate benchmarking packs."
          action={
            <label className="flex shrink-0 flex-col items-end gap-1 text-[10px] font-semibold uppercase tracking-wide text-ma-muted">
              Year
              <select
                className="h-9 min-w-[104px] rounded-sm border border-ma-line bg-ma-elevated px-2 text-[13px] font-medium text-ma-ink"
                value={f.year}
                aria-label="DAP minus reference year"
                onChange={(e) => f.setYear(Number(e.target.value) as YearKey)}
              >
                {filterYears.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </label>
          }
        >
          <DapMinusWaterfall referenceYear={f.year} />
        </Card>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Cost driver waterfall" subtitle="Illustrative build for primary filtered row with C1.">
          <div className="flex h-[220px] items-end gap-2">
            {waterfall.map((w) => (
              <div key={w.label} className="flex flex-1 flex-col items-center gap-2">
                <div
                  className="w-full rounded-sm bg-ma-graphite transition-[height] duration-300 ease-out"
                  style={{
                    height: `${(w.v / (waterfall[waterfall.length - 1]?.end || 1)) * 180}px`,
                  }}
                />
                <span className="text-center text-[10px] font-medium uppercase tracking-wide text-ma-muted">
                  {w.label}
                </span>
                <span className="text-[12px] tabular-nums text-ma-ink">{formatUsdPerTon(w.v)}</span>
              </div>
            ))}
          </div>
          <AiButton className="mt-4" showMeter={false} onClick={() => openAiPreset(findPresetById('ai_cost_waterfall')!)}>
            Ask AI — waterfall narrative
          </AiButton>
        </Card>

        <Card title="Driver intensity heatmap" subtitle="Normalized within each asset for pattern recognition.">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-[11px]">
              <thead>
                <tr className="text-ma-muted">
                  <th className="py-2 pr-2 font-semibold">Asset</th>
                  {['Ore', 'Reagents', 'Energy', 'Labour', 'Maint.'].map((h) => (
                    <th key={h} className="p-2 font-semibold">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {heatmapRows.map((row) => (
                  <tr key={row.asset} className="border-t border-ma-line">
                    <td className="py-2 pr-2 font-semibold text-ma-ink">{row.asset}</td>
                    {row.cells.map((c) => (
                      <td key={c.k} className="p-1">
                        <div
                          className="h-8 rounded-sm border border-ma-line"
                          style={{
                            background: `color-mix(in srgb, var(--ma-teal) ${Math.round(12 + c.intensity * 55)}%, transparent)`,
                          }}
                          title={`${c.k}: ${c.v}`}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <AiButton className="mt-4" showMeter={false} onClick={() => openAiPreset(findPresetById('ai_heatmap')!)}>
            Ask AI — intensity interpretation
          </AiButton>
        </Card>
      </div>

      <Card
        title="Scenario — overhead convergence"
        subtitle="Slide to test gap closure vs peer median, top quartile, or best-in-world bands."
      >
        <input
          type="range"
          min={0}
          max={2}
          step={1}
          value={scenarioIdx}
          onChange={(e) => setScenarioIdx(Number(e.target.value))}
          className="w-full accent-ma-teal"
        />
        <div className="mt-3 flex flex-wrap items-center gap-3 text-[13px]">
          <Badge tone="gold">{scenarioMode.replace('_', ' ')}</Badge>
          <span className="text-ma-muted">Target overhead ratio</span>
          <span key={targetOh} className="font-semibold tabular-nums text-ma-ink">
            {formatPct(targetOh * 100, 2)}
          </span>
          <span className="text-ma-muted">Illustrative EBITDA uplift</span>
          <span key={ebitdaImpact} className="font-semibold tabular-nums text-ma-teal">
            {formatSarM(Math.round(ebitdaImpact))}
          </span>
        </div>
      </Card>

      <Card title="Levers — owners · timing · EBITDA" subtitle="Linked to SteerCo-style accountability.">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left text-[13px]">
            <thead>
              <tr className="border-b border-ma-line text-[10px] uppercase tracking-wide text-ma-muted">
                <th className="py-2 pr-4 font-semibold">Lever</th>
                <th className="py-2 pr-4 font-semibold">Owner</th>
                <th className="py-2 pr-4 font-semibold">Timing</th>
                <th className="py-2 pr-4 font-semibold">EBITDA</th>
                <th className="py-2 font-semibold" />
              </tr>
            </thead>
            <tbody>
              {leverRows.map((l) => (
                <tr key={l.id} className="border-b border-ma-line/80">
                  <td className="py-3 pr-4 font-medium text-ma-ink">{l.lever}</td>
                  <td className="py-3 pr-4 text-ma-muted">{l.owner}</td>
                  <td className="py-3 pr-4 text-ma-muted">{l.timing}</td>
                  <td className="py-3 pr-4 tabular-nums font-semibold text-ma-teal">
                    {formatSarM(l.ebitdaImpactSarM)}
                  </td>
                  <td className="py-3">
                    <AiButton showMeter={false} className="py-1 text-[11px]" onClick={() => openAiPreset(findPresetById('ai_actions_cost')!)}>
                      Ask AI
                    </AiButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <DrillDrawer
        open={!!drillTitle}
        title={drillTitle ?? ''}
        onClose={() => setDrillTitle(null)}
        footer={
          <AiButton onClick={() => openAiPreset(findPresetById('ai_c1_quartile')!)}>Ask AI about this asset</AiButton>
        }
      >
        <p className="text-[13px] text-ma-muted">
          Driver detail for {drillTitle}. In production this panel binds to ERP cost pools, historian tags, and peer
          normalization tables. Value-at-stake is computed with the same coefficients as the scenario engine.
        </p>
      </DrillDrawer>
    </div>
  )
}
