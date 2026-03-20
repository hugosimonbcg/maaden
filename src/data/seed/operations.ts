import type { DowntimeCategory, FunnelStage, OperationalKpiRow, YearKey } from '../types'
import { assets } from './assets'

const years: YearKey[] = [2023, 2024, 2025, 2030]

export const operationalKpis: OperationalKpiRow[] = assets.flatMap((a) =>
  years.map((year, idx) => {
    const baseOee = a.verticalId === 'aluminum' ? 86 : a.verticalId === 'phosphate' ? 82 : 78
    const oee = Math.min(94, baseOee + idx * 0.8 + (year === 2030 ? 4 : 0))
    const yieldPct =
      a.verticalId === 'phosphate'
        ? 91 + idx * 0.4
        : a.verticalId === 'aluminum'
          ? 93.2 + idx * 0.2
          : 87.5 + idx * 0.35
    return {
      assetId: a.id,
      year,
      recoveryPct: yieldPct - 1.2,
      yieldPct,
      oee,
      utilization: Math.min(96, 84 + idx + (a.id === 'al_smelter' ? 3 : 0)),
      downtimePlannedHrs: 420 + idx * 12,
      downtimeUnplannedHrs: 310 - idx * 15 - (year === 2030 ? 40 : 0),
      energyGjPerTon:
        a.verticalId === 'aluminum' ? 48.2 - idx * 0.4 : 12.4 - idx * 0.15,
      waterM3PerTon: a.verticalId === 'gold_base_metals' ? 0.62 : 1.85 - idx * 0.04,
      peerYieldPct: {
        peer_median: yieldPct - 1.8,
        top_quartile: yieldPct + 0.9,
        best_in_world: yieldPct + 3.1,
      },
      dimension: 'd2_operations',
    }
  }),
)

export function funnelForAsset(_assetId: string): FunnelStage[] {
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
  return [
    { category: 'Bearing / rotating equipment', hours: Math.round(118 * skew), pct: 32 },
    { category: 'Instrumentation & controls', hours: Math.round(86 * skew), pct: 23 },
    { category: 'Power / grid events', hours: Math.round(64 * skew), pct: 17 },
    { category: 'Refractory / lining', hours: Math.round(52 * skew), pct: 14 },
    { category: 'Other corrective', hours: Math.round(52 * skew), pct: 14 },
  ]
}
