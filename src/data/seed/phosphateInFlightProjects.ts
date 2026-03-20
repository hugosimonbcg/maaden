/**
 * Illustrative Maaden-angled in-flight / committed phosphate projects for strategy UI.
 * Shown as milestones on the production curve (markers + labels), not a separate series.
 */
export type PhosphateInFlightProject = {
  id: string
  name: string
  /** Short label drawn next to the production point */
  markerLabel: string
  year: number
  /** Illustrative incremental potential, Mt/yr — referenced in marker copy */
  deltaMt: number
}

export const phosphateInFlightProjects: PhosphateInFlightProject[] = [
  {
    id: 'was_debottleneck',
    name: "Wa'ad Al Shamal — debottleneck & reliability envelope",
    markerLabel: "Wa'ad Al Shamal · +3.8 Mt/yr",
    year: 2024,
    deltaMt: 3.8,
  },
  {
    id: 'rak_creep',
    name: 'Ras Al Khair — acid / finishing creep & port sync',
    markerLabel: 'Ras Al Khair · +2.6 Mt/yr',
    year: 2027,
    deltaMt: 2.6,
  },
  {
    id: 'phosphate_3',
    name: 'Phosphate 3 expansion',
    markerLabel: 'Phosphate 3 · +7.4 Mt/yr',
    year: 2030,
    deltaMt: 7.4,
  },
]
