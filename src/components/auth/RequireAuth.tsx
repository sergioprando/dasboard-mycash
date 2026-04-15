import { Navigate } from 'react-router-dom'
import { APP_ROUTES } from '../../constants/routes'
import { useAuth } from '../../hooks/useAuth'

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-bg-default text-sm text-text-secondary">
        Carregando...
      </main>
    )
  }

  if (!user) {
    return <Navigate to={APP_ROUTES.login} replace />
  }

  return <>{children}</>
}
