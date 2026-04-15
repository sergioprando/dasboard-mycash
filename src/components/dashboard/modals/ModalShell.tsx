import { useEffect, type ReactNode } from 'react'
import { IconClose } from '../../layout/SidebarIcons'

type ModalShellProps = {
  title: string
  onClose: () => void
  children: ReactNode
  widthClassName?: string
}

export function ModalShell({
  title,
  onClose,
  children,
  widthClassName = 'max-w-[640px]',
}: ModalShellProps) {
  useEffect(() => {
    const onEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onEsc)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onEsc)
    }
  }, [onClose])

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-[var(--color-overlay-scrim)]"
        onClick={onClose}
        aria-label="Fechar modal"
      />
      <div
        className={`relative z-10 w-full rounded-[var(--radius-lg)] border border-border-default bg-bg-surface p-5 shadow-[var(--shadow-sidebar-toggle)] ${widthClassName}`}
      >
        <header className="mb-4 flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border-default text-text-secondary"
            aria-label="Fechar"
          >
            <IconClose />
          </button>
        </header>
        {children}
      </div>
    </div>
  )
}
