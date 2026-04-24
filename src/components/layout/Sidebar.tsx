import { useContext, useEffect, useRef, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { APP_ROUTES } from '../../constants/routes'
import { AuthContext } from '../../contexts/AuthContext'
import { NavTooltip } from './NavTooltip'
import {
  IconCard,
  IconChevronLeft,
  IconChevronRight,
  IconHome,
  IconLogOut,
  IconUser,
} from './SidebarIcons'

/**
 * Itens principais da sidebar conforme frame Dashboard do arquivo Figma
 * (Workshop — node 42-3096): Home + Cartões.
 * Demais rotas permanecem na aplicação; menu mobile (Prompt 3) lista navegação completa.
 */
const navItems = [
  { label: 'Home', path: APP_ROUTES.dashboard, Icon: IconHome, end: true },
  { label: 'Cartões', path: APP_ROUTES.cards, Icon: IconCard },
  { label: 'Perfil', path: APP_ROUTES.profile, Icon: IconUser },
]

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const auth = useContext(AuthContext)
  const navigate = useNavigate()
  const name = auth?.user?.user_metadata?.name ?? auth?.user?.email ?? 'Usuário'
  const email = auth?.user?.email ?? ''
  const avatarLetter = name.charAt(0).toUpperCase()

  // Fecha o dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <aside
      className="sidebar-transition relative hidden h-screen min-h-0 shrink-0 flex-col border-r border-border-default bg-bg-surface lg:flex"
      style={{
        width: collapsed
          ? 'var(--sidebar-width-collapsed)'
          : 'var(--sidebar-width-expanded)',
        transitionProperty: 'width',
        transitionDuration: 'var(--transition-sidebar-duration)',
        transitionTimingFunction: 'var(--transition-sidebar-easing)',
      }}
    >
      {/* Área scrollável: logo + nav */}
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-[var(--space-12)] pt-[var(--space-16)]">
        <div
          className={`mb-[var(--space-16)] flex items-center ${collapsed ? 'justify-center' : 'justify-start'}`}
        >
          {collapsed ? (
            <div
              className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] text-sm font-bold text-[var(--color-nav-item-active-fg)]"
              style={{ backgroundColor: 'var(--color-nav-item-active-bg)' }}
              aria-label="Mycash+"
            >
              M
            </div>
          ) : (
            <span className="text-lg font-bold tracking-tight text-text-primary">
              Mycash+
            </span>
          )}
        </div>

        <nav className="flex flex-col gap-[var(--space-8)]">
          {navItems.map(({ label, path, Icon, end }) => (
            <NavTooltip key={path} enabled={collapsed} label={label}>
              <NavLink
                to={path}
                end={end}
                className={({ isActive }) => {
                  const base =
                    'flex items-center gap-[var(--space-8)] rounded-[var(--radius-xl)] text-[length:var(--text-sm)] font-semibold outline-none transition-[background-color,color] duration-200 focus-visible:ring-2 focus-visible:ring-[var(--color-accent-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-surface)]'
                  const pad = collapsed
                    ? 'justify-center px-[var(--space-8)] py-[var(--space-8)]'
                    : 'px-[var(--space-12)] py-[var(--space-8)]'
                  if (isActive) {
                    return `${base} ${pad} text-[var(--color-nav-item-active-fg)]`
                  }
                  return `${base} ${pad} bg-transparent text-text-secondary hover:bg-[var(--color-neutral-200)]`
                }}
                style={({ isActive }) =>
                  isActive
                    ? { backgroundColor: 'var(--color-nav-item-active-bg)' }
                    : undefined
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className="shrink-0 [&>svg]:block"
                      style={{
                        color: isActive
                          ? 'var(--color-nav-item-active-icon)'
                          : 'var(--color-text-secondary)',
                      }}
                    >
                      <Icon />
                    </span>
                    <span
                      className={`truncate ${collapsed ? 'sr-only' : ''}`}
                    >
                      {label}
                    </span>
                  </>
                )}
              </NavLink>
            </NavTooltip>
          ))}
        </nav>
      </div>

      {/* Rodapé fixo: usuário sempre visível */}
      <div ref={menuRef} className="relative shrink-0 border-t border-border-default">

        {/* Dropdown — abre para cima */}
        {menuOpen && (
          <div className="absolute bottom-full left-[var(--space-12)] right-[var(--space-12)] mb-2 overflow-hidden rounded-[var(--radius-md)] border border-border-default bg-bg-surface shadow-[var(--shadow-sidebar-toggle)]">
            <button
              type="button"
              onClick={() => { setMenuOpen(false); navigate(APP_ROUTES.profile) }}
              className="flex w-full items-center gap-[var(--space-8)] px-[var(--space-12)] py-[var(--space-10)] text-[length:var(--text-sm)] font-semibold text-text-primary transition-colors hover:bg-[var(--color-neutral-100)]"
            >
              <IconUser />
              Editar Perfil
            </button>
            <div className="mx-[var(--space-12)] h-px bg-border-default" />
            <button
              type="button"
              onClick={async () => { setMenuOpen(false); await auth?.signOut() }}
              className="flex w-full items-center gap-[var(--space-8)] px-[var(--space-12)] py-[var(--space-10)] text-[length:var(--text-sm)] font-semibold text-red-500 transition-colors hover:bg-red-50"
            >
              <IconLogOut />
              Sair
            </button>
          </div>
        )}

        {/* Área clicável do usuário */}
        <button
          type="button"
          onClick={() => setMenuOpen((o) => !o)}
          className={`flex w-full items-center gap-[var(--space-12)] px-[var(--space-12)] pb-[var(--space-16)] pt-[var(--space-16)] transition-colors hover:bg-[var(--color-neutral-100)] ${collapsed ? 'flex-col' : ''}`}
        >
          <div
            className="flex shrink-0 items-center justify-center rounded-full border border-border-default bg-[var(--color-neutral-200)] text-sm font-semibold text-text-primary"
            style={{
              width: 'var(--size-avatar-md)',
              height: 'var(--size-avatar-md)',
              minWidth: 'var(--size-avatar-md)',
              minHeight: 'var(--size-avatar-md)',
            }}
            aria-hidden
          >
            {avatarLetter}
          </div>
          {!collapsed ? (
            <div className="min-w-0 flex-1 text-left">
              <p className="truncate text-[length:var(--text-sm)] font-semibold text-text-primary">
                {name}
              </p>
              <p className="truncate text-[length:var(--text-xs)] text-text-secondary">
                {email}
              </p>
            </div>
          ) : null}
        </button>
      </div>

      <button
        type="button"
        onClick={() => setCollapsed((c) => !c)}
        aria-expanded={!collapsed}
        aria-label={
          collapsed ? 'Expandir barra lateral' : 'Recolher barra lateral'
        }
        className="sidebar-transition absolute right-0 z-10 flex h-9 w-9 translate-x-1/2 items-center justify-center rounded-full border border-border-default bg-bg-surface text-text-primary shadow-[var(--shadow-sidebar-toggle)] transition-[background-color,box-shadow] duration-200 hover:bg-[var(--color-neutral-100)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-primary)] focus-visible:ring-offset-2"
        style={{ top: 'var(--sidebar-toggle-top)' }}
      >
        {collapsed ? <IconChevronRight /> : <IconChevronLeft />}
      </button>
    </aside>
  )
}
