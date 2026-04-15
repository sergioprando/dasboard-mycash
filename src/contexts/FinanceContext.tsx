import { createContext, type ReactNode, useCallback, useMemo, useState } from 'react'
import type {
  BankAccount,
  CreditCard,
  FamilyMember,
  Goal,
  Transaction,
} from '../types/finance'
import type { DateRange, TransactionTypeFilter } from '../utils/financeFilters'
import { applyTransactionFilters } from '../utils/financeFilters'
import {
  calculateCategoryPercentage,
  calculateExpensesByCategory,
  calculateExpensesForPeriod,
  calculateIncomeForPeriod,
  calculateSavingsRate,
  calculateTotalBalance,
  calculateTotalIncomeBase,
  type CategoryExpenseRow,
} from '../utils/financeMetrics'
import {
  MOCK_BANK_ACCOUNTS,
  MOCK_CREDIT_CARDS,
  MOCK_FAMILY_MEMBERS,
  MOCK_GOALS,
  MOCK_TRANSACTIONS,
} from './financeMockSeed'

export type FinanceContextValue = {
  transactions: Transaction[]
  goals: Goal[]
  creditCards: CreditCard[]
  bankAccounts: BankAccount[]
  familyMembers: FamilyMember[]
  selectedMemberId: string | null
  dateRange: DateRange
  transactionType: TransactionTypeFilter
  searchText: string
  setSelectedMemberId: (id: string | null) => void
  setDateRange: (range: DateRange) => void
  setTransactionType: (t: TransactionTypeFilter) => void
  setSearchText: (text: string) => void
  addTransaction: (t: Transaction) => void
  updateTransaction: (id: string, patch: Partial<Transaction>) => void
  deleteTransaction: (id: string) => void
  addGoal: (g: Goal) => void
  updateGoal: (id: string, patch: Partial<Goal>) => void
  deleteGoal: (id: string) => void
  addCreditCard: (c: CreditCard) => void
  updateCreditCard: (id: string, patch: Partial<CreditCard>) => void
  deleteCreditCard: (id: string) => void
  addBankAccount: (a: BankAccount) => void
  updateBankAccount: (id: string, patch: Partial<BankAccount>) => void
  deleteBankAccount: (id: string) => void
  addFamilyMember: (m: FamilyMember) => void
  updateFamilyMember: (id: string, patch: Partial<FamilyMember>) => void
  deleteFamilyMember: (id: string) => void
  getFilteredTransactions: () => Transaction[]
  calculateTotalBalance: () => number
  calculateIncomeForPeriod: () => number
  calculateExpensesForPeriod: () => number
  calculateExpensesByCategory: () => CategoryExpenseRow[]
  calculateCategoryPercentage: (categoryTotal: number) => number
  calculateSavingsRate: () => number
}

export const FinanceContext = createContext<FinanceContextValue | null>(null)

const defaultDateRange: DateRange = {
  startDate: '2026-01-01',
  endDate: '2026-04-30',
}

function buildFilters(
  selectedMemberId: string | null,
  dateRange: DateRange,
  transactionType: TransactionTypeFilter,
  searchText: string,
) {
  return {
    selectedMemberId,
    dateRange,
    transactionType,
    searchText,
  }
}

export function FinanceProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>(
    () => MOCK_TRANSACTIONS,
  )
  const [goals, setGoals] = useState<Goal[]>(() => MOCK_GOALS)
  const [creditCards, setCreditCards] = useState<CreditCard[]>(
    () => MOCK_CREDIT_CARDS,
  )
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>(
    () => MOCK_BANK_ACCOUNTS,
  )
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(
    () => MOCK_FAMILY_MEMBERS,
  )

  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null)
  const [dateRange, setDateRange] = useState<DateRange>(defaultDateRange)
  const [transactionType, setTransactionType] =
    useState<TransactionTypeFilter>('all')
  const [searchText, setSearchText] = useState('')

  const filters = useMemo(
    () =>
      buildFilters(selectedMemberId, dateRange, transactionType, searchText),
    [selectedMemberId, dateRange, transactionType, searchText],
  )

  const addTransaction = useCallback((t: Transaction) => {
    setTransactions((prev) => [...prev, t])
  }, [])

  const updateTransaction = useCallback(
    (id: string, patch: Partial<Transaction>) => {
      setTransactions((prev) =>
        prev.map((x) => (x.id === id ? { ...x, ...patch } : x)),
      )
    },
    [],
  )

  const deleteTransaction = useCallback((id: string) => {
    setTransactions((prev) => prev.filter((x) => x.id !== id))
  }, [])

  const addGoal = useCallback((g: Goal) => {
    setGoals((prev) => [...prev, g])
  }, [])

  const updateGoal = useCallback((id: string, patch: Partial<Goal>) => {
    setGoals((prev) => prev.map((x) => (x.id === id ? { ...x, ...patch } : x)))
  }, [])

  const deleteGoal = useCallback((id: string) => {
    setGoals((prev) => prev.filter((x) => x.id !== id))
  }, [])

  const addCreditCard = useCallback((c: CreditCard) => {
    setCreditCards((prev) => [...prev, c])
  }, [])

  const updateCreditCard = useCallback(
    (id: string, patch: Partial<CreditCard>) => {
      setCreditCards((prev) =>
        prev.map((x) => (x.id === id ? { ...x, ...patch } : x)),
      )
    },
    [],
  )

  const deleteCreditCard = useCallback((id: string) => {
    setCreditCards((prev) => prev.filter((x) => x.id !== id))
  }, [])

  const addBankAccount = useCallback((a: BankAccount) => {
    setBankAccounts((prev) => [...prev, a])
  }, [])

  const updateBankAccount = useCallback(
    (id: string, patch: Partial<BankAccount>) => {
      setBankAccounts((prev) =>
        prev.map((x) => (x.id === id ? { ...x, ...patch } : x)),
      )
    },
    [],
  )

  const deleteBankAccount = useCallback((id: string) => {
    setBankAccounts((prev) => prev.filter((x) => x.id !== id))
  }, [])

  const addFamilyMember = useCallback((m: FamilyMember) => {
    setFamilyMembers((prev) => [...prev, m])
  }, [])

  const updateFamilyMember = useCallback(
    (id: string, patch: Partial<FamilyMember>) => {
      setFamilyMembers((prev) =>
        prev.map((x) => (x.id === id ? { ...x, ...patch } : x)),
      )
    },
    [],
  )

  const deleteFamilyMember = useCallback((id: string) => {
    setFamilyMembers((prev) => prev.filter((x) => x.id !== id))
  }, [])

  const getFilteredTransactions = useCallback(() => {
    return applyTransactionFilters(transactions, filters)
  }, [transactions, filters])

  const getTotalBalance = useCallback(() => {
    return calculateTotalBalance(bankAccounts, creditCards)
  }, [bankAccounts, creditCards])

  const getIncomeForPeriod = useCallback(() => {
    return calculateIncomeForPeriod(transactions, filters)
  }, [transactions, filters])

  const getExpensesForPeriod = useCallback(() => {
    return calculateExpensesForPeriod(transactions, filters)
  }, [transactions, filters])

  const getExpensesByCategory = useCallback(() => {
    return calculateExpensesByCategory(transactions, filters)
  }, [transactions, filters])

  const getCategoryPercentage = useCallback(
    (categoryTotal: number) => {
      const totalIncome = calculateTotalIncomeBase(transactions, filters)
      return calculateCategoryPercentage(categoryTotal, totalIncome)
    },
    [transactions, filters],
  )

  const getSavingsRate = useCallback(() => {
    return calculateSavingsRate(transactions, filters)
  }, [transactions, filters])

  const value = useMemo<FinanceContextValue>(
    () => ({
      transactions,
      goals,
      creditCards,
      bankAccounts,
      familyMembers,
      selectedMemberId,
      dateRange,
      transactionType,
      searchText,
      setSelectedMemberId,
      setDateRange,
      setTransactionType,
      setSearchText,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      addGoal,
      updateGoal,
      deleteGoal,
      addCreditCard,
      updateCreditCard,
      deleteCreditCard,
      addBankAccount,
      updateBankAccount,
      deleteBankAccount,
      addFamilyMember,
      updateFamilyMember,
      deleteFamilyMember,
      getFilteredTransactions,
      calculateTotalBalance: getTotalBalance,
      calculateIncomeForPeriod: getIncomeForPeriod,
      calculateExpensesForPeriod: getExpensesForPeriod,
      calculateExpensesByCategory: getExpensesByCategory,
      calculateCategoryPercentage: getCategoryPercentage,
      calculateSavingsRate: getSavingsRate,
    }),
    [
      transactions,
      goals,
      creditCards,
      bankAccounts,
      familyMembers,
      selectedMemberId,
      dateRange,
      transactionType,
      searchText,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      addGoal,
      updateGoal,
      deleteGoal,
      addCreditCard,
      updateCreditCard,
      deleteCreditCard,
      addBankAccount,
      updateBankAccount,
      deleteBankAccount,
      addFamilyMember,
      updateFamilyMember,
      deleteFamilyMember,
      getFilteredTransactions,
      getTotalBalance,
      getIncomeForPeriod,
      getExpensesForPeriod,
      getExpensesByCategory,
      getCategoryPercentage,
      getSavingsRate,
    ],
  )

  return (
    <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>
  )
}
