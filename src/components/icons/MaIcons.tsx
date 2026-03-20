/** Stroke icons, 16×16, square caps — minimal / “sharp” system chrome */

type Props = { className?: string }

function cx(...parts: (string | undefined | false)[]) {
  return parts.filter(Boolean).join(' ')
}

/** Keep fixed box; callers can add color / margin without dropping size */
const boxNav = 'h-4 w-4 max-h-4 max-w-4 shrink-0'
const boxSm = 'h-3.5 w-3.5 max-h-3.5 max-w-3.5 shrink-0'

function strokeAttrs() {
  return {
    fill: 'none' as const,
    stroke: 'currentColor',
    strokeWidth: 1.25,
    strokeLinecap: 'square' as const,
    strokeLinejoin: 'miter' as const,
  }
}

export function IconBarsMetric({ className }: Props) {
  return (
    <svg
      viewBox="0 0 16 16"
      width="16"
      height="16"
      className={cx(boxNav, className)}
      aria-hidden
    >
      <path d="M2 13V3h12v10H2z" {...strokeAttrs()} />
      <path d="M5 13V8M8 13V5M11 13V9" {...strokeAttrs()} />
    </svg>
  )
}

export function IconGaugeOps({ className }: Props) {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" className={cx(boxNav, className)} aria-hidden>
      <path d="M3 12h10M3 12a5 5 0 0 1 10 0" {...strokeAttrs()} />
      <path d="M8 12V7l3-1.5" {...strokeAttrs()} />
    </svg>
  )
}

export function IconGridCapital({ className }: Props) {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" className={cx(boxNav, className)} aria-hidden>
      <path d="M2 2h5v5H2V2zm7 0h5v5H9V2zM2 9h5v5H2V9zm7 0h5v5H9V9z" {...strokeAttrs()} />
    </svg>
  )
}

export function IconNodesStrategy({ className }: Props) {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" className={cx(boxNav, className)} aria-hidden>
      <path d="M8 2.5v3M8 10.5v3M2.5 8h3M10.5 8h3" {...strokeAttrs()} />
      <rect x="6.25" y="1.25" width="3.5" height="3.5" {...strokeAttrs()} />
      <rect x="1.25" y="6.25" width="3.5" height="3.5" {...strokeAttrs()} />
      <rect x="11.25" y="6.25" width="3.5" height="3.5" {...strokeAttrs()} />
      <rect x="6.25" y="11.25" width="3.5" height="3.5" {...strokeAttrs()} />
    </svg>
  )
}

export function IconClock({ className }: Props) {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" className={cx(boxSm, className)} aria-hidden>
      <path d="M8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z" {...strokeAttrs()} />
      <path d="M8 5v4l3 2" {...strokeAttrs()} />
    </svg>
  )
}

export function IconFeedOk({ className }: Props) {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" className={cx(boxSm, className)} aria-hidden>
      <path d="M2 8l4 4 8-8" {...strokeAttrs()} />
    </svg>
  )
}

export function IconFeedWarn({ className }: Props) {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" className={cx(boxSm, className)} aria-hidden>
      <path d="M8 2L2 14h12L8 2z" {...strokeAttrs()} />
      <path d="M8 6v4M8 12v.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="square" />
    </svg>
  )
}

export function IconSun({ className }: Props) {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" className={cx(boxSm, className)} aria-hidden>
      <path d="M8 2v2M8 12v2M2 8h2M12 8h2M3.5 3.5l1.5 1.5M11 11l1.5 1.5M12.5 3.5L11 5M5 11l-1.5 1.5" {...strokeAttrs()} />
      <path d="M8 5a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" {...strokeAttrs()} />
    </svg>
  )
}

export function IconMoon({ className }: Props) {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" className={cx(boxSm, className)} aria-hidden>
      <path d="M9.5 2a5.5 5.5 0 1 0 5.5 8.5A4 4 0 0 1 9.5 2z" {...strokeAttrs()} />
    </svg>
  )
}
