import type { PersonaId } from '../data/types'

const copy = {
  cost: {
    strategy: {
      headline: 'Cost position anchors capital and portfolio choices',
      sub: 'Focus on structural drivers, quartile movement, and value-at-stake under disciplined scenarios.',
    },
    performance: {
      headline: 'Unit economics trace to throughput, yield, and conversion stability',
      sub: 'Tie cost deltas to operational levers with explicit maintenance and energy linkages.',
    },
    business_units: {
      headline: 'Asset-level C1 and overhead gaps versus agreed peer cohorts',
      sub: 'Use vertical and asset filters to align SteerCo actions to measurable EBITDA pathways.',
    },
  },
  operations: {
    strategy: {
      headline: 'Operational credibility underpins strategic optionality',
      sub: 'Recovery, yield, and reliability curves determine where expansion capital earns its hurdle.',
    },
    performance: {
      headline: 'Loss trees, downtime structure, and intensity norms',
      sub: 'Diagnose where mass balance and time-on-tool fail versus best-in-class bands.',
    },
    business_units: {
      headline: 'Line-level performance versus peer and best-in-world exemplars',
      sub: 'Prioritize interventions that close the largest verified gaps without destabilizing safety.',
    },
  },
  portfolio: {
    strategy: {
      headline: 'Capital allocation is the governing choice set for 2040 trajectory',
      sub: 'ROIC, risk, and strategic fit must cohere — not trade off silently in spreadsheets.',
    },
    performance: {
      headline: 'Sustaining and growth capital efficiency set the operating envelope',
      sub: 'Reliability and energy programs should appear as explicit portfolio risk offsets.',
    },
    business_units: {
      headline: 'Initiatives compete for marginal capital on transparent, comparable terms',
      sub: 'Project risk and schedule integrity are as material as headline returns.',
    },
  },
  strategy: {
    strategy: {
      headline: 'Where to play and how to win — grounded in benchmark fact',
      sub: 'Archetypes and exemplars test whether advantages are structural or cyclical.',
      forwardHeadline: 'Stress demand, supply, and clearing price to test strategic bets',
      forwardSub:
        'Forward view frames market clearing, surplus, and shortage — useful when debating curve shifts, optionality, and cyclical vs structural repricing.',
    },
    performance: {
      headline: 'Operational proof points constrain credible growth narratives',
      sub: 'Right-to-win requires demonstrated predictability, not aspiration.',
      forwardHeadline: 'Link throughput and reliability to where supply curves can credibly bend',
      forwardSub:
        'Use the demand / supply / price scaffold to argue which operating envelopes actually move marginal cost and available volume.',
    },
    business_units: {
      headline: 'Vertical leaders align market exposure with asset capabilities',
      sub: 'Product mix and chain position should match what plants can sustain at top-quartile cost.',
      forwardHeadline: 'Reconcile vertical plans with how markets clear on price and quantity',
      forwardSub:
        'Forward lens highlights where local capacity and logistics shift effective supply relative to product-level demand.',
    },
  },
} as const

export function usePersonaCopy(persona: PersonaId, page: keyof typeof copy) {
  return copy[page][persona]
}
