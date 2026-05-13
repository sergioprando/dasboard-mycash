import { useState, useEffect, useRef } from 'react'
import { ThemeSwitch } from '../layout/ThemeSwitch'
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
   Types
───────────────────────────────────────────── */

type Level = 'foundations' | 'atoms' | 'molecules' | 'organisms'

type NavSection = {
  id: string
  label: string
  level: Level
}

/* ─────────────────────────────────────────────
   Navigation config
───────────────────────────────────────────── */

const LEVELS: { id: Level; label: string; color: string; description: string }[] = [
  {
    id: 'foundations',
    label: 'Fundamentos',
    color: '#6b7280',
    description: 'Tokens de design — os valores brutos que alimentam todo o sistema.',
  },
  {
    id: 'atoms',
    label: 'Átomos',
    color: '#2a89ef',
    description: 'Elementos indivisíveis da UI. Não funcionam se partidos ao meio.',
  },
  {
    id: 'molecules',
    label: 'Moléculas',
    color: '#15be78',
    description: 'Grupos simples de átomos que funcionam como uma unidade.',
  },
  {
    id: 'organisms',
    label: 'Organismos',
    color: '#d7fe03',
    description: 'Componentes complexos formados por moléculas e átomos.',
  },
]

const NAV_SECTIONS: NavSection[] = [
  // Foundations
  { id: 'colors-primitive', label: 'Cores Primitivas',   level: 'foundations' },
  { id: 'colors-semantic',  label: 'Cores Semânticas',   level: 'foundations' },
  { id: 'typography',       label: 'Tipografia',          level: 'foundations' },
  { id: 'spacing',          label: 'Espaçamento',         level: 'foundations' },
  { id: 'radius',           label: 'Border Radius',       level: 'foundations' },
  { id: 'shadows',          label: 'Sombras',             level: 'foundations' },
  { id: 'motion',           label: 'Motion',              level: 'foundations' },
  // Atoms
  { id: 'atom-swatch',      label: 'Color Swatch',        level: 'atoms' },
  { id: 'atom-icon',        label: 'Ícones',              level: 'atoms' },
  { id: 'atom-badge',       label: 'Badge',               level: 'atoms' },
  { id: 'atom-avatar',      label: 'Avatar',              level: 'atoms' },
  { id: 'atom-divider',     label: 'Divisor',             level: 'atoms' },
  { id: 'atom-button',      label: 'Button',              level: 'atoms' },
  { id: 'atom-input',       label: 'Input',               level: 'atoms' },
  // Molecules
  { id: 'mol-field',        label: 'Form Field',          level: 'molecules' },
  { id: 'mol-navitem',      label: 'Nav Item',            level: 'molecules' },
  { id: 'mol-statitem',     label: 'Stat Item',           level: 'molecules' },
  { id: 'mol-transaction',  label: 'Transaction Row',     level: 'molecules' },
  { id: 'mol-iconbutton',   label: 'Icon Button',         level: 'molecules' },
  // Organisms
  { id: 'org-cards',        label: 'Summary Cards',       level: 'organisms' },
  { id: 'org-nav',          label: 'Navegação',           level: 'organisms' },
  { id: 'org-modal',        label: 'Modal Shell',         level: 'organisms' },
  { id: 'org-form',         label: 'Transaction Form',    level: 'organisms' },
]

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  function copy() {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }
  return (
    <button
      type="button"
      onClick={copy}
      className="shrink-0 rounded-[var(--radius-sm)] border border-border-default px-2.5 py-1 font-mono text-[11px] font-medium text-text-secondary transition hover:bg-[var(--color-neutral-200)] hover:text-text-primary"
    >
      {copied ? '✓ Copiado' : 'Copiar'}
    </button>
  )
}

function TokenRow({ name, value, preview }: { name: string; value: string; preview?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 rounded-[var(--radius-md)] border border-border-default bg-bg-surface px-4 py-3 transition hover:bg-[var(--color-neutral-100)]">
      {preview && <div className="shrink-0">{preview}</div>}
      <div className="min-w-0 flex-1">
        <p className="truncate font-mono text-[13px] font-semibold text-text-primary">{name}</p>
        <p className="truncate font-mono text-xs text-text-secondary">{value}</p>
      </div>
      <CopyButton text={name} />
    </div>
  )
}

function SectionHeader({
  id,
  title,
  description,
  level,
}: {
  id: string
  title: string
  description?: string
  level: Level
}) {
  const lvl = LEVELS.find((l) => l.id === level)!
  return (
    <div id={id} className="mb-6 scroll-mt-8">
      <div className="flex items-center gap-2 mb-1">
        <span
          className="inline-block rounded-full px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-widest"
          style={{ backgroundColor: lvl.color + '22', color: lvl.color === '#d7fe03' ? '#737a00' : lvl.color }}
        >
          {lvl.label}
        </span>
      </div>
      <h2 className="text-lg font-bold text-text-primary">{title}</h2>
      {description && <p className="mt-1 text-sm text-text-secondary">{description}</p>}
      <div className="mt-3 h-px bg-border-default" />
    </div>
  )
}

function LevelBanner({ level }: { level: Level }) {
  const lvl = LEVELS.find((l) => l.id === level)!
  return (
    <div
      className="mb-8 rounded-[var(--radius-lg)] border px-5 py-4"
      style={{ borderColor: lvl.color + '44', backgroundColor: lvl.color + '0d' }}
    >
      <div className="flex items-center gap-3">
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius-md)] text-sm font-bold"
          style={{ backgroundColor: lvl.color, color: lvl.id === 'organisms' ? '#111827' : '#fff' }}
        >
          {lvl.label[0]}
        </div>
        <div>
          <p className="font-bold text-text-primary">{lvl.label}</p>
          <p className="text-sm text-text-secondary">{lvl.description}</p>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   Data
───────────────────────────────────────────── */

const primitiveColors = [
  { name: '--color-neutral-0',    value: '#ffffff',  label: 'White' },
  { name: '--color-neutral-100',  value: '#f9fafb',  label: 'Gray 100' },
  { name: '--color-neutral-200',  value: '#f3f4f6',  label: 'Gray 200' },
  { name: '--color-neutral-300',  value: '#e5e7eb',  label: 'Gray 300' },
  { name: '--color-neutral-400',  value: '#d1d5db',  label: 'Gray 400' },
  { name: '--color-neutral-500',  value: '#9ca3af',  label: 'Gray 500' },
  { name: '--color-neutral-600',  value: '#6b7280',  label: 'Gray 600' },
  { name: '--color-neutral-700',  value: '#4b5563',  label: 'Gray 700' },
  { name: '--color-neutral-800',  value: '#374151',  label: 'Gray 800' },
  { name: '--color-neutral-900',  value: '#1f2937',  label: 'Gray 900' },
  { name: '--color-neutral-1000', value: '#111827',  label: 'Black' },
  { name: '--color-brand-600',    value: '#d7fe03',  label: 'Brand' },
  // Feedback
  { name: '--color-green-600',    value: '#15be78',  label: 'Green' },
  { name: '--color-green-100',    value: '#e8f9f2',  label: 'Green Tint' },
  { name: '--color-red-600',      value: '#e61e32',  label: 'Red' },
  { name: '--color-red-100',      value: '#fde9eb',  label: 'Red Tint' },
  { name: '--color-blue-600',     value: '#2a89ef',  label: 'Blue' },
]

const semanticColors = [
  { name: '--color-bg-default',         value: 'neutral-100',  hex: '#f9fafb',  usage: 'Fundo de página' },
  { name: '--color-bg-surface',         value: 'neutral-0',    hex: '#ffffff',  usage: 'Cards e painéis' },
  { name: '--color-bg-inverse',         value: 'neutral-1000', hex: '#111827',  usage: 'Botão primário, card balance' },
  { name: '--color-text-primary',       value: 'neutral-1000', hex: '#111827',  usage: 'Texto principal' },
  { name: '--color-text-secondary',     value: 'neutral-600',  hex: '#6b7280',  usage: 'Labels e subtítulos' },
  { name: '--color-text-inverse',       value: 'neutral-0',    hex: '#ffffff',  usage: 'Texto sobre fundo escuro' },
  { name: '--color-border-default',     value: 'neutral-300',  hex: '#e5e7eb',  usage: 'Bordas e divisores' },
  { name: '--color-accent-primary',     value: 'brand-600',    hex: '#d7fe03',  usage: 'Ações primárias, destaque' },
  { name: '--color-feedback-success',   value: 'green-600',    hex: '#15be78',  usage: 'Sucesso, receitas' },
  { name: '--color-feedback-danger',    value: 'red-600',      hex: '#e61e32',  usage: 'Erro, despesas' },
  { name: '--color-feedback-info',      value: 'blue-600',     hex: '#2a89ef',  usage: 'Informação' },
  { name: '--color-nav-item-active-bg', value: 'brand-600',    hex: '#d7fe03',  usage: 'Nav item ativo (fundo)' },
  { name: '--color-nav-item-active-fg', value: 'neutral-1000', hex: '#111827',  usage: 'Nav item ativo (texto)' },
]

const spacing = [
  { name: '--space-0',  value: '0px',  px: 0 },
  { name: '--space-2',  value: '2px',  px: 2 },
  { name: '--space-4',  value: '4px',  px: 4 },
  { name: '--space-6',  value: '6px',  px: 6 },
  { name: '--space-8',  value: '8px',  px: 8 },
  { name: '--space-12', value: '12px', px: 12 },
  { name: '--space-16', value: '16px', px: 16 },
]

const radii = [
  { name: '--radius-sm', value: '8px',  label: 'sm' },
  { name: '--radius-md', value: '12px', label: 'md' },
  { name: '--radius-lg', value: '16px', label: 'lg' },
  { name: '--radius-xl', value: '24px', label: 'xl' },
]

const typeScale = [
  { name: '--text-xs', value: '12px', label: 'Extra Small', weight: 400 },
  { name: '--text-sm', value: '14px', label: 'Small',       weight: 400 },
  { name: '--text-md', value: '16px', label: 'Medium',      weight: 500 },
  { name: '--text-lg', value: '20px', label: 'Large',       weight: 600 },
  { name: '--text-xl', value: '24px', label: 'Extra Large', weight: 700 },
]

const motionTokens = [
  { name: '--motion-duration-fast', value: '180ms',                           category: 'Duração' },
  { name: '--motion-duration-base', value: '260ms',                           category: 'Duração' },
  { name: '--motion-duration-slow', value: '420ms',                           category: 'Duração' },
  { name: '--motion-ease-standard', value: 'cubic-bezier(0.22, 1, 0.36, 1)', category: 'Easing' },
  { name: '--motion-ease-exit',     value: 'cubic-bezier(0.4, 0, 1, 1)',     category: 'Easing' },
  { name: '--transition-sidebar-duration', value: '280ms',                    category: 'Duração' },
]

/* ─────────────────────────────────────────────
   FOUNDATIONS
───────────────────────────────────────────── */

function FoundationsSection() {
  return (
    <div>
      <LevelBanner level="foundations" />

      {/* Primitive colors */}
      <SectionHeader
        id="colors-primitive"
        level="foundations"
        title="Cores Primitivas"
        description="Paleta de valores brutos. Nunca usados diretamente nos componentes — sempre via token semântico."
      />
      <div className="mb-10">
        <div className="mb-4 grid grid-cols-11 gap-1.5">
          {primitiveColors
            .filter((c) => c.name.includes('neutral'))
            .map((c) => (
              <div key={c.name} className="flex flex-col items-center gap-1">
                <div
                  className="h-10 w-full rounded-[var(--radius-sm)] border border-border-default"
                  style={{ backgroundColor: c.value }}
                />
                <span className="font-mono text-[9px] text-text-secondary leading-tight text-center">
                  {c.name.replace('--color-neutral-', '')}
                </span>
              </div>
            ))}
        </div>
        <div className="mb-6 flex gap-3">
          {primitiveColors
            .filter((c) => !c.name.includes('neutral'))
            .map((c) => (
              <div key={c.name} className="flex flex-col items-center gap-1">
                <div
                  className="h-10 w-14 rounded-[var(--radius-sm)] border border-border-default"
                  style={{ backgroundColor: c.value }}
                />
                <span className="font-mono text-[9px] text-text-secondary text-center leading-tight max-w-[56px]">
                  {c.label}
                </span>
              </div>
            ))}
        </div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {primitiveColors.map((c) => (
            <TokenRow
              key={c.name}
              name={c.name}
              value={c.value}
              preview={
                <div
                  className="h-7 w-7 rounded-[var(--radius-sm)] border border-border-default"
                  style={{ backgroundColor: c.value }}
                />
              }
            />
          ))}
        </div>
      </div>

      {/* Semantic colors */}
      <SectionHeader
        id="colors-semantic"
        level="foundations"
        title="Cores Semânticas"
        description="Tokens com propósito definido. Estes são os valores que os componentes devem usar."
      />
      <div className="mb-10">
        <div className="grid grid-cols-1 gap-2">
          {semanticColors.map((c) => (
            <div
              key={c.name}
              className="flex items-center gap-3 rounded-[var(--radius-md)] border border-border-default bg-bg-surface px-4 py-3 transition hover:bg-[var(--color-neutral-100)]"
            >
              <div
                className="h-7 w-7 shrink-0 rounded-[var(--radius-sm)] border border-border-default"
                style={{ backgroundColor: c.hex }}
              />
              <div className="min-w-0 flex-1 grid grid-cols-2 gap-x-4">
                <div>
                  <p className="font-mono text-[12px] font-semibold text-text-primary truncate">{c.name}</p>
                  <p className="font-mono text-[11px] text-text-secondary">→ {c.value}</p>
                </div>
                <p className="text-xs text-text-secondary self-center">{c.usage}</p>
              </div>
              <CopyButton text={c.name} />
            </div>
          ))}
        </div>
      </div>

      {/* Typography */}
      <SectionHeader
        id="typography"
        level="foundations"
        title="Tipografia"
        description="Família base e escala de tamanhos. Font-weight varia por nível."
      />
      <div className="mb-10">
        <div className="mb-4 rounded-[var(--radius-lg)] border border-border-default bg-bg-surface px-5 py-4">
          <div className="flex items-baseline gap-4">
            <p className="text-2xl font-bold text-text-primary">Inter</p>
            <p className="font-mono text-xs text-text-secondary">--font-family-base · "Inter", "Segoe UI", sans-serif</p>
          </div>
          <p className="mt-2 text-sm text-text-secondary">
            A B C D E F G H I J K L M N O P Q R S T U V W X Y Z
          </p>
          <p className="text-sm text-text-secondary">0 1 2 3 4 5 6 7 8 9 ! @ # $ % & *</p>
        </div>
        <div className="space-y-2">
          {typeScale.map((t) => (
            <div
              key={t.name}
              className="flex items-center gap-4 rounded-[var(--radius-md)] border border-border-default bg-bg-surface px-4 py-4"
            >
              <div className="w-36 shrink-0">
                <p className="font-mono text-xs text-text-secondary">{t.name}</p>
                <p className="font-mono text-xs text-text-secondary">{t.value}</p>
              </div>
              <p
                className="flex-1 text-text-primary truncate"
                style={{ fontSize: t.value, fontWeight: t.weight }}
              >
                {t.label} — Mycash+ Finanças
              </p>
              <CopyButton text={t.name} />
            </div>
          ))}
        </div>
        <div className="mt-4 grid grid-cols-4 gap-3">
          {[
            { w: 400, l: 'Regular' },
            { w: 500, l: 'Medium' },
            { w: 600, l: 'Semibold' },
            { w: 700, l: 'Bold' },
          ].map(({ w, l }) => (
            <div key={w} className="rounded-[var(--radius-md)] border border-border-default bg-bg-surface px-4 py-3 text-center">
              <p className="text-base text-text-primary" style={{ fontWeight: w }}>{l}</p>
              <p className="mt-1 font-mono text-[10px] text-text-secondary">{w}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Spacing */}
      <SectionHeader
        id="spacing"
        level="foundations"
        title="Espaçamento"
        description="Escala de 7 valores. Use os tokens em padding, gap e margin."
      />
      <div className="mb-10 space-y-2">
        {spacing.map((s) => (
          <div
            key={s.name}
            className="flex items-center gap-4 rounded-[var(--radius-md)] border border-border-default bg-bg-surface px-4 py-3"
          >
            <div className="w-28 shrink-0">
              <p className="font-mono text-[12px] font-semibold text-text-primary">{s.name}</p>
              <p className="font-mono text-xs text-text-secondary">{s.value}</p>
            </div>
            <div className="flex flex-1 items-center">
              <div
                className="h-3 rounded-full"
                style={{
                  width: `${Math.max(s.px * 4, 2)}px`,
                  backgroundColor: 'var(--color-accent-primary)',
                  minWidth: s.px === 0 ? '2px' : undefined,
                }}
              />
            </div>
            <span className="w-10 text-right font-mono text-xs text-text-secondary">{s.px}px</span>
            <CopyButton text={s.name} />
          </div>
        ))}
      </div>

      {/* Border radius */}
      <SectionHeader
        id="radius"
        level="foundations"
        title="Border Radius"
        description="Escala de 4 níveis de arredondamento."
      />
      <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {radii.map((r) => (
          <div
            key={r.name}
            className="flex flex-col items-center gap-3 rounded-[var(--radius-md)] border border-border-default bg-bg-surface p-5"
          >
            <div
              className="h-14 w-14 border-2 border-[var(--color-neutral-400)] bg-[var(--color-neutral-200)]"
              style={{ borderRadius: r.value }}
            />
            <div className="text-center">
              <p className="font-mono text-xs font-bold text-text-primary">{r.label}</p>
              <p className="font-mono text-xs text-text-secondary">{r.value}</p>
              <p className="mt-0.5 font-mono text-[10px] text-text-secondary truncate">{r.name}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Shadows */}
      <SectionHeader
        id="shadows"
        level="foundations"
        title="Sombras"
        description="Uma sombra sutil para elementos flutuantes como o toggle da sidebar."
      />
      <div className="mb-10">
        <div className="flex items-center gap-5 rounded-[var(--radius-lg)] border border-border-default bg-bg-surface px-5 py-5">
          <div
            className="h-14 w-14 shrink-0 rounded-[var(--radius-md)] bg-bg-surface"
            style={{ boxShadow: '0 1px 3px rgb(0 0 0 / 0.12)' }}
          />
          <div>
            <p className="font-mono text-sm font-semibold text-text-primary">--shadow-sidebar-toggle</p>
            <p className="font-mono text-xs text-text-secondary">0 1px 3px rgb(0 0 0 / 0.12)</p>
            <p className="mt-1 text-xs text-text-secondary">Usado no botão de toggle da sidebar</p>
          </div>
          <div className="ml-auto">
            <CopyButton text="--shadow-sidebar-toggle" />
          </div>
        </div>
      </div>

      {/* Motion */}
      <SectionHeader
        id="motion"
        level="foundations"
        title="Motion"
        description="Tokens de duração e easing. Animações reduzidas respeitam prefers-reduced-motion."
      />
      <div className="mb-10">
        <div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {motionTokens.map((m) => (
            <TokenRow key={m.name} name={m.name} value={m.value} />
          ))}
        </div>
        <div className="rounded-[var(--radius-lg)] border border-border-default bg-bg-surface p-5">
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-text-secondary">Classes de animação</p>
          <div className="flex flex-wrap gap-2">
            {['animate-page-in', 'animate-card-in', 'animate-modal-overlay', 'animate-modal-pop', 'hover-lift'].map(
              (cls) => (
                <code
                  key={cls}
                  className="rounded-[var(--radius-sm)] border border-border-default bg-[var(--color-neutral-100)] px-2 py-1 font-mono text-xs text-text-primary"
                >
                  .{cls}
                </code>
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   ATOMS
───────────────────────────────────────────── */

function AtomsSection() {
  const [inputVal, setInputVal] = useState('')

  return (
    <div>
      <LevelBanner level="atoms" />

      {/* Color Swatch */}
      <SectionHeader
        id="atom-swatch"
        level="atoms"
        title="Color Swatch"
        description="Átomo visual que representa um token de cor. Usado na documentação e em seletores de cor."
      />
      <div className="mb-10">
        <div className="rounded-[var(--radius-lg)] border border-border-default bg-bg-surface p-5">
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-text-secondary">Variantes</p>
          <div className="flex flex-wrap gap-4">
            {[
              { color: '#d7fe03', label: 'Brand', border: false },
              { color: '#15be78', label: 'Success', border: false },
              { color: '#e61e32', label: 'Danger', border: false },
              { color: '#2a89ef', label: 'Info', border: false },
              { color: '#111827', label: 'Inverse', border: false },
              { color: '#ffffff', label: 'Surface', border: true },
              { color: '#f9fafb', label: 'Default', border: true },
            ].map(({ color, label, border }) => (
              <div key={label} className="flex flex-col items-center gap-1.5">
                <div
                  className="h-10 w-10 rounded-[var(--radius-md)]"
                  style={{
                    backgroundColor: color,
                    border: border ? '1px solid var(--color-neutral-300)' : undefined,
                  }}
                />
                <span className="font-mono text-[10px] text-text-secondary">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Icons */}
      <SectionHeader
        id="atom-icon"
        level="atoms"
        title="Ícones"
        description="SVGs inline com currentColor. Herdam a cor do pai. Tamanho padrão: 20×20px, stroke 1.75."
      />
      <div className="mb-10">
        <div className="rounded-[var(--radius-lg)] border border-border-default bg-bg-surface p-5">
          <div className="flex flex-wrap gap-3">
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
                className="flex flex-col items-center gap-2 rounded-[var(--radius-md)] border border-border-default px-4 py-4 transition hover:bg-[var(--color-neutral-100)]"
              >
                <span className="text-text-primary">
                  <Icon />
                </span>
                <p className="font-mono text-[10px] text-text-secondary">{label}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 flex gap-3 border-t border-border-default pt-4">
            <p className="text-xs font-semibold text-text-secondary">Estados de cor:</p>
            {[
              { color: 'var(--color-text-primary)',   label: 'Primary' },
              { color: 'var(--color-text-secondary)', label: 'Secondary' },
              { color: 'var(--color-accent-primary)', label: 'Accent' },
              { color: 'var(--color-feedback-success)',label: 'Success' },
              { color: 'var(--color-feedback-danger)', label: 'Danger' },
            ].map(({ color, label }) => (
              <div key={label} className="flex items-center gap-1.5">
                <span style={{ color }}>
                  <IconHome />
                </span>
                <span className="text-xs text-text-secondary">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Badge */}
      <SectionHeader
        id="atom-badge"
        level="atoms"
        title="Badge"
        description="Rótulo inline de status. Pill shape com background semântico."
      />
      <div className="mb-10 rounded-[var(--radius-lg)] border border-border-default bg-bg-surface p-5">
        <div className="flex flex-wrap gap-3">
          <span
            className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold"
            style={{ backgroundColor: 'var(--color-green-100)', color: 'var(--color-feedback-success)' }}
          >
            Receita
          </span>
          <span
            className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold"
            style={{ backgroundColor: 'var(--color-red-100)', color: 'var(--color-feedback-danger)' }}
          >
            Despesa
          </span>
          <span
            className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold"
            style={{ backgroundColor: 'var(--color-accent-primary)', color: 'var(--color-nav-item-active-fg)' }}
          >
            Ativo
          </span>
          <span className="inline-flex items-center rounded-full border border-border-default px-3 py-1 text-xs font-semibold text-text-secondary">
            Neutro
          </span>
          <span
            className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold"
            style={{ backgroundColor: 'rgba(42,137,239,0.12)', color: 'var(--color-feedback-info)' }}
          >
            Info
          </span>
          <span
            className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold"
            style={{ backgroundColor: 'rgba(42,137,239,0.12)', color: 'var(--color-feedback-info)' }}
          >
            Pendente
          </span>
        </div>
      </div>

      {/* Avatar */}
      <SectionHeader
        id="atom-avatar"
        level="atoms"
        title="Avatar"
        description="Círculo de identidade do usuário. Iniciais como fallback."
      />
      <div className="mb-10 rounded-[var(--radius-lg)] border border-border-default bg-bg-surface p-5">
        <div className="flex flex-wrap items-end gap-8">
          {[
            { size: '2rem',   label: 'sm · 32px', initials: 'A' },
            { size: '2.5rem', label: 'md · 40px', initials: 'MS' },
            { size: '3rem',   label: 'lg · 48px', initials: 'JD' },
            { size: '4rem',   label: 'xl · 64px', initials: 'LF' },
          ].map(({ size, label, initials }) => (
            <div key={size} className="flex flex-col items-center gap-2">
              <div
                className="flex items-center justify-center rounded-full border border-border-default bg-[var(--color-neutral-200)] font-semibold text-text-primary"
                style={{ width: size, height: size, fontSize: `calc(${size} * 0.38)` }}
              >
                {initials}
              </div>
              <p className="font-mono text-[10px] text-text-secondary">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <SectionHeader
        id="atom-divider"
        level="atoms"
        title="Divisor"
        description="Linha horizontal ou com label central para separar seções."
      />
      <div className="mb-10 rounded-[var(--radius-lg)] border border-border-default bg-bg-surface p-5 space-y-6">
        <div>
          <p className="mb-3 font-mono text-xs text-text-secondary">Simples</p>
          <div className="h-px bg-border-default" />
        </div>
        <div>
          <p className="mb-3 font-mono text-xs text-text-secondary">Com label</p>
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-border-default" />
            <span className="text-xs text-text-secondary">ou continue com</span>
            <div className="h-px flex-1 bg-border-default" />
          </div>
        </div>
      </div>

      {/* Button */}
      <SectionHeader
        id="atom-button"
        level="atoms"
        title="Button"
        description="5 variantes. Tamanho padrão h-11. Padding horizontal px-5."
      />
      <div className="mb-10 space-y-4">
        {[
          {
            variant: 'Primary',
            desc: 'bg-bg-inverse · text-text-inverse · rounded-full',
            buttons: [
              <button key="1" type="button" className="h-11 rounded-full bg-bg-inverse px-5 text-sm font-semibold text-text-inverse">
                Salvar
              </button>,
              <button key="2" type="button" className="h-11 rounded-full bg-bg-inverse px-5 text-sm font-semibold text-text-inverse opacity-40" disabled>
                Desabilitado
              </button>,
            ],
          },
          {
            variant: 'Secondary',
            desc: 'border-border-default · bg-bg-surface · hover:bg-neutral-100',
            buttons: [
              <button key="1" type="button" className="h-11 rounded-[var(--radius-md)] border border-border-default bg-bg-surface px-5 text-sm font-semibold text-text-primary transition hover:bg-[var(--color-neutral-100)]">
                Cancelar
              </button>,
              <button key="2" type="button" className="flex h-11 items-center gap-2 rounded-[var(--radius-md)] border border-border-default bg-bg-surface px-5 text-sm font-semibold text-text-primary transition hover:bg-[var(--color-neutral-100)]">
                <IconUser /> Editar
              </button>,
            ],
          },
          {
            variant: 'Accent (Brand)',
            desc: 'bg-accent-primary · text-nav-item-active-fg · rounded-full',
            buttons: [
              <button
                key="1"
                type="button"
                className="h-11 rounded-full px-5 text-sm font-semibold"
                style={{ backgroundColor: 'var(--color-accent-primary)', color: 'var(--color-nav-item-active-fg)' }}
              >
                + Nova Transação
              </button>,
            ],
          },
          {
            variant: 'Danger',
            desc: 'text-red-500 · hover:bg-red-50',
            buttons: [
              <button key="1" type="button" className="flex h-11 items-center gap-2 rounded-[var(--radius-md)] px-5 text-sm font-semibold text-red-500 transition hover:bg-red-50">
                <IconLogOut /> Sair da conta
              </button>,
            ],
          },
          {
            variant: 'Link / Text',
            desc: 'font-semibold · underline · text-text-primary',
            buttons: [
              <button key="1" type="button" className="text-sm font-semibold text-text-primary underline">
                Esqueci minha senha
              </button>,
              <button key="2" type="button" className="text-sm font-semibold text-text-secondary underline">
                Ver todos
              </button>,
            ],
          },
        ].map(({ variant, desc, buttons }) => (
          <div key={variant} className="rounded-[var(--radius-lg)] border border-border-default bg-bg-surface p-5">
            <div className="mb-3 flex items-baseline gap-3">
              <p className="text-xs font-bold uppercase tracking-widest text-text-primary">{variant}</p>
              <p className="font-mono text-xs text-text-secondary">{desc}</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">{buttons}</div>
          </div>
        ))}
      </div>

      {/* Input */}
      <SectionHeader
        id="atom-input"
        level="atoms"
        title="Input"
        description="h-12 · radius-md · border-border-default · focus:ring-2 accent-primary"
      />
      <div className="mb-10 rounded-[var(--radius-lg)] border border-border-default bg-bg-surface p-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <input
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Texto (default)"
            className="h-12 w-full rounded-[var(--radius-md)] border border-border-default bg-bg-surface px-3 text-sm outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)]"
          />
          <input
            type="email"
            placeholder="Email"
            className="h-12 w-full rounded-[var(--radius-md)] border border-border-default bg-bg-surface px-3 text-sm outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)]"
          />
          <input
            type="password"
            placeholder="Senha"
            className="h-12 w-full rounded-[var(--radius-md)] border border-border-default bg-bg-surface px-3 text-sm outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)]"
          />
          <select className="h-12 w-full rounded-[var(--radius-md)] border border-border-default bg-bg-surface px-3 text-sm outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)]">
            <option>Select (opção)</option>
            <option>Débito</option>
            <option>Crédito</option>
          </select>
          <input
            disabled
            placeholder="Desabilitado"
            className="h-12 w-full rounded-[var(--radius-md)] border border-border-default bg-[var(--color-neutral-100)] px-3 text-sm text-text-secondary outline-none opacity-60 cursor-not-allowed"
          />
          <input
            placeholder="Estado de erro"
            className="h-12 w-full rounded-[var(--radius-md)] border-2 border-red-400 bg-bg-surface px-3 text-sm outline-none focus:ring-2 focus:ring-red-300"
          />
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   MOLECULES
───────────────────────────────────────────── */

function MoleculesSection() {
  const [transactionType, setTransactionType] = useState<'income' | 'expense'>('income')

  return (
    <div>
      <LevelBanner level="molecules" />

      {/* Form Field */}
      <SectionHeader
        id="mol-field"
        level="molecules"
        title="Form Field"
        description="Label + Input + mensagem de suporte. Unidade mínima de formulário."
      />
      <div className="mb-10 rounded-[var(--radius-lg)] border border-border-default bg-bg-surface p-5">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <label className="block space-y-1.5">
            <span className="text-sm font-semibold tracking-[0.3px] text-text-primary">Nome completo</span>
            <input
              placeholder="Ex: Maria Silva"
              className="h-12 w-full rounded-[var(--radius-md)] border border-border-default bg-bg-surface px-3 text-sm outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)]"
            />
          </label>
          <label className="block space-y-1.5">
            <span className="text-sm font-semibold tracking-[0.3px] text-text-primary">E-mail</span>
            <input
              type="email"
              placeholder="voce@email.com"
              className="h-12 w-full rounded-[var(--radius-md)] border border-border-default bg-bg-surface px-3 text-sm outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)]"
            />
          </label>
          <label className="block space-y-1.5">
            <span className="flex items-center justify-between text-sm font-semibold text-text-primary">
              Senha
              <span className="text-xs font-normal text-text-secondary">Mínimo 6 caracteres</span>
            </span>
            <input
              type="password"
              placeholder="••••••••"
              className="h-12 w-full rounded-[var(--radius-md)] border border-border-default bg-bg-surface px-3 text-sm outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)]"
            />
          </label>
          <div className="space-y-1.5">
            <span className="text-sm font-semibold tracking-[0.3px] text-text-primary">Valor *</span>
            <input
              placeholder="R$ 0,00"
              className="h-12 w-full rounded-[var(--radius-md)] border-2 border-red-400 bg-bg-surface px-3 text-sm outline-none"
            />
            <p className="text-xs text-red-500">Campo obrigatório.</p>
          </div>
        </div>
      </div>

      {/* Nav Item */}
      <SectionHeader
        id="mol-navitem"
        level="molecules"
        title="Nav Item"
        description="Ícone + Label + estado ativo/inativo. Bloco de navegação da sidebar."
      />
      <div className="mb-10 rounded-[var(--radius-lg)] border border-border-default bg-bg-surface p-5">
        <div className="flex gap-6">
          <div className="w-56 space-y-1 rounded-[var(--radius-lg)] border border-border-default p-3">
            {[
              { label: 'Dashboard', Icon: IconHome,  active: true  },
              { label: 'Cartões',   Icon: IconCard,  active: false },
              { label: 'Perfil',    Icon: IconUser,  active: false },
            ].map(({ label, Icon, active }) => (
              <div
                key={label}
                className="flex cursor-pointer items-center gap-2.5 rounded-[var(--radius-xl)] px-3 py-2.5 text-sm font-semibold transition"
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
          <div className="flex flex-col gap-3 text-xs text-text-secondary self-center">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full" style={{ backgroundColor: 'var(--color-accent-primary)' }} />
              <span>Active: bg-accent-primary + text-nav-item-active-fg</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-[var(--color-neutral-400)]" />
              <span>Inactive: text-text-secondary + hover:bg-neutral-200</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stat Item */}
      <SectionHeader
        id="mol-statitem"
        level="molecules"
        title="Stat Item"
        description="Label semântico + valor principal. Átomo de dado financeiro."
      />
      <div className="mb-10 rounded-[var(--radius-lg)] border border-border-default bg-bg-surface p-5">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: 'Saldo Total',  value: 'R$ 4.230',  delta: '+12%', up: true },
            { label: 'Receitas',     value: 'R$ 6.500',  delta: '+8%',  up: true },
            { label: 'Despesas',     value: 'R$ 2.270',  delta: '-3%',  up: false },
            { label: 'Metas',        value: '3 / 5',     delta: null,   up: true },
          ].map(({ label, value, delta, up }) => (
            <div key={label} className="flex flex-col gap-1">
              <p className="text-xs font-medium text-text-secondary">{label}</p>
              <p className="text-xl font-bold text-text-primary">{value}</p>
              {delta && (
                <span
                  className="inline-flex w-fit items-center rounded-full px-2 py-0.5 text-[10px] font-semibold"
                  style={{
                    backgroundColor: up ? 'var(--color-green-100)' : 'var(--color-red-100)',
                    color: up ? 'var(--color-feedback-success)' : 'var(--color-feedback-danger)',
                  }}
                >
                  {delta}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Transaction Row */}
      <SectionHeader
        id="mol-transaction"
        level="molecules"
        title="Transaction Row"
        description="Ícone de categoria + descrição + data + valor. Linha de extrato financeiro."
      />
      <div className="mb-10 rounded-[var(--radius-lg)] border border-border-default bg-bg-surface overflow-hidden">
        {[
          { desc: 'Salário mensal',  cat: 'Receita',      date: '01 Mai',  value: '+R$ 6.500,00', type: 'income'  },
          { desc: 'Aluguel',         cat: 'Moradia',       date: '05 Mai',  value: '-R$ 1.800,00', type: 'expense' },
          { desc: 'Supermercado',    cat: 'Alimentação',   date: '07 Mai',  value: '-R$ 320,00',   type: 'expense' },
          { desc: 'Freelance UX',    cat: 'Receita',       date: '10 Mai',  value: '+R$ 2.400,00', type: 'income'  },
        ].map((tx, i) => (
          <div
            key={i}
            className="flex items-center gap-4 px-5 py-4 transition hover:bg-[var(--color-neutral-100)] border-b border-border-default last:border-b-0"
          >
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm"
              style={{
                backgroundColor: tx.type === 'income' ? 'var(--color-green-100)' : 'var(--color-red-100)',
              }}
            >
              {tx.type === 'income' ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M12 19V5M5 12l7-7 7 7" stroke="var(--color-feedback-success)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M12 5v14M19 12l-7 7-7-7" stroke="var(--color-feedback-danger)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-text-primary truncate">{tx.desc}</p>
              <p className="text-xs text-text-secondary">{tx.cat} · {tx.date}</p>
            </div>
            <p
              className="text-sm font-bold tabular-nums shrink-0"
              style={{ color: tx.type === 'income' ? 'var(--color-feedback-success)' : 'var(--color-feedback-danger)' }}
            >
              {tx.value}
            </p>
          </div>
        ))}
      </div>

      {/* Icon Button */}
      <SectionHeader
        id="mol-iconbutton"
        level="molecules"
        title="Icon Button"
        description="Botão com apenas ícone. Usado em ações secundárias e navegação compacta."
      />
      <div className="mb-10 rounded-[var(--radius-lg)] border border-border-default bg-bg-surface p-5">
        <div className="flex flex-wrap items-center gap-4">
          <button type="button" className="flex h-10 w-10 items-center justify-center rounded-full border border-border-default bg-bg-surface text-text-secondary transition hover:bg-[var(--color-neutral-100)] hover:text-text-primary">
            <IconClose />
          </button>
          <button type="button" className="flex h-10 w-10 items-center justify-center rounded-full border border-border-default bg-bg-surface text-text-secondary transition hover:bg-[var(--color-neutral-100)] hover:text-text-primary">
            <IconChevronLeft />
          </button>
          <button type="button" className="flex h-10 w-10 items-center justify-center rounded-full border border-border-default bg-bg-surface text-text-secondary transition hover:bg-[var(--color-neutral-100)] hover:text-text-primary">
            <IconChevronRight />
          </button>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full"
            style={{ backgroundColor: 'var(--color-accent-primary)', color: 'var(--color-nav-item-active-fg)' }}
          >
            <IconUser />
          </button>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-bg-inverse text-text-inverse"
          >
            <IconHome />
          </button>
          <div className="ml-2 text-xs text-text-secondary">
            <p>32×32 · rounded-full</p>
            <p>border · ghost · accent · inverse</p>
          </div>
        </div>
      </div>

      {/* Type Toggle (bonus molecule) */}
      <SectionHeader
        id="mol-toggle"
        level="molecules"
        title="Type Toggle"
        description="Dois estados exclusivos. Usado no modal de nova transação."
      />
      <div className="mb-10 rounded-[var(--radius-lg)] border border-border-default bg-bg-surface p-5">
        <div className="flex w-fit rounded-[var(--radius-md)] border border-border-default p-1">
          {(['income', 'expense'] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setTransactionType(type)}
              className="rounded-[var(--radius-sm)] px-4 py-2 text-sm font-semibold transition"
              style={
                transactionType === type
                  ? {
                      backgroundColor: type === 'income' ? 'var(--color-green-100)' : 'var(--color-red-100)',
                      color: type === 'income' ? 'var(--color-feedback-success)' : 'var(--color-feedback-danger)',
                    }
                  : { color: 'var(--color-text-secondary)' }
              }
            >
              {type === 'income' ? 'Receita' : 'Despesa'}
            </button>
          ))}
        </div>
        <p className="mt-3 font-mono text-xs text-text-secondary">
          Estado atual: <strong>{transactionType}</strong>
        </p>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   ORGANISMS
───────────────────────────────────────────── */

function OrganismsSection() {
  const [modalOpen, setModalOpen] = useState(false)
  const [formType, setFormType] = useState<'income' | 'expense'>('expense')

  return (
    <div>
      <LevelBanner level="organisms" />

      {/* Summary Cards */}
      <SectionHeader
        id="org-cards"
        level="organisms"
        title="Summary Cards"
        description="Três cartões de resumo financeiro. Balance (dark), Income e Expense (light)."
      />
      <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Balance */}
        <div
          className="rounded-[var(--radius-lg)] p-5 animate-card-in"
          style={{ backgroundColor: 'var(--color-card-balance-bg)', color: 'var(--color-card-balance-fg)' }}
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold" style={{ color: 'var(--color-card-balance-label)' }}>
              Saldo Total
            </p>
            <span
              className="rounded-full px-2 py-0.5 text-[10px] font-bold"
              style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: 'var(--color-accent-primary)' }}
            >
              +12%
            </span>
          </div>
          <p className="mt-3 text-2xl font-bold">R$ 4.230,00</p>
          <p className="mt-1 text-xs" style={{ color: 'var(--color-card-balance-label)' }}>
            Atualizado hoje
          </p>
        </div>
        {/* Income */}
        <div className="rounded-[var(--radius-lg)] border border-border-default bg-bg-surface p-5 animate-card-in">
          <div className="flex items-center gap-3">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-full"
              style={{ backgroundColor: 'var(--color-card-income-icon-bg)' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M12 19V5M5 12l7-7 7 7" stroke="var(--color-feedback-success)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-text-secondary">Receitas</p>
          </div>
          <p className="mt-3 text-xl font-bold text-text-primary">R$ 6.500,00</p>
          <p className="mt-1 text-xs text-text-secondary">Mai 2025</p>
        </div>
        {/* Expense */}
        <div className="rounded-[var(--radius-lg)] border border-border-default bg-bg-surface p-5 animate-card-in">
          <div className="flex items-center gap-3">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-full"
              style={{ backgroundColor: 'var(--color-card-expense-icon-bg)' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M12 5v14M19 12l-7 7-7-7" stroke="var(--color-feedback-danger)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-text-secondary">Despesas</p>
          </div>
          <p className="mt-3 text-xl font-bold text-text-primary">R$ 2.270,00</p>
          <p className="mt-1 text-xs text-text-secondary">Mai 2025</p>
        </div>
      </div>

      {/* Navigation */}
      <SectionHeader
        id="org-nav"
        level="organisms"
        title="Navegação (Sidebar)"
        description="Sidebar expandida com logo, nav items, avatar e menu do usuário."
      />
      <div className="mb-10 rounded-[var(--radius-lg)] border border-border-default bg-bg-surface p-5">
        <div className="flex gap-6">
          {/* Expanded */}
          <div
            className="flex w-56 flex-col rounded-[var(--radius-lg)] border border-border-default p-4"
            style={{ backgroundColor: 'var(--color-bg-surface)' }}
          >
            <div className="mb-6 flex items-center gap-2 px-1">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-sm)] text-xs font-bold"
                style={{ backgroundColor: 'var(--color-accent-primary)', color: 'var(--color-nav-item-active-fg)' }}
              >
                M
              </div>
              <span className="text-sm font-bold text-text-primary">Mycash+</span>
            </div>
            <nav className="flex-1 space-y-1">
              {[
                { label: 'Dashboard', Icon: IconHome,  active: true  },
                { label: 'Cartões',   Icon: IconCard,  active: false },
                { label: 'Perfil',    Icon: IconUser,  active: false },
              ].map(({ label, Icon, active }) => (
                <div
                  key={label}
                  className="flex items-center gap-2.5 rounded-[var(--radius-xl)] px-3 py-2.5 text-sm font-semibold cursor-pointer transition"
                  style={
                    active
                      ? { backgroundColor: 'var(--color-nav-item-active-bg)', color: 'var(--color-nav-item-active-fg)' }
                      : { color: 'var(--color-text-secondary)' }
                  }
                >
                  <Icon />
                  {label}
                </div>
              ))}
            </nav>
            <div className="mt-4 border-t border-border-default pt-3">
              <div className="flex items-center gap-2.5 rounded-[var(--radius-xl)] px-3 py-2.5 cursor-pointer transition hover:bg-[var(--color-neutral-100)]">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-neutral-200)] text-xs font-semibold text-text-primary">
                  A
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-text-primary">Admin</p>
                  <p className="truncate text-[10px] text-text-secondary">admin@mycash.app</p>
                </div>
              </div>
            </div>
          </div>
          {/* Collapsed */}
          <div
            className="flex w-16 flex-col items-center rounded-[var(--radius-lg)] border border-border-default py-4"
            style={{ backgroundColor: 'var(--color-bg-surface)' }}
          >
            <div
              className="mb-5 flex h-8 w-8 items-center justify-center rounded-[var(--radius-sm)] text-xs font-bold"
              style={{ backgroundColor: 'var(--color-accent-primary)', color: 'var(--color-nav-item-active-fg)' }}
            >
              M
            </div>
            <nav className="flex flex-1 flex-col items-center gap-1">
              {[
                { Icon: IconHome, active: true },
                { Icon: IconCard, active: false },
                { Icon: IconUser, active: false },
              ].map(({ Icon, active }, i) => (
                <div
                  key={i}
                  className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-xl)] cursor-pointer transition"
                  style={
                    active
                      ? { backgroundColor: 'var(--color-nav-item-active-bg)', color: 'var(--color-nav-item-active-fg)' }
                      : { color: 'var(--color-text-secondary)' }
                  }
                >
                  <Icon />
                </div>
              ))}
            </nav>
          </div>
          <div className="flex flex-col justify-center gap-2 text-xs text-text-secondary">
            <p className="font-semibold text-text-primary">Dois estados:</p>
            <p>• Expandido — 18rem</p>
            <p>• Colapsado — 4.75rem</p>
            <p className="mt-2 font-semibold text-text-primary">Transição:</p>
            <p>• 280ms ease</p>
          </div>
        </div>
      </div>

      {/* Modal Shell */}
      <SectionHeader
        id="org-modal"
        level="organisms"
        title="Modal Shell"
        description="Overlay + container + header. Base reutilizável para todos os modais."
      />
      <div className="mb-10 rounded-[var(--radius-lg)] border border-border-default bg-bg-surface p-5">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="h-11 rounded-full px-5 text-sm font-semibold"
            style={{ backgroundColor: 'var(--color-accent-primary)', color: 'var(--color-nav-item-active-fg)' }}
          >
            Abrir Modal
          </button>
          <div className="text-xs text-text-secondary">
            <p>• Portal no document.body</p>
            <p>• Fechar com Esc ou overlay</p>
            <p>• Scroll do body bloqueado</p>
          </div>
        </div>
      </div>

      {/* Transaction Form */}
      <SectionHeader
        id="org-form"
        level="organisms"
        title="Transaction Form"
        description="Formulário completo de nova transação. Combina Type Toggle + Form Fields + Buttons."
      />
      <div className="mb-10 rounded-[var(--radius-lg)] border border-border-default bg-bg-surface p-5">
        <div className="max-w-sm space-y-4">
          <div className="flex w-full rounded-[var(--radius-md)] border border-border-default p-1">
            {(['income', 'expense'] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setFormType(type)}
                className="flex-1 rounded-[var(--radius-sm)] px-4 py-2 text-sm font-semibold transition"
                style={
                  formType === type
                    ? {
                        backgroundColor: type === 'income' ? 'var(--color-green-100)' : 'var(--color-red-100)',
                        color: type === 'income' ? 'var(--color-feedback-success)' : 'var(--color-feedback-danger)',
                      }
                    : { color: 'var(--color-text-secondary)' }
                }
              >
                {type === 'income' ? '↑ Receita' : '↓ Despesa'}
              </button>
            ))}
          </div>
          <label className="block space-y-1.5">
            <span className="text-sm font-semibold text-text-primary">Descrição</span>
            <input
              placeholder="Ex: Salário, Aluguel..."
              className="h-12 w-full rounded-[var(--radius-md)] border border-border-default bg-bg-surface px-3 text-sm outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)]"
            />
          </label>
          <label className="block space-y-1.5">
            <span className="text-sm font-semibold text-text-primary">Categoria</span>
            <select className="h-12 w-full rounded-[var(--radius-md)] border border-border-default bg-bg-surface px-3 text-sm outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)]">
              <option>Selecionar categoria</option>
              <option>Alimentação</option>
              <option>Moradia</option>
              <option>Transporte</option>
              <option>Saúde</option>
            </select>
          </label>
          <label className="block space-y-1.5">
            <span className="text-sm font-semibold text-text-primary">Valor</span>
            <input
              placeholder="R$ 0,00"
              className="h-12 w-full rounded-[var(--radius-md)] border border-border-default bg-bg-surface px-3 text-sm outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)]"
            />
          </label>
          <div className="flex gap-3 pt-2">
            <button type="button" className="flex-1 h-11 rounded-[var(--radius-md)] border border-border-default bg-bg-surface text-sm font-semibold text-text-primary transition hover:bg-[var(--color-neutral-100)]">
              Cancelar
            </button>
            <button
              type="button"
              className="flex-1 h-11 rounded-full text-sm font-semibold"
              style={{ backgroundColor: 'var(--color-accent-primary)', color: 'var(--color-nav-item-active-fg)' }}
            >
              Salvar
            </button>
          </div>
        </div>
      </div>

      {/* Modal portal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center animate-modal-overlay"
          style={{ backgroundColor: 'var(--color-overlay-scrim)' }}
          onClick={() => setModalOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-[var(--radius-xl)] bg-bg-surface p-6 animate-modal-pop"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-text-primary">Modal Shell</h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border-default text-text-secondary hover:bg-[var(--color-neutral-100)]"
              >
                <IconClose />
              </button>
            </div>
            <div className="space-y-3">
              <div className="rounded-[var(--radius-md)] border border-border-default bg-[var(--color-neutral-100)] p-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-text-secondary mb-1">Estrutura</p>
                <ul className="space-y-1 text-sm text-text-primary">
                  <li>• Overlay: fixed inset-0 z-[150]</li>
                  <li>• Scrim: color-overlay-scrim (42% neutral-1000)</li>
                  <li>• Container: max-w-[640px] · radius-xl</li>
                  <li>• Animação: animate-modal-pop (260ms)</li>
                </ul>
              </div>
            </div>
            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="h-11 rounded-full bg-bg-inverse px-5 text-sm font-semibold text-text-inverse"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ─────────────────────────────────────────────
   Main page
───────────────────────────────────────────── */

export function DesignSystemPage() {
  const [activeSection, setActiveSection] = useState<string>('colors-primitive')
  const [activeLevel, setActiveLevel] = useState<Level>('foundations')
  const mainRef = useRef<HTMLDivElement>(null)

  function scrollTo(id: string) {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setActiveSection(id)
    }
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
            const section = NAV_SECTIONS.find((s) => s.id === entry.target.id)
            if (section) setActiveLevel(section.level)
          }
        }
      },
      { rootMargin: '-20% 0px -70% 0px' },
    )
    NAV_SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  const groupedSections = LEVELS.map((lvl) => ({
    ...lvl,
    sections: NAV_SECTIONS.filter((s) => s.level === lvl.id),
  }))

  return (
    <div className="min-h-screen bg-bg-default font-[var(--font-family-base)]">
      {/* Top bar */}
      <header className="sticky top-0 z-50 border-b border-border-default bg-bg-surface/90 backdrop-blur-sm">
        <div className="flex h-14 items-center gap-4 px-6">
          <div className="flex items-center gap-2.5">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-sm)] text-xs font-bold"
              style={{ backgroundColor: 'var(--color-accent-primary)', color: 'var(--color-nav-item-active-fg)' }}
            >
              M
            </div>
            <span className="text-sm font-bold text-text-primary">Mycash+</span>
            <span className="text-text-secondary">/</span>
            <span className="text-sm font-semibold text-text-secondary">Design System</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <ThemeSwitch />
            {LEVELS.map((lvl) => (
              <button
                key={lvl.id}
                type="button"
                onClick={() => {
                  const first = NAV_SECTIONS.find((s) => s.level === lvl.id)
                  if (first) scrollTo(first.id)
                }}
                className="hidden rounded-full px-3 py-1 text-xs font-semibold transition sm:inline-flex"
                style={{
                  backgroundColor: activeLevel === lvl.id ? lvl.color + '22' : 'transparent',
                  color: activeLevel === lvl.id
                    ? lvl.id === 'organisms' ? '#737a00' : lvl.color
                    : 'var(--color-text-secondary)',
                }}
              >
                {lvl.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar navigation */}
        <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-60 shrink-0 overflow-y-auto border-r border-border-default bg-bg-surface py-6 lg:block no-scrollbar">
          <div className="px-4">
            {groupedSections.map((grp) => (
              <div key={grp.id} className="mb-5">
                <div className="mb-1.5 flex items-center gap-2 px-2">
                  <div
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: grp.color }}
                  />
                  <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-text-secondary">
                    {grp.label}
                  </p>
                </div>
                <div className="space-y-0.5">
                  {grp.sections.map((sec) => (
                    <button
                      key={sec.id}
                      type="button"
                      onClick={() => scrollTo(sec.id)}
                      className="flex w-full items-center gap-2 rounded-[var(--radius-sm)] px-3 py-2 text-left text-sm transition"
                      style={
                        activeSection === sec.id
                          ? {
                              backgroundColor: grp.color + '18',
                              color: grp.id === 'organisms' ? '#737a00' : grp.color,
                              fontWeight: 600,
                            }
                          : { color: 'var(--color-text-secondary)' }
                      }
                    >
                      {sec.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Main content */}
        <main ref={mainRef} className="flex-1 min-w-0 px-6 py-10 lg:px-10">
          <div className="mx-auto max-w-3xl">
            {/* Hero */}
            <div className="mb-14">
              <div className="mb-3 flex items-center gap-2">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-[var(--radius-md)] text-lg font-black"
                  style={{ backgroundColor: 'var(--color-accent-primary)', color: 'var(--color-nav-item-active-fg)' }}
                >
                  DS
                </div>
                <div>
                  <h1 className="text-2xl font-black text-text-primary">Mycash+ Design System</h1>
                  <p className="text-sm text-text-secondary">
                    Taxonomia baseada em Atomic Design · Fundamentos → Átomos → Moléculas → Organismos
                  </p>
                </div>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {LEVELS.map((lvl) => (
                  <button
                    key={lvl.id}
                    type="button"
                    onClick={() => {
                      const first = NAV_SECTIONS.find((s) => s.level === lvl.id)
                      if (first) scrollTo(first.id)
                    }}
                    className="rounded-[var(--radius-lg)] border p-4 text-left transition hover:shadow-sm"
                    style={{ borderColor: lvl.color + '44', backgroundColor: lvl.color + '0d' }}
                  >
                    <div
                      className="mb-2 flex h-8 w-8 items-center justify-center rounded-[var(--radius-sm)] text-xs font-bold"
                      style={{ backgroundColor: lvl.color, color: lvl.id === 'organisms' ? '#111827' : '#fff' }}
                    >
                      {lvl.label[0]}
                    </div>
                    <p className="text-sm font-bold text-text-primary">{lvl.label}</p>
                    <p className="mt-0.5 text-xs text-text-secondary">
                      {NAV_SECTIONS.filter((s) => s.level === lvl.id).length} seções
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <FoundationsSection />
            <div className="my-12 h-px bg-border-default" />
            <AtomsSection />
            <div className="my-12 h-px bg-border-default" />
            <MoleculesSection />
            <div className="my-12 h-px bg-border-default" />
            <OrganismsSection />
          </div>

          <footer className="mx-auto mt-16 max-w-3xl border-t border-border-default pt-6 text-center">
            <p className="text-xs text-text-secondary">
              Mycash+ Design System · Atomic Design · Atualizado em{' '}
              {new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
            </p>
          </footer>
        </main>
      </div>
    </div>
  )
}
