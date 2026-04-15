import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { APP_ROUTES } from '../../constants/routes'
import { useAuth } from '../../hooks/useAuth'

export function LoginPage() {
  const { user, signIn, signUp, loading } = useAuth()
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  if (!loading && user) {
    return <Navigate to={APP_ROUTES.dashboard} replace />
  }

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    setMessage(null)

    const error =
      mode === 'login'
        ? await signIn(email, password)
        : await signUp(name || email.split('@')[0] || 'Usuário', email, password)

    if (error) {
      setMessage(error)
    } else if (mode === 'signup') {
      setMessage('Conta criada. Verifique seu e-mail para confirmar acesso (se habilitado).')
    }

    setSubmitting(false)
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-bg-default px-4">
      <section className="w-full max-w-[420px] rounded-[var(--radius-lg)] border border-border-default bg-bg-surface p-6 shadow-[var(--shadow-sidebar-toggle)]">
        <h1 className="text-2xl font-semibold text-text-primary">mycash+</h1>
        <p className="mt-1 text-sm text-text-secondary">
          {mode === 'login' ? 'Entre na sua conta' : 'Crie sua conta'}
        </p>

        <form onSubmit={onSubmit} className="mt-5 space-y-3">
          {mode === 'signup' ? (
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nome"
              className="h-11 w-full rounded-md border border-border-default px-3 text-sm"
              required
            />
          ) : null}
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="E-mail"
            className="h-11 w-full rounded-md border border-border-default px-3 text-sm"
            required
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Senha"
            className="h-11 w-full rounded-md border border-border-default px-3 text-sm"
            required
            minLength={6}
          />
          <button
            type="submit"
            disabled={submitting}
            className="h-11 w-full rounded-full bg-bg-inverse px-5 text-sm font-semibold text-text-inverse disabled:opacity-60"
          >
            {submitting ? 'Aguarde...' : mode === 'login' ? 'Entrar' : 'Criar conta'}
          </button>
        </form>

        <button
          type="button"
          onClick={() => {
            setMode((prev) => (prev === 'login' ? 'signup' : 'login'))
            setMessage(null)
          }}
          className="mt-3 text-sm font-semibold text-text-primary underline"
        >
          {mode === 'login' ? 'Não tenho conta' : 'Já tenho conta'}
        </button>

        {message ? <p className="mt-3 text-xs text-text-secondary">{message}</p> : null}
      </section>
    </main>
  )
}
