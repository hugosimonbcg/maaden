import { Outlet } from 'react-router-dom'
import { useUrlFilters } from '../../hooks/useUrlFilters'
import { useShellStore } from '../../store/shellStore'
import { LeftNav } from './LeftNav'
import { TopBar } from './TopBar'
import { SourceStrip } from './SourceStrip'
import { GlobalFilters } from './GlobalFilters'
import { ActionTrackerPanel } from './ActionTrackerPanel'
import { QueryBar } from '../ai/QueryBar'
import { InsightDrawer } from '../ai/InsightDrawer'

export function AppShell() {
  const f = useUrlFilters()
  const aiOpen = useShellStore((s) => s.aiDrawerOpen)

  return (
    <div className="flex min-h-screen items-start bg-ma-bg font-sans text-ma-ink">
      <LeftNav />
      <div
        className={`flex min-h-screen min-h-0 min-w-0 flex-1 flex-col transition-[padding] ${aiOpen ? 'pr-[min(420px,100vw)]' : ''}`}
      >
        <TopBar cohort={f.cohort} onCohort={f.setCohort} />
        <SourceStrip />
        <GlobalFilters
          vertical={f.vertical}
          asset={f.asset}
          year={f.year}
          cohort={f.cohort}
          geo={f.geo}
          metricDim={f.metricDim}
          persona={f.persona}
          onVertical={f.setVertical}
          onAsset={f.setAsset}
          onYear={f.setYear}
          onCohort={f.setCohort}
          onGeo={f.setGeo}
          onMetricDim={f.setMetricDim}
          onPersona={f.setPersona}
        />
        <QueryBar />
        <main className="mx-auto w-full max-w-[1440px] flex-1 overflow-y-auto px-6 py-6">
          <Outlet />
        </main>
        <ActionTrackerPanel vertical={f.vertical} />
      </div>
      <InsightDrawer />
    </div>
  )
}
