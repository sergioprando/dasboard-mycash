import { NavLink, Outlet } from 'react-router-dom'
import { APP_ROUTES } from '../../constants/routes'

const navItems = [
  { label: 'Home', path: APP_ROUTES.dashboard },
  { label: 'Cartoes', path: APP_ROUTES.cards },
  { label: 'Transacoes', path: APP_ROUTES.transactions },
  { label: 'Perfil', path: APP_ROUTES.profile },
  { label: 'Objetivos', path: APP_ROUTES.goals },
]

export function AppShell() {
  return (
    <div className="min-h-screen bg-bg-default text-text-primary">
      <div className="mx-auto flex min-h-screen w-full max-w-[1600px]">
        <aside className="hidden w-72 border-r border-border-default bg-bg-surface p-[var(--space-16)] lg:block">
          <p className="mb-[var(--space-16)] text-xl font-semibold">Mycash+</p>
          <nav className="space-y-[var(--space-8)]">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `block rounded-xl px-[var(--space-12)] py-[var(--space-8)] text-sm font-medium transition ${
                    isActive
                      ? 'bg-bg-inverse text-text-inverse'
                      : 'text-text-secondary hover:bg-neutral-200'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <div className="flex min-h-screen w-full flex-col">
          <header className="border-b border-border-default bg-bg-surface px-4 py-4 md:px-6 lg:hidden">
            <div className="flex items-center justify-between">
              <p className="text-lg font-semibold">Mycash+</p>
              <button
                type="button"
                className="rounded-full border border-border-default px-[var(--space-12)] py-[var(--space-6)] text-sm"
              >
                Menu
              </button>
            </div>
          </header>

          <main className="w-full px-4 py-4 md:px-6 md:py-6 lg:px-8 lg:py-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
