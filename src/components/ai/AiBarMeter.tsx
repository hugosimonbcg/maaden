import type { AiPhase } from '../../data/types'

const COUNT = 7

export function AiBarMeter({ phase, className = '' }: { phase: AiPhase; className?: string }) {
  const active = phase === 'thinking' || phase === 'speaking'
  const listening = phase === 'listening'
  const speed = active ? 0.32 : listening ? 0.42 : 0.55

  return (
    <div className={`flex h-6 items-end gap-px ${className}`} aria-hidden>
      {Array.from({ length: COUNT }).map((_, i) => (
        <span
          key={i}
          className="w-[3px] origin-bottom rounded-[1px] bg-[color:var(--ai-accent)] motion-reduce:animate-none"
          style={{
            height: `${35 + ((i * 13) % 45)}%`,
            animation: `ai-bar-meter ${speed + i * 0.05}s cubic-bezier(0.22, 1, 0.36, 1) infinite`,
            animationDelay: `${i * 0.04}s`,
            opacity: active ? 1 : listening ? 0.85 : 0.55,
          }}
        />
      ))}
    </div>
  )
}
