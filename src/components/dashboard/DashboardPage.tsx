import { useFinance } from '../../hooks/useFinance'
import { CreditCardsWidget } from './CreditCardsWidget'
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
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)]">
        <div className="min-w-0 space-y-4">
          <ExpensesByCategoryCarousel />
          <SummaryCards
            totalBalance={balance}
            totalIncome={income}
            totalExpense={expense}
            filteredTransactions={filtered}
          />
        </div>
        <div className="min-w-0">
          <CreditCardsWidget />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)]">
        <div className="min-w-0">
          <FinancialFlowChart />
        </div>
        <div className="min-w-0 rounded-[var(--radius-lg)] border border-border-default bg-bg-surface p-6">
          <h2 className="text-lg font-semibold text-text-primary">Próximas despesas</h2>
          <p className="mt-2 text-sm text-text-secondary">
            Widget será implementado no Prompt 10.
          </p>
        </div>
      </div>
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
