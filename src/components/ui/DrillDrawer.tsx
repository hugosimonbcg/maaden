import type { ReactNode } from 'react'
import { Button } from './Button'

export function DrillDrawer({
  open,
  title,
  onClose,
  children,
  footer,
}: {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
  footer?: ReactNode
}) {
  if (!open) return null

  return (
    <>
      <button
        type="button"
        aria-label="Close detail"
        className="fixed inset-0 z-30 bg-ma-charcoal/40"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal
        className="fixed bottom-0 left-0 right-0 z-30 max-h-[55vh] overflow-y-auto border-t border-ma-line bg-ma-elevated shadow-[0_-12px_40px_rgba(15,18,16,0.1)]"
      >
        <div className="mx-auto flex max-w-[1200px] items-start justify-between gap-4 px-6 py-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-ma-muted">Detail</p>
            <h2 className="mt-1 text-[16px] font-semibold text-ma-ink">{title}</h2>
          </div>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
        <div className="mx-auto max-w-[1200px] px-6 pb-6">{children}</div>
        {footer && <div className="border-t border-ma-line bg-ma-surface px-6 py-3">{footer}</div>}
      </div>
    </>
  )
}
