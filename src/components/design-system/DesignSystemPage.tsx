import { useState } from 'react'
import {
  IconHome,
  IconCard,
  IconUser,
  IconLogOut,
  IconChevronRight,
  IconChevronLeft,
  IconClose,
} from '../layout/SidebarIcons'

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-12">
      <h2 className="mb-6 border-b border-border-default pb-3 text-xl font-bold text-text-primary">
        {title}
      </h2>
      {children}
    </section>
  )
}

function TokenRow({ name, value, preview }: { name: string; value: string; preview?: React.ReactNode }) {
  const [copied, setCopied] = useState(false)
  function copy() {
    navigator.clipboard.writeText(name)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }
  return (
    <div className="flex items-center gap-4 rounded-[var(--radius-md)] border border-border-default bg-bg-surface px-4 py-3 transition hover:bg-[var(--color-neutral-100)]">
      {preview && <div className="shrink-0">{preview}</div>}
      <div className="min-w-0 flex-1">
        <p className="truncate font-mono text-sm font-semibold text-text-primary">{name}</p>
        <p className="truncate font-mono text-xs text-text-secondary">{value}</p>
      </div>
      <button
        type="button"
        onClick={copy}
        className="shrink-0 rounded-[var(--radius-sm)] border border-border-default px-3 py-1 text-xs font-semibold text-text-secondary transition hover:bg-[var(--color-neutral-200)] hover:text-text-primary"
      >
        {copied ? 'Copiado!' : 'Copiar'}
      </button>
    </div>
  )
}

/* ─────────────────────────────────────────────
   Color tokens
───────────────────────────────────────────── */

const primitiveColors = [
  { name: '--color-neutral-0',    value: '#ffffff' },
  { name: '--color-neutral-100',  value: '#f9fafb' },
  { name: '--color-neutral-200',  value: '#f3f4f6' },
  { name: '--color-neutral-300',  value: '#e5e7eb' },
  { name: '--color-neutral-400',  value: '#d1d5db' },
  { name: '--color-neutral-500',  value: '#9ca3af' },
  { name: '--color-neutral-600',  value: '#6b7280' },
  { name: '--color-neutral-700',  value: '#4b5563' },
  { name: '--color-neutral-800',  value: '#374151' },
  { name: '--color-neutral-900',  value: '#1f2937' },
  { name: '--color-neutral-1000', value: '#111827' },
  { name: '--color-brand-600',    value: '#d7fe03' },
  { name: '--color-green-600',    value: '#15be78' },
  { name: '--color-red-600',      value: '#e61e32' },
  { name: '--color-blue-600',     value: '#2a89ef' },
  { name: '--color-red-100',      value: '#fde9eb' },
  { name: '--color-green-100',    value: '#e8f9f2' },
]

const semanticColors = [
  { name: '--color-bg-default',          value: 'var(--color-neutral-100)',  hex: '#f9fafb' },
  { name: '--color-bg-surface',          value: 'var(--color-neutral-0)',    hex: '#ffffff' },
  { name: '--color-bg-inverse',          value: 'var(--color-neutral-1000)', hex: '#111827' },
  { name: '--color-text-primary',        value: 'var(--color-neutral-1000)', hex: '#111827' },
  { name: '--color-text-secondary',      value: 'var(--color-neutral-600)',  hex: '#6b7280' },
  { name: '--color-text-inverse',        value: 'var(--color-neutral-0)',    hex: '#ffffff' },
  { name: '--color-border-default',      value: 'var(--color-neutral-300)',  hex: '#e5e7eb' },
  { name: '--color-accent-primary',      value: 'var(--color-brand-600)',    hex: '#d7fe03' },
  { name: '--color-feedback-success',    value: 'var(--color-green-600)',    hex: '#15be78' },
  { name: '--color-feedback-danger',     value: 'var(--color-red-600)',      hex: '#e61e32' },
  { name: '--color-feedback-info',       value: 'var(--color-blue-600)',     hex: '#2a89ef' },
  { name: '--color-nav-item-active-bg',  value: 'var(--color-brand-600)',    hex: '#d7fe03' },
  { name: '--color-nav-item-active-fg',  value: 'var(--color-neutral-1000)', hex: '#111827' },
]

/* ─────────────────────────────────────────────
   Typography scale
───────────────────────────────────────────── */

const typeScale = [
  { name: '--text-xs',  value: '12px', label: 'Extra Small' },
  { name: '--text-sm',  value: '14px', label: 'Small' },
  { name: '--text-md',  value: '16px', label: 'Medium' },
  { name: '--text-lg',  value: '20px', label: 'Large' },
  { name: '--text-xl',  value: '24px', label: 'Extra Large' },
]

/* ─────────────────────────────────────────────
   Spacing
───────────────────────────────────────────── */

const spacing = [
  { name: '--space-0',  value: '0px',  px: 0  },
  { name: '--space-2',  value: '2px',  px: 2  },
  { name: '--space-4',  value: '4px',  px: 4  },
  { name: '--space-6',  value: '6px',  px: 6  },
  { name: '--space-8',  value: '8px',  px: 8  },
  { name: '--space-12', value: '12px', px: 12 },
  { name: '--space-16', value: '16px', px: 16 },
]

/* ─────────────────────────────────────────────
   Border radius
───────────────────────────────────────────── */

const radii = [
  { name: '--radius-sm', value: '8px'  },
  { name: '--radius-md', value: '12px' },
  { name: '--radius-lg', value: '16px' },
  { name: '--radius-xl', value: '24px' },
]

/* ─────────────────────────────────────────────
   Shadows
───────────────────────────────────────────── */

const shadows = [
  { name: '--shadow-sidebar-toggle', value: '0 1px 3px rgb(0 0 0 / 0.12)', label: 'Sidebar Toggle' },
]

/* ─────────────────────────────────────────────
   Main page
───────────────────────────────────────────── */

export function DesignSystemPage() {
  const [inputValue, setInputValue] = useState('')

  return (
    <div className="min-h-screen bg-bg-default px-6 py-10 font-[var(--font-family-base)]">
      {/* Header */}
      <header className="mb-12">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] text-sm font-bold"
            style={{ backgroundColor: 'var(--color-accent-primary)', color: 'var(--color-nav-item-active-fg)' }}
          >
            M
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Mycash+ Design System</h1>
            <p className="text-sm text-text-secondary">Tokens, componentes e padrões visuais da aplicação</p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-4xl space-y-0">

        {/* ── Colors: Primitives ── */}
        <Section title="Cores — Primitivas">
          <p className="mb-4 text-sm text-text-secondary">
            Paleta base de cores brutas. Use sempre os tokens semânticos nas interfaces.
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {primitiveColors.map((c) => (
              <TokenRow
                key={c.name}
                name={c.name}
                value={c.value}
                preview={
                  <div
                    className="h-8 w-8 rounded-[var(--radius-sm)] border border-border-default"
                    style={{ backgroundColor: c.value }}
                  />
                }
              />
            ))}
          </div>
        </Section>

        {/* ── Colors: Semantic ── */}
        <Section title="Cores — Semânticas">
          <p className="mb-4 text-sm text-text-secondary">
            Tokens de propósito. Esses são os valores que devem ser usados nos componentes.
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {semanticColors.map((c) => (
              <TokenRow
                key={c.name}
                name={c.name}
                value={c.value}
                preview={
                  <div
                    className="h-8 w-8 rounded-[var(--radius-sm)] border border-border-default"
                    style={{ backgroundColor: c.hex }}
                  />
                }
              />
            ))}
          </div>
        </Section>

        {/* ── Typography ── */}
        <Section title="Tipografia">
          <div className="mb-6 rounded-[var(--radius-lg)] border border-border-default bg-bg-surface p-6">
            <p className="mb-1 text-xs text-text-secondary">Família base</p>
            <p className="text-lg font-semibold text-text-primary">Inter, Segoe UI, sans-serif</p>
            <p className="font-mono text-xs text-text-secondary">--font-family-base</p>
          </div>

          {/* Scale */}
          <div className="space-y-3">
            {typeScale.map((t) => (
              <div
                key={t.name}
                className="flex items-center gap-4 rounded-[var(--radius-md)] border border-border-default bg-bg-surface px-4 py-4"
              >
                <div className="w-28 shrink-0">
                  <p className="font-mono text-xs text-text-secondary">{t.name}</p>
                  <p className="font-mono text-xs text-text-secondary">{t.value}</p>
                </div>
                <p
                  className="flex-1 font-semibold text-text-primary"
                  style={{ fontSize: t.value }}
                >
                  {t.label} — Aa Bb Cc 123
                </p>
              </div>
            ))}
          </div>

          {/* Weight samples */}
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {['normal', 'medium', 'semibold', 'bold'].map((w) => (
              <div
                key={w}
                className="rounded-[var(--radius-md)] border border-border-default bg-bg-surface px-4 py-4"
              >
                <p className={`text-base text-text-primary font-${w}`} style={{ fontWeight: w === 'medium' ? 500 : w === 'semibold' ? 600 : w === 'bold' ? 700 : 400 }}>
                  Mycash+
                </p>
                <p className="mt-1 font-mono text-xs text-text-secondary capitalize">{w}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Spacing ── */}
        <Section title="Espaçamento">
          <div className="space-y-3">
            {spacing.map((s) => (
              <div
                key={s.name}
                className="flex items-center gap-4 rounded-[var(--radius-md)] border border-border-default bg-bg-surface px-4 py-3"
              >
                <div className="w-32 shrink-0">
                  <p className="font-mono text-sm font-semibold text-text-primary">{s.name}</p>
                  <p className="font-mono text-xs text-text-secondary">{s.value}</p>
                </div>
                <div className="flex-1">
                  <div
                    className="h-4 rounded-full bg-[var(--color-accent-primary)]"
                    style={{ width: `${Math.max(s.px * 2, 4)}px` }}
                  />
                </div>
                <span className="font-mono text-xs text-text-secondary">{s.px}px</span>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Border Radius ── */}
        <Section title="Border Radius">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {radii.map((r) => (
              <div
                key={r.name}
                className="flex flex-col items-center gap-3 rounded-[var(--radius-md)] border border-border-default bg-bg-surface p-4"
              >
                <div
                  className="h-16 w-16 border-2 border-border-default bg-[var(--color-neutral-200)]"
                  style={{ borderRadius: r.value }}
                />
                <div className="text-center">
                  <p className="font-mono text-xs font-semibold text-text-primary">{r.name.replace('--radius-', '')}</p>
                  <p className="font-mono text-xs text-text-secondary">{r.value}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Shadows ── */}
        <Section title="Sombras">
          <div className="space-y-3">
            {shadows.map((s) => (
              <div
                key={s.name}
                className="flex items-center gap-4 rounded-[var(--radius-md)] border border-border-default bg-bg-surface px-4 py-4"
              >
                <div
                  className="h-12 w-12 shrink-0 rounded-[var(--radius-md)] bg-bg-surface"
                  style={{ boxShadow: s.value }}
                />
                <div>
                  <p className="font-mono text-sm font-semibold text-text-primary">{s.name}</p>
                  <p className="font-mono text-xs text-text-secondary">{s.label}</p>
                  <p className="font-mono text-xs text-text-secondary">{s.value}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Icons ── */}
        <Section title="Ícones">
          <p className="mb-4 text-sm text-text-secondary">
            Ícones SVG inline com <code className="rounded bg-[var(--color-neutral-200)] px-1 py-0.5 font-mono text-xs">currentColor</code> — herdam a cor do elemento pai.
          </p>
          <div className="flex flex-wrap gap-4">
            {[
              { label: 'IconHome',         Icon: IconHome },
              { label: 'IconCard',         Icon: IconCard },
              { label: 'IconUser',         Icon: IconUser },
              { label: 'IconLogOut',       Icon: IconLogOut },
              { label: 'IconChevronLeft',  Icon: IconChevronLeft },
              { label: 'IconChevronRight', Icon: IconChevronRight },
              { label: 'IconClose',        Icon: IconClose },
            ].map(({ label, Icon }) => (
              <div
                key={label}
                className="flex flex-col items-center gap-2 rounded-[var(--radius-md)] border border-border-default bg-bg-surface px-4 py-4"
              >
                <span className="text-text-primary"><Icon /></span>
                <p className="font-mono text-xs text-text-secondary">{label}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Buttons ── */}
        <Section title="Botões">
          <div className="space-y-6">
            {/* Primary */}
            <div className="rounded-[var(--radius-lg)] border border-border-default bg-bg-surface p-6">
              <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-text-secondary">Primary</p>
              <p className="mb-4 font-mono text-xs text-text-secondary">bg-bg-inverse · text-text-inverse · rounded-full</p>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  className="h-11 rounded-full bg-bg-inverse px-5 text-sm font-semibold text-text-inverse"
                >
                  Entrar
                </button>
                <button
                  type="button"
                  disabled
                  className="h-11 rounded-full bg-bg-inverse px-5 text-sm font-semibold text-text-inverse opacity-60"
                >
                  Desabilitado
                </button>
              </div>
            </div>

            {/* Secondary / ghost */}
            <div className="rounded-[var(--radius-lg)] border border-border-default bg-bg-surface p-6">
              <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-text-secondary">Secondary / Ghost</p>
              <p className="mb-4 font-mono text-xs text-text-secondary">border-border-default · bg-bg-surface · hover:bg-neutral-100</p>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  className="h-11 rounded-[var(--radius-md)] border border-border-default bg-bg-surface px-5 text-sm font-semibold text-text-primary transition hover:bg-[var(--color-neutral-100)]"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="flex h-11 items-center gap-2 rounded-[var(--radius-md)] border border-border-default bg-bg-surface px-5 text-sm font-semibold text-text-primary transition hover:bg-[var(--color-neutral-100)]"
                >
                  <IconUser /> Editar Perfil
                </button>
              </div>
            </div>

            {/* Accent */}
            <div className="rounded-[var(--radius-lg)] border border-border-default bg-bg-surface p-6">
              <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-text-secondary">Accent (Brand)</p>
              <p className="mb-4 font-mono text-xs text-text-secondary">bg-accent-primary · text-nav-item-active-fg</p>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  className="h-11 rounded-full px-5 text-sm font-semibold"
                  style={{ backgroundColor: 'var(--color-accent-primary)', color: 'var(--color-nav-item-active-fg)' }}
                >
                  + Nova Transação
                </button>
              </div>
            </div>

            {/* Danger */}
            <div className="rounded-[var(--radius-lg)] border border-border-default bg-bg-surface p-6">
              <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-text-secondary">Danger</p>
              <p className="mb-4 font-mono text-xs text-text-secondary">text-red-500 · hover:bg-red-50</p>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  className="flex h-11 items-center gap-2 rounded-[var(--radius-md)] px-5 text-sm font-semibold text-red-500 transition hover:bg-red-50"
                >
                  <IconLogOut /> Sair
                </button>
              </div>
            </div>

            {/* Link / text */}
            <div className="rounded-[var(--radius-lg)] border border-border-default bg-bg-surface p-6">
              <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-text-secondary">Link / Text</p>
              <p className="mb-4 font-mono text-xs text-text-secondary">text-sm font-semibold underline · text-text-primary</p>
              <div className="flex flex-wrap gap-4">
                <button type="button" className="text-sm font-semibold text-text-primary underline">
                  Esqueci minha senha
                </button>
                <button type="button" className="text-sm font-semibold text-text-primary underline">
                  Não tenho conta
                </button>
              </div>
            </div>
          </div>
        </Section>

        {/* ── Form Inputs ── */}
        <Section title="Inputs">
          <div className="rounded-[var(--radius-lg)] border border-border-default bg-bg-surface p-6">
            <p className="mb-4 font-mono text-xs text-text-secondary">
              h-12 · rounded-radius-md · border-border-default · bg-bg-surface · px-3 · text-sm
            </p>
            <div className="space-y-4 max-w-sm">
              <label className="block space-y-1.5">
                <span className="text-sm font-semibold tracking-[0.3px] text-text-primary">Nome</span>
                <input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ex: Maria Silva"
                  className="h-12 w-full rounded-[var(--radius-md)] border border-border-default bg-bg-surface px-3 text-sm outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)]"
                />
              </label>
              <label className="block space-y-1.5">
                <span className="text-sm font-semibold tracking-[0.3px] text-text-primary">E-mail</span>
                <input
                  type="email"
                  placeholder="Ex: voce@email.com"
                  className="h-12 w-full rounded-[var(--radius-md)] border border-border-default bg-bg-surface px-3 text-sm outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)]"
                />
              </label>
              <label className="block space-y-1.5">
                <span className="text-sm font-semibold tracking-[0.3px] text-text-primary">Senha</span>
                <input
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  className="h-12 w-full rounded-[var(--radius-md)] border border-border-default bg-bg-surface px-3 text-sm outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)]"
                />
              </label>
              <label className="block space-y-1.5">
                <span className="text-sm font-semibold tracking-[0.3px] text-text-primary">Select</span>
                <select className="h-12 w-full rounded-[var(--radius-md)] border border-border-default bg-bg-surface px-3 text-sm outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)]">
                  <option>Débito</option>
                  <option>Crédito</option>
                  <option>Pix</option>
                </select>
              </label>
            </div>
          </div>
        </Section>

        {/* ── Badges / Status ── */}
        <Section title="Badges e Status">
          <div className="flex flex-wrap gap-3">
            <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold"
              style={{ backgroundColor: 'var(--color-green-100)', color: 'var(--color-feedback-success)' }}>
              Receita
            </span>
            <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold"
              style={{ backgroundColor: 'var(--color-red-100)', color: 'var(--color-feedback-danger)' }}>
              Despesa
            </span>
            <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold"
              style={{ backgroundColor: 'var(--color-accent-primary)', color: 'var(--color-nav-item-active-fg)' }}>
              Ativo
            </span>
            <span className="inline-flex items-center rounded-full border border-border-default px-3 py-1 text-xs font-semibold text-text-secondary">
              Neutro
            </span>
            <span className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold"
              style={{ backgroundColor: 'rgba(42,137,239,0.12)', color: 'var(--color-feedback-info)' }}>
              Info
            </span>
          </div>
        </Section>

        {/* ── Cards ── */}
        <Section title="Cards">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {/* Balance card */}
            <div
              className="rounded-[var(--radius-lg)] p-5"
              style={{ backgroundColor: 'var(--color-card-balance-bg)', color: 'var(--color-card-balance-fg)' }}
            >
              <p className="text-xs font-semibold" style={{ color: 'var(--color-card-balance-label)' }}>
                Saldo Total
              </p>
              <p className="mt-2 text-2xl font-bold">R$ 4.230,00</p>
              <p className="mt-1 text-xs" style={{ color: 'var(--color-card-balance-label)' }}>
                Atualizado hoje
              </p>
            </div>

            {/* Income card */}
            <div className="rounded-[var(--radius-lg)] border border-border-default bg-bg-surface p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full"
                  style={{ backgroundColor: 'var(--color-card-income-icon-bg)' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M12 19V5M5 12l7-7 7 7" stroke="var(--color-feedback-success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-text-secondary">Receitas</p>
              </div>
              <p className="mt-3 text-xl font-bold text-text-primary">R$ 6.500,00</p>
            </div>

            {/* Expense card */}
            <div className="rounded-[var(--radius-lg)] border border-border-default bg-bg-surface p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full"
                  style={{ backgroundColor: 'var(--color-card-expense-icon-bg)' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M12 5v14M19 12l-7 7-7-7" stroke="var(--color-feedback-danger)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-text-secondary">Despesas</p>
              </div>
              <p className="mt-3 text-xl font-bold text-text-primary">R$ 2.270,00</p>
            </div>
          </div>
        </Section>

        {/* ── Avatar ── */}
        <Section title="Avatar">
          <div className="flex flex-wrap items-end gap-6">
            {[
              { size: '2rem',   label: 'sm' },
              { size: '2.5rem', label: 'md (padrão)' },
              { size: '3rem',   label: 'lg' },
            ].map(({ size, label }) => (
              <div key={size} className="flex flex-col items-center gap-2">
                <div
                  className="flex items-center justify-center rounded-full border border-border-default bg-[var(--color-neutral-200)] text-sm font-semibold text-text-primary"
                  style={{ width: size, height: size }}
                >
                  S
                </div>
                <p className="font-mono text-xs text-text-secondary">{label}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Nav Items ── */}
        <Section title="Navegação — Nav Items">
          <div className="max-w-xs overflow-hidden rounded-[var(--radius-lg)] border border-border-default bg-bg-surface">
            {[
              { label: 'Home',    Icon: IconHome,  active: true  },
              { label: 'Cartões', Icon: IconCard,  active: false },
              { label: 'Perfil',  Icon: IconUser,  active: false },
            ].map(({ label, Icon, active }) => (
              <div
                key={label}
                className="flex items-center gap-2 rounded-[var(--radius-xl)] mx-3 my-1 px-3 py-2 text-sm font-semibold transition"
                style={
                  active
                    ? { backgroundColor: 'var(--color-nav-item-active-bg)', color: 'var(--color-nav-item-active-fg)' }
                    : { color: 'var(--color-text-secondary)' }
                }
              >
                <span style={{ color: active ? 'var(--color-nav-item-active-icon)' : 'var(--color-text-secondary)' }}>
                  <Icon />
                </span>
                {label}
              </div>
            ))}
          </div>
        </Section>

        {/* ── Divider ── */}
        <Section title="Divisores">
          <div className="space-y-4">
            <div className="h-px w-full bg-border-default" />
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-border-default" />
              <span className="text-xs text-text-secondary">ou continue com</span>
              <div className="h-px flex-1 bg-border-default" />
            </div>
          </div>
        </Section>

        {/* ── Motion tokens ── */}
        <Section title="Motion — Duração e Easing">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {[
              { name: '--motion-duration-fast', value: '180ms' },
              { name: '--motion-duration-base', value: '260ms' },
              { name: '--motion-duration-slow', value: '420ms' },
              { name: '--motion-ease-standard', value: 'cubic-bezier(0.22, 1, 0.36, 1)' },
              { name: '--motion-ease-exit',     value: 'cubic-bezier(0.4, 0, 1, 1)' },
              { name: '--transition-sidebar-duration', value: '280ms' },
            ].map((t) => (
              <TokenRow key={t.name} name={t.name} value={t.value} />
            ))}
          </div>
        </Section>

      </div>

      {/* Footer */}
      <footer className="mt-16 border-t border-border-default pt-6 text-center">
        <p className="text-xs text-text-secondary">
          Mycash+ Design System · Atualizado em {new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
        </p>
      </footer>
    </div>
  )
}
