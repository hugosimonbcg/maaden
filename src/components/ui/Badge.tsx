export function Badge({
  children,
  tone = 'neutral',
}: {
  children: React.ReactNode
  tone?: 'neutral' | 'teal' | 'gold' | 'risk' | 'muted'
}) {
  const tones = {
    neutral: 'bg-ma-surface text-ma-graphite border-ma-line',
    teal: 'bg-[#e8f2f1] text-ma-teal border-[#c5dedb]',
    gold: 'bg-[#f3ebe0] text-ma-gold-dim border-[#e5d5c4]',
    risk: 'bg-[#f6e8e8] text-ma-risk border-[#e8cfcf]',
    muted: 'bg-ma-bg text-ma-muted border-ma-line',
  }
  return (
    <span
      className={`inline-flex items-center rounded-sm border px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide ${tones[tone]}`}
    >
      {children}
    </span>
  )
}
