import type { AiPhase } from '../../data/types'

export function AiOrb({ phase, className = '' }: { phase: AiPhase; className?: string }) {
  const active = phase === 'thinking' || phase === 'speaking'
  const listening = phase === 'listening'

  return (
    <div className={`relative flex shrink-0 items-center justify-center ${className}`} aria-hidden>
      <svg width="40" height="40" viewBox="0 0 40 40" className="overflow-visible">
        <defs>
          <linearGradient id="ai-orb-arc" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--ai-accent)" stopOpacity="0" />
            <stop offset="45%" stopColor="var(--ai-accent)" stopOpacity="1" />
            <stop offset="55%" stopColor="var(--ai-accent)" stopOpacity="1" />
            <stop offset="100%" stopColor="var(--ai-accent)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <circle
          cx="20"
          cy="20"
          r="16"
          fill="none"
          stroke="var(--ai-edge)"
          strokeWidth="1"
        />
        <circle
          cx="20"
          cy="20"
          r="16"
          fill="none"
          stroke="url(#ai-orb-arc)"
          strokeWidth="1.5"
          strokeLinecap="butt"
          strokeDasharray={active ? '18 82' : listening ? '12 88' : '8 92'}
          className={active || listening ? 'ai-orb-spin' : ''}
          style={{ transformOrigin: '20px 20px' }}
        />
        <circle cx="20" cy="20" r="5" fill="none" stroke="var(--ai-orb-ring)" strokeWidth="1" />
      </svg>
    </div>
  )
}
