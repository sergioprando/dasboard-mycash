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
      id: `mem-${Date.now()}`,
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
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nome do membro"
          className="w-full rounded-md border border-border-default px-3 py-2 text-sm"
          required
        />
        <input
          value={role}
          onChange={(e) => setRole(e.target.value)}
          placeholder="Perfil (ex.: Cônjuge, Filho)"
          className="w-full rounded-md border border-border-default px-3 py-2 text-sm"
          required
        />
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email (opcional)"
          type="email"
          className="w-full rounded-md border border-border-default px-3 py-2 text-sm"
        />
        <input
          value={monthlyIncome}
          onChange={(e) => setMonthlyIncome(e.target.value)}
          placeholder="Renda mensal"
          type="number"
          min="0"
          step="0.01"
          className="w-full rounded-md border border-border-default px-3 py-2 text-sm"
        />

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
