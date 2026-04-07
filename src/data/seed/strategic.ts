import type { MarketExposure, PeerArchetype, StrategicOption, ValueChainNode } from '../types'

export const valueChainNodes: ValueChainNode[] = [
  {
    id: 'vc_ph_1',
    stage: 'Rock to acid',
    description: 'Scale reserves & Q1 cash cost; recovery ROM→acid gap vs Q1 peers',
    maadenPosition: 'lead',
    verticalId: 'phosphate',
  },
  {
    id: 'vc_ph_2',
    stage: 'Ammonia & downstream',
    description: 'Commodity-heavy mix; India seasonal logistics concentration',
    maadenPosition: 'exposed',
    verticalId: 'phosphate',
  },
  {
    id: 'vc_al_1',
    stage: 'Bauxite to metal',
    description: 'Best-in-class smelter C1; refinery ore quality & rolling/VAP drag',
    maadenPosition: 'competitive',
    verticalId: 'aluminum',
  },
  {
    id: 'vc_gb_1',
    stage: 'Orebody to doré',
    description: 'Strong returns; LOM depth & scale vs Q1 — exploration critical',
    maadenPosition: 'developing',
    verticalId: 'gold_base_metals',
  },
  {
    id: 'vc_corp',
    stage: 'Corporate leverage',
    description: 'TSR leader; balance sheet stretch limits self-funded growth',
    maadenPosition: 'exposed',
    verticalId: 'corporate',
  },
]

export const marketExposure: MarketExposure[] = [
  { region: 'GCC', segment: 'Fertilizer offtake', sharePct: 28, marginIndicator: 'stable' },
  {
    region: 'South Asia',
    segment: 'DAP/MAP (India seasonal May–Sep)',
    sharePct: 36,
    marginIndicator: 'thin',
  },
  { region: 'East Asia', segment: 'Aluminum products', sharePct: 24, marginIndicator: 'strong' },
  { region: 'Domestic KSA', segment: 'Construction & industry', sharePct: 12, marginIndicator: 'stable' },
]

export const peerArchetypes: PeerArchetype[] = [
  {
    id: 'ar_mosaic',
    name: 'Integrated phosphate majors (Mosaic, OCP, PhosAgro)',
    type: 'mining_peer',
    focus: 'Specialty fertilizer mix vs commodity DAP/MAP',
    strengths: ['Product diversification', 'Logistics integration'],
    watchouts: ['Input cost cyclicality'],
  },
  {
    id: 'ar_alcoa',
    name: 'Smelter-refinery systems (e.g. Arconic-style rolling mix)',
    type: 'mining_peer',
    focus: 'VAP netback & can/auto body mix',
    strengths: ['Technical yield', 'Downstream realization'],
    watchouts: ['Energy price exposure'],
  },
  {
    id: 'ar_bhp_rio',
    name: 'Diversified miners (BHP, Rio, Anglo, Vale)',
    type: 'mining_peer',
    focus: 'TSR vs underlying ROIC / leverage path',
    strengths: ['Scale', 'Capital markets access'],
    watchouts: ['Cycle timing', 'Portfolio mix'],
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
    title: 'Phosphate recovery & mix (ROM→acid, specialty crop)',
    thesis: 'Close recovery vs Q1 and reduce commodity concentration toward ~45% specialty by 2040 ambition.',
    rationale:
      'Diagnostic flagged ROM→acid and beneficiation gaps vs Q1; peers run materially higher specialty share.',
    risks: ['India logistics seasonality', 'Working capital', 'Balance sheet headroom'],
    expectedValueSarM: 320,
    horizon: '2027–2030',
    verticalId: 'phosphate',
  },
  {
    id: 'so_2',
    title: 'Aluminum: protect smelter, fix rolling & VAP netback',
    thesis: 'Sustain Q1 smelter C1; redeploy capital toward VAP mix and rolling utilization.',
    rationale:
      'Smelter structural advantage vs ~$1.6k/t Q1 benchmark; rolling/utilization and VAP share trail Q1 peers.',
    risks: ['Offtake underwriting', 'Power tariff path', 'Scrap availability'],
    expectedValueSarM: 440,
    horizon: '2028–2032',
    verticalId: 'aluminum',
  },
  {
    id: 'so_3',
    title: 'GBM: LOM extension + scale / maintenance discipline',
    thesis: 'Exploration success and selective consolidation vs small-scale, high AISC after overhead.',
    rationale:
      'Strong ROIC at asset level; structural LOM and scale gap vs Q1; PM compliance variability flagged.',
    risks: ['Exploration outcomes', 'UG execution'],
    expectedValueSarM: 175,
    horizon: '2026–2029',
    verticalId: 'gold_base_metals',
  },
]
