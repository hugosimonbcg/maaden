import { useMemo } from 'react'
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceDot,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { phosphateInFlightProjects } from '../../data/seed/phosphateInFlightProjects'
import { usRockPhosphateSeries } from '../../data/seed/usaRockPhosphate'

function cumulativeProjectMt(year: number): number {
  let add = 0
  for (const p of phosphateInFlightProjects) {
    if (year >= p.year) add += p.deltaMt
  }
  return add
}

export function UsRockPhosphateChart() {
  const data = useMemo(() => {
    return usRockPhosphateSeries.map((row) => {
      const add = cumulativeProjectMt(row.year)
      return {
        ...row,
        production: Math.round((row.production + add) * 10) / 10,
      }
    })
  }, [])

  const productionByYear = useMemo(() => {
    const m = new Map<number, number>()
    for (const row of data) m.set(row.year, row.production)
    return m
  }, [data])

  const volMax = useMemo(() => {
    let m = 0
    for (const d of data) {
      m = Math.max(m, d.production, d.consumption)
    }
    return Math.min(95, Math.max(60, Math.ceil(m / 5) * 5 + 5))
  }, [data])

  const volTicks = useMemo(() => {
    const step = volMax <= 75 ? 10 : 15
    const out: number[] = []
    for (let t = 0; t <= volMax; t += step) out.push(t)
    if (out[out.length - 1] !== volMax) out.push(volMax)
    return out
  }, [volMax])

  const priceDomain = useMemo(() => {
    const v = data.map((d) => d.priceUsdPerTon)
    const mn = Math.min(...v)
    const mx = Math.max(...v)
    const pad = Math.max(8, (mx - mn) * 0.2)
    return [Math.floor(mn - pad), Math.ceil(mx + pad)] as [number, number]
  }, [data])

  return (
    <div className="w-full min-w-0">
      <div className="h-[min(420px,55vh)] w-full min-h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 58, right: 12, left: 2, bottom: 14 }}>
            <CartesianGrid stroke="var(--ma-line)" strokeOpacity={0.85} vertical={false} />
            <XAxis
              dataKey="year"
              tick={{ fontSize: 11, fill: 'var(--ma-muted)' }}
              tickMargin={8}
              minTickGap={28}
              tickFormatter={(y: number) => String(y)}
            />
            <YAxis
              yAxisId="vol"
              domain={[0, volMax]}
              ticks={volTicks}
              tick={{ fontSize: 11, fill: 'var(--ma-muted)' }}
              width={44}
              label={{
                value: 'Global rock phosphate (million tonnes)',
                angle: -90,
                position: 'insideLeft',
                offset: 12,
                style: { fill: 'var(--ma-muted)', fontSize: 11, fontWeight: 500 },
              }}
            />
            <YAxis
              yAxisId="price"
              orientation="right"
              domain={priceDomain}
              tick={{ fontSize: 11, fill: 'var(--ma-muted)' }}
              width={52}
              label={{
                value: 'Price (US$/t)',
                angle: 90,
                position: 'insideRight',
                offset: 10,
                style: { fill: 'var(--ma-muted)', fontSize: 11, fontWeight: 500 },
              }}
            />
            <Tooltip
              contentStyle={{
                borderRadius: 2,
                border: '1px solid var(--ma-line)',
                background: 'var(--ma-elevated)',
                color: 'var(--ma-ink)',
                fontSize: 12,
              }}
              formatter={(value, name) => {
                if (value == null) return ['', '']
                const n = String(name)
                if (n.includes('Price') || n.includes('US$/t')) return [`$${value}/t`, n]
                return [`${value} Mt`, n]
              }}
              labelFormatter={(y) => `Year ${y}`}
            />
            <Legend
              verticalAlign="top"
              align="left"
              wrapperStyle={{
                top: 4,
                left: 2,
                paddingLeft: 8,
                paddingRight: 10,
                paddingTop: 4,
                paddingBottom: 8,
                fontSize: 12,
                background: 'var(--ma-elevated)',
                border: '1px solid var(--ma-line)',
                borderRadius: 2,
                boxShadow: '0 1px 0 rgba(15,18,16,0.04)',
              }}
            />
            <Line
              yAxisId="vol"
              type="monotone"
              dataKey="production"
              name="Production"
              stroke="var(--ma-gold)"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
            <Line
              yAxisId="vol"
              type="monotone"
              dataKey="consumption"
              name="Apparent consumption"
              stroke="var(--ma-graphite)"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
            <Line
              yAxisId="price"
              type="monotone"
              dataKey="priceUsdPerTon"
              name="Price (US$/t)"
              stroke="var(--ma-teal)"
              strokeWidth={2}
              strokeDasharray="5 4"
              dot={false}
              isAnimationActive={false}
            />
            {phosphateInFlightProjects.map((p, i) => {
              const y = productionByYear.get(p.year)
              if (y == null) return null
              const labelPos = (['top', 'right', 'top'] as const)[i % 3]
              const labelOffset = labelPos === 'top' ? (i === 0 ? 8 : 14) : 6
              return (
                <ReferenceDot
                  key={p.id}
                  yAxisId="vol"
                  x={p.year}
                  y={y}
                  r={5}
                  fill="var(--ma-gold)"
                  stroke="var(--ma-elevated)"
                  strokeWidth={2}
                  label={{
                    value: p.markerLabel,
                    position: labelPos,
                    offset: labelOffset,
                    fill: 'var(--ma-ink)',
                    fontSize: 10,
                    fontWeight: 600,
                  }}
                />
              )
            })}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <p className="mt-4 w-full text-[12px] leading-relaxed text-ma-muted">
        Stylized 2012–2030 profile for phosphate strategy dialogue — not a live forecast. Production reflects cumulative
        +Mt/yr from each illustrative in-flight project from its milestone year onward; gold dots mark those projects on
        the curve. Apparent consumption is unchanged vs the base scenario. Teal dashed line: benchmark price
        (US$/t) for context — not a specific traded price index.
      </p>
    </div>
  )
}
