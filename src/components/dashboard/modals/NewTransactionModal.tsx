import { useMemo, useState } from 'react'
import { useFinance } from '../../../hooks/useFinance'
import type { Transaction, TransactionType } from '../../../types'
import { ModalShell } from './ModalShell'

type NewTransactionModalProps = {
  onClose: () => void
}

function formatCurrencyInput(rawValue: string): string {
  const digits = rawValue.replace(/\D/g, '')
  if (!digits) return 'R$ 0,00'
  const amount = Number(digits) / 100
  return amount.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

export function NewTransactionModal({ onClose }: NewTransactionModalProps) {
  const { familyMembers, creditCards, bankAccounts, transactions, addTransaction } = useFinance()
  const [type, setType] = useState<TransactionType>('income')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [valueLabel, setValueLabel] = useState('R$ 0,00')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [memberId, setMemberId] = useState<string>(familyMembers[0]?.id ?? '')
  const [accountId, setAccountId] = useState<string>(
    bankAccounts[0]?.id ?? creditCards[0]?.id ?? '',
  )

  const accountOptions = useMemo(
    () => [
      ...bankAccounts.map((account) => ({ id: account.id, label: account.name })),
      ...creditCards.map((card) => ({ id: card.id, label: card.name })),
    ],
    [bankAccounts, creditCards],
  )

  const categoryOptions = useMemo(
    () =>
      Array.from(
        new Set([
          ...transactions.map((transaction) => transaction.category),
          'Alimentação',
          'Moradia',
          'Transporte',
          'Lazer',
          'Saúde',
          'Educação',
          'Investimentos',
          'Salário',
        ]),
      ),
    [transactions],
  )

  const onSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()
    const numericValue = Number(valueLabel.replace(/\D/g, '')) / 100

    if (!description.trim() || !category.trim() || !accountId || !Number.isFinite(numericValue)) {
      return
    }

    const tx: Transaction = {
      id: crypto.randomUUID(),
      type,
      description: description.trim(),
      category: category.trim(),
      value: numericValue,
      date,
      dueDate: type === 'expense' ? date : undefined,
      memberId: memberId || null,
      accountId,
      installments: 1,
      currentInstallment: undefined,
      isRecurring: false,
      isPaid: type === 'income',
      status: type === 'income' ? 'completed' : 'pending',
    }

    addTransaction(tx)
    onClose()
  }

  return (
    <ModalShell title="Nova transação" onClose={onClose} widthClassName="max-w-[760px]">
      <p className="mb-5 text-sm tracking-[0.3px] text-text-secondary">
        Registre entradas e saídas para manter seu controle.
      </p>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="mx-auto flex w-full max-w-[420px] rounded-full border border-border-default p-1">
          <button
            type="button"
            onClick={() => setType('income')}
            className={`h-10 flex-1 rounded-full text-sm font-semibold ${
              type === 'income'
                ? 'bg-bg-inverse text-text-inverse'
                : 'bg-transparent text-text-primary'
            }`}
          >
            Receita
          </button>
          <button
            type="button"
            onClick={() => setType('expense')}
            className={`h-10 flex-1 rounded-full text-sm font-semibold ${
              type === 'expense'
                ? 'bg-bg-inverse text-text-inverse'
                : 'bg-transparent text-text-primary'
            }`}
          >
            Despesas
          </button>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <label className="space-y-1.5">
            <span className="text-sm font-semibold tracking-[0.3px] text-text-primary">
              Valor da transação
            </span>
            <input
              value={valueLabel}
              onChange={(e) => setValueLabel(formatCurrencyInput(e.target.value))}
              placeholder="R$ 0,00"
              className="h-12 w-full rounded-[var(--radius-md)] border border-border-default bg-bg-surface px-3 text-sm"
            />
          </label>
          <label className="space-y-1.5">
            <span className="text-sm font-semibold tracking-[0.3px] text-text-primary">Data</span>
            <input
              value={date}
              onChange={(e) => setDate(e.target.value)}
              type="date"
              className="h-12 w-full rounded-[var(--radius-md)] border border-border-default bg-bg-surface px-3 text-sm"
            />
          </label>
        </div>

        <label className="block space-y-1.5">
          <span className="text-sm font-semibold tracking-[0.3px] text-text-primary">Descrição</span>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="EX: Supermercado Semanal"
            className="h-12 w-full rounded-[var(--radius-md)] border border-border-default bg-bg-surface px-3 text-sm"
          />
        </label>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-sm font-semibold tracking-[0.3px] text-text-primary">Categoria</span>
            <button
              type="button"
              className="text-xs font-semibold tracking-[0.3px] text-text-primary"
            >
              + Nova categoria
            </button>
          </div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="h-12 w-full rounded-[var(--radius-md)] border border-border-default bg-bg-surface px-3 text-sm"
          >
            <option value="">Selecione a categoria</option>
            {categoryOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <label className="space-y-1.5">
            <span className="text-sm font-semibold tracking-[0.3px] text-text-primary">Responsável</span>
            <select
              value={memberId}
              onChange={(e) => setMemberId(e.target.value)}
              className="h-12 w-full rounded-[var(--radius-md)] border border-border-default bg-bg-surface px-3 text-sm"
            >
              <option value="">Familiar</option>
              {familyMembers.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-1.5">
            <span className="text-sm font-semibold tracking-[0.3px] text-text-primary">Conta</span>
            <select
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              className="h-12 w-full rounded-[var(--radius-md)] border border-border-default bg-bg-surface px-3 text-sm"
            >
              {accountOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-2 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="h-11 rounded-full border border-border-default px-6 text-sm font-semibold text-text-primary"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="h-11 rounded-full bg-bg-inverse px-6 text-sm font-semibold text-text-inverse"
          >
            Salvar transação
          </button>
        </div>
      </form>
    </ModalShell>
  )
}
