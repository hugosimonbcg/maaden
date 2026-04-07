import type { AiPreset } from '../types'

export const aiPresets: AiPreset[] = [
  {
    id: 'ai_c1_quartile',
    prompt: "Show Maaden C1 cash cost vs peer quartiles for 2023–2025",
    routeTags: ['cost'],
    response: {
      summary:
        'Waad Al Shamal sits in the first quartile on C1 cash cost (phosphate-acid equivalent) in the 2021 full-business diagnostic (2020 anchor), while operational recovery ROM→acid and beneficiation remain well below Q1 peer benchmarks — the dominant value gap is yield, not unit cash cost at the mine gate. Ras Al Khair finishing is competitive on cost but exposed to acid logistics and India seasonal offtake.',
      reasoning: [
        'Peer curves blend Capital IQ / public disclosures with the 2021 Board-commissioned benchmarking exercise (150+ KPIs, 5–10 peers per business).',
        'Internal actuals reconcile to ERP cost centers; historian tags anchor energy and reagent drivers.',
        'Phosphate narrative tension: strong cost position vs deteriorating margin and recovery headroom vs OCP / PhosAgro / Mosaic-style peers.',
      ],
      confidence: 0.86,
      sources: ['erp', 'capital_iq', 'woodmac', 'investor_filings'],
      lineage: [
        'costBenchmarks: ph_waad, ph_ras (aligned to 2021 diagnostic, 2020 anchor)',
        'operationalKpis: recovery vs Q1 peer band',
        'peerArchetypes: Mosaic, OCP, PhosAgro',
      ],
      followUps: [
        { label: 'Waterfall by driver for 2025', promptId: 'ai_cost_waterfall' },
        { label: 'Overhead ratio scenario', promptId: 'ai_overhead_ebitda' },
      ],
    },
  },
  {
    id: 'ai_overhead_ebitda',
    prompt: 'If overhead ratio closes to top quartile, what is EBITDA impact?',
    routeTags: ['cost', 'portfolio'],
    response: {
      summary:
        'Closing the corporate and shared-services overhead ratio to the peer top quartile implies approximately SAR 420–680 million annual EBITDA at steady-state volumes, with two-thirds from corporate platform productivity and one-third from vertical shared services.',
      reasoning: [
        'Scenario applies elasticity coefficients from 2023–2025 overhead actuals vs peer medians.',
        'Assumes no revenue destruction from support reduction; execution risk is captured separately.',
        'Corporate platform (CORP) carries the largest absolute gap; verticals show smaller but material leakage in maintenance overhead pools.',
      ],
      confidence: 0.74,
      sources: ['erp', 'capital_iq', 'public'],
      lineage: [
        'costBenchmarks: corp_platform, overheadRatio 2023–2025',
        'portfolioItems: pi_corp_digital',
      ],
      followUps: [
        { label: 'Show lever owners and timing', promptId: 'ai_actions_cost' },
        { label: 'ROIC sensitivity', promptId: 'ai_roic_sensitivity' },
      ],
    },
  },
  {
    id: 'ai_cost_waterfall',
    prompt: 'Decompose C1 movement into drivers for the selected asset',
    routeTags: ['cost'],
    response: {
      summary:
        'For the selected asset, 2024–2025 C1 improvement is dominated by energy normalization and maintenance productivity; reagents are flat to slightly adverse on global sulfur chemistry.',
      reasoning: [
        'Waterfall uses locked 2024 baseline with 2025 actuals from ERP and historian tags.',
        'Peer overlay uses the same driver taxonomy for comparability.',
      ],
      confidence: 0.81,
      sources: ['erp', 'historian', 'woodmac'],
      lineage: ['costBenchmarks: selected asset, 2024–2025'],
      followUps: [
        { label: 'Heatmap by process step', promptId: 'ai_heatmap' },
      ],
    },
  },
  {
    id: 'ai_heatmap',
    prompt: 'Where are the highest cost intensities by process step?',
    routeTags: ['cost'],
    response: {
      summary:
        'Highest intensity clusters concentrate in energy-intensive conversion steps and bulk handling — consistent with peer phosphate and aluminum curves once normalized for technology type.',
      reasoning: [
        'Heatmap cells combine ERP cost pools mapped to process steps and historian throughput.',
      ],
      confidence: 0.78,
      sources: ['erp', 'historian'],
      lineage: ['assets.processSteps → cost pool mapping v2026.03'],
      followUps: [{ label: 'Operational yield link', promptId: 'ai_ops_root' }],
    },
  },
  {
    id: 'ai_ops_root',
    prompt: 'What is driving yield loss vs best-in-class for this asset?',
    routeTags: ['operations'],
    response: {
      summary:
        'For integrated phosphate, the mass-balance story matches the diagnostic: largest losses sit between ROM, beneficiation, and acid circuit stability vs a ~92% Q1 ROM→acid benchmark; short stops and grade variability amplify the gap. For aluminum, Phase 1 ops benchmarks emphasize current efficiency and specific energy vs a ~92–96% peer band, potlining/relining rhythm, and anode/carbon stability — refinery losses concentrate in digestion–precipitation and calciner availability.',
      reasoning: [
        'Loss tree compares historian mass balance to theoretical yield; phosphate funnel stages weighted to recovery KPIs from the 2021 exercise.',
        'Best-in-class band uses Q1 peer anchors from the diagnostic, adjusted for asset technology type.',
      ],
      confidence: 0.79,
      sources: ['historian', 'erp', 'public'],
      lineage: ['operationalKpis: selected asset, 2023–2025', 'funnelForAsset'],
      followUps: [
        { label: 'Downtime Pareto detail', promptId: 'ai_downtime' },
        { label: 'Link to C1 impact', promptId: 'ai_c1_quartile' },
      ],
    },
  },
  {
    id: 'ai_downtime',
    prompt: 'Rank unplanned downtime categories for reliability focus',
    routeTags: ['operations'],
    response: {
      summary:
        'Category mix is asset-specific: integrated phosphate skews to rotating equipment and I&C; aluminum smelter skews to potlining, carbon/anode, and grid modulation; alumina refinery to digestion/precipitation and calciner/steam; gold sites emphasize mill/crusher and PM-compliance-driven stops. Power events are episodic but high severity when they occur.',
      reasoning: [
        'Pareto built from CMMS work orders classified to standard reliability taxonomy; seed profiles mirror diagnostic emphasis by vertical.',
      ],
      confidence: 0.83,
      sources: ['erp', 'historian'],
      lineage: ['downtimeParetoForAsset'],
      followUps: [{ label: 'Capex efficiency link', promptId: 'ai_alloc_tradeoff' }],
    },
  },
  {
    id: 'ai_alloc_tradeoff',
    prompt: 'What reallocations improve ROIC without unacceptable risk?',
    routeTags: ['portfolio'],
    response: {
      summary:
        'The 2021 storyline pairs stretched leverage with operational catch-up: marginal growth tilt toward GBM LOM/extension and phosphate recovery/debottleneck improves portfolio ROIC at constant risk, only if smelter sustaining and power-resilience envelopes stay funded and aluminum downstream (rolling/VAP) is sized to offtake.',
      reasoning: [
        'Bubble positions use ROIC vs project risk from the capital committee fact pack.',
        'Minimum sustaining thresholds by vertical reflect diagnostic CAPEX/D&A and maintenance backlog themes.',
      ],
      confidence: 0.72,
      sources: ['erp', 'capital_iq', 'investor_filings'],
      lineage: ['portfolioItems', 'capitalAllocation'],
      followUps: [
        { label: 'Strategic options scan', promptId: 'ai_growth_returns' },
      ],
    },
  },
  {
    id: 'ai_roic_sensitivity',
    prompt: 'Sensitivity of ROIC to overhead and energy drivers',
    routeTags: ['portfolio', 'cost'],
    response: {
      summary:
        'ROIC shows higher elasticity to energy-adjusted conversion in aluminum than to overhead in phosphate; corporate overhead closure moves group ROIC ~40–70 bps at flat metal prices.',
      reasoning: [
        'Coefficients from 2023–2025 panel regression on vertical actuals.',
      ],
      confidence: 0.7,
      sources: ['erp', 'bloomberg', 'capital_iq'],
      lineage: ['portfolioItems: operating_asset rows', 'costBenchmarks'],
      followUps: [{ label: 'Right-to-win', promptId: 'ai_right_to_win' }],
    },
  },
  {
    id: 'ai_right_to_win',
    prompt: 'Where is the biggest right-to-win gap vs peers and exemplars?',
    routeTags: ['strategy'],
    response: {
      summary:
        'The 2021 diagnostic framed the headline tension as world-class assets with underperforming operations and a stretched balance sheet: near-term right-to-win is operational excellence (phosphate recovery, aluminum rolling/VAP, gold maintenance/OEE) plus portfolio differentiation away from commodity-heavy mix — not reserve quality alone.',
      reasoning: [
        'Archetypes include diversified miners (BHP, Rio, Anglo, Vale) for TSR vs fundamentals, and phosphate majors (Mosaic, OCP, PhosAgro) for mix.',
        'Exemplar operators (Nucor, Shell-class process) anchor maintenance and energy discipline where definitions align.',
      ],
      confidence: 0.77,
      sources: ['woodmac', 'capital_iq', 'public', 'investor_filings'],
      lineage: ['peerArchetypes', 'strategicOptions', 'valueChainNodes'],
      followUps: [
        { label: 'Growth plays without return destruction', promptId: 'ai_growth_returns' },
      ],
    },
  },
  {
    id: 'ai_growth_returns',
    prompt: 'Which growth plays improve strategic position without destroying returns?',
    routeTags: ['strategy', 'portfolio'],
    response: {
      summary:
        'Selective phosphate VAP and beneficiation/recovery programs plus GBM exploration/LOM extension align best with diagnostic upside without repeating commodity-heavy mix; smelter expansion stays secondary to rolling/VAP and energy resilience unless margin structure is locked.',
      reasoning: [
        'Options evaluated against hurdle rates and strategic fit scores in portfolioItems and strategicOptions (2021 diagnostic option set).',
      ],
      confidence: 0.73,
      sources: ['capital_iq', 'woodmac', 'erp'],
      lineage: ['strategicOptions', 'portfolioItems'],
      followUps: [{ label: 'Capital allocation matrix', promptId: 'ai_alloc_tradeoff' }],
    },
  },
  {
    id: 'ai_actions_cost',
    prompt: 'List prioritized cost levers with owners',
    routeTags: ['cost'],
    response: {
      summary:
        'Prioritized levers echo the diagnostic stack: phosphate ROM→acid recovery and reagent discipline (WAS/Ras), aluminum power and rolling/VAP realization (smelter/refinery), gold mill reliability and PM compliance (GBM), corporate G&A productivity. Each has value-at-stake and SteerCo owners.',
      reasoning: ['actions table synced to CSIC-style prioritization; stakes aligned to 2021 benchmarking themes (illustrative).'],
      confidence: 0.8,
      sources: ['erp'],
      lineage: ['costLevers', 'actions'],
      followUps: [{ label: 'EBITDA scenario slider', promptId: 'ai_overhead_ebitda' }],
    },
  },
]
