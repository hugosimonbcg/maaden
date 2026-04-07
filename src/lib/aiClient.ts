import type { AiPreset } from '../data/types'

export type AiApiSuccess = { ok: true; preset: AiPreset }

export type AiApiFailure = { ok: false; code: string }

export type AiApiResponse = AiApiSuccess | AiApiFailure

export async function fetchAiEnrichedPreset(params: {
  prompt: string
  routeTag: 'cost' | 'operations' | 'portfolio' | 'strategy'
  presetId: string
}): Promise<AiApiResponse> {
  try {
    const r = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    })
    let data: unknown
    try {
      data = await r.json()
    } catch {
      return { ok: false, code: 'INVALID_JSON' }
    }
    if (!data || typeof data !== 'object') {
      return { ok: false, code: 'INVALID_RESPONSE' }
    }
    const o = data as Record<string, unknown>
    if (o.ok === true && o.preset && typeof o.preset === 'object') {
      return { ok: true, preset: o.preset as AiPreset }
    }
    if (o.ok === false && typeof o.code === 'string') {
      return { ok: false, code: o.code }
    }
    return { ok: false, code: r.ok ? 'UNEXPECTED_SHAPE' : 'HTTP_ERROR' }
  } catch {
    return { ok: false, code: 'NETWORK' }
  }
}
