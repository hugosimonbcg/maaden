import type { ReactNode } from 'react'

export function AiPanel({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`relative overflow-hidden rounded-sm border border-[color:var(--ai-edge)] bg-[color:var(--ai-panel-bg)] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06),0_0_0_1px_rgba(0,0,0,0.35)] ${className}`}
    >
      <div
        className="pointer-events-none absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-[color:var(--ai-accent)] to-transparent opacity-90"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, var(--ai-accent) 42%, var(--ai-accent) 58%, transparent 100%)',
        }}
      />
      {children}
    </div>
  )
}
