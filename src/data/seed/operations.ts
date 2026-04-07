import type { DowntimeCategory, FunnelStage, OperationalKpiRow, YearKey } from '../types'
import { assets } from './assets'

const years: YearKey[] = [2023, 2024, 2025, 2030]

/** 2021 diagnostic themes (2020 ops anchor): recovery gaps, smelter vs rolling, GBM scale/AISC — trend years add slight improvement. */
type OpSeed = {
  yieldPct: number
  recoveryPct: number
  oee: number
  utilization: number
  downtimePlannedHrs: number
  downtimeUnplannedHrs: number
  energyGjPerTon: number
  waterM3PerTon: number
  peerYieldPct: { peer_median: number; top_quartile: number; best_in_world: number }
}

const opSeed: Record<string, OpSeed> = {
  ph_waad: {
    yieldPct: 59,
    recoveryPct: 57.8,
    oee: 78,
    utilization: 84,
    downtimePlannedHrs: 395,
    downtimeUnplannedHrs: 418,
    energyGjPerTon: 13.1,
    waterM3PerTon: 1.9,
    peerYieldPct: { peer_median: 70, top_quartile: 82, best_in_world: 92 },
  },
  ph_ras: {
    yieldPct: 66,
    recoveryPct: 64.5,
    oee: 80,
    utilization: 88,
    downtimePlannedHrs: 360,
    downtimeUnplannedHrs: 340,
    energyGjPerTon: 11.8,
    waterM3PerTon: 1.72,
    peerYieldPct: { peer_median: 74, top_quartile: 84, best_in_world: 91 },
  },
  al_smelter: {
    yieldPct: 94.5,
    recoveryPct: 93.2,
    oee: 91,
    utilization: 100,
    downtimePlannedHrs: 310,
    downtimeUnplannedHrs: 265,
    energyGjPerTon: 13.35,
    waterM3PerTon: 1.55,
    peerYieldPct: { peer_median: 90, top_quartile: 92.5, best_in_world: 94.2 },
  },
  al_refining: {
    yieldPct: 91,
    recoveryPct: 89.5,
    oee: 77,
    utilization: 73,
    downtimePlannedHrs: 440,
    downtimeUnplannedHrs: 355,
    energyGjPerTon: 48.6,
    waterM3PerTon: 1.82,
    peerYieldPct: { peer_median: 88, top_quartile: 90, best_in_world: 92 },
  },
  gb_duwayhi: {
    yieldPct: 87.5,
    recoveryPct: 86.2,
    oee: 85,
    utilization: 89,
    downtimePlannedHrs: 400,
    downtimeUnplannedHrs: 298,
    energyGjPerTon: 11.9,
    waterM3PerTon: 0.58,
    peerYieldPct: { peer_median: 82, top_quartile: 86, best_in_world: 89 },
  },
  gb_mansourah: {
    yieldPct: 81.2,
    recoveryPct: 79.8,
    oee: 72,
    utilization: 81,
    downtimePlannedHrs: 455,
    downtimeUnplannedHrs: 385,
    energyGjPerTon: 12.4,
    waterM3PerTon: 0.64,
    peerYieldPct: { peer_median: 84, top_quartile: 87, best_in_world: 90 },
  },
  corp_platform: {
    yieldPct: 82,
    recoveryPct: 80,
    oee: 81,
    utilization: 86,
    downtimePlannedHrs: 0,
    downtimeUnplannedHrs: 0,
    energyGjPerTon: 2.1,
    waterM3PerTon: 0.35,
    peerYieldPct: { peer_median: 80, top_quartile: 83, best_in_world: 86 },
  },
}

const defaultSeed: OpSeed = opSeed.corp_platform

export const operationalKpis: OperationalKpiRow[] = assets.flatMap((a) =>
  years.map((year, idx) => {
    const s = opSeed[a.id] ?? defaultSeed
    const step = idx * 0.45 + (year === 2030 ? 3.2 : 0)
    const yieldPct = Math.min(97, s.yieldPct + step * 0.55)
    const recoveryPct = Math.min(96, s.recoveryPct + step * 0.5)
    const oee = Math.min(94, s.oee + step * 0.35)
    const utilization = Math.min(100, s.utilization + step * 0.4)
    const peerBump = step * 0.15
    return {
      assetId: a.id,
      year,
      recoveryPct,
      yieldPct,
      oee,
      utilization,
      downtimePlannedHrs: Math.round(s.downtimePlannedHrs + idx * 10),
      downtimeUnplannedHrs: Math.round(
        s.downtimeUnplannedHrs - idx * 12 - (year === 2030 ? 28 : 0),
      ),
      energyGjPerTon: s.energyGjPerTon - idx * (a.verticalId === 'aluminum' ? 0.35 : 0.12),
      waterM3PerTon: s.waterM3PerTon - idx * 0.03,
      peerYieldPct: {
        peer_median: s.peerYieldPct.peer_median + peerBump,
        top_quartile: s.peerYieldPct.top_quartile + peerBump * 0.8,
        best_in_world: s.peerYieldPct.best_in_world + peerBump * 0.5,
      },
      dimension: 'd2_operations',
    }
  }),
)

export function funnelForAsset(assetId: string): FunnelStage[] {
  if (assetId === 'ph_waad' || assetId === 'ph_ras') {
    return [
      { stage: 'ROM / feed', value: 100, lossToNext: 18 },
      { stage: 'Beneficiation / digest', value: 82, lossToNext: 12 },
      { stage: 'Acid & finishing', value: 72.2, lossToNext: 8.5 },
      { stage: 'Merchant / fertilizer product', value: 66.1 },
    ]
  }
  return [
    { stage: 'ROM / feed', value: 100, lossToNext: 4.2 },
    { stage: 'Grind / leach or digest', value: 95.8, lossToNext: 2.6 },
    { stage: 'Separation / reduction', value: 93.2, lossToNext: 1.9 },
    { stage: 'Finished product', value: 91.3 },
  ]
}

export function downtimeParetoForAsset(assetId: string): DowntimeCategory[] {
  const skew =
    assetId.includes('al') ? 1.1 : assetId.includes('gb') ? 1.05 : 1
  if (assetId.includes('gb')) {
    return [
      { category: 'Mill / crusher mechanical', hours: Math.round(132 * skew), pct: 34 },
      { category: 'Planned maintenance compliance', hours: Math.round(98 * skew), pct: 25 },
      { category: 'Instrumentation & controls', hours: Math.round(72 * skew), pct: 18 },
      { category: 'Power / backup', hours: Math.round(58 * skew), pct: 15 },
      { category: 'Other corrective', hours: Math.round(32 * skew), pct: 8 },
    ]
  }
  return [
    { category: 'Bearing / rotating equipment', hours: Math.round(118 * skew), pct: 32 },
    { category: 'Instrumentation & controls', hours: Math.round(86 * skew), pct: 23 },
    { category: 'Power / grid events', hours: Math.round(64 * skew), pct: 17 },
    { category: 'Refractory / lining', hours: Math.round(52 * skew), pct: 14 },
    { category: 'Other corrective', hours: Math.round(52 * skew), pct: 14 },
  ]
}
