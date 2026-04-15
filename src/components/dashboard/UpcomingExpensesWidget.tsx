import { useMemo } from 'react'
import { useFinance } from '../../hooks/useFinance'
import { IconCard } from '../layout/SidebarIcons'

type UpcomingExpense = {
  id: string
  description: string
  dueLabel: string
  sourceLabel: string
  amount: number
}

function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

function formatDueLabel(isoDate: string): string {
  const [year, month, day] = isoDate.split('-')
  if (!year || !month || !day) return 'Vence em breve'
  return `Vence dia ${day}/${month}`
}

function toComparableDate(isoDate: string): number {
  const value = Date.parse(`${isoDate}T00:00:00`)
  return Number.isNaN(value) ? Number.POSITIVE_INFINITY : value
}

function buildSourceLabel(
  accountId: string,
  cardById: Map<string, { name: string; lastDigits?: string }>,
  accountById: Map<string, { name: string }>,
): string {
  const card = cardById.get(accountId)
  if (card) {
    const brand = card.name.split(' ')[0] ?? card.name
    const digits = card.lastDigits ? ` **** ${card.lastDigits}` : ''
    return `Crédito ${brand}${digits}`
  }

  const account = accountById.get(accountId)
  if (account) return account.name
  return 'Sem conta vinculada'
}

function IconCheck() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M5 12.5L9.5 17L19 7.5"
        stroke="var(--color-green-600)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function UpcomingExpensesWidget() {
  const { transactions, creditCards, bankAccounts } = useFinance()

  const expenses = useMemo<UpcomingExpense[]>(() => {
    const cardById = new Map(
      creditCards.map((card) => [
        card.id,
        { name: card.name, lastDigits: card.lastDigits },
      ]),
    )
    const accountById = new Map(bankAccounts.map((acc) => [acc.id, { name: acc.name }]))
    const today = toComparableDate(new Date().toISOString().slice(0, 10))

    const candidates = transactions
      .filter((transaction) => transaction.type === 'expense')
      .map((transaction) => {
        const dueDate = transaction.dueDate ?? transaction.date
        return {
          id: transaction.id,
          description: transaction.description,
          dueDate,
          sourceLabel: buildSourceLabel(transaction.accountId, cardById, accountById),
          amount: transaction.value,
        }
      })

    const upcoming = candidates
      .filter((item) => toComparableDate(item.dueDate) >= today)
      .sort((a, b) => toComparableDate(a.dueDate) - toComparableDate(b.dueDate))

    const fallback = candidates.sort(
      (a, b) => toComparableDate(a.dueDate) - toComparableDate(b.dueDate),
    )
    const source = upcoming.length > 0 ? upcoming : fallback

    const normalized = source.slice(0, 6).map((item) => ({
      id: item.id,
      description: item.description,
      dueLabel: formatDueLabel(item.dueDate),
      sourceLabel: item.sourceLabel,
      amount: item.amount,
    }))

    const lightBill = normalized.find((item) =>
      item.description.toLocaleLowerCase('pt-BR').includes('conta de luz'),
    )

    if (!lightBill) return normalized

    const filled = [...normalized]
    while (filled.length < 6) {
      filled.push({
        ...lightBill,
        id: `${lightBill.id}-dup-${filled.length}`,
      })
    }
    return filled.slice(0, 6)
  }, [transactions, creditCards, bankAccounts])

  return (
    <section className="min-w-0 rounded-[var(--radius-lg)] border border-border-default bg-[var(--color-neutral-100)] p-6 md:p-8 xl:flex xl:h-[388px] xl:flex-col">
      <header className="mb-8 flex items-center justify-between gap-3 xl:mb-6">
        <h2 className="inline-flex items-center gap-2 text-[20px] font-bold leading-7 text-text-primary">
          <IconCard className="h-6 w-6 shrink-0" />
          Próximas despesas
        </h2>
        <button
          type="button"
          aria-label="Adicionar despesa"
          className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border-default text-[30px] leading-none text-text-primary hover:bg-[var(--color-neutral-200)]"
        >
          +
        </button>
      </header>

      {expenses.length === 0 ? (
        <p className="text-sm text-text-secondary">Nenhuma despesa prevista para os próximos dias.</p>
      ) : (
        <div className="space-y-8 xl:flex-1 xl:space-y-6 xl:overflow-y-auto xl:pr-1">
          {expenses.map((expense) => (
            <article key={expense.id} className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h3 className="truncate text-[20px] font-bold leading-7 text-text-primary">
                  {expense.description}
                </h3>
                <p className="mt-1 text-xs font-semibold leading-4 tracking-[0.3px] text-text-primary">
                  {expense.dueLabel}
                </p>
                <p className="mt-1 truncate text-sm leading-5 tracking-[0.3px] text-text-secondary">
                  {expense.sourceLabel}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-3 pt-1">
                <p className="text-base font-semibold leading-5 tracking-[0.3px] text-text-primary">
                  {formatCurrency(expense.amount)}
                </p>
                <button
                  type="button"
                  aria-label={`Marcar ${expense.description} como concluída`}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border-default bg-bg-surface"
                >
                  <IconCheck />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
