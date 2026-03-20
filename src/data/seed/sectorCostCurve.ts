import type { CostBenchmarkRow, VerticalId, YearKey } from '../types'
import { assets } from './assets'

function yearFactor(y: YearKey): number {
  if (y === 2021) return 0.96
  if (y === 2023) return 1.02
  if (y === 2024) return 1.0
  if (y === 2025) return 0.98
  return 0.92
}

export type SectorRegion = 'cis' | 'china' | 'americas' | 'mena' | 'row' | 'maaden'

export interface SectorCostCurveSegment {
  id: string
  label: string
  fullName: string
  region: SectorRegion
  capacityMt: number
  c1UsdPerTon: number
  /** Portfolio C1 when chart position is capped for scale (Maaden only). */
  c1UsdPerTonReported?: number
  cumStartMt: number
  isMaaden: boolean
  assetId?: string
  fill: string
  stroke: string
  strokeWidth: number
}

const regionStyle: Record<
  Exclude<SectorRegion, 'maaden'>,
  { fill: string; stroke: string }
> = {
  /* Reference-style merit order: CIS rust, China orange, Americas blue, ROW mint, MENA sand */
  cis: { fill: 'rgba(168, 90, 72, 0.92)', stroke: '#7c3d32' },
  china: { fill: 'rgba(234, 120, 12, 0.9)', stroke: '#9a3412' },
  americas: { fill: 'rgba(59, 130, 246, 0.88)', stroke: '#1d4ed8' },
  mena: { fill: 'rgba(202, 168, 120, 0.82)', stroke: '#8b7355' },
  row: { fill: 'rgba(134, 220, 165, 0.9)', stroke: '#3f6f4a' },
}

const maadenStyle = {
  fill: 'var(--ma-teal)',
  stroke: 'var(--ma-gold)',
  strokeWidth: 2,
}

type Seed = {
  id: string
  label: string
  fullName: string
  region: Exclude<SectorRegion, 'maaden'>
  capacityMt: number
  /** Reference C1 at 2024 factor = 1 */
  c1Ref: number
}

/**
 * Phosphate merit-order curve — ~10 competitor bars; high-cost tail collapsed so Maaden wedges stay visible
 * on the right. ~731 Mt competitor capacity (+ Maaden).
 */
const phosphateSeeds: Seed[] = [
  { id: 'p_cis_a', label: 'CIS — integrated', fullName: 'CIS — PhosAgro / EuroChem / FSU integrated', region: 'cis', capacityMt: 100, c1Ref: 28 },
  { id: 'p_row_a', label: 'ROW — low cost', fullName: 'ROW — large rock & acid (ex-China)', region: 'row', capacityMt: 160, c1Ref: 30 },
  { id: 'p_mena_a', label: 'MENA — OCP core', fullName: 'Morocco — OCP mine-to-fertilizer', region: 'mena', capacityMt: 75, c1Ref: 32 },
  { id: 'p_cis_b', label: 'CIS — tier II', fullName: 'CIS — Kazakhstan / secondary FSU', region: 'cis', capacityMt: 55, c1Ref: 34 },
  { id: 'p_row_b', label: 'ROW — India / SEA', fullName: 'ROW — India & SE Asia rock–acid', region: 'row', capacityMt: 58, c1Ref: 36 },
  { id: 'p_am_a', label: 'Americas — N.Am.', fullName: 'Americas — Canada / US integrated', region: 'americas', capacityMt: 42, c1Ref: 39 },
  { id: 'p_cn_a', label: 'China — integrated', fullName: 'China — large integrated complexes', region: 'china', capacityMt: 46, c1Ref: 42 },
  { id: 'p_mena_b', label: 'MENA — other', fullName: 'MENA — GCC / Jordan / Tunisia', region: 'mena', capacityMt: 35, c1Ref: 45 },
  { id: 'p_row_c', label: 'ROW — EU / LatAm', fullName: 'ROW — EU finishing & LatAm granulation', region: 'row', capacityMt: 40, c1Ref: 48 },
  {
    id: 'p_cn_am_hi',
    label: 'China / Americas — upper mid',
    fullName: 'China & Americas — non-int., Brazil, marginal units (aggregated)',
    region: 'china',
    capacityMt: 86,
    c1Ref: 56,
  },
  {
    id: 'p_tail_agg',
    label: 'ROW / China — high-cost tail',
    fullName: 'ROW & China — stranded / idled / phase-out (aggregated)',
    region: 'row',
    capacityMt: 34,
    c1Ref: 74,
  },
]

const aluminumSeeds: Seed[] = [
  { id: 'a_rus', label: 'Russia — smelters', fullName: 'Russia — primary aluminum', region: 'cis', capacityMt: 3.8, c1Ref: 1820 },
  { id: 'a_cn', label: 'China — grid', fullName: 'China — coal-linked smelters', region: 'china', capacityMt: 42, c1Ref: 1980 },
  { id: 'a_gcc', label: 'GCC — ex-KSA', fullName: 'GCC — other smelters', region: 'mena', capacityMt: 2.4, c1Ref: 1880 },
  { id: 'a_ca', label: 'Canada', fullName: 'Canada — hydro smelters', region: 'americas', capacityMt: 3.1, c1Ref: 1760 },
  { id: 'a_au', label: 'Australia', fullName: 'Australia — smelters', region: 'row', capacityMt: 1.6, c1Ref: 1920 },
  { id: 'a_eu', label: 'EU — Norway/IS', fullName: 'EU — Nordic hydro', region: 'row', capacityMt: 2.2, c1Ref: 1790 },
  { id: 'a_in', label: 'India', fullName: 'India — smelters', region: 'row', capacityMt: 4.0, c1Ref: 2050 },
  { id: 'a_us', label: 'US', fullName: 'US — Pacific Northwest', region: 'americas', capacityMt: 1.5, c1Ref: 1840 },
  { id: 'a_br', label: 'Brazil', fullName: 'Brazil — Alunorte linked', region: 'americas', capacityMt: 0.85, c1Ref: 2010 },
]

const goldSeeds: Seed[] = [
  { id: 'g_au', label: 'Australia majors', fullName: 'Australia — tier-1 producers', region: 'row', capacityMt: 0.42, c1Ref: 520 },
  { id: 'g_ca', label: 'Canada', fullName: 'Canada — open pit', region: 'americas', capacityMt: 0.28, c1Ref: 560 },
  { id: 'g_us', label: 'US — Nevada', fullName: 'US — Carlin-style', region: 'americas', capacityMt: 0.35, c1Ref: 590 },
  { id: 'g_af', label: 'West Africa', fullName: 'West Africa — oxide / CIL', region: 'row', capacityMt: 0.55, c1Ref: 640 },
  { id: 'g_sa', label: 'South Africa', fullName: 'South Africa — deep UG', region: 'row', capacityMt: 0.22, c1Ref: 720 },
  { id: 'g_cn', label: 'China', fullName: 'China — domestic gold', region: 'china', capacityMt: 0.48, c1Ref: 680 },
  { id: 'g_kz', label: 'Kazakhstan', fullName: 'Kazakhstan — refractory', region: 'cis', capacityMt: 0.18, c1Ref: 760 },
  { id: 'g_lat', label: 'LatAm', fullName: 'Latin America — copper-gold', region: 'americas', capacityMt: 0.31, c1Ref: 610 },
]

function seedsForVertical(v: VerticalId): Seed[] | null {
  if (v === 'phosphate') return phosphateSeeds
  if (v === 'aluminum') return aluminumSeeds
  if (v === 'gold_base_metals') return goldSeeds
  return null
}

export interface SectorCostCurveModel {
  segments: SectorCostCurveSegment[]
  totalCapacityMt: number
  maxCost: number
  unit: string
  xLabel: string
  verticalLabel: string
}

export function buildSectorCostCurve(
  vertical: VerticalId | 'all',
  year: YearKey,
  rows: CostBenchmarkRow[],
): SectorCostCurveModel | null {
  if (vertical === 'corporate') return null

  const vf: VerticalId = vertical === 'all' ? 'phosphate' : vertical
  const seeds = seedsForVertical(vf)
  if (!seeds) return null

  const yf = yearFactor(year) / yearFactor(2024)

  const external: Omit<SectorCostCurveSegment, 'cumStartMt'>[] = seeds.map((s) => {
    const st = regionStyle[s.region]
    return {
      id: s.id,
      label: s.label,
      fullName: s.fullName,
      region: s.region,
      capacityMt: s.capacityMt,
      c1UsdPerTon: Math.round(s.c1Ref * yf),
      isMaaden: false,
      fill: st.fill,
      stroke: st.stroke,
      strokeWidth: 1,
    }
  })

  const extMaxC1 = Math.max(...external.map((e) => e.c1UsdPerTon), 1)
  /** Keep Maaden on the chart when portfolio C1 is far above the global merit band (hero / scenario). */
  const maadenCurveCap = Math.min(125, Math.round(extMaxC1 * 1.16 + 8))

  const maadenVerticalFilter = (assetId: string) => {
    const a = assets.find((x) => x.id === assetId)
    if (!a) return false
    if (vertical === 'all') return a.verticalId === vf
    return a.verticalId === vertical
  }

  const maadenRows = rows.filter((r) => r.c1UsdPerTon > 0 && maadenVerticalFilter(r.assetId))
  const maaden: Omit<SectorCostCurveSegment, 'cumStartMt'>[] = maadenRows.map((r) => {
    const a = assets.find((x) => x.id === r.assetId)!
    const cap = Math.round((r.productTonnes / 1e6) * 10) / 10
    const actual = r.c1UsdPerTon
    const displayC1 = Math.min(actual, maadenCurveCap)
    return {
      id: `maaden_${r.assetId}`,
      label: a.shortCode,
      fullName: a.name,
      region: 'maaden',
      capacityMt: Math.max(0.15, cap),
      c1UsdPerTon: displayC1,
      c1UsdPerTonReported: displayC1 < actual ? actual : undefined,
      isMaaden: true,
      assetId: r.assetId,
      fill: maadenStyle.fill,
      stroke: maadenStyle.stroke,
      strokeWidth: maadenStyle.strokeWidth,
    }
  })

  const combined = [...external, ...maaden].sort((a, b) => a.c1UsdPerTon - b.c1UsdPerTon)

  let cum = 0
  const segments: SectorCostCurveSegment[] = combined.map((s) => {
    const seg = { ...s, cumStartMt: cum }
    cum += s.capacityMt
    return seg
  })

  const totalCapacityMt = cum
  const maxCost = Math.max(...segments.map((s) => s.c1UsdPerTon), 1) * 1.06

  const unit = vf === 'aluminum' ? 'US$/t Al' : vf === 'gold_base_metals' ? 'US$/t milled' : 'US$/t'
  const xLabel =
    vf === 'aluminum'
      ? 'Cumulative capacity (Mt primary Al / yr)'
      : vf === 'gold_base_metals'
        ? 'Cumulative capacity (Mt ore milled / yr)'
        : 'Cumulative capacity (Mt phosphate product equiv. / yr)'

  const verticalLabel =
    vf === 'phosphate'
      ? 'Phosphate & derivative value chain'
      : vf === 'aluminum'
        ? 'Primary aluminum'
        : 'Gold / ore treatment'

  return { segments, totalCapacityMt, maxCost, unit, xLabel, verticalLabel }
}
