import { useState } from 'react'
import { useFinance } from '../../../hooks/useFinance'
import type { FamilyMember } from '../../../types'
import { ModalShell } from './ModalShell'

type AddMemberModalProps = {
  onClose: () => void
}

export function AddMemberModal({ onClose }: AddMemberModalProps) {
  const { addFamilyMember } = useFinance()
  const [name, setName] = useState('')
  const [role, setRole] = useState('')
  const [email, setEmail] = useState('')
  const [monthlyIncome, setMonthlyIncome] = useState('')

  const onSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()
    const income = Number(monthlyIncome || '0')
    if (!name.trim() || !role.trim() || !Number.isFinite(income)) return

    const newMember: FamilyMember = {
      id: crypto.randomUUID(),
      name: name.trim(),
      role: role.trim(),
      email: email.trim() || undefined,
      monthlyIncome: income,
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name.trim())}`,
    }

    addFamilyMember(newMember)
    onClose()
  }

  return (
    <ModalShell title="Adicionar membro" onClose={onClose}>
      <form onSubmit={onSubmit} className="space-y-3">
        <label className="block space-y-1.5">
          <span className="text-sm font-semibold tracking-[0.3px] text-text-primary">Nome</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Maria Silva"
            className="h-12 w-full rounded-[var(--radius-md)] border border-border-default bg-bg-surface px-3 text-sm"
            required
          />
        </label>

        <label className="block space-y-1.5">
          <span className="text-sm font-semibold tracking-[0.3px] text-text-primary">Perfil</span>
          <input
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="Ex: Cônjuge, Filho"
            className="h-12 w-full rounded-[var(--radius-md)] border border-border-default bg-bg-surface px-3 text-sm"
            required
          />
        </label>

        <label className="block space-y-1.5">
          <span className="text-sm font-semibold tracking-[0.3px] text-text-primary">Email <span className="font-normal text-text-secondary">(opcional)</span></span>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Ex: maria@email.com"
            type="email"
            className="h-12 w-full rounded-[var(--radius-md)] border border-border-default bg-bg-surface px-3 text-sm"
          />
        </label>

        <label className="block space-y-1.5">
          <span className="text-sm font-semibold tracking-[0.3px] text-text-primary">Renda mensal</span>
          <input
            value={monthlyIncome}
            onChange={(e) => setMonthlyIncome(e.target.value)}
            placeholder="0,00"
            type="number"
            min="0"
            step="0.01"
            className="h-12 w-full rounded-[var(--radius-md)] border border-border-default bg-bg-surface px-3 text-sm"
          />
        </label>

        <button
          type="submit"
          className="h-11 w-full rounded-full bg-bg-inverse px-5 text-sm font-semibold text-text-inverse"
        >
          Salvar membro
        </button>
      </form>
    </ModalShell>
  )
}
