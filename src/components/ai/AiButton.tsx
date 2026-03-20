import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { useShellStore } from '../../store/shellStore'
import { AiBarMeter } from './AiBarMeter'

export function AiButton({
  children,
  showMeter = true,
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
  showMeter?: boolean
}) {
  const aiPhase = useShellStore((s) => s.aiPhase)

  return (
    <button
      type="button"
      className={`group inline-flex items-center justify-center gap-2 rounded-sm border border-[color:var(--ai-accent)] bg-[color:var(--ai-panel-elevated)] px-3 py-1.5 text-[12px] font-semibold uppercase tracking-wide text-[color:var(--ai-text)] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)] transition-[opacity,transform,border-color] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] hover:brightness-110 active:translate-x-px active:opacity-95 disabled:pointer-events-none disabled:opacity-40 ${className}`}
      {...props}
    >
      {showMeter && (
        <span className="hidden sm:block">
          <AiBarMeter phase={aiPhase} className="h-5 w-10" />
        </span>
      )}
      {children}
    </button>
  )
}
