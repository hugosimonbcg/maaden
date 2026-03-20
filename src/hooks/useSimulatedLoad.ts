import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

/** Brief skeleton pulse on route change — executive-grade, not playful. */
export function useSimulatedLoad(ms = 420) {
  const { pathname } = useLocation()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const t = window.setTimeout(() => setLoading(false), ms)
    return () => window.clearTimeout(t)
  }, [pathname, ms])

  return loading
}
