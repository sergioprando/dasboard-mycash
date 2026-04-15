/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
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
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabaseClient'

type DbFamilyMember = {
  id: string
  name: string
  role: string
  avatar_url: string | null
  monthly_income: number | string | null
}

type DbCategory = {
  id: string
  name: string
}

type DbAccount = {
  id: string
  type: 'CHECKING' | 'SAVINGS' | 'CREDIT_CARD'
  name: string
  holder_id: string
  balance: number | string | null
  credit_limit: number | string | null
  current_bill: number | string | null
  closing_day: number | null
  due_day: number | null
  last_digits: string | null
  theme: string | null
}

type DbTransaction = {
  id: string
  type: 'INCOME' | 'EXPENSE'
  description: string
  amount: number | string
  date: string
  category_id: string | null
  member_id: string | null
  account_id: string | null
  total_installments: number | null
  installment_number: number | null
  is_recurring: boolean | null
  status: 'PENDING' | 'COMPLETED'
}

type DbGoal = {
  id: string
  name: string
  category: string
  target_amount: number | string | null
  current_amount: number | string | null
  due_date: string
  member_id: string | null
}

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
  const { user } = useAuth()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [goals, setGoals] = useState<Goal[]>([])
  const [creditCards, setCreditCards] = useState<CreditCard[]>([])
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([])
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([])

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

  const ensureCurrentUser = useCallback(async () => {
    if (!user) return
    await supabase.from('users').upsert(
      {
        id: user.id,
        email: user.email ?? '',
        name:
          (user.user_metadata?.name as string | undefined) ??
          (user.email?.split('@')[0] ?? 'Usuário'),
        avatar_url: (user.user_metadata?.avatar_url as string | undefined) ?? null,
      },
      { onConflict: 'id' },
    )
  }, [user])

  useEffect(() => {
    const load = async () => {
      if (!user) {
        setTransactions([])
        setGoals([])
        setCreditCards([])
        setBankAccounts([])
        setFamilyMembers([])
        return
      }

      await ensureCurrentUser()

      const [membersRes, categoriesRes, accountsRes, transactionsRes, goalsRes] =
        await Promise.all([
          supabase.from('family_members').select('*').eq('user_id', user.id).order('created_at'),
          supabase.from('categories').select('*').eq('user_id', user.id),
          supabase.from('accounts').select('*').eq('user_id', user.id).order('created_at'),
          supabase.from('transactions').select('*').eq('user_id', user.id).order('date', { ascending: false }),
          supabase.from('goals').select('*').eq('user_id', user.id).order('created_at'),
        ])

      const members = ((membersRes.data ?? []) as DbFamilyMember[]).map((row) => ({
        id: row.id as string,
        name: row.name as string,
        role: row.role as string,
        avatarUrl: (row.avatar_url as string | null) ?? '',
        email: undefined,
        monthlyIncome: Number(row.monthly_income ?? 0),
      }))
      setFamilyMembers(members)

      const categoriesById = new Map<string, string>(
        ((categoriesRes.data ?? []) as DbCategory[]).map((row) => [
          row.id as string,
          row.name as string,
        ]),
      )

      const accounts = (accountsRes.data ?? []) as DbAccount[]
      const bank = accounts
        .filter((row) => row.type !== 'CREDIT_CARD')
        .map((row) => ({
          id: row.id as string,
          name: row.name as string,
          holderId: row.holder_id as string,
          balance: Number(row.balance ?? 0),
          type:
            row.type === 'SAVINGS'
              ? 'savings'
              : row.type === 'CHECKING'
                ? 'checking'
                : 'investment',
        })) as BankAccount[]
      const cards = accounts
        .filter((row) => row.type === 'CREDIT_CARD')
        .map((row) => ({
          id: row.id as string,
          name: row.name as string,
          holderId: row.holder_id as string,
          limit: Number(row.credit_limit ?? 0),
          currentBill: Number(row.current_bill ?? 0),
          closingDay: Number(row.closing_day ?? 1),
          dueDay: Number(row.due_day ?? 1),
          lastDigits: (row.last_digits as string | null) ?? undefined,
          theme: ((row.theme as string | null) ?? 'black') as CreditCard['theme'],
        })) as CreditCard[]
      setBankAccounts(bank)
      setCreditCards(cards)

      const txs = ((transactionsRes.data ?? []) as DbTransaction[]).map((row) => ({
        id: row.id as string,
        type: (row.type as string) === 'INCOME' ? 'income' : 'expense',
        description: row.description as string,
        category: categoriesById.get((row.category_id as string | null) ?? '') ?? 'Sem categoria',
        value: Number(row.amount ?? 0),
        date: row.date as string,
        dueDate: (row.type as string) === 'EXPENSE' ? ((row.date as string) ?? undefined) : undefined,
        memberId: (row.member_id as string | null) ?? null,
        accountId: (row.account_id as string | null) ?? '',
        installments: Number(row.total_installments ?? 1),
        currentInstallment: (row.installment_number as number | null) ?? undefined,
        isRecurring: Boolean(row.is_recurring),
        isPaid: (row.status as string) === 'COMPLETED',
        status: (row.status as string) === 'COMPLETED' ? 'completed' : 'pending',
      })) as Transaction[]
      setTransactions(txs)

      const loadedGoals = ((goalsRes.data ?? []) as DbGoal[]).map((row) => ({
        id: row.id,
        name: row.name,
        category: row.category,
        targetAmount: Number(row.target_amount ?? 0),
        currentAmount: Number(row.current_amount ?? 0),
        dueDate: row.due_date,
        memberId: row.member_id,
      })) as Goal[]
      setGoals(loadedGoals)

      if (members.length === 0) {
        const { data: createdMember } = await supabase
          .from('family_members')
          .insert({
            user_id: user.id,
            name:
              (user.user_metadata?.name as string | undefined) ??
              (user.email?.split('@')[0] ?? 'Titular'),
            role: 'Titular',
            avatar_url: (user.user_metadata?.avatar_url as string | undefined) ?? null,
            monthly_income: 0,
          })
          .select('*')
          .single()
        if (createdMember) {
          setFamilyMembers([
            {
              id: createdMember.id as string,
              name: createdMember.name as string,
              role: createdMember.role as string,
              avatarUrl: (createdMember.avatar_url as string | null) ?? '',
              email: undefined,
              monthlyIncome: Number(createdMember.monthly_income ?? 0),
            },
          ])
        }
      }
    }

    void load()
  }, [user, ensureCurrentUser])

  const getOrCreateCategoryId = useCallback(
    async (name: string, type: 'income' | 'expense') => {
      if (!user) return null
      const supabaseType = type === 'income' ? 'INCOME' : 'EXPENSE'
      const { data: found } = await supabase
        .from('categories')
        .select('id')
        .eq('user_id', user.id)
        .eq('name', name)
        .eq('type', supabaseType)
        .maybeSingle()
      if (found?.id) return found.id as string

      const { data: created } = await supabase
        .from('categories')
        .insert({
          user_id: user.id,
          name,
          type: supabaseType,
        })
        .select('id')
        .single()

      return (created?.id as string | undefined) ?? null
    },
    [user],
  )

  const addTransaction = useCallback((t: Transaction) => {
    setTransactions((prev) => [...prev, t])
    void (async () => {
      if (!user) return
      const categoryId = await getOrCreateCategoryId(t.category, t.type)
      await supabase.from('transactions').insert({
        id: t.id,
        user_id: user.id,
        type: t.type === 'income' ? 'INCOME' : 'EXPENSE',
        amount: t.value,
        description: t.description,
        date: t.date,
        category_id: categoryId,
        account_id: t.accountId || null,
        member_id: t.memberId,
        installment_number: t.currentInstallment ?? null,
        total_installments: t.installments || 1,
        is_recurring: t.isRecurring,
        status: t.status === 'completed' ? 'COMPLETED' : 'PENDING',
        notes: null,
      })
    })()
  }, [user, getOrCreateCategoryId])

  const updateTransaction = useCallback(
    (id: string, patch: Partial<Transaction>) => {
      setTransactions((prev) =>
        prev.map((x) => (x.id === id ? { ...x, ...patch } : x)),
      )
      void (async () => {
        const payload: Record<string, unknown> = {}
        if (patch.description !== undefined) payload.description = patch.description
        if (patch.value !== undefined) payload.amount = patch.value
        if (patch.date !== undefined) payload.date = patch.date
        if (patch.status !== undefined) payload.status = patch.status === 'completed' ? 'COMPLETED' : 'PENDING'
        if (patch.isRecurring !== undefined) payload.is_recurring = patch.isRecurring
        if (patch.installments !== undefined) payload.total_installments = patch.installments
        if (patch.currentInstallment !== undefined) payload.installment_number = patch.currentInstallment
        if (Object.keys(payload).length > 0) {
          await supabase.from('transactions').update(payload).eq('id', id)
        }
      })()
    },
    [],
  )

  const deleteTransaction = useCallback((id: string) => {
    setTransactions((prev) => prev.filter((x) => x.id !== id))
    void supabase.from('transactions').delete().eq('id', id)
  }, [])

  const addGoal = useCallback((g: Goal) => {
    setGoals((prev) => [...prev, g])
    void (async () => {
      if (!user) return
      await supabase.from('goals').insert({
        id: g.id,
        user_id: user.id,
        name: g.name,
        category: g.category,
        target_amount: g.targetAmount,
        current_amount: g.currentAmount,
        due_date: g.dueDate,
        member_id: g.memberId,
      })
    })()
  }, [user])

  const updateGoal = useCallback((id: string, patch: Partial<Goal>) => {
    setGoals((prev) => prev.map((x) => (x.id === id ? { ...x, ...patch } : x)))
    void (async () => {
      const payload: Record<string, unknown> = {}
      if (patch.name !== undefined) payload.name = patch.name
      if (patch.category !== undefined) payload.category = patch.category
      if (patch.targetAmount !== undefined) payload.target_amount = patch.targetAmount
      if (patch.currentAmount !== undefined) payload.current_amount = patch.currentAmount
      if (patch.dueDate !== undefined) payload.due_date = patch.dueDate
      if (patch.memberId !== undefined) payload.member_id = patch.memberId
      if (Object.keys(payload).length > 0) {
        await supabase.from('goals').update(payload).eq('id', id)
      }
    })()
  }, [])

  const deleteGoal = useCallback((id: string) => {
    setGoals((prev) => prev.filter((x) => x.id !== id))
    void supabase.from('goals').delete().eq('id', id)
  }, [])

  const addCreditCard = useCallback((c: CreditCard) => {
    setCreditCards((prev) => [...prev, c])
    void (async () => {
      if (!user) return
      await supabase.from('accounts').insert({
        id: c.id,
        user_id: user.id,
        type: 'CREDIT_CARD',
        name: c.name,
        bank: c.name.split(' ')[0] ?? c.name,
        last_digits: c.lastDigits ?? null,
        holder_id: c.holderId,
        balance: 0,
        credit_limit: c.limit,
        current_bill: c.currentBill,
        due_day: c.dueDay,
        closing_day: c.closingDay,
        theme: c.theme,
      })
    })()
  }, [user])

  const updateCreditCard = useCallback(
    (id: string, patch: Partial<CreditCard>) => {
      setCreditCards((prev) =>
        prev.map((x) => (x.id === id ? { ...x, ...patch } : x)),
      )
      void (async () => {
        const payload: Record<string, unknown> = {}
        if (patch.name !== undefined) payload.name = patch.name
        if (patch.limit !== undefined) payload.credit_limit = patch.limit
        if (patch.currentBill !== undefined) payload.current_bill = patch.currentBill
        if (patch.dueDay !== undefined) payload.due_day = patch.dueDay
        if (patch.closingDay !== undefined) payload.closing_day = patch.closingDay
        if (patch.lastDigits !== undefined) payload.last_digits = patch.lastDigits ?? null
        if (patch.theme !== undefined) payload.theme = patch.theme
        if (Object.keys(payload).length > 0) await supabase.from('accounts').update(payload).eq('id', id)
      })()
    },
    [],
  )

  const deleteCreditCard = useCallback((id: string) => {
    setCreditCards((prev) => prev.filter((x) => x.id !== id))
    void supabase.from('accounts').delete().eq('id', id)
  }, [])

  const addBankAccount = useCallback((a: BankAccount) => {
    setBankAccounts((prev) => [...prev, a])
    void (async () => {
      if (!user) return
      await supabase.from('accounts').insert({
        id: a.id,
        user_id: user.id,
        type:
          a.type === 'savings'
            ? 'SAVINGS'
            : a.type === 'checking'
              ? 'CHECKING'
              : 'CHECKING',
        name: a.name,
        bank: a.name.split(' ')[0] ?? a.name,
        holder_id: a.holderId,
        balance: a.balance,
        current_bill: 0,
      })
    })()
  }, [user])

  const updateBankAccount = useCallback(
    (id: string, patch: Partial<BankAccount>) => {
      setBankAccounts((prev) =>
        prev.map((x) => (x.id === id ? { ...x, ...patch } : x)),
      )
      void (async () => {
        const payload: Record<string, unknown> = {}
        if (patch.name !== undefined) payload.name = patch.name
        if (patch.balance !== undefined) payload.balance = patch.balance
        if (Object.keys(payload).length > 0) await supabase.from('accounts').update(payload).eq('id', id)
      })()
    },
    [],
  )

  const deleteBankAccount = useCallback((id: string) => {
    setBankAccounts((prev) => prev.filter((x) => x.id !== id))
    void supabase.from('accounts').delete().eq('id', id)
  }, [])

  const addFamilyMember = useCallback((m: FamilyMember) => {
    setFamilyMembers((prev) => [...prev, m])
    void (async () => {
      if (!user) return
      await supabase.from('family_members').insert({
        id: m.id,
        user_id: user.id,
        name: m.name,
        role: m.role,
        avatar_url: m.avatarUrl || null,
        monthly_income: m.monthlyIncome,
      })
    })()
  }, [user])

  const updateFamilyMember = useCallback(
    (id: string, patch: Partial<FamilyMember>) => {
      setFamilyMembers((prev) =>
        prev.map((x) => (x.id === id ? { ...x, ...patch } : x)),
      )
      void (async () => {
        const payload: Record<string, unknown> = {}
        if (patch.name !== undefined) payload.name = patch.name
        if (patch.role !== undefined) payload.role = patch.role
        if (patch.avatarUrl !== undefined) payload.avatar_url = patch.avatarUrl
        if (patch.monthlyIncome !== undefined) payload.monthly_income = patch.monthlyIncome
        if (Object.keys(payload).length > 0) await supabase.from('family_members').update(payload).eq('id', id)
      })()
    },
    [],
  )

  const deleteFamilyMember = useCallback((id: string) => {
    setFamilyMembers((prev) => prev.filter((x) => x.id !== id))
    void supabase.from('family_members').delete().eq('id', id)
  }, [])

  const getFilteredTransactions = useCallback(() => {
    return applyTransactionFilters(transactions, filters)
  }, [transactions, filters])

  const getTotalBalance = useCallback(() => {
    return calculateTotalBalance(transactions, filters)
  }, [transactions, filters])

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
