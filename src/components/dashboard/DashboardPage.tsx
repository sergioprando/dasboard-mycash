import { useFinance } from '../../hooks/useFinance'
import { CreditCardsWidget } from './CreditCardsWidget'
import { DashboardHeader } from './DashboardHeader'
import { DetailedStatementWidget } from './DetailedStatementWidget'
import { ExpensesByCategoryCarousel } from './ExpensesByCategoryCarousel'
import { FinancialFlowChart } from './FinancialFlowChart'
import { SummaryCards } from './SummaryCards'
import { UpcomingExpensesWidget } from './UpcomingExpensesWidget'

export function DashboardPage() {
  const finance = useFinance()
  const filtered = finance.getFilteredTransactions()
  const balance = finance.calculateTotalBalance()
  const income = finance.calculateIncomeForPeriod()
  const expense = finance.calculateExpensesForPeriod()

  return (
    <section className="animate-page-in space-y-4">
      <DashboardHeader />
      <div className="animate-card-in grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)]">
        <div className="animate-card-in min-w-0 space-y-4">
          <ExpensesByCategoryCarousel />
          <SummaryCards
            totalBalance={balance}
            totalIncome={income}
            totalExpense={expense}
            filteredTransactions={filtered}
          />
        </div>
        <div className="animate-card-in min-w-0">
          <CreditCardsWidget />
        </div>
      </div>

      <div className="animate-card-in grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)]">
        <div className="animate-card-in min-w-0">
          <FinancialFlowChart />
        </div>
        <UpcomingExpensesWidget />
      </div>
      <DetailedStatementWidget />
    </section>
  )
}
