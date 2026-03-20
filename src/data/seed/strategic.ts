import type { MarketExposure, PeerArchetype, StrategicOption, ValueChainNode } from '../types'

export const valueChainNodes: ValueChainNode[] = [
  {
    id: 'vc_ph_1',
    stage: 'Rock to acid',
    description: 'Mine-to-merchant acid integration',
    maadenPosition: 'lead',
    verticalId: 'phosphate',
  },
  {
    id: 'vc_ph_2',
    stage: 'Ammonia & downstream',
    description: 'Nitrogen linkage and fertilizer mix',
    maadenPosition: 'competitive',
    verticalId: 'phosphate',
  },
  {
    id: 'vc_al_1',
    stage: 'Bauxite to metal',
    description: 'Refinery-smelter coupling and cast products',
    maadenPosition: 'competitive',
    verticalId: 'aluminum',
  },
  {
    id: 'vc_gb_1',
    stage: 'Orebody to doré',
    description: 'Underground scale and recovery discipline',
    maadenPosition: 'developing',
    verticalId: 'gold_base_metals',
  },
  {
    id: 'vc_corp',
    stage: 'Corporate leverage',
    description: 'Capital, portfolio, and market access',
    maadenPosition: 'competitive',
    verticalId: 'corporate',
  },
]

export const marketExposure: MarketExposure[] = [
  { region: 'GCC', segment: 'Fertilizer offtake', sharePct: 38, marginIndicator: 'stable' },
  { region: 'South Asia', segment: 'DAP/MAP', sharePct: 22, marginIndicator: 'thin' },
  { region: 'East Asia', segment: 'Aluminum products', sharePct: 27, marginIndicator: 'strong' },
  { region: 'Domestic KSA', segment: 'Construction & industry', sharePct: 13, marginIndicator: 'stable' },
]

export const peerArchetypes: PeerArchetype[] = [
  {
    id: 'ar_mosaic',
    name: 'Integrated phosphate majors',
    type: 'mining_peer',
    focus: 'Acid-ammonia-fertilizer coupling',
    strengths: ['Logistics integration', 'Merchant acid optionality'],
    watchouts: ['Input cost cyclicality'],
  },
  {
    id: 'ar_alcoa',
    name: 'Smelter-refinery systems',
    type: 'mining_peer',
    focus: 'Power-adjusted conversion economics',
    strengths: ['Technical yield', 'Product mix'],
    watchouts: ['Energy price exposure'],
  },
  {
    id: 'ar_nucor',
    name: 'Industrial metal operators (exemplar)',
    type: 'non_mining_exemplar',
    focus: 'Throughput reliability and micro-cost control',
    strengths: ['OEE culture', 'Maintenance precision'],
    watchouts: ['Different feedstock physics'],
  },
  {
    id: 'ar_shell_ops',
    name: 'Large-scale process operators (exemplar)',
    type: 'non_mining_exemplar',
    focus: 'Energy intensity and turnaround discipline',
    strengths: ['Turnaround planning', 'Energy accounting'],
    watchouts: ['Regulatory context differs'],
  },
]

export const strategicOptions: StrategicOption[] = [
  {
    id: 'so_1',
    title: 'Deepen VAP share in phosphate',
    thesis: 'Shift mix toward differentiated fertilizer and industrial acid bundles.',
    rationale: 'Peer margin curves show 180–320 bps uplift where VAP exceeds 35% of tonnes sold.',
    risks: ['Feedstock constraints', 'Working capital'],
    expectedValueSarM: 290,
    horizon: '2027–2030',
    verticalId: 'phosphate',
  },
  {
    id: 'so_2',
    title: 'Aluminum downstream expansion (selective)',
    thesis: 'Anchor metal in KSA industrial demand before exporting marginal tonnes.',
    rationale: 'Reduces realized volatility vs. LME-heavy peers while improving ROIC on marginal capital.',
    risks: ['Offtake underwriting', 'Power tariff path'],
    expectedValueSarM: 410,
    horizon: '2028–2032',
    verticalId: 'aluminum',
  },
  {
    id: 'so_3',
    title: 'GBM portfolio rationalization',
    thesis: 'Concentrate on assets with endowment depth and recovery headroom.',
    rationale: 'Benchmarks show largest value gap in utilization and recovery, not reserve tonnes.',
    risks: ['Execution in UG transitions'],
    expectedValueSarM: 150,
    horizon: '2026–2029',
    verticalId: 'gold_base_metals',
  },
]
