import { useEffect, useId, useMemo, useRef, useState } from 'react'
import type { DapMinusStepDef } from '../../data/seed/dapMinus'
import { dapMinusSteps } from '../../data/seed/dapMinus'

const COLORS = {
  anchor: '#5eb8cf',
  processing: '#a78bfa',
  input: '#fb923c',
} as const

const margin = { top: 52, right: 16, bottom: 80, left: 56 }
const maxV = 1600

type BarGeom = {
  id: string
  label: string
  value: number
  kind: DapMinusStepDef['kind']
  x: number
  w: number
  yTop: number
  yBot: number
}

export function DapMinusWaterfall({ steps = dapMinusSteps }: { steps?: DapMinusStepDef[] }) {
  const gid = useId()
  const containerRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(900)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width ?? 900
      setWidth(Math.max(320, Math.floor(w)))
    })
    ro.observe(el)
    setWidth(Math.max(320, Math.floor(el.getBoundingClientRect().width)))
    return () => ro.disconnect()
  }, [])

  const height = 360
  const iw = width - margin.left - margin.right
  const ih = height - margin.top - margin.bottom

  const yPx = (v: number) => margin.top + ih - (v / maxV) * ih

  const { bars, connectors } = useMemo(() => {
    const n = steps.length
    const slotW = iw / n
    const pad = 3
    const barsAcc: BarGeom[] = []
    const conn: { x1: number; x2: number; y: number }[] = []

    const [first, ...rest] = steps
    const last = rest[rest.length - 1]
    const middle = rest.slice(0, -1)

    let running = first.value

    const pushBar = (col: number, def: DapMinusStepDef, yTop: number, yBot: number) => {
      const x = margin.left + col * slotW + pad
      const w = slotW - pad * 2
      barsAcc.push({
        id: def.id,
        label: def.label,
        value: def.value,
        kind: def.kind,
        x,
        w,
        yTop,
        yBot,
      })
      return { x, w }
    }

    // Pillar: DAP price
    const b0 = pushBar(0, first, yPx(first.value), yPx(0))
    conn.push({ x1: b0.x + b0.w, x2: margin.left + slotW + pad, y: yPx(running) })

    middle.forEach((s, i) => {
      const col = i + 1
      const yTop = yPx(running)
      running -= s.value
      const yBot = yPx(running)
      const b = pushBar(col, s, yTop, yBot)
      const xNextLeft = margin.left + (col + 1) * slotW + pad
      conn.push({ x1: b.x + b.w, x2: xNextLeft, y: yBot })
    })

    const lastCol = n - 1
    pushBar(lastCol, last, yPx(last.value), yPx(0))

    return { bars: barsAcc, connectors: conn }
  }, [steps, iw, ih])

  const yTicks = [0, 400, 800, 1200, 1600]

  return (
    <div ref={containerRef} className="w-full">
      <div className="rounded-sm border border-ma-line bg-ma-elevated px-3 pb-2 pt-4 shadow-[inset_0_1px_0_rgba(15,18,16,0.04)]">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3 px-1">
          <div className="flex flex-wrap gap-4 text-[10px] font-semibold uppercase tracking-wide text-ma-muted">
            <span className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 shrink-0 border border-ma-line" style={{ background: COLORS.anchor }} />
              Price / margin
            </span>
            <span className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 shrink-0 border border-ma-line" style={{ background: COLORS.processing }} />
              Processing
            </span>
            <span className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 shrink-0 border border-ma-line" style={{ background: COLORS.input }} />
              Input costs
            </span>
          </div>
        </div>

        <p className="mb-2 px-1 text-center text-[11px] italic text-ma-gold-dim">
          Margin anchored downstream; upstream economics are derivative
        </p>

        <svg width={width} height={height} className="max-w-full text-ma-ink" role="img" aria-label="DAP minus cost waterfall">
          <title>DAP minus approach — indicative phosphate cost structure</title>
          <defs>
            <pattern id={`${gid}-grid`} width="8" height="8" patternUnits="userSpaceOnUse">
              <path d="M 8 0 L 0 0 0 8" fill="none" stroke="var(--ma-line)" strokeWidth="1" opacity={0.6} />
            </pattern>
          </defs>
          <rect x={margin.left} y={margin.top} width={iw} height={ih} fill={`url(#${gid}-grid)`} opacity={0.45} />

          {yTicks.map((t) => {
            const y = yPx(t)
            return (
              <g key={t}>
                <line
                  x1={margin.left}
                  x2={margin.left + iw}
                  y1={y}
                  y2={y}
                  stroke="var(--ma-line)"
                  strokeDasharray="4 4"
                  strokeOpacity={0.9}
                />
                <text x={margin.left - 8} y={y + 4} textAnchor="end" className="fill-ma-muted text-[10px] tabular-nums">
                  {t}
                </text>
              </g>
            )
          })}

          <text
            x={14}
            y={margin.top + ih / 2}
            transform={`rotate(-90 14 ${margin.top + ih / 2})`}
            className="fill-ma-muted text-[10px] font-semibold uppercase tracking-[0.12em]"
          >
            DAP minus approach
          </text>

          {connectors.map((c, idx) => (
            <line
              key={idx}
              x1={c.x1}
              x2={c.x2}
              y1={c.y}
              y2={c.y}
              stroke="var(--ma-muted)"
              strokeOpacity={0.45}
              strokeWidth={1}
              strokeDasharray="3 2"
            />
          ))}

          {bars.map((b) => {
            const fill = COLORS[b.kind]
            const h = b.yBot - b.yTop
            return (
              <g key={b.id}>
                <rect
                  x={b.x}
                  y={b.yTop}
                  width={b.w}
                  height={Math.max(1, h)}
                  fill={fill}
                  stroke="rgba(0,0,0,0.35)"
                  strokeWidth={1}
                />
                <text
                  x={b.x + b.w / 2}
                  y={b.yTop - 6}
                  textAnchor="middle"
                  className="fill-ma-ink text-[11px] font-semibold tabular-nums"
                >
                  {b.value}
                </text>
                <foreignObject x={b.x} y={height - margin.bottom + 4} width={b.w} height={margin.bottom - 8}>
                  <div className="flex h-full items-start justify-center px-0.5 text-center text-[9px] font-medium leading-snug text-ma-muted">
                    {b.label}
                  </div>
                </foreignObject>
              </g>
            )
          })}
        </svg>

        <p className="mt-1 border-t border-ma-line px-2 py-2 text-[10px] leading-relaxed text-ma-muted">
          Indicative phosphate cost structure — all figures in US$/t DAP P₂O₅ equivalent. Illustrative prototype only;
          not Maaden financial statements.
        </p>
      </div>
    </div>
  )
}
