export function formatSarM(n: number, compact = false): string {
  if (compact && Math.abs(n) >= 1000) {
    return `SAR ${(n / 1000).toFixed(2)}B`
  }
  return `SAR ${Math.round(n)}M`
}

export function formatUsdPerTon(n: number): string {
  if (n === 0) return '—'
  return `$${n.toLocaleString('en-US')}/t`
}

export function formatPct(n: number, digits = 1): string {
  return `${n.toFixed(digits)}%`
}

export function formatNumber(n: number, digits = 1): string {
  return n.toLocaleString('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })
}

export function peerTierLabel(t: string): string {
  switch (t) {
    case 'peer_median':
      return 'Peer median'
    case 'top_quartile':
      return 'Top quartile'
    case 'best_in_world':
      return 'Best-in-world'
    default:
      return t
  }
}

export function quartileLabel(q: number): string {
  const ord = ['1st', '2nd', '3rd', '4th']
  return `${ord[q - 1] ?? q} quartile`
}
