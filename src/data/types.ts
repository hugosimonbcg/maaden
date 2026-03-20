export type AiPhase = 'idle' | 'listening' | 'thinking' | 'speaking'

export type VerticalId = 'phosphate' | 'aluminum' | 'gold_base_metals' | 'corporate'

export type YearKey = 2021 | 2023 | 2024 | 2025 | 2030

export type PeerTier = 'maaden' | 'peer_median' | 'top_quartile' | 'best_in_world'

export type PerformanceDimension = 'd1_assets' | 'd2_operations' | 'd3_cost_capital' | 'd4_marketing_mix' | 'd5_org_enablers'

export type PersonaId = 'strategy' | 'performance' | 'business_units'

export type ActionStatus = 'proposed' | 'in_progress' | 'blocked' | 'done'

export type DataSourceId =
  | 'erp'
  | 'historian'
  | 'investor_filings'
  | 'capital_iq'
  | 'woodmac'
  | 'public'
  | 'bloomberg'

export type GeographyFilter = 'all' | 'ksa' | 'gcc' | 'export_markets'

export interface Vertical {
  id: VerticalId
  label: string
}

export interface Asset {
  id: string
  verticalId: VerticalId
  name: string
  shortCode: string
  processSteps: string[]
  primaryGeo: GeographyFilter
  dimensionTags: PerformanceDimension[]
}

export interface CostBreakdown {
  oreAndMining: number
  reagents: number
  energy: number
  labour: number
  maintenance: number
  other: number
}

export interface CostBenchmarkRow {
  assetId: string
  year: YearKey
  productTonnes: number
  c1UsdPerTon: number
  breakdown: CostBreakdown
  overheadRatio: number
  quartile: 1 | 2 | 3 | 4
  peerC1UsdPerTon: Record<Exclude<PeerTier, 'maaden'>, number>
  dimension: PerformanceDimension
}

export interface OperationalKpiRow {
  assetId: string
  year: YearKey
  recoveryPct: number
  yieldPct: number
  oee: number
  utilization: number
  downtimePlannedHrs: number
  downtimeUnplannedHrs: number
  energyGjPerTon: number
  waterM3PerTon: number
  peerYieldPct: Record<Exclude<PeerTier, 'maaden'>, number>
  dimension: PerformanceDimension
}

export type PortfolioKind = 'operating_asset' | 'growth_initiative'

export interface PortfolioItem {
  id: string
  name: string
  verticalId: VerticalId
  kind: PortfolioKind
  roic: number
  roce: number
  capexEfficiency: number
  capitalIntensity: number
  projectRisk: 1 | 2 | 3 | 4 | 5
  strategicFit: number
  paybackMonths: number
  scheduleVariancePct: number
  budgetVariancePct: number
  expectedEbitdaSarM: number
  dimension: PerformanceDimension
}

export interface ValueChainNode {
  id: string
  stage: string
  description: string
  maadenPosition: 'lead' | 'competitive' | 'developing' | 'exposed'
  verticalId: VerticalId
}

export interface MarketExposure {
  region: string
  segment: string
  sharePct: number
  marginIndicator: 'strong' | 'stable' | 'thin'
}

export interface StrategicOption {
  id: string
  title: string
  thesis: string
  rationale: string
  risks: string[]
  expectedValueSarM: number
  horizon: string
  verticalId: VerticalId
}

export interface PeerArchetype {
  id: string
  name: string
  type: 'mining_peer' | 'non_mining_exemplar'
  focus: string
  strengths: string[]
  watchouts: string[]
}

export interface ActionItem {
  id: string
  title: string
  lever: string
  owner: string
  verticalId: VerticalId
  assetId?: string
  dueDate: string
  status: ActionStatus
  valueAtStakeSarM: number
  linkedRoute: '/cost' | '/operations' | '/portfolio' | '/strategy'
  suggestedPromptId: string
  dimension: PerformanceDimension
}

export interface AiFollowUp {
  label: string
  promptId: string
}

export interface AiPreset {
  id: string
  prompt: string
  routeTags: Array<'cost' | 'operations' | 'portfolio' | 'strategy'>
  response: {
    summary: string
    reasoning: string[]
    confidence: number
    sources: DataSourceId[]
    lineage: string[]
    followUps: AiFollowUp[]
  }
}

export interface SourceFreshness {
  source: DataSourceId
  label: string
  kind: 'internal' | 'external'
  lastRefresh: string
  status: 'current' | 'stale' | 'partial'
}

export interface CostLeverRow {
  id: string
  lever: string
  owner: string
  timing: string
  ebitdaImpactSarM: number
  assetId: string
  verticalId: VerticalId
}

export interface FunnelStage {
  stage: string
  value: number
  lossToNext?: number
}

export interface DowntimeCategory {
  category: string
  hours: number
  pct: number
}
