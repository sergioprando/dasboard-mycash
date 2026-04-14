import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'

export function AppShell() {
  return (
    <div className="min-h-screen bg-bg-default text-text-primary">
      <div className="mx-auto flex min-h-screen w-full max-w-[1600px]">
        <Sidebar />

        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
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

          <main className="w-full min-w-0 flex-1 px-4 py-4 transition-[padding] duration-[var(--transition-sidebar-duration)] ease-[var(--transition-sidebar-easing)] md:px-6 md:py-6 lg:px-8 lg:py-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
