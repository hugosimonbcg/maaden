import type { AiPreset } from '../data/types'
import { aiPresets } from '../data/seed'

export function findPresetById(id: string): AiPreset | undefined {
  return aiPresets.find((p) => p.id === id)
}

export function matchPresetFromQuery(
  q: string,
  routeTag: 'cost' | 'operations' | 'portfolio' | 'strategy',
): AiPreset {
  const lower = q.toLowerCase()
  const pool = aiPresets.filter((p) => p.routeTags.includes(routeTag))
  const direct = pool.find((p) => lower.includes(p.prompt.slice(0, 18).toLowerCase()))
  if (direct) return direct
  if (lower.includes('overhead') && lower.includes('ebitda')) {
    return aiPresets.find((p) => p.id === 'ai_overhead_ebitda')!
  }
  if (lower.includes('c1') || lower.includes('quartile') || lower.includes('cost')) {
    return aiPresets.find((p) => p.id === 'ai_c1_quartile')!
  }
  if (lower.includes('downtime') || lower.includes('pareto')) {
    return aiPresets.find((p) => p.id === 'ai_downtime')!
  }
  if (lower.includes('yield') || lower.includes('loss')) {
    return aiPresets.find((p) => p.id === 'ai_ops_root')!
  }
  if (lower.includes('allocat') || lower.includes('roic') || lower.includes('capital')) {
    return aiPresets.find((p) => p.id === 'ai_alloc_tradeoff')!
  }
  if (lower.includes('right') || lower.includes('win')) {
    return aiPresets.find((p) => p.id === 'ai_right_to_win')!
  }
  if (lower.includes('growth')) {
    return aiPresets.find((p) => p.id === 'ai_growth_returns')!
  }
  return (
    pool[0] ??
    aiPresets[0] ?? {
      id: 'ai_default',
      prompt: q,
      routeTags: [routeTag],
      response: {
        summary:
          'The benchmark fact base supports a structured answer once the query is scoped to a vertical, asset, and year. Refine filters or select a suggested interrogation.',
        reasoning: [
          'No matching preset — prototype routes conversational intent to closest analytical thread.',
        ],
        confidence: 0.55,
        sources: ['erp', 'public'],
        lineage: ['filters: vertical, asset, year, cohort'],
        followUps: [],
      },
    }
  )
}
