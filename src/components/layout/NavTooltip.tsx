import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'

type NavTooltipProps = {
  enabled: boolean
  label: string
  children: ReactNode
}

const SHOW_DELAY_MS = 400

export function NavTooltip({ enabled, label, children }: NavTooltipProps) {
  const [visible, setVisible] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [])

  const handleEnter = useCallback(() => {
    if (!enabled) return
    clearTimer()
    timeoutRef.current = setTimeout(() => setVisible(true), SHOW_DELAY_MS)
  }, [clearTimer, enabled])

  const handleLeave = useCallback(() => {
    clearTimer()
    setVisible(false)
  }, [clearTimer])

  useEffect(() => () => clearTimer(), [clearTimer])

  return (
    <div
      className="relative w-full"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onFocus={handleEnter}
      onBlur={handleLeave}
    >
      {children}
      {enabled && visible ? (
        <div
          role="tooltip"
          className="pointer-events-none absolute left-full top-1/2 z-50 ml-[var(--space-8)] -translate-y-1/2 whitespace-nowrap rounded-[var(--radius-sm)] border border-border-default bg-bg-surface px-[var(--space-8)] py-[var(--space-4)] text-[length:var(--text-xs)] font-medium text-text-primary shadow-[var(--shadow-sidebar-toggle)]"
        >
          {label}
        </div>
      ) : null}
    </div>
  )
}
