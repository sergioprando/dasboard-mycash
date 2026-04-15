import { useEffect, useMemo, useState } from 'react'
import { useFinance } from '../../hooks/useFinance'
import type { CreditCard } from '../../types'

const PAGE_SIZE = 3

function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

function iconBackgroundForTheme(theme: CreditCard['theme']): string {
  if (theme === 'black') return 'var(--color-neutral-1000)'
  if (theme === 'lime') return 'var(--color-accent-primary)'
  return 'var(--color-neutral-0)'
}

function iconForegroundForTheme(theme: CreditCard['theme']): string {
  if (theme === 'black') return 'var(--color-neutral-0)'
  return 'var(--color-neutral-1000)'
}

function badgeClassForTheme(theme: CreditCard['theme']): string {
  if (theme === 'black') return 'bg-[var(--color-neutral-1000)] text-[var(--color-neutral-0)]'
  if (theme === 'lime') return 'bg-[var(--color-accent-primary)] text-[var(--color-neutral-1000)]'
  return 'bg-[var(--color-neutral-200)] text-[var(--color-neutral-1000)]'
}

function CardGlyph({ color }: { color: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="2.5"
        y="6"
        width="19"
        height="12"
        rx="2.5"
        stroke={color}
        strokeWidth="1.8"
      />
      <path d="M2.5 10.2h19" stroke={color} strokeWidth="1.8" />
    </svg>
  )
}

function CardDetailsModal({
  card,
  onClose,
}: {
  card: CreditCard
  onClose: () => void
}) {
  const { transactions } = useFinance()

  useEffect(() => {
    const onEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onEsc)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onEsc)
    }
  }, [onClose])

  const expenses = useMemo(
    () =>
      transactions
        .filter((t) => t.type === 'expense' && t.accountId === card.id)
        .sort((a, b) => (a.date < b.date ? 1 : -1))
        .slice(0, 8),
    [transactions, card.id],
  )

  const usagePercent = Math.round((card.currentBill / card.limit) * 100)

  return (
    <div className="fixed inset-0 z-[140] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-[var(--color-overlay-scrim)]"
        onClick={onClose}
        aria-label="Fechar detalhes do cartão"
      />
      <div className="relative z-10 w-full max-w-[640px] rounded-[var(--radius-lg)] border border-border-default bg-bg-surface p-5 shadow-[var(--shadow-sidebar-toggle)]">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-text-primary">{card.name}</h3>
            <p className="text-sm text-text-secondary">Cartão de crédito</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="h-9 w-9 rounded-full border border-border-default text-text-secondary"
            aria-label="Fechar"
          >
            ✕
          </button>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-3">
          <div className="rounded-[var(--radius-md)] border border-border-default p-3">
            <p className="text-xs text-text-secondary">Limite total</p>
            <p className="mt-1 text-sm font-semibold text-text-primary">{formatCurrency(card.limit)}</p>
          </div>
          <div className="rounded-[var(--radius-md)] border border-border-default p-3">
            <p className="text-xs text-text-secondary">Fatura atual</p>
            <p className="mt-1 text-sm font-semibold text-text-primary">{formatCurrency(card.currentBill)}</p>
          </div>
          <div className="rounded-[var(--radius-md)] border border-border-default p-3">
            <p className="text-xs text-text-secondary">Uso</p>
            <p className="mt-1 text-sm font-semibold text-text-primary">{usagePercent}%</p>
          </div>
        </div>

        <div className="rounded-[var(--radius-md)] border border-border-default p-3">
          <p className="mb-2 text-sm font-semibold text-text-primary">Despesas recentes</p>
          {expenses.length === 0 ? (
            <p className="text-sm text-text-secondary">Nenhuma despesa registrada neste cartão.</p>
          ) : (
            <ul className="space-y-2">
              {expenses.map((tx) => (
                <li key={tx.id} className="flex items-center justify-between text-sm">
                  <span className="truncate text-text-primary">{tx.description}</span>
                  <span className="font-semibold text-text-primary">{formatCurrency(tx.value)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

export function CreditCardsWidget() {
  const { creditCards } = useFinance()
  const [page, setPage] = useState(0)
  const [selectedCard, setSelectedCard] = useState<CreditCard | null>(null)

  const totalPages = Math.max(1, Math.ceil(creditCards.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages - 1)
  const visibleCards = creditCards.slice(
    safePage * PAGE_SIZE,
    safePage * PAGE_SIZE + PAGE_SIZE,
  )

  useEffect(() => {
    if (page > totalPages - 1) {
      setPage(Math.max(0, totalPages - 1))
    }
  }, [page, totalPages])

  return (
    <>
      <section className="rounded-[var(--radius-lg)] border border-border-default bg-[var(--color-neutral-100)] p-4 md:p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="inline-flex items-center gap-2 text-[26px] font-semibold text-text-primary md:text-lg">
            <span aria-hidden>💳</span>
            Cards & contas
          </h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border-default bg-bg-surface text-lg leading-none hover:bg-[var(--color-neutral-200)]"
              aria-label="Adicionar novo cartão"
            >
              +
            </button>
            <button
              type="button"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border-default bg-bg-surface text-base hover:bg-[var(--color-neutral-200)]"
              aria-label="Avançar cartões"
            >
              →
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {visibleCards.map((card) => {
            const usagePercent = Math.round((card.currentBill / card.limit) * 100)
            const bankLabel = card.name.split(' ')[0]
            const masked = card.lastDigits ? `•••• ${card.lastDigits}` : '•••• ----'
            return (
              <button
                key={card.id}
                type="button"
                onClick={() => setSelectedCard(card)}
                className="group flex w-full items-center gap-3 rounded-[var(--radius-md)] border border-border-default bg-bg-surface p-3 text-left transition duration-200 hover:-translate-y-1 hover:shadow-[var(--shadow-sidebar-toggle)]"
              >
                <span
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] border border-border-default"
                  style={{
                    backgroundColor: iconBackgroundForTheme(card.theme),
                  }}
                >
                  <CardGlyph color={iconForegroundForTheme(card.theme)} />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block truncate text-xs text-text-secondary">{bankLabel}</span>
                  <span className="block text-[34px] font-bold leading-none text-text-primary md:text-[32px]">
                    {formatCurrency(card.currentBill)}
                  </span>
                  <span className="block text-xs text-text-secondary">{masked}</span>
                </span>

                <span className="shrink-0 text-right">
                  <span
                    className={`inline-flex min-w-[52px] items-center justify-center rounded-full px-2 py-1 text-xs font-semibold ${badgeClassForTheme(card.theme)}`}
                  >
                    {usagePercent}%
                  </span>
                  <span className="mt-2 block text-xs text-text-secondary">
                    Vence dia {card.dueDay}
                  </span>
                </span>
              </button>
            )
          })}
        </div>

        {totalPages > 1 ? (
          <div className="mt-4 flex items-center justify-between text-xs text-text-secondary">
            <button
              type="button"
              disabled={safePage === 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              className="rounded-full border border-border-default px-3 py-1 disabled:opacity-40"
            >
              Anterior
            </button>
            <span>
              Página {safePage + 1} de {totalPages}
            </span>
            <button
              type="button"
              disabled={safePage >= totalPages - 1}
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              className="rounded-full border border-border-default px-3 py-1 disabled:opacity-40"
            >
              Próxima
            </button>
          </div>
        ) : null}
      </section>

      {selectedCard ? (
        <CardDetailsModal card={selectedCard} onClose={() => setSelectedCard(null)} />
      ) : null}
    </>
  )
}
