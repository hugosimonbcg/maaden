import type { SourceFreshness } from '../types'

export const sourceFreshness: SourceFreshness[] = [
  {
    source: 'erp',
    label: 'ERP — actuals',
    kind: 'internal',
    lastRefresh: '2026-03-18T05:40:00Z',
    status: 'current',
  },
  {
    source: 'historian',
    label: 'Plant historian',
    kind: 'internal',
    lastRefresh: '2026-03-18T04:15:00Z',
    status: 'current',
  },
  {
    source: 'investor_filings',
    label: 'Investor filings',
    kind: 'external',
    lastRefresh: '2026-03-17T18:00:00Z',
    status: 'current',
  },
  {
    source: 'capital_iq',
    label: 'S&P Capital IQ',
    kind: 'external',
    lastRefresh: '2026-03-16T09:30:00Z',
    status: 'partial',
  },
  {
    source: 'woodmac',
    label: 'Wood Mackenzie',
    kind: 'external',
    lastRefresh: '2026-03-15T22:10:00Z',
    status: 'stale',
  },
  {
    source: 'bloomberg',
    label: 'Bloomberg — macros',
    kind: 'external',
    lastRefresh: '2026-03-18T06:00:00Z',
    status: 'current',
  },
  {
    source: 'public',
    label: 'Public disclosures',
    kind: 'external',
    lastRefresh: '2026-03-14T11:45:00Z',
    status: 'partial',
  },
]
