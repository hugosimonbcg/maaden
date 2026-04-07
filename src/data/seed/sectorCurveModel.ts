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
  /** DAP site curve (CRU-style pack). */
  company?: string
  country?: string
  site?: string
  dapConversionUsdPerTon?: number
  dapNUsdPerTon?: number
  dapPUsdPerTon?: number
  dapSUsdPerTon?: number
}

export interface SectorCostCurveModel {
  segments: SectorCostCurveSegment[]
  totalCapacityMt: number
  maxCost: number
  unit: string
  xLabel: string
  verticalLabel: string
  /** DAP site pack: producer companies. Smelter delivered pack: countries (same highlight UX). */
  companyNames?: string[]
  phosphateSource?: 'dap_sites' | 'synthetic'
  /** Primary Al — smelter-level delivered cost pack (vs. legacy synthetic regional bars). */
  aluminumSource?: 'smelter_delivered' | 'synthetic'
}
