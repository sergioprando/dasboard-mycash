import { useEffect, useRef, useState } from 'react'

export function useAnimatedNumber(target: number, durationMs = 800): number {
  const [value, setValue] = useState(target)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const from = 0
    const startAt = performance.now()

    const tick = (now: number) => {
      const elapsed = now - startAt
      const progress = Math.min(elapsed / durationMs, 1)
      const eased = 1 - (1 - progress) ** 3
      setValue(from + (target - from) * eased)
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick)
      }
    }

    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
    }
    rafRef.current = requestAnimationFrame(tick)

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [target, durationMs])

  return value
}
