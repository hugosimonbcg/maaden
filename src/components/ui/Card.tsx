import type { ReactNode } from 'react'

export function Card({
  title,
  subtitle,
  action,
  children,
  className = '',
}: {
  title?: string
  subtitle?: string
  action?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <section
      className={`rounded-sm border border-ma-line bg-ma-elevated shadow-[0_1px_0_rgba(15,18,16,0.04)] ${className}`}
    >
      {(title || subtitle || action) && (
        <header className="flex flex-wrap items-start justify-between gap-3 border-b border-ma-line px-5 py-4">
          <div>
            {title && (
              <h2 className="text-[13px] font-semibold uppercase tracking-[0.12em] text-ma-graphite">
                {title}
              </h2>
            )}
            {subtitle && <p className="mt-1 max-w-prose text-[13px] leading-snug text-ma-muted">{subtitle}</p>}
          </div>
          {action}
        </header>
      )}
      <div className="px-5 py-4">{children}</div>
    </section>
  )
}
