import { countryToSectorRegion } from './phosphateDapCurve'
import type { SectorCostCurveModel, SectorCostCurveSegment, SectorRegion } from './sectorCurveModel'

/**
 * Primary-aluminum smelters — delivered cost ($/t Al), 2025 house view.
 * Calibrated to a “Delivered cost breakdown per smelter 2025” style curve: raw materials + energy +
 * labour + freight + tariffs + carbon (Maaden ~9th on merit order, ~$2,000/t; low end ~$1,840/t; tail ~$2,680/t).
 * Capacities are illustrative kt/yr for bar-width proportionality (~global primary Al capacity).
 */
export interface AluminumSmelterCurveRow {
  facility: string
  country: string
  productionKt: number
  deliveredUsdPerTon: number
}

const RAW_SMELTERS: AluminumSmelterCurveRow[] = [
  { facility: 'Puerto Madryn', country: 'Argentina', productionKt: 460, deliveredUsdPerTon: 1840 },
  { facility: 'Alba (Aluminum Bahrain)', country: 'Bahrain', productionKt: 1580, deliveredUsdPerTon: 1865 },
  { facility: 'Sohar', country: 'Oman', productionKt: 400, deliveredUsdPerTon: 1882 },
  { facility: 'Taishet', country: 'Russia', productionKt: 420, deliveredUsdPerTon: 1894 },
  { facility: 'Hillside', country: 'South Africa', productionKt: 175, deliveredUsdPerTon: 1902 },
  { facility: 'Straumsvík', country: 'Iceland', productionKt: 215, deliveredUsdPerTon: 1912 },
  { facility: 'Grundartangi', country: 'Iceland', productionKt: 315, deliveredUsdPerTon: 1924 },
  { facility: 'Dubal (Jebel Ali)', country: 'United Arab Emirates', productionKt: 380, deliveredUsdPerTon: 1936 },
  { facility: 'Maaden — Ras Al Khair', country: 'Saudi Arabia', productionKt: 780, deliveredUsdPerTon: 1998 },
  { facility: 'Qatalum', country: 'Qatar', productionKt: 605, deliveredUsdPerTon: 2008 },
  { facility: 'EMAL', country: 'United Arab Emirates', productionKt: 760, deliveredUsdPerTon: 2018 },
  { facility: 'ISAL', country: 'Iceland', productionKt: 205, deliveredUsdPerTon: 2028 },
  { facility: 'Mozal', country: 'Mozambique', productionKt: 570, deliveredUsdPerTon: 2040 },
  { facility: 'MAPS', country: 'Mozambique', productionKt: 580, deliveredUsdPerTon: 2052 },
  { facility: 'Bell Bay', country: 'Australia', productionKt: 195, deliveredUsdPerTon: 2064 },
  { facility: 'Tomago', country: 'Australia', productionKt: 575, deliveredUsdPerTon: 2076 },
  { facility: 'Boyne Island', country: 'Australia', productionKt: 545, deliveredUsdPerTon: 2088 },
  { facility: 'Sayanogorsk', country: 'Russia', productionKt: 545, deliveredUsdPerTon: 2100 },
  { facility: 'Irkutsk', country: 'Russia', productionKt: 660, deliveredUsdPerTon: 2112 },
  { facility: 'Bratsk', country: 'Russia', productionKt: 1000, deliveredUsdPerTon: 2124 },
  { facility: 'Bogoslovsk', country: 'Russia', productionKt: 298, deliveredUsdPerTon: 2136 },
  { facility: 'Nadvoitsy', country: 'Russia', productionKt: 75, deliveredUsdPerTon: 2148 },
  { facility: 'Vogel (Hamburg area)', country: 'Germany', productionKt: 110, deliveredUsdPerTon: 2160 },
  { facility: 'Neuss', country: 'Germany', productionKt: 230, deliveredUsdPerTon: 2172 },
  { facility: 'Essen', country: 'Germany', productionKt: 165, deliveredUsdPerTon: 2184 },
  { facility: 'Lista', country: 'Norway', productionKt: 94, deliveredUsdPerTon: 2196 },
  { facility: 'Mosjøen', country: 'Norway', productionKt: 200, deliveredUsdPerTon: 2208 },
  { facility: 'Slovalco', country: 'Slovakia', productionKt: 172, deliveredUsdPerTon: 2220 },
  { facility: 'San Ciprián', country: 'Spain', productionKt: 228, deliveredUsdPerTon: 2232 },
  { facility: 'Avilés', country: 'Spain', productionKt: 143, deliveredUsdPerTon: 2244 },
  { facility: 'La Coruña', country: 'Spain', productionKt: 87, deliveredUsdPerTon: 2256 },
  { facility: 'Deschambault', country: 'Canada', productionKt: 260, deliveredUsdPerTon: 2268 },
  { facility: 'Bécancour', country: 'Canada', productionKt: 413, deliveredUsdPerTon: 2280 },
  { facility: 'Alouette', country: 'Canada', productionKt: 558, deliveredUsdPerTon: 2292 },
  { facility: 'Kitimat', country: 'Canada', productionKt: 432, deliveredUsdPerTon: 2304 },
  { facility: 'Massena West', country: 'United States', productionKt: 130, deliveredUsdPerTon: 2316 },
  { facility: 'Wenatchee', country: 'United States', productionKt: 184, deliveredUsdPerTon: 2328 },
  { facility: 'Intalco / Ferndale', country: 'United States', productionKt: 279, deliveredUsdPerTon: 2340 },
  { facility: 'Mt Holly', country: 'United States', productionKt: 229, deliveredUsdPerTon: 2352 },
  { facility: 'New Madrid', country: 'United States', productionKt: 263, deliveredUsdPerTon: 2364 },
  { facility: 'Dunkerque', country: 'France', productionKt: 285, deliveredUsdPerTon: 2376 },
  { facility: 'Delfzijl', country: 'Netherlands', productionKt: 110, deliveredUsdPerTon: 2388 },
  { facility: 'Voerde', country: 'Germany', productionKt: 93, deliveredUsdPerTon: 2400 },
  { facility: 'Hamburg', country: 'Germany', productionKt: 135, deliveredUsdPerTon: 2412 },
  { facility: 'Stade', country: 'Germany', productionKt: 135, deliveredUsdPerTon: 2424 },
  { facility: 'Rheinwerk', country: 'Germany', productionKt: 230, deliveredUsdPerTon: 2436 },
  { facility: 'India — domestic (agg.)', country: 'India', productionKt: 4100, deliveredUsdPerTon: 2450 },
  { facility: 'China — SW / hydro-linked (agg.)', country: 'China', productionKt: 8200, deliveredUsdPerTon: 2475 },
  { facility: 'China — NW (agg.)', country: 'China', productionKt: 10500, deliveredUsdPerTon: 2505 },
  { facility: 'China — Shandong / NE (agg.)', country: 'China', productionKt: 9800, deliveredUsdPerTon: 2535 },
  { facility: 'China — Central grid (agg.)', country: 'China', productionKt: 11200, deliveredUsdPerTon: 2565 },
  { facility: 'EU — ETS + power stress (agg.)', country: 'Germany', productionKt: 2800, deliveredUsdPerTon: 2595 },
  { facility: 'Russia — marginal power (agg.)', country: 'Russia', productionKt: 950, deliveredUsdPerTon: 2620 },
  { facility: 'China — coastal / tariff-heavy (agg.)', country: 'China', productionKt: 6200, deliveredUsdPerTon: 2650 },
  { facility: 'Sebree', country: 'United States', productionKt: 220, deliveredUsdPerTon: 2680 },
]

export function isMaadenAluminumSmelter(facility: string, country: string): boolean {
  const u = `${facility} ${country}`.toUpperCase()
  if (/\bMAADEN|MA'?ADEN|MA’ADEN\b/.test(u)) return true
  if (country.toLowerCase().includes('saudi') && /RAS AL KHAIR|RAS AL-KHAIR|\bRAK\b/i.test(facility)) return true
  return false
}

function slugPart(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '')
    .slice(0, 36)
}

const maadenStyle = {
  fill: 'var(--ma-teal)',
  stroke: 'var(--ma-gold)',
  strokeWidth: 2,
}

const regionStyle: Record<Exclude<SectorRegion, 'maaden'>, { fill: string; stroke: string }> = {
  cis: { fill: 'rgba(168, 90, 72, 0.92)', stroke: '#7c3d32' },
  china: { fill: 'rgba(234, 120, 12, 0.9)', stroke: '#9a3412' },
  americas: { fill: 'rgba(59, 130, 246, 0.88)', stroke: '#1d4ed8' },
  mena: { fill: 'rgba(202, 168, 120, 0.82)', stroke: '#8b7355' },
  row: { fill: 'rgba(134, 220, 165, 0.9)', stroke: '#3f6f4a' },
}

/** @internal Exported for tests / tooling; curve build uses RAW_SMELTERS. */
export function getAluminumSmelterCurveRows(): AluminumSmelterCurveRow[] {
  return [...RAW_SMELTERS]
}

function uniqueSortedCountries(rows: AluminumSmelterCurveRow[]): string[] {
  const set = new Set(rows.map((r) => r.country.trim()).filter(Boolean))
  return [...set].sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' }))
}

export function buildAluminumSmelterDeliveredCurve(): SectorCostCurveModel | null {
  const rows = getAluminumSmelterCurveRows()
  if (!rows.length) return null

  const sorted = [...rows].sort((a, b) => a.deliveredUsdPerTon - b.deliveredUsdPerTon)
  const companyNames = uniqueSortedCountries(rows)

  const combined: Omit<SectorCostCurveSegment, 'cumStartMt'>[] = sorted.map((r, i) => {
    const capacityMt = Math.max(0.01, r.productionKt / 1000)
    const isMaaden = isMaadenAluminumSmelter(r.facility, r.country)
    const peerRegion = countryToSectorRegion(r.country)
    const region: SectorRegion = isMaaden ? 'maaden' : peerRegion
    const st = isMaaden ? maadenStyle : regionStyle[peerRegion]
    const label = r.facility.length > 22 ? `${r.facility.slice(0, 20)}…` : r.facility
    return {
      id: `${slugPart(r.facility)}_${slugPart(r.country)}_${i}`,
      label,
      fullName: `${r.facility} · ${r.country}`,
      region,
      capacityMt,
      c1UsdPerTon: Math.round(r.deliveredUsdPerTon * 1000) / 1000,
      isMaaden,
      assetId: isMaaden ? 'al_smelter' : undefined,
      fill: st.fill,
      stroke: st.stroke,
      strokeWidth: isMaaden ? maadenStyle.strokeWidth : 1,
      /** Smelter pack has no operator column; country groups bars for the same highlight UX as phosphate “Company”. */
      company: r.country,
      country: r.country,
    }
  })

  let cum = 0
  const segments: SectorCostCurveSegment[] = combined.map((s) => {
    const seg = { ...s, cumStartMt: cum }
    cum += s.capacityMt
    return seg
  })

  const totalCapacityMt = cum
  const maxCost = Math.max(...segments.map((s) => s.c1UsdPerTon), 1) * 1.06

  return {
    segments,
    totalCapacityMt,
    maxCost,
    unit: 'US$/t Al (delivered)',
    xLabel: 'Cumulative capacity (Mt primary Al / yr)',
    verticalLabel: 'Primary aluminum',
    companyNames,
    aluminumSource: 'smelter_delivered',
  }
}
