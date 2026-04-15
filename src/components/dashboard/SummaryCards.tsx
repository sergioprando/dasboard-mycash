import { useMemo } from 'react'
import type { Transaction } from '../../types'
import { useAnimatedNumber } from '../../hooks/useAnimatedNumber'

function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

function ArrowTrendIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M4 16l7-7 4 4 5-5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconIncome() {
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
        d="M6 8h10v10M16 8L6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconExpense() {
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
        d="M18 16H8V6M8 16l10-10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

type SummaryCardsProps = {
  totalBalance: number
  totalIncome: number
  totalExpense: number
  filteredTransactions: Transaction[]
}

function BalanceCard({
  totalBalance,
  growthPercent,
}: {
  totalBalance: number
  growthPercent: number
}) {
  const animatedBalance = useAnimatedNumber(totalBalance, 800)
  const roundedGrowth = Number(growthPercent.toFixed(1))
  const growthSignal = roundedGrowth >= 0 ? '+' : ''

  return (
    <article className="relative overflow-hidden rounded-[var(--radius-lg)] bg-[var(--color-card-balance-bg)] p-5 text-[var(--color-card-balance-fg)] md:p-6">
      <div
        className="pointer-events-none absolute -right-14 -top-16 h-52 w-52 rounded-full blur-3xl"
        style={{ backgroundColor: 'var(--color-card-balance-glow)' }}
        aria-hidden
      />
      <p className="relative text-xs font-medium text-[var(--color-card-balance-label)]">
        Saldo Total
      </p>
      <p className="relative mt-2 text-[30px] font-bold leading-none md:text-[36px]">
        {formatCurrency(animatedBalance)}
      </p>
      <div className="relative mt-4 inline-flex items-center gap-1.5 rounded-full bg-[var(--color-card-balance-badge-bg)] px-3 py-1 text-xs font-medium">
        <ArrowTrendIcon />
        <span>
          {growthSignal}
          {roundedGrowth}% esse mes
        </span>
      </div>
    </article>
  )
}

function IncomeCard({ totalIncome }: { totalIncome: number }) {
  const animatedIncome = useAnimatedNumber(totalIncome, 800)
  return (
    <article className="rounded-[var(--radius-lg)] border border-border-default bg-bg-surface p-5 md:p-6">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-text-primary">Receitas</p>
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-card-income-icon-bg)] text-[var(--color-feedback-success)]">
          <IconIncome />
        </span>
      </div>
      <p className="mt-5 text-[28px] font-bold leading-none text-text-primary">
        {formatCurrency(animatedIncome)}
      </p>
    </article>
  )
}

function ExpenseCard({ totalExpense }: { totalExpense: number }) {
  const animatedExpense = useAnimatedNumber(totalExpense, 800)
  return (
    <article className="rounded-[var(--radius-lg)] border border-border-default bg-bg-surface p-5 md:p-6">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-text-secondary">Despesas</p>
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-card-expense-icon-bg)] text-[var(--color-feedback-danger)]">
          <IconExpense />
        </span>
      </div>
      <p className="mt-5 text-[28px] font-bold leading-none text-text-primary">
        {formatCurrency(animatedExpense)}
      </p>
    </article>
  )
}

function calculateGrowthFromLast30Days(
  totalBalance: number,
  filteredTransactions: Transaction[],
): number {
  const now = new Date()
  const last30Start = new Date(now)
  last30Start.setDate(now.getDate() - 30)
  const last30Iso = last30Start.toISOString().slice(0, 10)
  const todayIso = now.toISOString().slice(0, 10)

  const netLast30 = filteredTransactions
    .filter((t) => t.date >= last30Iso && t.date <= todayIso)
    .reduce((sum, t) => sum + (t.type === 'income' ? t.value : -t.value), 0)

  const previousBalance = totalBalance - netLast30
  if (previousBalance === 0) {
    return netLast30 === 0 ? 0 : 100
  }
  return (netLast30 / Math.abs(previousBalance)) * 100
}

export function SummaryCards({
  totalBalance,
  totalIncome,
  totalExpense,
  filteredTransactions,
}: SummaryCardsProps) {
  const growthPercent = useMemo(
    () => calculateGrowthFromLast30Days(totalBalance, filteredTransactions),
    [totalBalance, filteredTransactions],
  )

  return (
    <section className="grid grid-cols-1 gap-4 lg:grid-cols-[1.15fr_1fr_1fr]">
      <BalanceCard totalBalance={totalBalance} growthPercent={growthPercent} />
      <IncomeCard totalIncome={totalIncome} />
      <ExpenseCard totalExpense={totalExpense} />
    </section>
  )
}
