import { useMemo, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from 'recharts'
import { Card } from '../components/ui/Card'
import { AiButton } from '../components/ai/AiButton'
import { Badge } from '../components/ui/Badge'
import { Skeleton } from '../components/ui/Skeleton'
import { useUrlFilters } from '../hooks/useUrlFilters'
import { usePersonaCopy } from '../hooks/usePersonaCopy'
import { useSimulatedLoad } from '../hooks/useSimulatedLoad'
import { capitalAllocation, portfolioItems, verticals } from '../data/seed'
import { findPresetById } from '../lib/aiMatch'
import { formatNumber, formatPct } from '../lib/format'
import { filterPortfolio } from '../lib/selectors'
import { useShellStore } from '../store/shellStore'

export function PortfolioPage() {
  const f = useUrlFilters()
  const loading = useSimulatedLoad()
  const openAiPreset = useShellStore((s) => s.openAiPreset)
  const copy = usePersonaCopy(f.persona, 'portfolio')

  const items = useMemo(() => filterPortfolio(f.vertical), [f.vertical])
  const [shift, setShift] = useState(3)

  const bubbleData = useMemo(
    () =>
      portfolioItems.map((p) => ({
        name: p.name,
        risk: p.projectRisk,
        roic: p.roic,
        z: p.expectedEbitdaSarM,
        kind: p.kind,
      })),
    [],
  )

  const matrix = verticals.map((v) => {
    const cur = capitalAllocation.current.find((c) => c.verticalId === v.id)?.pct ?? 0
    const rec = capitalAllocation.recommended.find((c) => c.verticalId === v.id)?.pct ?? 0
    const adj = Math.max(0, Math.min(100, rec + (shift - 3) * 0.8))
    return { ...v, current: cur, recommended: rec, adjusted: adj }
  })

  const blendedRoic =
    items.filter((i) => i.kind === 'operating_asset').reduce((s, i) => s + i.roic, 0) /
    Math.max(1, items.filter((i) => i.kind === 'operating_asset').length)

  const blendedRoche =
    items.filter((i) => i.kind === 'operating_asset').reduce((s, i) => s + i.roce, 0) /
    Math.max(1, items.filter((i) => i.kind === 'operating_asset').length)

  const capexEff =
    items.reduce((s, i) => s + i.capexEfficiency, 0) / Math.max(1, items.length)

  const vas = items.reduce((s, i) => s + i.expectedEbitdaSarM * 0.06, 0)

  const ebitdaDelta = Math.round(40 + shift * 18)
  const roicDelta = shift * 0.12

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-72 w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-ma-muted">
          Portfolio value & capital allocation
        </p>
        <h2 className="mt-1 text-[22px] font-semibold tracking-tight text-ma-ink">{copy.headline}</h2>
        <p className="mt-2 max-w-[760px] text-[14px] leading-relaxed text-ma-muted">{copy.sub}</p>
      </div>

      <div className="grid gap-3 lg:grid-cols-5">
        {[
          { label: 'Blended ROIC', value: formatPct(blendedRoic, 1) },
          { label: 'Blended ROCE', value: formatPct(blendedRoche, 1) },
          { label: 'Capital intensity (idx)', value: formatNumber(1.02, 2) },
          { label: 'Capex efficiency (avg)', value: formatNumber(capexEff, 2) },
          { label: 'Value at stake (illustr.)', value: `SAR ${Math.round(vas)}M` },
        ].map((k) => (
          <div key={k.label} className="rounded-sm border border-ma-line bg-ma-elevated p-4">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-ma-muted">{k.label}</p>
            <p className="mt-2 text-[18px] font-semibold tabular-nums text-ma-ink">{k.value}</p>
          </div>
        ))}
      </div>

      <Card
        title="Risk–return positioning"
        subtitle="Bubble area ∝ expected EBITDA contribution (illustrative). Click Ask AI for tradeoffs."
      >
        <div className="h-[340px] w-full min-w-0 min-h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--ma-line)" />
              <XAxis
                type="number"
                dataKey="risk"
                name="Risk"
                domain={[0.5, 5.5]}
                tick={{ fontSize: 11, fill: 'var(--ma-muted)' }}
              />
              <YAxis
                type="number"
                dataKey="roic"
                name="ROIC %"
                domain={[8, 20]}
                tick={{ fontSize: 11, fill: 'var(--ma-muted)' }}
              />
              <ZAxis type="number" dataKey="z" range={[80, 800]} />
              <Tooltip
                cursor={{ strokeDasharray: '3 3' }}
                formatter={(v, name) => [typeof v === 'number' ? v : v ?? '', String(name ?? '')]}
                contentStyle={{ background: 'var(--ma-elevated)', border: '1px solid var(--ma-line)' }}
              />
              <Legend />
              <Scatter name="Initiatives & assets" data={bubbleData} fill="var(--ma-teal)">
                {bubbleData.map((_, i) => (
                  <Cell
                    key={i}
                    fill={bubbleData[i].kind === 'growth_initiative' ? 'var(--ma-teal)' : 'var(--ma-graphite)'}
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
        <AiButton className="mt-3" onClick={() => openAiPreset(findPresetById('ai_alloc_tradeoff')!)}>
          AI — allocation & tradeoffs
        </AiButton>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Capital allocation matrix" subtitle="Current vs recommended vs scenario-adjusted mix.">
          <div className="h-[260px] w-full min-w-0 min-h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={matrix} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--ma-line)" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: 'var(--ma-muted)' }} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--ma-muted)' }} domain={[0, 50]} />
                <Tooltip formatter={(v) => `${formatNumber(typeof v === 'number' ? v : Number(v), 1)}%`} />
                <Legend />
                <Bar dataKey="current" name="Current %" fill="var(--ma-gold)" radius={[2, 2, 0, 0]} />
                <Bar dataKey="recommended" name="Recommended %" fill="var(--ma-graphite)" radius={[2, 2, 0, 0]} />
                <Bar dataKey="adjusted" name="Scenario %" fill="var(--ma-teal)" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Reallocation scenario" subtitle="Stress-test marginal shifts while holding sustaining floors.">
          <label className="text-[11px] font-semibold uppercase tracking-wide text-ma-muted">
            Shift aggressiveness
          </label>
          <input
            type="range"
            min={0}
            max={6}
            value={shift}
            onChange={(e) => setShift(Number(e.target.value))}
            className="mt-2 w-full accent-ma-teal"
          />
          <div className="mt-4 grid grid-cols-2 gap-3 text-[13px]">
            <div className="rounded-sm border border-ma-line bg-ma-surface p-3">
              <p className="text-[10px] font-semibold uppercase text-ma-muted">EBITDA (illustr.)</p>
              <p key={ebitdaDelta} className="mt-1 text-[20px] font-semibold text-ma-teal">
                +SAR {ebitdaDelta}M
              </p>
            </div>
            <div className="rounded-sm border border-ma-line bg-ma-surface p-3">
              <p className="text-[10px] font-semibold uppercase text-ma-muted">Group ROIC delta</p>
              <p key={roicDelta} className="mt-1 text-[20px] font-semibold text-ma-ink">
                +{formatNumber(roicDelta, 2)} pts
              </p>
            </div>
          </div>
          <p className="mt-3 text-[12px] text-ma-muted">
            Risk profile: <Badge tone="gold">Moderate</Badge> shift preserves smelter resilience envelope.
          </p>
        </Card>
      </div>

      <Card title="Project capex efficiency" subtitle="Schedule integrity, budget variance, payback, strategic fit.">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] border-collapse text-left text-[13px]">
            <thead>
              <tr className="border-b border-ma-line text-[10px] uppercase tracking-wide text-ma-muted">
                <th className="py-2 pr-4 font-semibold">Initiative / asset</th>
                <th className="py-2 pr-4 font-semibold">Capex eff.</th>
                <th className="py-2 pr-4 font-semibold">Schedule var.</th>
                <th className="py-2 pr-4 font-semibold">Budget var.</th>
                <th className="py-2 pr-4 font-semibold">Payback (mo)</th>
                <th className="py-2 pr-4 font-semibold">Strategic fit</th>
                <th className="py-2 font-semibold" />
              </tr>
            </thead>
            <tbody>
              {portfolioItems.map((p) => (
                <tr key={p.id} className="border-b border-ma-line/80">
                  <td className="py-3 pr-4 font-medium text-ma-ink">{p.name}</td>
                  <td className="py-3 pr-4 tabular-nums">{formatNumber(p.capexEfficiency, 2)}</td>
                  <td className="py-3 pr-4 tabular-nums">{formatPct(p.scheduleVariancePct, 0)}</td>
                  <td className="py-3 pr-4 tabular-nums">{formatPct(p.budgetVariancePct, 0)}</td>
                  <td className="py-3 pr-4 tabular-nums">{p.paybackMonths || '—'}</td>
                  <td className="py-3 pr-4 tabular-nums">{p.strategicFit}</td>
                  <td className="py-3">
                    <AiButton showMeter={false} className="py-1 text-[11px]" onClick={() => openAiPreset(findPresetById('ai_roic_sensitivity')!)}>
                      Ask AI
                    </AiButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
