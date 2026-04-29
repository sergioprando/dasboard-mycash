import { Navigate, Route, Routes } from 'react-router-dom'
import { APP_ROUTES } from '../constants/routes'
import { LoginPage } from '../components/auth/LoginPage'
import { RequireAuth } from '../components/auth/RequireAuth'
import { AppShell } from '../components/layout/AppShell'
import { DashboardPage } from '../components/dashboard/DashboardPage'
import { CardsPage } from '../components/cards/CardsPage'
import { TransactionsPage } from '../components/transactions/TransactionsPage'
import { ProfilePage } from '../components/profile/ProfilePage'
import { GoalsPage } from '../components/goals/GoalsPage'
import { DesignSystemPage } from '../components/design-system/DesignSystemPage'

export function AppRouter() {
  return (
    <Routes>
      <Route path={APP_ROUTES.login} element={<LoginPage />} />
      {/* Página pública — não requer autenticação */}
      <Route path={APP_ROUTES.designSystem} element={<DesignSystemPage />} />
      <Route
        element={
          <RequireAuth>
            <AppShell />
          </RequireAuth>
        }
      >
        <Route path={APP_ROUTES.dashboard} element={<DashboardPage />} />
        <Route path={APP_ROUTES.cards} element={<CardsPage />} />
        <Route path={APP_ROUTES.transactions} element={<TransactionsPage />} />
        <Route path={APP_ROUTES.profile} element={<ProfilePage />} />
        <Route path={APP_ROUTES.goals} element={<GoalsPage />} />
      </Route>
      <Route
        path="*"
        element={<Navigate to={APP_ROUTES.login} replace />}
      />
    </Routes>
  )
}
