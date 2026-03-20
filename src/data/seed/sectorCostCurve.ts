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
  cis: { fill: 'rgba(30, 58, 95, 0.9)', stroke: '#152a45' },
  china: { fill: 'rgba(180, 83, 9, 0.88)', stroke: '#78350f' },
  americas: { fill: 'rgba(37, 99, 235, 0.82)', stroke: '#1e40af' },
  mena: { fill: 'rgba(59, 130, 106, 0.45)', stroke: '#2d6a66' },
  row: { fill: 'rgba(82, 82, 91, 0.78)', stroke: '#3f3f46' },
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

/** Phosphate / acid / DAP value chain — illustrative global capacity (Mt product equiv.) */
const phosphateSeeds: Seed[] = [
  { id: 'p_cis', label: 'FSU — integrated', fullName: 'FSU — integrated mine-to-acid', region: 'cis', capacityMt: 3.8, c1Ref: 74 },
  { id: 'p_cn_i', label: 'China — integ.', fullName: 'China — large integrated', region: 'china', capacityMt: 8.6, c1Ref: 84 },
  { id: 'p_ocp', label: 'Morocco — OCP', fullName: 'Morocco — OCP integrated', region: 'mena', capacityMt: 12.4, c1Ref: 79 },
  { id: 'p_us_i', label: 'US — integrated', fullName: 'US — integrated producers', region: 'americas', capacityMt: 4.2, c1Ref: 91 },
  { id: 'p_sa', label: 'Saudi — other', fullName: 'KSA — other phosphate complexes', region: 'mena', capacityMt: 2.1, c1Ref: 88 },
  { id: 'p_in_pr', label: 'India — rock', fullName: 'India — phosphate rock route', region: 'row', capacityMt: 3.4, c1Ref: 96 },
  { id: 'p_jor', label: 'Jordan — JPMC', fullName: 'Jordan — JPMC / Arab Potash linked', region: 'mena', capacityMt: 1.9, c1Ref: 92 },
  { id: 'p_tun', label: 'Tunisia', fullName: 'Tunisia — GCT', region: 'mena', capacityMt: 1.2, c1Ref: 99 },
  { id: 'p_cn_ni', label: 'China — non-int.', fullName: 'China — non-integrated', region: 'china', capacityMt: 6.5, c1Ref: 108 },
  { id: 'p_in_pa', label: 'India — acid', fullName: 'India — merchant acid route', region: 'row', capacityMt: 2.8, c1Ref: 112 },
  { id: 'p_eg', label: 'Egypt', fullName: 'Egypt — phosphoric acid', region: 'mena', capacityMt: 1.6, c1Ref: 104 },
  { id: 'p_br', label: 'Brazil', fullName: 'Brazil — import acid + granulation', region: 'americas', capacityMt: 2.4, c1Ref: 118 },
  { id: 'p_mos', label: 'Mosaic — Florida', fullName: 'Mosaic — Florida integrated', region: 'americas', capacityMt: 3.1, c1Ref: 95 },
  { id: 'p_nut', label: 'Nutrien', fullName: 'Nutrien — North America', region: 'americas', capacityMt: 2.7, c1Ref: 101 },
  { id: 'p_icl', label: 'ICL', fullName: 'ICL — Dead Sea integrated', region: 'mena', capacityMt: 1.4, c1Ref: 89 },
  { id: 'p_eu', label: 'EU — import acid', fullName: 'EU — import acid + finishing', region: 'row', capacityMt: 2.2, c1Ref: 124 },
  { id: 'p_cn_tail', label: 'China — tail', fullName: 'China — high-cost / idled tail', region: 'china', capacityMt: 2.9, c1Ref: 138 },
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
    return {
      id: `maaden_${r.assetId}`,
      label: a.shortCode,
      fullName: a.name,
      region: 'maaden',
      capacityMt: Math.max(0.15, cap),
      c1UsdPerTon: r.c1UsdPerTon,
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
