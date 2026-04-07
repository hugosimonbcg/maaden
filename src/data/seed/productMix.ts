/** Commodity vs VAP — aligned to 2021 diagnostic (phosphate commodity-heavy; smelting VAP gap vs Q1). */
export const productMixMatrix = [
  { verticalId: 'phosphate' as const, commodityPct: 88, vapPct: 12, marginRank: 3 },
  { verticalId: 'aluminum' as const, commodityPct: 45, vapPct: 55, marginRank: 3 },
  { verticalId: 'gold_base_metals' as const, commodityPct: 78, vapPct: 22, marginRank: 2 },
  { verticalId: 'corporate' as const, commodityPct: 0, vapPct: 0, marginRank: 4 },
]
