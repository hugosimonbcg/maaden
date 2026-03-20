import type { PeerTier } from '../data/types'

/** Illustrative sensitivity: closing overhead gap toward target tier. */
export function overheadScenarioEbitdaSarM(params: {
  currentOverheadRatio: number
  targetOverheadRatio: number
  revenueSarM: number
}): number {
  const delta = params.currentOverheadRatio - params.targetOverheadRatio
  return Math.max(0, delta * params.revenueSarM)
}

export function scenarioTargetRatio(
  current: number,
  mode: 'median' | 'upper_quartile' | 'best_in_world',
): number {
  const targets = {
    median: current * 0.97,
    upper_quartile: current * 0.91,
    best_in_world: current * 0.84,
  }
  return targets[mode]
}

export function peerTierToScenarioMode(tier: PeerTier): 'median' | 'upper_quartile' | 'best_in_world' {
  if (tier === 'peer_median') return 'median'
  if (tier === 'top_quartile') return 'upper_quartile'
  return 'best_in_world'
}
