export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-sm bg-gradient-to-r from-ma-line/40 via-ma-surface to-ma-line/40 bg-[length:200%_100%] ${className}`}
    />
  )
}
