import { useState } from 'react'
import type { PeerTier } from '../../data/types'
import { sourceFreshness } from '../../data/seed'
import { IconClock, IconFeedOk, IconFeedWarn } from '../icons/MaIcons'
import { Button } from '../ui/Button'

function formatRefresh(iso: string) {
  const d = new Date(iso)
  return d.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function TopBar({
  cohort,
  onCohort,
}: {
  cohort: PeerTier
  onCohort: (c: PeerTier) => void
}) {
  const [lang, setLang] = useState<'en' | 'ar'>('en')
  const last = sourceFreshness.reduce((a, s) => (a > s.lastRefresh ? a : s.lastRefresh), '')
  const staleExternal = sourceFreshness.filter((s) => s.kind === 'external' && s.status !== 'current').length

  return (
    <header className="flex flex-col gap-4 border-b border-ma-line bg-ma-elevated px-6 py-3 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
      <div className="min-w-0 lg:min-w-[200px] lg:flex-1 lg:pr-4">
        <h1 className="text-[15px] font-semibold leading-tight tracking-tight text-ma-ink">
          Maaden Benchmark Intelligence
        </h1>
        <p className="mt-0.5 text-[12px] leading-snug text-ma-muted">
          Continuous benchmark fact base · Strategy AI architecture alignment
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 lg:shrink-0">
        <div className="flex items-center gap-2">
          <IconClock className="text-ma-muted" />
          <div className="flex flex-col justify-center leading-none">
            <span className="text-[10px] font-semibold uppercase tracking-wide text-ma-muted/80">
              Last refresh
            </span>
            <span className="mt-1 text-[12px] font-medium leading-tight text-ma-ink">{formatRefresh(last)}</span>
          </div>
        </div>

        <div className="hidden h-9 w-px shrink-0 bg-ma-line md:block" aria-hidden />

        <div className="flex items-center gap-2">
          {staleExternal ? (
            <IconFeedWarn className="text-ma-amber-warn" />
          ) : (
            <IconFeedOk className="text-ma-teal" />
          )}
          <div className="flex min-w-0 max-w-[220px] flex-col justify-center leading-none sm:max-w-none">
            <span className="text-[10px] font-semibold uppercase tracking-wide text-ma-muted/80">
              Source status
            </span>
            <span
              className={`mt-1 text-[12px] font-medium leading-tight ${staleExternal ? 'text-ma-amber-warn' : 'text-ma-teal'}`}
            >
              {staleExternal ? `${staleExternal} external feeds need attention` : 'All critical feeds current'}
            </span>
          </div>
        </div>

        <div className="hidden h-9 w-px shrink-0 bg-ma-line md:block" aria-hidden />

        <label className="flex flex-col justify-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-ma-muted">
          Peer cohort
          <select
            className="h-9 min-w-[9.5rem] rounded-sm border border-ma-line bg-ma-bg px-2 text-[13px] font-medium text-ma-ink"
            value={cohort}
            onChange={(e) => onCohort(e.target.value as PeerTier)}
          >
            <option value="peer_median">Peer median</option>
            <option value="top_quartile">Top quartile</option>
            <option value="best_in_world">Best-in-world</option>
          </select>
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-2 lg:shrink-0">
        <div className="flex rounded-sm border border-ma-line p-0.5">
          <button
            type="button"
            onClick={() => {
              setLang('en')
              document.documentElement.lang = 'en'
              document.documentElement.dir = 'ltr'
            }}
            className={`rounded-sm px-2 py-1 text-[11px] font-semibold ${
              lang === 'en' ? 'bg-ma-charcoal text-white' : 'text-ma-muted'
            }`}
          >
            EN
          </button>
          <button
            type="button"
            onClick={() => {
              setLang('ar')
              document.documentElement.lang = 'ar'
              document.documentElement.dir = 'rtl'
            }}
            className={`rounded-sm px-2 py-1 text-[11px] font-semibold ${
              lang === 'ar' ? 'bg-ma-charcoal text-white' : 'text-ma-muted'
            }`}
          >
            AR
          </button>
        </div>
        <Button variant="secondary" className="text-[12px]">
          Export
        </Button>
        <Button variant="secondary" className="text-[12px]">
          Share view
        </Button>
      </div>
    </header>
  )
}
