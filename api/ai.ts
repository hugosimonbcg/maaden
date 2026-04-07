import type { AiPreset } from '../src/data/types'
import { findPresetById, matchPresetFromQuery } from '../src/lib/aiPresetMatch'

export const config = {
  runtime: 'edge',
}

/** Groq production model (see https://console.groq.com/docs/models — avoid deprecated preview IDs). */
const DEFAULT_MODEL = 'llama-3.1-8b-instant'
const DEFAULT_BASE = 'https://api.groq.com/openai/v1'

type RouteTag = 'cost' | 'operations' | 'portfolio' | 'strategy'

const ROUTE_TAGS = new Set<RouteTag>(['cost', 'operations', 'portfolio', 'strategy'])

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  })
}

function parseModelJson(content: string): { summary?: string; reasoning?: unknown } | null {
  const trimmed = content.trim()
  try {
    return JSON.parse(trimmed) as { summary?: string; reasoning?: unknown }
  } catch {
    const start = trimmed.indexOf('{')
    const end = trimmed.lastIndexOf('}')
    if (start >= 0 && end > start) {
      try {
        return JSON.parse(trimmed.slice(start, end + 1)) as { summary?: string; reasoning?: unknown }
      } catch {
        return null
      }
    }
  }
  return null
}

function mergeNarrative(
  base: AiPreset,
  userPrompt: string,
  parsed: { summary?: string; reasoning?: unknown },
  modelId: string,
): AiPreset {
  const reasoning =
    Array.isArray(parsed.reasoning) && parsed.reasoning.every((x) => typeof x === 'string')
      ? (parsed.reasoning as string[])
      : base.response.reasoning
  const summary = typeof parsed.summary === 'string' && parsed.summary.trim() ? parsed.summary.trim() : base.response.summary

  return {
    ...base,
    prompt: userPrompt,
    narrativeSource: 'groq',
    narrativeModelId: modelId,
    response: {
      ...base.response,
      summary,
      reasoning: reasoning.length ? reasoning : base.response.reasoning,
    },
  }
}

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'POST') {
    return json({ ok: false, code: 'METHOD_NOT_ALLOWED' }, 405)
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return json({ ok: false, code: 'INVALID_JSON' }, 400)
  }

  if (!body || typeof body !== 'object') {
    return json({ ok: false, code: 'INVALID_BODY' }, 400)
  }

  const b = body as Record<string, unknown>
  const prompt = typeof b.prompt === 'string' ? b.prompt : ''
  const presetId = typeof b.presetId === 'string' ? b.presetId : ''
  const routeTag = b.routeTag

  if (!ROUTE_TAGS.has(routeTag as RouteTag)) {
    return json({ ok: false, code: 'INVALID_ROUTE_TAG' }, 400)
  }

  const tag = routeTag as RouteTag

  let base: AiPreset
  if (presetId) {
    const p = findPresetById(presetId)
    if (!p) {
      return json({ ok: false, code: 'UNKNOWN_PRESET' }, 400)
    }
    base = p
  } else if (prompt.trim()) {
    base = matchPresetFromQuery(prompt, tag)
  } else {
    return json({ ok: false, code: 'MISSING_PROMPT_OR_PRESET' }, 400)
  }

  const userPrompt = prompt.trim() || base.prompt

  const apiKey = (process.env.GROQ_API_KEY ?? process.env.AI_API_KEY ?? '').trim()
  if (!apiKey) {
    return json({ ok: false, code: 'NO_API_KEY' })
  }

  const baseUrl = (process.env.AI_BASE_URL ?? DEFAULT_BASE).replace(/\/$/, '')
  const model = (process.env.AI_MODEL ?? DEFAULT_MODEL).trim() || DEFAULT_MODEL

  const canonical = {
    summary: base.response.summary,
    reasoning: base.response.reasoning,
  }

  const system = `You are editing executive briefing copy for a synthetic benchmarking prototype (illustrative data only, not live ERP output).

Rules:
- Do NOT add new numbers, currencies, percentages, company names, or claims.
- Do NOT contradict the canonical facts below.
- Improve clarity and executive tone only.
- Output a single JSON object with exactly two keys: "summary" (string) and "reasoning" (array of strings). No markdown, no code fences.

Canonical summary:
${canonical.summary}

Canonical reasoning (preserve each fact; you may rephrase sentences):
${canonical.reasoning.map((r, i) => `${i + 1}. ${r}`).join('\n')}`

  const userMsg = `User query (for tone alignment only): ${userPrompt}\n\nReturn JSON only.`

  const completionUrl = `${baseUrl}/chat/completions`

  const callGroq = async (useJsonObject: boolean): Promise<Response> => {
    const payload: Record<string, unknown> = {
      model,
      temperature: 0.25,
      max_tokens: 1024,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: userMsg },
      ],
    }
    if (useJsonObject) {
      payload.response_format = { type: 'json_object' }
    }
    return fetch(completionUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
  }

  let upstream = await callGroq(true)
  if (!upstream.ok) {
    upstream = await callGroq(false)
  }

  if (!upstream.ok) {
    const errText = await upstream.text().catch(() => '')
    return json(
      {
        ok: false,
        code: 'UPSTREAM_ERROR',
        status: upstream.status,
        detail: errText.slice(0, 500),
      },
      200,
    )
  }

  let completion: {
    choices?: Array<{ message?: { content?: string | null } }>
  }
  try {
    completion = (await upstream.json()) as typeof completion
  } catch {
    return json({ ok: false, code: 'UPSTREAM_PARSE' }, 200)
  }

  const content = completion.choices?.[0]?.message?.content
  if (typeof content !== 'string' || !content.trim()) {
    return json({ ok: false, code: 'EMPTY_COMPLETION' }, 200)
  }

  const parsed = parseModelJson(content)
  if (!parsed) {
    return json({ ok: false, code: 'MODEL_JSON_PARSE' }, 200)
  }

  const preset = mergeNarrative(base, userPrompt, parsed, model)
  return json({ ok: true, preset })
}
