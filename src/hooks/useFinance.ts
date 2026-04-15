import { useContext } from 'react'
import { FinanceContext } from '../contexts/FinanceContext'

export function useFinance() {
  const ctx = useContext(FinanceContext)
  if (!ctx) {
    throw new Error('useFinance deve ser usado dentro de FinanceProvider')
  }
  return ctx
}
