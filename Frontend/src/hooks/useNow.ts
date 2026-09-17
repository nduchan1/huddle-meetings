import { useEffect, useState } from 'react'

/** Current time in ms, refreshed on an interval and whenever the tab becomes visible again. */
export function useNow(intervalMs = 30_000): number {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const tick = () => setNow(Date.now())
    const timer = window.setInterval(tick, intervalMs)
    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') tick()
    }
    document.addEventListener('visibilitychange', onVisibilityChange)
    return () => {
      window.clearInterval(timer)
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [intervalMs])

  return now
}
