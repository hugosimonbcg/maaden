import { useMemo } from 'react'
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { usRockPhosphateSeries } from '../../data/seed/usaRockPhosphate'

export function UsRockPhosphateChart() {
  const data = useMemo(() => usRockPhosphateSeries, [])

  return (
    <div className="w-full min-w-0">
      <div className="h-[min(420px,55vh)] w-full min-h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 12, left: 2, bottom: 8 }}>
            <CartesianGrid stroke="var(--ma-line)" strokeOpacity={0.85} vertical={false} />
            <XAxis
              dataKey="year"
              tick={{ fontSize: 11, fill: 'var(--ma-muted)' }}
              tickMargin={8}
              minTickGap={28}
              tickFormatter={(y: number) => String(y)}
            />
            <YAxis
              domain={[0, 60]}
              ticks={[0, 10, 20, 30, 40, 50, 60]}
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
            <Tooltip
              contentStyle={{
                borderRadius: 2,
                border: '1px solid var(--ma-line)',
                background: 'var(--ma-elevated)',
                color: 'var(--ma-ink)',
                fontSize: 12,
              }}
              formatter={(value) => (value != null ? [`${value} Mt`, ''] : ['', ''])}
              labelFormatter={(y) => `Year ${y}`}
            />
            <Legend
              verticalAlign="top"
              align="left"
              wrapperStyle={{
                paddingLeft: 8,
                paddingRight: 10,
                paddingTop: 6,
                paddingBottom: 6,
                fontSize: 12,
                background: 'var(--ma-elevated)',
                border: '1px solid var(--ma-line)',
                borderRadius: 2,
                boxShadow: '0 1px 0 rgba(15,18,16,0.04)',
              }}
            />
            <Line
              type="monotone"
              dataKey="production"
              name="Production"
              stroke="var(--ma-gold)"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="consumption"
              name="Apparent consumption"
              stroke="var(--ma-graphite)"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-4 max-w-prose text-[12px] leading-relaxed text-ma-muted">
        Stylized 2012–2030 profile for phosphate strategy dialogue — not a live forecast. Later years are illustrative;
        apparent consumption tracks global end-use; divergence from production reflects net trade and inventory effects
        in aggregate balances.
      </p>
    </div>
  )
}
