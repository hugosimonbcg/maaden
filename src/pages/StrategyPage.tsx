import { useMemo, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Card } from '../components/ui/Card'
import { AiButton } from '../components/ai/AiButton'
import { Badge } from '../components/ui/Badge'
import { Skeleton } from '../components/ui/Skeleton'
import { useUrlFilters } from '../hooks/useUrlFilters'
import { usePersonaCopy } from '../hooks/usePersonaCopy'
import { useSimulatedLoad } from '../hooks/useSimulatedLoad'
import {
  marketExposure,
  peerArchetypes,
  productMixMatrix,
  strategicOptions,
  valueChainNodes,
} from '../data/seed'
import { findPresetById } from '../lib/aiMatch'
import { formatSarM } from '../lib/format'
import { useShellStore } from '../store/shellStore'
import { UsRockPhosphateChart } from '../components/charts/UsRockPhosphateChart'

type StrategyLensCopy = {
  headline: string
  sub: string
  forwardHeadline: string
  forwardSub: string
}

export function StrategyPage() {
  const f = useUrlFilters()
  const loading = useSimulatedLoad()
  const openAiPreset = useShellStore((s) => s.openAiPreset)
  const copy = usePersonaCopy(f.persona, 'strategy') as StrategyLensCopy
  const [strategyLens, setStrategyLens] = useState<'backward' | 'forward'>('backward')

  const chain = useMemo(() => {
    if (f.vertical === 'all') return valueChainNodes
    return valueChainNodes.filter((v) => v.verticalId === f.vertical)
  }, [f.vertical])

  const mix = useMemo(() => {
    if (f.vertical === 'all') return productMixMatrix
    return productMixMatrix.filter((m) => m.verticalId === f.vertical)
  }, [f.vertical])

  const exposureChart = marketExposure.map((m) => ({
    name: `${m.region} · ${m.segment}`,
    share: m.sharePct,
    margin: m.marginIndicator,
  }))

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  const positionStyles: Record<string, string> = {
    lead: 'border-ma-teal bg-ma-teal/10',
    competitive: 'border-ma-gold/50 bg-ma-gold/10',
    developing: 'border-ma-line bg-ma-surface',
    exposed: 'border-ma-risk/40 bg-ma-risk/10',
  }

  const headline = strategyLens === 'backward' ? copy.headline : copy.forwardHeadline
  const sub = strategyLens === 'backward' ? copy.sub : copy.forwardSub

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-ma-muted">Strategy outlook</p>
          <h2 className="mt-1 text-[22px] font-semibold tracking-tight text-ma-ink">{headline}</h2>
          <p className="mt-2 max-w-[760px] text-[14px] leading-relaxed text-ma-muted">{sub}</p>
        </div>
        <div
          className="flex shrink-0 rounded-sm border border-ma-line bg-ma-surface p-0.5"
          role="group"
          aria-label="Strategy horizon"
        >
          <button
            type="button"
            onClick={() => setStrategyLens('backward')}
            className={`rounded-sm px-3 py-2 text-[11px] font-semibold uppercase tracking-wide transition-colors ${
              strategyLens === 'backward'
                ? 'bg-ma-charcoal text-white'
                : 'text-ma-muted hover:text-ma-ink'
            }`}
          >
            Backward
          </button>
          <button
            type="button"
            onClick={() => setStrategyLens('forward')}
            className={`rounded-sm px-3 py-2 text-[11px] font-semibold uppercase tracking-wide transition-colors ${
              strategyLens === 'forward'
                ? 'bg-ma-charcoal text-white'
                : 'text-ma-muted hover:text-ma-ink'
            }`}
          >
            Forward
          </button>
        </div>
      </div>

      <Card
        title="Rock phosphate — production & apparent consumption"
        subtitle="Global rock phosphate (million tonnes), 2012–2030: production, apparent consumption, illustrative benchmark price, with production-line milestones for named in-flight projects (Wa'ad Al Shamal, Ras Al Khair, Phosphate 3 expansion) — for aggregate balance, trade, and cycle dialogue."
      >
        <UsRockPhosphateChart />
      </Card>

      <Card title="Value chain positioning" subtitle="Where Maaden leads, competes, or must close gaps.">
        <div className="grid gap-3 md:grid-cols-2">
          {chain.map((n) => (
            <div
              key={n.id}
              className={`rounded-sm border p-4 ${positionStyles[n.maadenPosition] ?? 'border-ma-line bg-ma-elevated'}`}
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-[14px] font-semibold text-ma-ink">{n.stage}</h3>
                <Badge tone="neutral">{n.maadenPosition}</Badge>
              </div>
              <p className="mt-2 text-[13px] leading-snug text-ma-muted">{n.description}</p>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Product mix — commodity vs VAP" subtitle="Share of tonnes / revenue proxy (illustrative).">
          <div className="space-y-4">
            {mix.map((m) => (
              <div key={m.verticalId}>
                <div className="flex justify-between text-[12px] font-semibold text-ma-graphite">
                  <span className="capitalize">{m.verticalId.replace(/_/g, ' ')}</span>
                  <span className="text-ma-muted">Margin rank {m.marginRank}</span>
                </div>
                <div className="mt-2 flex h-3 overflow-hidden rounded-sm border border-ma-line">
                  <div className="bg-ma-graphite" style={{ width: `${m.commodityPct}%` }} title="Commodity" />
                  <div className="bg-ma-teal" style={{ width: `${m.vapPct}%` }} title="VAP" />
                </div>
                <div className="mt-1 flex justify-between text-[11px] text-ma-muted">
                  <span>Commodity {m.commodityPct}%</span>
                  <span>VAP {m.vapPct}%</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Market exposure" subtitle="Geography × segment — where returns are earned or thinned.">
          <div className="h-[260px] w-full min-w-0 min-h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={exposureChart} layout="vertical" margin={{ top: 4, right: 8, left: 8, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--ma-line)" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: 'var(--ma-muted)' }} />
                <YAxis type="category" dataKey="name" width={160} tick={{ fontSize: 10, fill: 'var(--ma-muted)' }} />
                <Tooltip />
                <Bar dataKey="share" fill="var(--ma-graphite)" name="Share %" radius={[0, 2, 2, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card title="Peer archetypes & exemplars" subtitle="Mining peers plus non-mining best-in-world references.">
        <div className="grid gap-4 md:grid-cols-2">
          {peerArchetypes.map((a) => (
            <div key={a.id} className="rounded-sm border border-ma-line bg-ma-elevated p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-[14px] font-semibold text-ma-ink">{a.name}</h3>
                  <p className="mt-1 text-[12px] text-ma-muted">{a.focus}</p>
                </div>
                <Badge tone={a.type === 'mining_peer' ? 'teal' : 'gold'}>
                  {a.type === 'mining_peer' ? 'Mining peer' : 'Exemplar'}
                </Badge>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3 text-[12px]">
                <div>
                  <p className="text-[10px] font-semibold uppercase text-ma-muted">Strengths</p>
                  <ul className="mt-1 list-disc pl-4 text-ma-graphite">
                    {a.strengths.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase text-ma-muted">Watchouts</p>
                  <ul className="mt-1 list-disc pl-4 text-ma-graphite">
                    {a.watchouts.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Strategic options" subtitle="Theses with explicit risks — not undebated growth wishlists.">
        <div className="grid gap-4 lg:grid-cols-3">
          {strategicOptions
            .filter((o) => f.vertical === 'all' || o.verticalId === f.vertical)
            .map((o) => (
              <div key={o.id} className="flex flex-col rounded-sm border border-ma-line bg-ma-surface p-4">
                <h3 className="text-[14px] font-semibold text-ma-ink">{o.title}</h3>
                <p className="mt-2 text-[13px] leading-snug text-ma-graphite">{o.thesis}</p>
                <p className="mt-2 text-[12px] text-ma-muted">{o.rationale}</p>
                <ul className="mt-2 list-disc pl-4 text-[12px] text-ma-risk">
                  {o.risks.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
                <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-4">
                  <span className="text-[12px] font-semibold text-ma-teal">{formatSarM(o.expectedValueSarM)} EV</span>
                  <span className="text-[11px] text-ma-muted">{o.horizon}</span>
                </div>
              </div>
            ))}
        </div>
      </Card>

      <Card title="Strategy copilot — interrogations" subtitle="Precision questions tuned to this fact base.">
        <div className="flex flex-col gap-2">
          {[
            { id: 'ai_right_to_win', q: 'Where do we have the biggest right-to-win gap?' },
            { id: 'ai_growth_returns', q: 'Which growth plays improve strategic position without destroying returns?' },
            { id: 'ai_alloc_tradeoff', q: 'What reallocations improve ROIC at acceptable risk?' },
          ].map((x) => (
            <button
              key={x.id}
              type="button"
              onClick={() => openAiPreset(findPresetById(x.id)!)}
              className="rounded-sm border border-ma-line bg-ma-elevated px-4 py-3 text-left text-[13px] font-medium text-ma-teal hover:border-ma-teal/40"
            >
              {x.q}
            </button>
          ))}
        </div>
        <AiButton className="mt-4" onClick={() => openAiPreset(findPresetById('ai_right_to_win')!)}>
          Open full AI trace
        </AiButton>
      </Card>
    </div>
  )
}
