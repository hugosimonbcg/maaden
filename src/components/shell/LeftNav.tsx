import { NavLink, useLocation } from 'react-router-dom'
import maadenLogo from '../../assets/maaden-logo.svg'
import { useTheme } from '../../hooks/useTheme'
import {
  IconBarsMetric,
  IconGridCapital,
  IconGaugeOps,
  IconMoon,
  IconNodesStrategy,
  IconSun,
} from '../icons/MaIcons'

const items = [
  {
    to: '/cost',
    label: 'Cost competitiveness',
    sub: '$/t · drivers · quartiles',
    Icon: IconBarsMetric,
  },
  {
    to: '/operations',
    label: 'Operational performance',
    sub: 'Yield · OEE · intensity',
    Icon: IconGaugeOps,
  },
  {
    to: '/portfolio',
    label: 'Portfolio & capital',
    sub: 'ROIC · capex · risk',
    Icon: IconGridCapital,
  },
  {
    to: '/strategy',
    label: 'Strategy outlook',
    sub: 'Chain · mix · options',
    Icon: IconNodesStrategy,
  },
] as const

export function LeftNav() {
  const { search } = useLocation()
  const { mode, setMode } = useTheme()

  return (
    <aside className="sticky top-0 z-20 flex h-[100dvh] max-h-screen w-[248px] shrink-0 flex-col overflow-hidden border-r border-[color:var(--ma-nav-border)] bg-[var(--ma-nav-bg)] text-white">
      <div className="shrink-0 border-b border-[color:var(--ma-nav-border)] px-5 py-6">
        <img
          src={maadenLogo}
          alt="Maaden"
          className="h-9 w-auto max-w-full object-left object-contain brightness-110 dark:brightness-100"
        />
        <p className="mt-3 text-[12px] leading-snug text-[color:var(--ma-nav-muted)]">
          AI-enabled strategy & performance operating system
        </p>
      </div>
      <nav className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto p-3" aria-label="Benchmark outcomes">
        {items.map((item) => {
          const { Icon } = item
          return (
            <NavLink
              key={item.to}
              to={{ pathname: item.to, search }}
              className={({ isActive }) =>
                `flex gap-3 rounded-sm border px-3 py-3 text-left transition-colors duration-150 ${
                  isActive
                    ? 'border-[color:var(--ma-gold)]/50 bg-white/[0.08] text-white'
                    : 'border-transparent text-[color:var(--ma-nav-muted)] hover:border-white/10 hover:bg-white/[0.04] hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={`mt-0.5 shrink-0 ${isActive ? 'text-[color:var(--ma-gold)]' : 'text-[color:var(--ma-nav-subtle)]'}`}
                  />
                  <div className="min-w-0">
                    <div className="text-[13px] font-semibold leading-tight">{item.label}</div>
                    <div className="mt-1 text-[11px] text-[color:var(--ma-nav-subtle)]">{item.sub}</div>
                  </div>
                </>
              )}
            </NavLink>
          )
        })}
      </nav>
      <div className="shrink-0 border-t border-[color:var(--ma-nav-border)] p-4">
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-[color:var(--ma-nav-subtle)]">
          Appearance
        </p>
        <div
          className="flex rounded-sm border border-[color:var(--ma-nav-border)] p-0.5"
          role="group"
          aria-label="Theme"
        >
          <button
            type="button"
            onClick={() => setMode('light')}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-sm px-2 py-1.5 text-[11px] font-semibold transition-colors duration-150 ${
              mode === 'light' ? 'bg-white/15 text-white' : 'text-[color:var(--ma-nav-subtle)] hover:text-white'
            }`}
          >
            <IconSun className="opacity-90" />
            Light
          </button>
          <button
            type="button"
            onClick={() => setMode('dark')}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-sm px-2 py-1.5 text-[11px] font-semibold transition-colors duration-150 ${
              mode === 'dark' ? 'bg-white/15 text-white' : 'text-[color:var(--ma-nav-subtle)] hover:text-white'
            }`}
          >
            <IconMoon className="opacity-90" />
            Dark
          </button>
        </div>
        <p className="mt-4 text-[10px] leading-relaxed text-[color:var(--ma-nav-faint)]">
          Illustrative prototype — synthetic fact base
        </p>
      </div>
    </aside>
  )
}
