/** Illustrative DAP-minus bridge ($/t DAP P₂O₅ eq.) — synthetic prototype narrative */

export type DapMinusKind = 'anchor' | 'processing' | 'input'

export interface DapMinusStepDef {
  id: string
  label: string
  /** Anchor = level ($/t); processing/input = deduction ($/t) */
  value: number
  kind: DapMinusKind
}

/** Ordered: start price, deductions, implied margin (must reconcile). */
export const dapMinusSteps: DapMinusStepDef[] = [
  { id: 'dap', label: 'DAP price ($/t)', value: 1500, kind: 'anchor' },
  { id: 'gran', label: 'Granulation cost', value: 54, kind: 'processing' },
  { id: 'cn', label: 'Conversion cost of N', value: 68, kind: 'processing' },
  { id: 'pn', label: 'Purchasing price of N', value: 45, kind: 'input' },
  { id: 'cpa', label: 'Conversion cost of PA', value: 90, kind: 'processing' },
  { id: 'csa', label: 'Conversion cost of SA', value: 69, kind: 'processing' },
  { id: 'ps', label: 'Purchasing price of S', value: 110, kind: 'input' },
  { id: 'ext', label: 'Extraction costs', value: 100, kind: 'processing' },
  { id: 'ben', label: 'Beneficiation costs', value: 50, kind: 'processing' },
  { id: 'log', label: 'Logistics', value: 120, kind: 'processing' },
  { id: 'margin', label: 'DAP Margin', value: 794, kind: 'anchor' },
]
