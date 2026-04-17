import { Outlet } from 'react-router-dom'
import { HeaderMobile } from './HeaderMobile'
import { Sidebar } from './Sidebar'

export function AppShell() {
  return (
    <div className="h-screen overflow-hidden bg-bg-default text-text-primary">
      <div className="mx-auto flex h-full w-full max-w-[1600px]">
        <Sidebar />

        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <HeaderMobile />

          <main className="w-full min-w-0 flex-1 overflow-y-auto px-4 pb-4 pt-[calc(var(--mobile-header-height)+var(--space-16))] transition-[padding] duration-[var(--transition-sidebar-duration)] ease-[var(--transition-sidebar-easing)] md:px-6 md:pb-6 lg:px-8 lg:pb-8 lg:pt-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
