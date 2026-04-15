import { useMemo, useState } from 'react'
import { useFinance } from '../../../hooks/useFinance'
import type { Transaction, TransactionType } from '../../../types'
import { ModalShell } from './ModalShell'

type NewTransactionModalProps = {
  onClose: () => void
}

function toInputDate(value: string): string {
  return value.slice(0, 10)
}

export function NewTransactionModal({ onClose }: NewTransactionModalProps) {
  const { familyMembers, creditCards, bankAccounts, addTransaction } = useFinance()
  const [type, setType] = useState<TransactionType>('expense')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [value, setValue] = useState('')
  const [date, setDate] = useState(toInputDate(new Date().toISOString()))
  const [dueDate, setDueDate] = useState('')
  const [memberId, setMemberId] = useState<string>('')
  const [accountId, setAccountId] = useState<string>('')
  const [installments, setInstallments] = useState('1')
  const [isRecurring, setIsRecurring] = useState(false)
  const [isPaid, setIsPaid] = useState(type === 'income')

  const accountOptions = useMemo(
    () => [
      ...bankAccounts.map((account) => ({ id: account.id, label: account.name })),
      ...creditCards.map((card) => ({ id: card.id, label: card.name })),
    ],
    [bankAccounts, creditCards],
  )

  const onSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()
    const numericValue = Number(value)
    const numericInstallments = Math.max(1, Number(installments))

    if (!description.trim() || !category.trim() || !accountId || !Number.isFinite(numericValue)) return

    const tx: Transaction = {
      id: `tx-${Date.now()}`,
      type,
      description: description.trim(),
      category: category.trim(),
      value: numericValue,
      date,
      dueDate: dueDate || undefined,
      memberId: memberId || null,
      accountId,
      installments: numericInstallments,
      currentInstallment: numericInstallments > 1 ? 1 : undefined,
      isRecurring,
      isPaid,
      status: isPaid ? 'completed' : 'pending',
    }

    addTransaction(tx)
    onClose()
  }

  return (
    <ModalShell title="Nova transação" onClose={onClose} widthClassName="max-w-[760px]">
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="flex gap-2">
          {(['expense', 'income'] as const).map((valueType) => (
            <button
              key={valueType}
              type="button"
              onClick={() => {
                setType(valueType)
                if (valueType === 'income') setIsPaid(true)
              }}
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                type === valueType
                  ? 'bg-bg-inverse text-text-inverse'
                  : 'bg-[var(--color-neutral-100)] text-text-secondary'
              }`}
            >
              {valueType === 'expense' ? 'Despesa' : 'Receita'}
            </button>
          ))}
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descrição"
            className="rounded-md border border-border-default px-3 py-2 text-sm"
            required
          />
          <input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Categoria"
            className="rounded-md border border-border-default px-3 py-2 text-sm"
            required
          />
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Valor"
            type="number"
            min="0"
            step="0.01"
            className="rounded-md border border-border-default px-3 py-2 text-sm"
            required
          />
          <input
            value={date}
            onChange={(e) => setDate(e.target.value)}
            type="date"
            className="rounded-md border border-border-default px-3 py-2 text-sm"
            required
          />
          <input
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            type="date"
            className="rounded-md border border-border-default px-3 py-2 text-sm"
          />
          <select
            value={memberId}
            onChange={(e) => setMemberId(e.target.value)}
            className="rounded-md border border-border-default px-3 py-2 text-sm"
          >
            <option value="">Família (sem membro)</option>
            {familyMembers.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name}
              </option>
            ))}
          </select>
          <select
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
            className="rounded-md border border-border-default px-3 py-2 text-sm"
            required
          >
            <option value="">Selecione conta/cartão</option>
            {accountOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
          <input
            value={installments}
            onChange={(e) => setInstallments(e.target.value)}
            type="number"
            min="1"
            placeholder="Parcelas"
            className="rounded-md border border-border-default px-3 py-2 text-sm"
          />
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary">
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={isRecurring}
              onChange={(e) => setIsRecurring(e.target.checked)}
            />
            Recorrente
          </label>
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={isPaid}
              onChange={(e) => setIsPaid(e.target.checked)}
            />
            Já pago
          </label>
        </div>

        <button
          type="submit"
          className="h-11 w-full rounded-full bg-bg-inverse px-5 text-sm font-semibold text-text-inverse"
        >
          Salvar transação
        </button>
      </form>
    </ModalShell>
  )
}
