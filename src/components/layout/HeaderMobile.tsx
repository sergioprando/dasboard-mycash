import { useCallback, useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { IconClose } from './SidebarIcons'
import { MOCK_USER } from './layoutUserMock'
import { mobileNavItems } from './mobileNavItems'

export function HeaderMobile() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [panelEntered, setPanelEntered] = useState(false)

  const closeMenu = useCallback(() => setMenuOpen(false), [])

  useEffect(() => {
    if (!menuOpen) {
      setPanelEntered(false)
      return
    }
    const id = window.requestAnimationFrame(() => setPanelEntered(true))
    return () => window.cancelAnimationFrame(id)
  }, [menuOpen])

  useEffect(() => {
    if (!menuOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMenu()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [menuOpen, closeMenu])

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  const handleLogout = () => {
    closeMenu()
    // TODO: integrar fluxo de logout quando autenticação existir
  }

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-[100] border-b border-border-default bg-bg-surface lg:hidden">
        <div className="mx-auto flex h-[var(--mobile-header-height)] max-w-[1600px] items-center justify-between px-[var(--space-16)]">
          <span className="text-[length:var(--text-lg)] font-bold tracking-tight text-text-primary">
            Mycash+
          </span>
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-expanded={menuOpen}
            aria-haspopup="dialog"
            aria-controls="mobile-menu-dropdown"
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-border-default bg-[var(--color-neutral-200)] text-sm font-semibold text-text-primary outline-none transition hover:bg-[var(--color-neutral-300)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent-primary)] focus-visible:ring-offset-2"
            style={{
              width: 'var(--size-avatar-md)',
              height: 'var(--size-avatar-md)',
            }}
          >
            <span className="sr-only">Abrir menu</span>
            <span aria-hidden>{MOCK_USER.avatarLetter}</span>
          </button>
        </div>
      </header>

      {menuOpen ? (
        <div
          className="mobile-menu-root fixed inset-0 z-[90] lg:hidden"
          role="presentation"
        >
          <div
            className="absolute bottom-0 left-0 right-0 top-[var(--mobile-header-height)]"
            style={{ backgroundColor: 'var(--color-overlay-scrim)' }}
            aria-hidden
            onClick={closeMenu}
          />

          <div
            id="mobile-menu-dropdown"
            role="dialog"
            aria-modal="true"
            aria-labelledby="mobile-menu-title"
            className="mobile-menu-panel pointer-events-auto absolute left-[var(--space-16)] right-[var(--space-16)] top-[var(--mobile-header-height)] z-[95] flex max-h-[min(70vh,calc(100dvh-var(--mobile-header-height)-var(--space-16)))] flex-col overflow-hidden rounded-b-[var(--radius-lg)] border border-t-0 border-border-default bg-bg-surface shadow-[var(--shadow-sidebar-toggle)] transition-[transform,opacity] duration-300 ease-out"
            style={{
              transform: panelEntered ? 'translateY(0)' : 'translateY(-100%)',
              opacity: panelEntered ? 1 : 0,
            }}
          >
            <div className="flex items-center justify-between border-b border-border-default px-[var(--space-16)] py-[var(--space-12)]">
              <h2
                id="mobile-menu-title"
                className="text-[length:var(--text-md)] font-semibold text-text-primary"
              >
                Menu
              </h2>
              <button
                type="button"
                onClick={closeMenu}
                aria-label="Fechar menu"
                className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-text-secondary outline-none transition hover:bg-[var(--color-neutral-200)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent-primary)]"
              >
                <IconClose />
              </button>
            </div>

            <nav
              className="min-h-0 flex-1 overflow-y-auto px-[var(--space-8)] py-[var(--space-8)]"
              aria-label="Navegação principal"
            >
              <ul className="flex flex-col gap-[var(--space-8)]">
                {mobileNavItems.map(({ label, path, Icon, end }) => (
                  <li key={path}>
                    <NavLink
                      to={path}
                      end={end}
                      onClick={closeMenu}
                      className={({ isActive }) =>
                        `flex min-h-[48px] items-center gap-[var(--space-12)] rounded-[var(--radius-md)] px-[var(--space-12)] py-[var(--space-8)] text-[length:var(--text-sm)] font-medium transition-colors ${
                          isActive
                            ? 'bg-bg-inverse text-text-inverse'
                            : 'bg-transparent text-text-secondary hover:bg-[var(--color-neutral-200)]'
                        }`
                      }
                    >
                      <span className="shrink-0 [&>svg]:block">
                        <Icon />
                      </span>
                      {label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="border-t border-border-default p-[var(--space-16)]">
              <button
                type="button"
                onClick={handleLogout}
                className="flex min-h-[48px] w-full items-center justify-center rounded-[var(--radius-md)] bg-feedback-danger px-[var(--space-12)] text-[length:var(--text-sm)] font-semibold text-text-inverse outline-none transition hover:opacity-90 focus-visible:ring-2 focus-visible:ring-[var(--color-neutral-1000)] focus-visible:ring-offset-2"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
