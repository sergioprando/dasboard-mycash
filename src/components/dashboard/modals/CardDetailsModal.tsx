import { useMemo } from 'react'
import { useFinance } from '../../../hooks/useFinance'
import type { CreditCard } from '../../../types'
import { ModalShell } from './ModalShell'

type CardDetailsModalProps = {
  card: CreditCard
  onClose: () => void
}

function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

export function CardDetailsModal({ card, onClose }: CardDetailsModalProps) {
  const { transactions } = useFinance()

  const expenses = useMemo(
    () =>
      transactions
        .filter((transaction) => transaction.type === 'expense' && transaction.accountId === card.id)
        .sort((a, b) => (a.date < b.date ? 1 : -1))
        .slice(0, 8),
    [transactions, card.id],
  )

  const usagePercent = Math.round((card.currentBill / card.limit) * 100)

  return (
    <ModalShell title={card.name} onClose={onClose}>
      <p className="mb-4 text-sm text-text-secondary">Cartão de crédito</p>
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
    </ModalShell>
  )
}
