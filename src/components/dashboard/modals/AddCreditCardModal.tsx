import { useState } from 'react'
import { useFinance } from '../../../hooks/useFinance'
import type { CreditCard } from '../../../types'
import { ModalShell } from './ModalShell'

type AddCreditCardModalProps = {
  onClose: () => void
}

export function AddCreditCardModal({ onClose }: AddCreditCardModalProps) {
  const { addCreditCard, familyMembers } = useFinance()
  const [name, setName] = useState('')
  const [holderId, setHolderId] = useState(familyMembers[0]?.id ?? '')
  const [limit, setLimit] = useState('')
  const [currentBill, setCurrentBill] = useState('0')
  const [closingDay, setClosingDay] = useState('8')
  const [dueDay, setDueDay] = useState('15')
  const [lastDigits, setLastDigits] = useState('')
  const [theme, setTheme] = useState<CreditCard['theme']>('black')

  const onSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()
    const parsedLimit = Number(limit)
    const parsedBill = Number(currentBill)
    const parsedClosing = Number(closingDay)
    const parsedDue = Number(dueDay)
    if (!name.trim() || !holderId || !Number.isFinite(parsedLimit)) return

    const card: CreditCard = {
      id: crypto.randomUUID(),
      name: name.trim(),
      holderId,
      limit: parsedLimit,
      currentBill: Number.isFinite(parsedBill) ? parsedBill : 0,
      closingDay: Number.isFinite(parsedClosing) ? parsedClosing : 8,
      dueDay: Number.isFinite(parsedDue) ? parsedDue : 15,
      lastDigits: lastDigits.trim() || undefined,
      theme,
    }

    addCreditCard(card)
    onClose()
  }

  return (
    <ModalShell title="Adicionar cartão" onClose={onClose}>
      <form onSubmit={onSubmit} className="space-y-3">
        <label className="block space-y-1.5">
          <span className="text-sm font-semibold tracking-[0.3px] text-text-primary">Nome do cartão</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Nubank Gold"
            className="h-12 w-full rounded-[var(--radius-md)] border border-border-default bg-bg-surface px-3 text-sm"
            required
          />
        </label>

        <label className="block space-y-1.5">
          <span className="text-sm font-semibold tracking-[0.3px] text-text-primary">Titular</span>
          <select
            value={holderId}
            onChange={(e) => setHolderId(e.target.value)}
            className="h-12 w-full rounded-[var(--radius-md)] border border-border-default bg-bg-surface px-3 text-sm"
            required
          >
            {familyMembers.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name}
              </option>
            ))}
          </select>
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="block space-y-1.5">
            <span className="text-sm font-semibold tracking-[0.3px] text-text-primary">Limite</span>
            <input
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              placeholder="0,00"
              type="number"
              min="0"
              step="0.01"
              className="h-12 w-full rounded-[var(--radius-md)] border border-border-default bg-bg-surface px-3 text-sm"
              required
            />
          </label>
          <label className="block space-y-1.5">
            <span className="text-sm font-semibold tracking-[0.3px] text-text-primary">Fatura atual</span>
            <input
              value={currentBill}
              onChange={(e) => setCurrentBill(e.target.value)}
              placeholder="0,00"
              type="number"
              min="0"
              step="0.01"
              className="h-12 w-full rounded-[var(--radius-md)] border border-border-default bg-bg-surface px-3 text-sm"
            />
          </label>
          <label className="block space-y-1.5">
            <span className="text-sm font-semibold tracking-[0.3px] text-text-primary">Dia de fechamento</span>
            <input
              value={closingDay}
              onChange={(e) => setClosingDay(e.target.value)}
              placeholder="Ex: 8"
              type="number"
              min="1"
              max="31"
              className="h-12 w-full rounded-[var(--radius-md)] border border-border-default bg-bg-surface px-3 text-sm"
            />
          </label>
          <label className="block space-y-1.5">
            <span className="text-sm font-semibold tracking-[0.3px] text-text-primary">Dia de vencimento</span>
            <input
              value={dueDay}
              onChange={(e) => setDueDay(e.target.value)}
              placeholder="Ex: 15"
              type="number"
              min="1"
              max="31"
              className="h-12 w-full rounded-[var(--radius-md)] border border-border-default bg-bg-surface px-3 text-sm"
            />
          </label>
        </div>

        <label className="block space-y-1.5">
          <span className="text-sm font-semibold tracking-[0.3px] text-text-primary">Últimos 4 dígitos <span className="font-normal text-text-secondary">(opcional)</span></span>
          <input
            value={lastDigits}
            onChange={(e) => setLastDigits(e.target.value)}
            placeholder="Ex: 1234"
            className="h-12 w-full rounded-[var(--radius-md)] border border-border-default bg-bg-surface px-3 text-sm"
          />
        </label>
        <div className="flex gap-2">
          {(['black', 'lime', 'white'] as const).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setTheme(item)}
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                theme === item
                  ? 'bg-bg-inverse text-text-inverse'
                  : 'bg-[var(--color-neutral-100)] text-text-secondary'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
        <button
          type="submit"
          className="h-11 w-full rounded-full bg-bg-inverse px-5 text-sm font-semibold text-text-inverse"
        >
          Salvar cartão
        </button>
      </form>
    </ModalShell>
  )
}
