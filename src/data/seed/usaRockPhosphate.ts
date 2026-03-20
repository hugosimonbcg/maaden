/**
 * Illustrative global rock phosphate series (Mt) for strategy UI — stylized after public
 * long-run production / apparent-consumption profiles, not a live data feed.
 */
export type UsRockPhosphatePoint = {
  year: number
  production: number
  consumption: number
  /** Illustrative benchmark price, US$/t — wobbles around ~150 for strategy dialogue. */
  priceUsdPerTon: number
}

function wobble(phase: number, year: number): number {
  return Math.sin(phase * 1.9 + year * 0.42) * 1.4 + Math.sin(phase * 2.7 + year * 0.19) * 0.9
}

/** 2012–2030 annual points (incl. illustrative outer years); deterministic (no random). */
export const usRockPhosphateSeries: UsRockPhosphatePoint[] = (() => {
  const start = 2012
  const end = 2030
  const rows: UsRockPhosphatePoint[] = []
  for (let year = start; year <= end; year++) {
    const t = (year - start) / (end - start)
    let prod: number
    let cons: number
    if (t < 0.25) {
      prod = 24 + wobble(1, year) * 1.2 + t * 4
      cons = prod * 0.9 + wobble(2, year) * 0.8
    } else if (t < 0.55) {
      const u = (t - 0.25) / 0.3
      prod = 27 + u * 22 + wobble(3, year) * (1.5 + u * 4)
      cons = prod * 0.9 + wobble(4, year) * (1 + u * 3)
    } else if (t < 0.72) {
      const u = (t - 0.55) / 0.17
      prod = 49 + wobble(5, year) * 3 - u * 2
      cons = 44 + wobble(6, year) * 2.5 - u * 1.5
    } else {
      const u = (t - 0.72) / 0.28
      prod = 47 - u * 23 + wobble(7, year) * 1.5
      cons = 42 - u * 14 + wobble(8, year) * 1.5 + Math.max(0, u - 0.55) * 12
    }
    if (t < 0.75 && cons > prod - 0.3) cons = Math.min(cons, prod * 0.96 + wobble(9, year) * 0.15)
    const priceUsd =
      150 +
      wobble(10, year) * 12 +
      wobble(11, year) * 8 +
      t * 14 +
      Math.sin(year * 0.55) * 6
    rows.push({
      year,
      production: Math.round(Math.max(0, prod) * 10) / 10,
      consumption: Math.round(Math.max(0, cons) * 10) / 10,
      priceUsdPerTon: Math.round(Math.max(40, priceUsd) * 10) / 10,
    })
  }
  return rows
})()
