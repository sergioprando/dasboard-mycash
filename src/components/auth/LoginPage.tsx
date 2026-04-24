import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { APP_ROUTES } from '../../constants/routes'
import { useAuth } from '../../hooks/useAuth'
import { supabase } from '../../lib/supabaseClient'

export function LoginPage() {
  const { user, signIn, signUp, signInWithGoogle, loading } = useAuth()
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
            <label className="block space-y-1.5">
              <span className="text-sm font-semibold tracking-[0.3px] text-text-primary">Nome</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Maria Silva"
                className="h-12 w-full rounded-[var(--radius-md)] border border-border-default bg-bg-surface px-3 text-sm"
                required
              />
            </label>
          ) : null}
          <label className="block space-y-1.5">
            <span className="text-sm font-semibold tracking-[0.3px] text-text-primary">E-mail</span>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Ex: voce@email.com"
              className="h-12 w-full rounded-[var(--radius-md)] border border-border-default bg-bg-surface px-3 text-sm"
              required
            />
          </label>
          <label className="block space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold tracking-[0.3px] text-text-primary">Senha</span>
              {mode === 'login' ? (
                <button
                  type="button"
                  onClick={async () => {
                    if (!email) { setMessage('Digite seu e-mail primeiro.'); return }
                    setSubmitting(true)
                    const { error } = await supabase.auth.resetPasswordForEmail(email, {
                      redirectTo: window.location.origin,
                    })
                    setMessage(error ? error.message : 'E-mail de recuperação enviado! Verifique sua caixa de entrada.')
                    setSubmitting(false)
                  }}
                  className="text-xs font-semibold text-text-secondary underline hover:text-text-primary"
                >
                  Esqueci minha senha
                </button>
              ) : null}
            </div>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Mínimo 6 caracteres"
              className="h-12 w-full rounded-[var(--radius-md)] border border-border-default bg-bg-surface px-3 text-sm"
              required
              minLength={6}
            />
          </label>
          <button
            type="submit"
            disabled={submitting}
            className="h-11 w-full rounded-full bg-bg-inverse px-5 text-sm font-semibold text-text-inverse disabled:opacity-60"
          >
            {submitting ? 'Aguarde...' : mode === 'login' ? 'Entrar' : 'Criar conta'}
          </button>

          {/* Link Não tenho conta — abaixo do botão principal */}
          <button
            type="button"
            onClick={() => {
              setMode((prev) => (prev === 'login' ? 'signup' : 'login'))
              setMessage(null)
            }}
            className="w-full text-center text-sm font-semibold text-text-primary underline"
          >
            {mode === 'login' ? 'Não tenho conta' : 'Já tenho conta'}
          </button>
        </form>

        {/* Divisor */}
        <div className="my-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-border-default" />
          <span className="text-xs text-text-secondary">ou continue com</span>
          <div className="h-px flex-1 bg-border-default" />
        </div>

        {/* Botão Google */}
        <button
          type="button"
          onClick={async () => {
            setSubmitting(true)
            const error = await signInWithGoogle()
            if (error) setMessage(error)
            setSubmitting(false)
          }}
          disabled={submitting}
          className="flex h-12 w-full items-center justify-center gap-3 rounded-[var(--radius-md)] border border-border-default bg-bg-surface text-sm font-semibold text-text-primary transition hover:bg-[var(--color-neutral-100)] disabled:opacity-60"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
            <path d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/>
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 6.293C4.672 4.166 6.656 3.58 9 3.58z" fill="#EA4335"/>
          </svg>
          Entrar com Google
        </button>

        {message ? <p className="mt-3 text-xs text-text-secondary">{message}</p> : null}
      </section>
    </main>
  )
}
