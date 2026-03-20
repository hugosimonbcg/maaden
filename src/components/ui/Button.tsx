import type { ButtonHTMLAttributes, ReactNode } from 'react'

export function Button({
  children,
  variant = 'secondary',
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost'
  children: ReactNode
}) {
  const v =
    variant === 'primary'
      ? 'bg-ma-charcoal text-white border-ma-charcoal hover:bg-ma-graphite'
      : variant === 'ghost'
        ? 'bg-transparent text-ma-teal border-transparent hover:bg-ma-surface'
        : 'bg-ma-elevated text-ma-ink border-ma-line hover:border-ma-gold/50'
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center gap-2 rounded-sm border px-3 py-1.5 text-[13px] font-medium transition-colors ${v} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
