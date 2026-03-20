import { Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from '../components/shell/AppShell'
import { CostBenchmarkPage } from '../pages/CostBenchmarkPage'
import { OperationsPage } from '../pages/OperationsPage'
import { PortfolioPage } from '../pages/PortfolioPage'
import { StrategyPage } from '../pages/StrategyPage'

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<Navigate to="/cost" replace />} />
        <Route path="/cost" element={<CostBenchmarkPage />} />
        <Route path="/operations" element={<OperationsPage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/strategy" element={<StrategyPage />} />
        <Route path="*" element={<Navigate to="/cost" replace />} />
      </Route>
    </Routes>
  )
}
