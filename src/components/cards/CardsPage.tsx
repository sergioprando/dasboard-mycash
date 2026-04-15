import { useMemo, useState } from 'react'
import { useFinance } from '../../hooks/useFinance'
import type { CreditCard } from '../../types'
import { AddCreditCardModal } from '../dashboard/modals/AddCreditCardModal'
import { CardDetailsModal } from '../dashboard/modals/CardDetailsModal'

function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

function themeClass(theme: CreditCard['theme']): string {
  if (theme === 'black') return 'bg-[var(--color-neutral-1000)] text-[var(--color-neutral-0)]'
  if (theme === 'lime') return 'bg-[var(--color-accent-primary)] text-[var(--color-neutral-1000)]'
  return 'bg-[var(--color-neutral-0)] text-[var(--color-neutral-1000)]'
}

export function CardsPage() {
  const { creditCards, transactions, familyMembers } = useFinance()
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedCard, setSelectedCard] = useState<CreditCard | null>(null)

  const summary = useMemo(() => {
    const totalLimit = creditCards.reduce((sum, card) => sum + card.limit, 0)
    const totalBill = creditCards.reduce((sum, card) => sum + card.currentBill, 0)
    const usagePercent = totalLimit > 0 ? Math.round((totalBill / totalLimit) * 100) : 0
    return { totalLimit, totalBill, usagePercent }
  }, [creditCards])

  const recentByCard = useMemo(() => {
    return creditCards.map((card) => ({
      cardId: card.id,
      cardName: card.name,
      items: transactions
        .filter((tx) => tx.type === 'expense' && tx.accountId === card.id)
        .sort((a, b) => (a.date < b.date ? 1 : -1))
        .slice(0, 4),
    }))
  }, [creditCards, transactions])

  return (
    <>
      <section className="space-y-4">
        <header className="rounded-[var(--radius-lg)] border border-border-default bg-bg-surface p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-text-primary">Cartões e contas</h1>
              <p className="mt-1 text-sm text-text-secondary">
                Gestão completa dos cartões da família, limites e despesas recentes.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="h-11 rounded-full bg-bg-inverse px-5 text-sm font-semibold text-text-inverse"
            >
              + Adicionar cartão
            </button>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <div className="rounded-[var(--radius-md)] border border-border-default bg-[var(--color-neutral-100)] p-4">
              <p className="text-xs text-text-secondary">Limite total</p>
              <p className="mt-1 text-xl font-semibold text-text-primary">
                {formatCurrency(summary.totalLimit)}
              </p>
            </div>
            <div className="rounded-[var(--radius-md)] border border-border-default bg-[var(--color-neutral-100)] p-4">
              <p className="text-xs text-text-secondary">Fatura consolidada</p>
              <p className="mt-1 text-xl font-semibold text-text-primary">
                {formatCurrency(summary.totalBill)}
              </p>
            </div>
            <div className="rounded-[var(--radius-md)] border border-border-default bg-[var(--color-neutral-100)] p-4">
              <p className="text-xs text-text-secondary">Uso médio de limite</p>
              <p className="mt-1 text-xl font-semibold text-text-primary">{summary.usagePercent}%</p>
            </div>
          </div>
        </header>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
          <section className="rounded-[var(--radius-lg)] border border-border-default bg-bg-surface p-6">
            <h2 className="mb-4 text-lg font-semibold text-text-primary">Meus cartões</h2>
            <div className="grid gap-3 md:grid-cols-2">
              {creditCards.map((card) => {
                const holder = familyMembers.find((member) => member.id === card.holderId)
                const usagePercent = Math.round((card.currentBill / card.limit) * 100)
                return (
                  <button
                    key={card.id}
                    type="button"
                    onClick={() => setSelectedCard(card)}
                    className={`rounded-[var(--radius-md)] border border-border-default p-4 text-left transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-sidebar-toggle)] ${themeClass(card.theme)}`}
                  >
                    <p className="text-sm font-semibold">{card.name}</p>
                    <p className="mt-1 text-xs opacity-80">Titular: {holder?.name ?? 'Não informado'}</p>
                    <p className="mt-4 text-2xl font-bold">{formatCurrency(card.currentBill)}</p>
                    <div className="mt-3 flex items-center justify-between text-xs">
                      <span>Limite: {formatCurrency(card.limit)}</span>
                      <span>{usagePercent}%</span>
                    </div>
                  </button>
                )
              })}
            </div>
          </section>

          <section className="rounded-[var(--radius-lg)] border border-border-default bg-bg-surface p-6">
            <h2 className="mb-4 text-lg font-semibold text-text-primary">Despesas recentes por cartão</h2>
            <div className="space-y-4">
              {recentByCard.map((cardGroup) => (
                <article key={cardGroup.cardId} className="rounded-[var(--radius-md)] border border-border-default p-3">
                  <h3 className="text-sm font-semibold text-text-primary">{cardGroup.cardName}</h3>
                  {cardGroup.items.length === 0 ? (
                    <p className="mt-2 text-xs text-text-secondary">Sem despesas registradas.</p>
                  ) : (
                    <ul className="mt-2 space-y-2">
                      {cardGroup.items.map((item) => (
                        <li key={item.id} className="flex items-center justify-between text-xs">
                          <span className="truncate text-text-primary">{item.description}</span>
                          <span className="font-semibold text-text-primary">
                            {formatCurrency(item.value)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </article>
              ))}
            </div>
          </section>
        </div>
      </section>

      {showAddModal ? <AddCreditCardModal onClose={() => setShowAddModal(false)} /> : null}
      {selectedCard ? (
        <CardDetailsModal card={selectedCard} onClose={() => setSelectedCard(null)} />
      ) : null}
    </>
  )
}
