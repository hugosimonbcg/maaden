import type { CostBenchmarkRow, YearKey } from '../types'
import { assets } from './assets'

const years: YearKey[] = [2021, 2023, 2024, 2025, 2030]

function baseForAsset(assetId: string): {
  c1: number
  oh: number
  q: 1 | 2 | 3 | 4
} {
  const map: Record<string, { c1: number; oh: number; q: 1 | 2 | 3 | 4 }> = {
    ph_waad: { c1: 704, oh: 0.14, q: 2 },
    ph_ras: { c1: 102, oh: 0.11, q: 2 },
    al_smelter: { c1: 1840, oh: 0.09, q: 3 },
    al_refining: { c1: 312, oh: 0.1, q: 2 },
    gb_duwaymi: { c1: 890, oh: 0.13, q: 2 },
    gb_mansourah: { c1: 1020, oh: 0.15, q: 3 },
    corp_platform: { c1: 0, oh: 0.22, q: 3 },
  }
  return map[assetId] ?? { c1: 100, oh: 0.12, q: 2 }
}

function yearFactor(y: YearKey): number {
  if (y === 2021) return 0.96
  if (y === 2023) return 1.02
  if (y === 2024) return 1.0
  if (y === 2025) return 0.98
  return 0.92
}

export const costBenchmarks: CostBenchmarkRow[] = assets.flatMap((a) =>
  years.map((year) => {
    const b = baseForAsset(a.id)
    const f = yearFactor(year)
    const c1 = a.id === 'corp_platform' ? 0 : Math.round(b.c1 * f)
    const totalDrivers =
      c1 > 0
        ? {
            oreAndMining: Math.round(c1 * 0.28),
            reagents: Math.round(c1 * 0.18),
            energy: Math.round(c1 * 0.24),
            labour: Math.round(c1 * 0.12),
            maintenance: Math.round(c1 * 0.1),
            other: Math.max(0, c1 - Math.round(c1 * 0.92)),
          }
        : {
            oreAndMining: 0,
            reagents: 0,
            energy: 0,
            labour: 42,
            maintenance: 0,
            other: 38,
          }
    const peerC1 = {
      peer_median: Math.round((c1 || 80) * 1.06),
      top_quartile: Math.round((c1 || 80) * 0.94),
      best_in_world: Math.round((c1 || 80) * 0.82),
    }
    return {
      assetId: a.id,
      year,
      productTonnes:
        a.id === 'corp_platform'
          ? 0
          : year === 2030
            ? Math.round(4.2e6 * 1.08)
            : Math.round(3.8e6 * (0.97 + (year - 2023) * 0.01)),
      c1UsdPerTon: c1,
      breakdown: totalDrivers,
      overheadRatio: Math.min(0.28, b.oh + (year === 2030 ? -0.03 : year === 2025 ? -0.01 : 0)),
      quartile: b.q,
      peerC1UsdPerTon: peerC1,
      dimension: 'd3_cost_capital',
    }
  }),
)

export const costLevers = [
  {
    id: 'lv_1',
    lever: 'Reagent intensity reduction — acid circuit yield',
    owner: 'VP Phosphate Operations',
    timing: 'Q3 2026',
    ebitdaImpactSarM: 186,
    assetId: 'ph_waad',
    verticalId: 'phosphate' as const,
  },
  {
    id: 'lv_2',
    lever: 'Power contracting re-baseline & load shifting',
    owner: 'Chief Power Officer',
    timing: 'Q1 2027',
    ebitdaImpactSarM: 240,
    assetId: 'al_smelter',
    verticalId: 'aluminum' as const,
  },
  {
    id: 'lv_3',
    lever: 'G&A ratio convergence to top quartile',
    owner: 'CSIC — Corporate',
    timing: 'Rolling 18 mo',
    ebitdaImpactSarM: 95,
    assetId: 'corp_platform',
    verticalId: 'corporate' as const,
  },
  {
    id: 'lv_4',
    lever: 'Maintenance strategy — fixed plant PM optimization',
    owner: 'Head Reliability, GBM',
    timing: 'Q4 2026',
    ebitdaImpactSarM: 72,
    assetId: 'gb_mansourah',
    verticalId: 'gold_base_metals' as const,
  },
]
