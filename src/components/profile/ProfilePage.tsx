import { useMemo, useState } from 'react'
import { useFinance } from '../../hooks/useFinance'
import { formatCurrencyBRL } from '../../utils/formatters'

type ProfileTab = 'info' | 'settings'

export function ProfilePage() {
  const { familyMembers, transactions, goals, updateFamilyMember } = useFinance()
  const [activeTab, setActiveTab] = useState<ProfileTab>('info')
  const [selectedMemberId, setSelectedMemberId] = useState(familyMembers[0]?.id ?? '')

  const selectedMember =
    familyMembers.find((member) => member.id === selectedMemberId) ?? familyMembers[0]

  const memberStats = useMemo(() => {
    if (!selectedMember) {
      return { totalTransactions: 0, totalExpenses: 0, goalsCount: 0 }
    }

    const relatedTransactions = transactions.filter(
      (tx) => tx.memberId === selectedMember.id,
    )
    const totalExpenses = relatedTransactions
      .filter((tx) => tx.type === 'expense')
      .reduce((sum, tx) => sum + tx.value, 0)
    const goalsCount = goals.filter((goal) => goal.memberId === selectedMember.id).length

    return {
      totalTransactions: relatedTransactions.length,
      totalExpenses,
      goalsCount,
    }
  }, [selectedMember, transactions, goals])

  const [nameDraft, setNameDraft] = useState(selectedMember?.name ?? '')
  const [roleDraft, setRoleDraft] = useState(selectedMember?.role ?? '')
  const [emailDraft, setEmailDraft] = useState(selectedMember?.email ?? '')
  const [incomeDraft, setIncomeDraft] = useState(String(selectedMember?.monthlyIncome ?? 0))
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [weeklyReport, setWeeklyReport] = useState(false)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [compactMode, setCompactMode] = useState(false)
  const [currencyCode, setCurrencyCode] = useState('BRL')

  const syncDrafts = (memberId: string) => {
    const member = familyMembers.find((item) => item.id === memberId)
    if (!member) return
    setNameDraft(member.name)
    setRoleDraft(member.role)
    setEmailDraft(member.email ?? '')
    setIncomeDraft(String(member.monthlyIncome))
  }

  const onSave: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()
    if (!selectedMember) return

    updateFamilyMember(selectedMember.id, {
      name: nameDraft.trim() || selectedMember.name,
      role: roleDraft.trim() || selectedMember.role,
      email: emailDraft.trim() || undefined,
      monthlyIncome: Number(incomeDraft) || 0,
    })
  }

  return (
    <section className="animate-page-in space-y-4">
      <header className="animate-card-in rounded-[var(--radius-lg)] border border-border-default bg-bg-surface p-6">
        <h1 className="text-2xl font-semibold text-text-primary">Perfil</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Gerencie os dados de cada membro da família e acompanhe indicadores pessoais.
        </p>
      </header>

      <div className="animate-card-in rounded-[var(--radius-lg)] border border-border-default bg-bg-surface p-5">
        <div className="mb-5 inline-flex rounded-full border border-border-default p-1">
          <button
            type="button"
            onClick={() => setActiveTab('info')}
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              activeTab === 'info'
                ? 'bg-bg-inverse text-text-inverse'
                : 'text-text-secondary'
            }`}
          >
            Informações
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              activeTab === 'settings'
                ? 'bg-bg-inverse text-text-inverse'
                : 'text-text-secondary'
            }`}
          >
            Configurações
          </button>
        </div>

        {activeTab === 'info' ? (
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <div className="rounded-[var(--radius-md)] border border-border-default bg-[var(--color-neutral-100)] p-4">
              <h2 className="text-base font-semibold text-text-primary">Dados do membro</h2>
              <div className="mt-3 flex items-center gap-3">
                <div className="h-12 w-12 overflow-hidden rounded-full border border-border-default bg-bg-surface">
                  {selectedMember?.avatarUrl ? (
                    <img
                      src={selectedMember.avatarUrl}
                      alt={selectedMember.name}
                      className="h-full w-full object-cover"
                    />
                  ) : null}
                </div>
                <select
                  value={selectedMember?.id ?? ''}
                  onChange={(event) => {
                    const nextId = event.target.value
                    setSelectedMemberId(nextId)
                    syncDrafts(nextId)
                  }}
                  className="h-10 min-w-[220px] rounded-md border border-border-default bg-bg-surface px-3 text-sm"
                >
                  {familyMembers.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.name}
                    </option>
                  ))}
                </select>
              </div>

              <form onSubmit={onSave} className="mt-4 space-y-3">
                <input
                  value={nameDraft}
                  onChange={(event) => setNameDraft(event.target.value)}
                  placeholder="Nome"
                  className="w-full rounded-md border border-border-default px-3 py-2 text-sm"
                />
                <input
                  value={roleDraft}
                  onChange={(event) => setRoleDraft(event.target.value)}
                  placeholder="Perfil"
                  className="w-full rounded-md border border-border-default px-3 py-2 text-sm"
                />
                <input
                  value={emailDraft}
                  onChange={(event) => setEmailDraft(event.target.value)}
                  placeholder="E-mail"
                  type="email"
                  className="w-full rounded-md border border-border-default px-3 py-2 text-sm"
                />
                <input
                  value={incomeDraft}
                  onChange={(event) => setIncomeDraft(event.target.value)}
                  placeholder="Renda mensal"
                  type="number"
                  min="0"
                  step="0.01"
                  className="w-full rounded-md border border-border-default px-3 py-2 text-sm"
                />
                <button
                  type="submit"
                  className="h-10 rounded-full bg-bg-inverse px-5 text-sm font-semibold text-text-inverse"
                >
                  Salvar informações
                </button>
              </form>
            </div>

            <div className="space-y-3">
              <div className="rounded-[var(--radius-md)] border border-border-default bg-[var(--color-neutral-100)] p-4">
                <p className="text-xs text-text-secondary">Transações do membro</p>
                <p className="mt-1 text-xl font-semibold text-text-primary">
                  {memberStats.totalTransactions}
                </p>
              </div>
              <div className="rounded-[var(--radius-md)] border border-border-default bg-[var(--color-neutral-100)] p-4">
                <p className="text-xs text-text-secondary">Total em despesas</p>
                <p className="mt-1 text-xl font-semibold text-text-primary">
                  {formatCurrencyBRL(memberStats.totalExpenses)}
                </p>
              </div>
              <div className="rounded-[var(--radius-md)] border border-border-default bg-[var(--color-neutral-100)] p-4">
                <p className="text-xs text-text-secondary">Objetivos vinculados</p>
                <p className="mt-1 text-xl font-semibold text-text-primary">
                  {memberStats.goalsCount}
                </p>
              </div>
              <p className="text-xs text-text-secondary">
                A aba de configurações completas será finalizada no Prompt 20.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <section className="rounded-[var(--radius-md)] border border-border-default bg-[var(--color-neutral-100)] p-4">
              <h2 className="text-base font-semibold text-text-primary">Notificações</h2>
              <div className="mt-3 space-y-3">
                <label className="flex items-center justify-between rounded-md border border-border-default bg-bg-surface px-3 py-2">
                  <span className="text-sm text-text-primary">Receber alertas por e-mail</span>
                  <input
                    type="checkbox"
                    checked={emailNotifications}
                    onChange={(event) => setEmailNotifications(event.target.checked)}
                  />
                </label>
                <label className="flex items-center justify-between rounded-md border border-border-default bg-bg-surface px-3 py-2">
                  <span className="text-sm text-text-primary">Notificações push</span>
                  <input
                    type="checkbox"
                    checked={pushNotifications}
                    onChange={(event) => setPushNotifications(event.target.checked)}
                  />
                </label>
                <label className="flex items-center justify-between rounded-md border border-border-default bg-bg-surface px-3 py-2">
                  <span className="text-sm text-text-primary">Resumo semanal</span>
                  <input
                    type="checkbox"
                    checked={weeklyReport}
                    onChange={(event) => setWeeklyReport(event.target.checked)}
                  />
                </label>
              </div>
            </section>

            <section className="rounded-[var(--radius-md)] border border-border-default bg-[var(--color-neutral-100)] p-4">
              <h2 className="text-base font-semibold text-text-primary">Segurança</h2>
              <div className="mt-3 space-y-3">
                <label className="flex items-center justify-between rounded-md border border-border-default bg-bg-surface px-3 py-2">
                  <span className="text-sm text-text-primary">Autenticação em duas etapas</span>
                  <input
                    type="checkbox"
                    checked={twoFactorEnabled}
                    onChange={(event) => setTwoFactorEnabled(event.target.checked)}
                  />
                </label>
                <button
                  type="button"
                  className="w-full rounded-full border border-border-default px-4 py-2 text-sm font-semibold text-text-primary"
                >
                  Alterar senha
                </button>
                <button
                  type="button"
                  className="w-full rounded-full border border-[var(--color-red-600)] px-4 py-2 text-sm font-semibold text-[var(--color-red-600)]"
                >
                  Encerrar sessões ativas
                </button>
              </div>
            </section>

            <section className="rounded-[var(--radius-md)] border border-border-default bg-[var(--color-neutral-100)] p-4">
              <h2 className="text-base font-semibold text-text-primary">Preferências do app</h2>
              <div className="mt-3 space-y-3">
                <label className="block space-y-1">
                  <span className="text-xs font-semibold uppercase text-text-secondary">Moeda</span>
                  <select
                    value={currencyCode}
                    onChange={(event) => setCurrencyCode(event.target.value)}
                    className="h-10 w-full rounded-md border border-border-default bg-bg-surface px-3 text-sm"
                  >
                    <option value="BRL">Real (BRL)</option>
                    <option value="USD">Dólar (USD)</option>
                    <option value="EUR">Euro (EUR)</option>
                  </select>
                </label>
                <label className="flex items-center justify-between rounded-md border border-border-default bg-bg-surface px-3 py-2">
                  <span className="text-sm text-text-primary">Modo compacto nas tabelas</span>
                  <input
                    type="checkbox"
                    checked={compactMode}
                    onChange={(event) => setCompactMode(event.target.checked)}
                  />
                </label>
              </div>
            </section>

            <section className="rounded-[var(--radius-md)] border border-border-default bg-[var(--color-neutral-100)] p-4">
              <h2 className="text-base font-semibold text-text-primary">Ações da conta</h2>
              <div className="mt-3 space-y-2">
                <button
                  type="button"
                  className="w-full rounded-full border border-border-default px-4 py-2 text-sm font-semibold text-text-primary"
                >
                  Exportar dados financeiros
                </button>
                <button
                  type="button"
                  className="w-full rounded-full border border-border-default px-4 py-2 text-sm font-semibold text-text-primary"
                >
                  Baixar relatório em PDF
                </button>
                <button
                  type="button"
                  className="w-full rounded-full border border-[var(--color-red-600)] px-4 py-2 text-sm font-semibold text-[var(--color-red-600)]"
                >
                  Solicitar exclusão da conta
                </button>
              </div>
            </section>
          </div>
        )}
      </div>
    </section>
  )
}
