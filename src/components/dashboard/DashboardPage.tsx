import { useFinance } from '../../hooks/useFinance'
import { DashboardHeader } from './DashboardHeader'
import { ExpensesByCategoryCarousel } from './ExpensesByCategoryCarousel'
import { FinancialFlowChart } from './FinancialFlowChart'
import { SummaryCards } from './SummaryCards'

export function DashboardPage() {
  const finance = useFinance()
  const filtered = finance.getFilteredTransactions()
  const balance = finance.calculateTotalBalance()
  const income = finance.calculateIncomeForPeriod()
  const expense = finance.calculateExpensesForPeriod()

  return (
    <section className="space-y-4">
      <DashboardHeader />
      <ExpensesByCategoryCarousel />
      <SummaryCards
        totalBalance={balance}
        totalIncome={income}
        totalExpense={expense}
        filteredTransactions={filtered}
      />
      <FinancialFlowChart />
      <div className="rounded-[var(--radius-lg)] border border-border-default bg-bg-surface p-6">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="mt-2 text-sm text-text-secondary">
          Estrutura base pronta para receber os widgets da primeira pagina.
        </p>
        <p className="mt-4 text-sm text-text-secondary">
          Contexto financeiro:{' '}
          <span className="font-medium text-text-primary">
            {filtered.length} lançamentos filtrados
          </span>
          {' · '}
          <span className="font-medium text-text-primary">
            Saldo agregado{' '}
            {balance.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            })}
          </span>
        </p>
      </div>
    </section>
  )
}
