import { useEffect, useId, useMemo, useRef, useState } from 'react'
import type { SectorCostCurveModel, SectorCostCurveSegment } from '../../data/seed/sectorCostCurve'
import { formatNumber, formatUsdPerTon } from '../../lib/format'

const margin = { top: 14, right: 20, bottom: 44, left: 54 }

type Props = {
  model: SectorCostCurveModel
  benchmarkUsdPerTon?: number | null
  benchmarkLabel?: string
  onMaadenClick?: (segment: SectorCostCurveSegment) => void
}

const LEGEND: { region: SectorCostCurveSegment['region']; label: string }[] = [
  { region: 'maaden', label: 'Maaden' },
  { region: 'cis', label: 'CIS / FSU' },
  { region: 'china', label: 'China' },
  { region: 'americas', label: 'Americas' },
  { region: 'mena', label: 'MENA (excl. Maaden)' },
  { region: 'row', label: 'Rest of world' },
]

export function SectorCostCurve({
  model,
  benchmarkUsdPerTon,
  benchmarkLabel,
  onMaadenClick,
}: Props) {
  const gid = useId()
  const containerRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(720)
  const [hovered, setHovered] = useState<SectorCostCurveSegment | null>(null)
  const [tipPos, setTipPos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width ?? 720
      setWidth(Math.max(280, Math.floor(w)))
    })
    ro.observe(el)
    setWidth(Math.max(280, Math.floor(el.getBoundingClientRect().width)))
    return () => ro.disconnect()
  }, [])

  const height = 380
  const iw = width - margin.left - margin.right
  const ih = height - margin.top - margin.bottom
  const { segments, totalCapacityMt, maxCost, unit, xLabel } = model

  const xPx = (mt: number) => margin.left + (mt / totalCapacityMt) * iw
  const yPx = (cost: number) => margin.top + ih - (cost / maxCost) * ih

  const stepPath = useMemo(() => {
    if (!segments.length) return ''
    const xP = (mt: number) => margin.left + (mt / totalCapacityMt) * iw
    const yP = (cost: number) => margin.top + ih - (cost / maxCost) * ih
    const pts = segments.map((s) => ({
      xL: xP(s.cumStartMt),
      xR: xP(s.cumStartMt + s.capacityMt),
      yT: yP(s.c1UsdPerTon),
    }))
    let d = `M ${pts[0].xL} ${pts[0].yT}`
    pts.forEach((b, i) => {
      d += ` L ${b.xR} ${b.yT}`
      if (i < pts.length - 1) d += ` L ${b.xR} ${pts[i + 1].yT}`
    })
    return d
  }, [segments, totalCapacityMt, maxCost, iw, ih])

  const xTicks = useMemo(() => {
    const n = 5
    return Array.from({ length: n + 1 }, (_, i) => (totalCapacityMt * i) / n)
  }, [totalCapacityMt])

  const yTicks = useMemo(() => {
    const n = 5
    return Array.from({ length: n + 1 }, (_, i) => (maxCost * i) / n)
  }, [maxCost])

  const regionsInChart = useMemo(() => {
    const set = new Set(segments.map((s) => s.region))
    return LEGEND.filter((l) => set.has(l.region))
  }, [segments])

  const benchY =
    benchmarkUsdPerTon != null && benchmarkUsdPerTon > 0 && benchmarkUsdPerTon <= maxCost * 1.02
      ? yPx(benchmarkUsdPerTon)
      : null

  return (
    <div ref={containerRef} className="relative w-full">
      <svg
        width={width}
        height={height}
        className="max-w-full text-ma-ink"
        role="img"
        aria-label="Sector cost curve: cumulative capacity versus unit cash cost"
      >
        <title>Sector merit-order cost curve</title>
        <defs>
          <clipPath id={`${gid}-plot`}>
            <rect x={margin.left} y={margin.top} width={iw} height={ih} />
          </clipPath>
        </defs>

        <g stroke="var(--ma-line)" strokeWidth={1}>
          {yTicks.map((t) => {
            const y = yPx(t)
            return (
              <line
                key={t}
                x1={margin.left}
                x2={margin.left + iw}
                y1={y}
                y2={y}
                strokeDasharray="3 3"
              />
            )
          })}
        </g>

        <text
          x={12}
          y={margin.top + ih / 2}
          transform={`rotate(-90 12 ${margin.top + ih / 2})`}
          className="fill-ma-muted text-[10px] font-semibold uppercase tracking-wide"
        >
          {unit}
        </text>

        {xTicks.map((t) => {
          const x = xPx(t)
          return (
            <g key={t}>
              <line x1={x} x2={x} y1={margin.top + ih} y2={margin.top + ih + 5} stroke="var(--ma-line)" />
              <text
                x={x}
                y={margin.top + ih + 18}
                textAnchor="middle"
                className="fill-ma-muted text-[10px] tabular-nums"
              >
                {formatNumber(t, t >= 10 ? 0 : 1)}
              </text>
            </g>
          )
        })}

        {yTicks.map((t) => {
          const y = yPx(t)
          return (
            <text
              key={t}
              x={margin.left - 8}
              y={y + 4}
              textAnchor="end"
              className="fill-ma-muted text-[10px] tabular-nums"
            >
              {Math.round(t).toLocaleString('en-US')}
            </text>
          )
        })}

        <text
          x={margin.left + iw / 2}
          y={height - 6}
          textAnchor="middle"
          className="fill-ma-muted text-[10px] font-semibold uppercase tracking-wide"
        >
          {xLabel}
        </text>

        <g clipPath={`url(#${gid}-plot)`}>
          {segments.map((s) => {
            const x = xPx(s.cumStartMt)
            const w = Math.max(1, xPx(s.cumStartMt + s.capacityMt) - x)
            const y = yPx(s.c1UsdPerTon)
            const h = margin.top + ih - y
            return (
              <rect
                key={s.id}
                x={x}
                y={y}
                width={w}
                height={h}
                fill={s.fill}
                stroke={s.stroke}
                strokeWidth={s.strokeWidth}
                className={s.isMaaden ? 'cursor-pointer' : 'cursor-default'}
                onMouseEnter={(e) => {
                  setHovered(s)
                  const r = containerRef.current?.getBoundingClientRect()
                  if (r) setTipPos({ x: e.clientX - r.left, y: e.clientY - r.top })
                }}
                onMouseMove={(e) => {
                  const r = containerRef.current?.getBoundingClientRect()
                  if (r) setTipPos({ x: e.clientX - r.left, y: e.clientY - r.top })
                }}
                onMouseLeave={() => setHovered(null)}
                onClick={() => {
                  if (s.isMaaden && s.assetId && onMaadenClick) onMaadenClick(s)
                }}
              />
            )
          })}
        </g>

        <path
          d={stepPath}
          fill="none"
          stroke="var(--ma-risk)"
          strokeWidth={1.25}
          strokeDasharray="4 3"
          strokeLinecap="square"
          opacity={0.85}
          pointerEvents="none"
        />

        {benchY != null && (
          <g>
            <line
              x1={margin.left}
              x2={margin.left + iw}
              y1={benchY}
              y2={benchY}
              stroke="var(--ma-amber-warn)"
              strokeWidth={1.5}
              strokeDasharray="6 4"
              pointerEvents="none"
            />
            <text
              x={margin.left + iw - 4}
              y={benchY - 5}
              textAnchor="end"
              className="fill-ma-amber-warn text-[9px] font-semibold uppercase tracking-wide"
            >
              {benchmarkLabel ?? 'Benchmark'}
            </text>
          </g>
        )}
      </svg>

      {hovered && (
        <div
          className="pointer-events-none absolute z-10 max-w-[240px] rounded-sm border border-ma-line bg-ma-elevated px-2.5 py-2 text-[11px] shadow-md"
          style={{
            left: Math.min(tipPos.x + 12, width - 200),
            top: Math.max(tipPos.y - 8, 8),
          }}
        >
          <p className="font-semibold text-ma-ink">{hovered.fullName}</p>
          <p className="mt-1 tabular-nums text-ma-muted">
            C1 cash cost: <span className="font-medium text-ma-ink">{formatUsdPerTon(hovered.c1UsdPerTon)}</span>
          </p>
          <p className="tabular-nums text-ma-muted">
            Capacity: <span className="font-medium text-ma-ink">{formatNumber(hovered.capacityMt, 1)} Mt</span>
          </p>
          {hovered.isMaaden && <p className="mt-1 text-[10px] text-ma-teal">Click for driver drill-down</p>}
        </div>
      )}

      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 border-t border-ma-line pt-3">
        {regionsInChart.map(({ region, label }) => {
          const sample = segments.find((s) => s.region === region)
          if (!sample) return null
          return (
            <div key={region} className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-wide text-ma-muted">
              <span
                className="h-2.5 w-2.5 shrink-0 border"
                style={{ background: sample.fill, borderColor: sample.stroke }}
              />
              {label}
            </div>
          )
        })}
      </div>
    </div>
  )
}
