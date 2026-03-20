import type { AiPreset } from '../types'

export const aiPresets: AiPreset[] = [
  {
    id: 'ai_c1_quartile',
    prompt: "Show Maaden C1 cash cost vs peer quartiles for 2023–2025",
    routeTags: ['cost'],
    response: {
      summary:
        'Across the integrated phosphate chain, Waad Al Shamal tracks second quartile on C1 cash cost on a phosphate-acid equivalent basis for 2023–2025, with 2025 showing a 2.1% improvement vs 2023. Ras Al Khair finishing sits closer to the peer median on DAP cash cost due to acid logistics exposure.',
      reasoning: [
        'Peer curves are built from Capital IQ cost disclosures and WoodMac phosphate benchmarks, normalized to acid-equivalent tonnes.',
        'Internal actuals reconcile to ERP cost centers with historian validation on energy and reagent drivers.',
        'Quartile ranks are stable year-on-year; largest variance is energy and reagent intensity, not labour.',
      ],
      confidence: 0.86,
      sources: ['erp', 'capital_iq', 'woodmac', 'investor_filings'],
      lineage: [
        'costBenchmarks: ph_waad, years 2023–2025',
        'costBenchmarks: ph_ras, years 2023–2025',
        'peerArchetypes: Integrated phosphate majors',
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
        'Yield loss vs best-in-class is concentrated post-primary separation: grind/leach (or digest) stability and short stops account for the majority of the gap; planned downtime is within peer norms.',
      reasoning: [
        'Loss tree compares historian mass balance to modeled theoretical yield.',
        'Best-in-class anchor uses a non-mining process exemplar band adjusted for physics constraints.',
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
        'Rotating equipment and I&C dominate unplanned hours; power events are episodic but high severity when they occur.',
      reasoning: [
        'Pareto built from CMMS work orders classified to standard reliability taxonomy.',
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
        'A marginal shift of growth capex toward GBM expansion and phosphate debottlenecking improves portfolio ROIC at constant risk appetite, assuming smelter resilience packages remain funded to protect power-adjusted conversion.',
      reasoning: [
        'Bubble positions use ROIC vs project risk from the capital committee fact pack.',
        'Recommended allocation respects minimum sustaining thresholds by vertical.',
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
        'The largest right-to-win gap is in operational predictability (OEE + short-stop rate) versus non-mining exemplars, not in reserve quality. Second is VAP share and pricing realization in phosphate vs integrated majors.',
      reasoning: [
        'Archetype cards synthesize marketing mix, cost position, and asset endowment.',
        'Exemplars are used only where metric definitions align after normalization.',
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
        'Selective phosphate VAP build and GBM expansion score highest on strategic fit vs return threshold; smelter downstream requires disciplined offtake structuring to avoid return dilution.',
      reasoning: [
        'Options evaluated against hurdle rates and strategic fit scores in portfolioItems and strategicOptions.',
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
        'Prioritized levers: reagent intensity (WAS), power contracting (smelter), G&A ratio (corporate), reliability program (GBM). Each lever is tracked with value-at-stake and SteerCo owners.',
      reasoning: ['actions table synced to CSIC prioritization workshop notes (illustrative).'],
      confidence: 0.8,
      sources: ['erp'],
      lineage: ['costLevers', 'actions'],
      followUps: [{ label: 'EBITDA scenario slider', promptId: 'ai_overhead_ebitda' }],
    },
  },
]
