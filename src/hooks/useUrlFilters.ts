import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { GeographyFilter, PeerTier, PerformanceDimension, PersonaId, VerticalId, YearKey } from '../data/types'

const PEERS: PeerTier[] = ['peer_median', 'top_quartile', 'best_in_world']

function parseVertical(v: string | null): VerticalId | 'all' {
  if (!v || v === 'all') return 'all'
  if (v === 'phosphate' || v === 'aluminum' || v === 'gold_base_metals' || v === 'corporate') return v
  return 'all'
}

function parseYear(v: string | null): YearKey {
  const n = Number(v)
  if (n === 2021 || n === 2023 || n === 2024 || n === 2025 || n === 2030) return n
  return 2025
}

function parseCohort(v: string | null): PeerTier {
  if (v && PEERS.includes(v as PeerTier)) return v as PeerTier
  return 'top_quartile'
}

function parseGeo(v: string | null): GeographyFilter {
  if (v === 'ksa' || v === 'gcc' || v === 'export_markets') return v
  return 'all'
}

function parseDim(v: string | null): PerformanceDimension | 'all' {
  if (
    v === 'd1_assets' ||
    v === 'd2_operations' ||
    v === 'd3_cost_capital' ||
    v === 'd4_marketing_mix' ||
    v === 'd5_org_enablers'
  )
    return v
  return 'all'
}

function parsePersona(v: string | null): PersonaId {
  if (v === 'performance' || v === 'business_units') return v
  return 'strategy'
}

export function useUrlFilters() {
  const [search, setSearch] = useSearchParams()

  const vertical = parseVertical(search.get('vertical'))
  const asset = search.get('asset') ?? 'all'
  const year = parseYear(search.get('year'))
  const cohort = parseCohort(search.get('cohort'))
  const geo = parseGeo(search.get('geo'))
  const metricDim = parseDim(search.get('dim'))
  const persona = parsePersona(search.get('persona'))

  const setParams = useCallback(
    (patch: Record<string, string | number | undefined>) => {
      const next = new URLSearchParams(search)
      Object.entries(patch).forEach(([k, val]) => {
        if (val === undefined || val === '') next.delete(k)
        else next.set(k, String(val))
      })
      setSearch(next, { replace: true })
    },
    [search, setSearch],
  )

  const filterState = useMemo(
    () => ({ vertical, asset: asset as string | 'all', year, geo, metricDim }),
    [vertical, asset, year, geo, metricDim],
  )

  return {
    vertical,
    asset: asset as string | 'all',
    year,
    cohort,
    geo,
    metricDim,
    persona,
    filterState,
    setVertical: (v: VerticalId | 'all') => setParams({ vertical: v === 'all' ? undefined : v, asset: 'all' }),
    setAsset: (a: string | 'all') => setParams({ asset: a === 'all' ? undefined : a }),
    setYear: (y: YearKey) => setParams({ year: y }),
    setCohort: (c: PeerTier) => setParams({ cohort: c }),
    setGeo: (g: GeographyFilter) => setParams({ geo: g === 'all' ? undefined : g }),
    setMetricDim: (d: PerformanceDimension | 'all') => setParams({ dim: d === 'all' ? undefined : d }),
    setPersona: (p: PersonaId) => setParams({ persona: p === 'strategy' ? undefined : p }),
  }
}
