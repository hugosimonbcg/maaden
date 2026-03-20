import type {
  ActionItem,
  Asset,
  CostBenchmarkRow,
  GeographyFilter,
  OperationalKpiRow,
  PerformanceDimension,
  PortfolioItem,
  VerticalId,
  YearKey,
} from '../data/types'
import { actions, assets, costBenchmarks, operationalKpis, portfolioItems } from '../data/seed'

export interface FilterState {
  vertical: VerticalId | 'all'
  asset: string | 'all'
  year: YearKey
  geo: GeographyFilter
  metricDim: PerformanceDimension | 'all'
}

export function assetsForVertical(vertical: VerticalId | 'all'): Asset[] {
  if (vertical === 'all') return assets
  return assets.filter((a) => a.verticalId === vertical)
}

function geoMatches(asset: Asset, geo: GeographyFilter): boolean {
  if (geo === 'all') return true
  if (geo === 'ksa') return asset.primaryGeo === 'ksa'
  if (geo === 'gcc') return asset.verticalId !== 'corporate'
  if (geo === 'export_markets')
    return asset.verticalId === 'phosphate' || asset.verticalId === 'aluminum' || asset.verticalId === 'gold_base_metals'
  return true
}

export function filterCosts(f: FilterState): CostBenchmarkRow[] {
  return costBenchmarks.filter((r) => {
    const a = assets.find((x) => x.id === r.assetId)
    if (!a) return false
    if (f.vertical !== 'all' && a.verticalId !== f.vertical) return false
    if (f.asset !== 'all' && r.assetId !== f.asset) return false
    if (r.year !== f.year) return false
    if (!geoMatches(a, f.geo)) return false
    if (f.metricDim !== 'all' && r.dimension !== f.metricDim) return false
    return true
  })
}

export function filterOps(f: FilterState): OperationalKpiRow[] {
  return operationalKpis.filter((r) => {
    const a = assets.find((x) => x.id === r.assetId)
    if (!a) return false
    if (f.vertical !== 'all' && a.verticalId !== f.vertical) return false
    if (f.asset !== 'all' && r.assetId !== f.asset) return false
    if (r.year !== f.year) return false
    if (!geoMatches(a, f.geo)) return false
    if (f.metricDim !== 'all' && r.dimension !== f.metricDim) return false
    return true
  })
}

export function filterPortfolio(vertical: VerticalId | 'all'): PortfolioItem[] {
  if (vertical === 'all') return portfolioItems
  return portfolioItems.filter((p) => p.verticalId === vertical)
}

export function filterActions(vertical: VerticalId | 'all'): ActionItem[] {
  if (vertical === 'all') return actions
  return actions.filter((a) => a.verticalId === vertical)
}

const trendYears: YearKey[] = [2023, 2024, 2025, 2030]

export function filterOpsTrend(f: FilterState): OperationalKpiRow[] {
  return operationalKpis.filter((r) => {
    if (!trendYears.includes(r.year)) return false
    const a = assets.find((x) => x.id === r.assetId)
    if (!a) return false
    if (f.vertical !== 'all' && a.verticalId !== f.vertical) return false
    if (f.asset !== 'all' && r.assetId !== f.asset) return false
    if (!geoMatches(a, f.geo)) return false
    if (f.metricDim !== 'all' && r.dimension !== f.metricDim) return false
    return true
  })
}

export function latestInternalRefreshIso(): string {
  return '2026-03-18T05:40:00Z'
}
