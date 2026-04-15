import type { Transaction } from '../types/finance'

export type TransactionTypeFilter = 'all' | 'income' | 'expense'

export type DateRange = {
  startDate: string
  endDate: string
}

export type FinanceFilters = {
  selectedMemberId: string | null
  dateRange: DateRange
  transactionType: TransactionTypeFilter
  searchText: string
}

function matchesSearch(t: Transaction, searchText: string): boolean {
  const q = searchText.trim().toLowerCase()
  if (!q) return true
  return (
    t.description.toLowerCase().includes(q) ||
    t.category.toLowerCase().includes(q)
  )
}

/** Membro + período + busca (sem filtro de tipo de transação). */
export function applyBaseTransactionFilters(
  transactions: Transaction[],
  filters: Pick<FinanceFilters, 'selectedMemberId' | 'dateRange' | 'searchText'>,
): Transaction[] {
  return transactions.filter((t) => {
    if (
      filters.selectedMemberId &&
      t.memberId !== filters.selectedMemberId
    ) {
      return false
    }
    if (t.date < filters.dateRange.startDate || t.date > filters.dateRange.endDate) {
      return false
    }
    if (!matchesSearch(t, filters.searchText)) return false
    return true
  })
}

/** Todos os filtros ativos, inclusive tipo (receita/despesa/todos). */
export function applyTransactionFilters(
  transactions: Transaction[],
  filters: FinanceFilters,
): Transaction[] {
  return applyBaseTransactionFilters(transactions, filters).filter((t) => {
    if (filters.transactionType === 'income' && t.type !== 'income') {
      return false
    }
    if (filters.transactionType === 'expense' && t.type !== 'expense') {
      return false
    }
    return true
  })
}
