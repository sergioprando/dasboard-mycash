import type { Transaction } from '../types/finance'
import {
  applyBaseTransactionFilters,
  applyTransactionFilters,
  type FinanceFilters,
} from './financeFilters'

export function calculateTotalBalance(
  transactions: Transaction[],
  filters: FinanceFilters,
): number {
  return applyTransactionFilters(transactions, filters).reduce(
    (sum, t) => sum + (t.type === 'income' ? t.value : -t.value),
    0,
  )
}

export function calculateIncomeForPeriod(
  transactions: Transaction[],
  filters: FinanceFilters,
): number {
  return applyTransactionFilters(transactions, filters)
    .filter((t) => t.type === 'income')
    .reduce((s, t) => s + t.value, 0)
}

export function calculateExpensesForPeriod(
  transactions: Transaction[],
  filters: FinanceFilters,
): number {
  return applyTransactionFilters(transactions, filters)
    .filter((t) => t.type === 'expense')
    .reduce((s, t) => s + t.value, 0)
}

export type CategoryExpenseRow = {
  category: string
  total: number
}

export function calculateExpensesByCategory(
  transactions: Transaction[],
  filters: FinanceFilters,
): CategoryExpenseRow[] {
  const map = new Map<string, number>()
  for (const t of applyTransactionFilters(transactions, filters)) {
    if (t.type !== 'expense') continue
    map.set(t.category, (map.get(t.category) ?? 0) + t.value)
  }
  return [...map.entries()]
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total)
}

export function calculateCategoryPercentage(
  categoryTotal: number,
  totalIncome: number,
): number {
  if (totalIncome <= 0) return 0
  return Math.round((categoryTotal / totalIncome) * 1000) / 10
}

/** Receita total no período base (membro, datas, busca), ignorando filtro de tipo. */
export function calculateTotalIncomeBase(
  transactions: Transaction[],
  filters: FinanceFilters,
): number {
  return applyBaseTransactionFilters(transactions, filters)
    .filter((t) => t.type === 'income')
    .reduce((s, t) => s + t.value, 0)
}

export function calculateSavingsRate(
  transactions: Transaction[],
  filters: FinanceFilters,
): number {
  const income = calculateTotalIncomeBase(transactions, filters)
  const expense = applyBaseTransactionFilters(transactions, filters)
    .filter((t) => t.type === 'expense')
    .reduce((s, t) => s + t.value, 0)
  if (income <= 0) return 0
  return Math.round(((income - expense) / income) * 1000) / 10
}
