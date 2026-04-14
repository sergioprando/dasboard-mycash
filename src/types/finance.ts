export type TransactionType = 'income' | 'expense'
export type TransactionStatus = 'pending' | 'completed'

export interface Transaction {
  id: string
  type: TransactionType
  description: string
  category: string
  value: number
  date: string
  memberId: string | null
  accountId: string
  installments: number
  currentInstallment?: number
  isRecurring: boolean
  isPaid: boolean
  status: TransactionStatus
}

export interface Goal {
  id: string
  name: string
  category: string
  targetAmount: number
  currentAmount: number
  dueDate: string
  memberId: string | null
}

export interface CreditCard {
  id: string
  name: string
  holderId: string
  limit: number
  currentBill: number
  closingDay: number
  dueDay: number
  lastDigits?: string
  theme: 'black' | 'lime' | 'white'
}

export interface BankAccount {
  id: string
  name: string
  holderId: string
  balance: number
  type: 'checking' | 'savings' | 'investment'
}

export interface FamilyMember {
  id: string
  name: string
  role: string
  avatarUrl: string
  email?: string
  monthlyIncome: number
}
