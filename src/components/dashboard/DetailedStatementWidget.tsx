import { useMemo, useState } from 'react'
import { useFinance } from '../../hooks/useFinance'
import { ModalShell } from './modals/ModalShell'

const PAGE_SIZE = 5

function formatDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-')
  if (!year || !month || !day) return '--/--/----'
  return `${day}/${month}/${year}`
}

function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

function resolveAccountLabel(
  accountId: string,
  cardsById: Map<string, { name: string }>,
  accountsById: Map<string, { type: string }>,
): string {
  const card = cardsById.get(accountId)
  if (card) return `Cartão ${card.name.split(' ')[0]}`
  const account = accountsById.get(accountId)
  if (!account) return 'Conta'
  if (account.type === 'checking') return 'Conta corrente'
  if (account.type === 'savings') return 'Conta poupança'
  return 'Conta investimento'
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.75" />
      <path d="M16.2 16.2L21 21" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  )
}

function StatementIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 3a4 4 0 0 0-4 4v2H7a3 3 0 0 0-3 3v2.2A3.8 3.8 0 0 0 7.8 18H12"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path d="M12 7h8M15 4l-3 3 3 3" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      <path d="M12 13h8M17 10l3 3-3 3" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  )
}

function ArrowUpIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 18V7M7.5 11.5 12 7l4.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export function DetailedStatementWidget() {
  const { transactions, familyMembers, creditCards, bankAccounts } = useFinance()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [showTypeModal, setShowTypeModal] = useState(false)
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('expense')

  const rows = useMemo(() => {
    const membersById = new Map(familyMembers.map((member) => [member.id, member]))
    const cardsById = new Map(creditCards.map((card) => [card.id, { name: card.name }]))
    const accountsById = new Map(bankAccounts.map((account) => [account.id, { type: account.type }]))

    return transactions
      .filter((transaction) =>
        typeFilter === 'all' ? true : transaction.type === typeFilter,
      )
      .filter((transaction) => {
        if (!search.trim()) return true
        const value = search.toLocaleLowerCase('pt-BR')
        return (
          transaction.description.toLocaleLowerCase('pt-BR').includes(value) ||
          transaction.category.toLocaleLowerCase('pt-BR').includes(value)
        )
      })
      .sort((a, b) => (a.date < b.date ? 1 : -1))
      .map((transaction) => {
        const member = transaction.memberId ? membersById.get(transaction.memberId) : undefined
        const installmentLabel =
          transaction.installments > 1
            ? `${transaction.currentInstallment ?? 1}/${transaction.installments}`
            : '-'

        return {
          id: transaction.id,
          memberName: member?.name ?? 'Família',
          memberAvatar: member?.avatarUrl ?? '',
          dateLabel: formatDate(transaction.date),
          description: transaction.description,
          category: transaction.category,
          accountLabel: resolveAccountLabel(transaction.accountId, cardsById, accountsById),
          installmentLabel,
          amountLabel: formatCurrency(transaction.value),
        }
      })
  }, [transactions, familyMembers, creditCards, bankAccounts, search, typeFilter])

  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const startIndex = (safePage - 1) * PAGE_SIZE
  const visibleRows = rows.slice(startIndex, startIndex + PAGE_SIZE)

  return (
    <>
      <section className="rounded-[var(--radius-lg)] border border-border-default bg-[var(--color-neutral-100)] p-6 md:p-8">
      <header className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <h2 className="inline-flex items-center gap-2 text-[20px] font-bold leading-7 text-text-primary">
          <StatementIcon />
          Extrato detalhado
        </h2>

        <div className="flex items-center gap-4 self-start lg:self-auto">
          <label className="inline-flex items-center gap-2 rounded-full border border-[var(--color-neutral-500)] px-4 py-2 text-sm text-text-primary">
            <SearchIcon />
            <input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value)
                setPage(1)
              }}
              placeholder="Buscar lançamentos"
              className="w-[140px] bg-transparent text-sm outline-none placeholder:text-text-secondary"
            />
          </label>
          <button
            type="button"
            onClick={() => setShowTypeModal(true)}
            className="inline-flex items-center gap-1 text-xs font-semibold tracking-[0.3px] text-text-primary"
          >
            {typeFilter === 'expense'
              ? 'Despesas'
              : typeFilter === 'income'
                ? 'Receitas'
                : 'Todos'}
            <span aria-hidden className="text-sm">⌄</span>
          </button>
        </div>
      </header>

      <div className="overflow-x-auto">
        <table className="min-w-[920px] w-full table-fixed">
          <thead>
            <tr className="text-left">
              <th className="pb-5 text-[18px] font-semibold leading-6 tracking-[0.3px] text-text-primary">Membro</th>
              <th className="pb-5 text-[18px] font-semibold leading-6 tracking-[0.3px] text-text-primary">Datas</th>
              <th className="pb-5 text-[18px] font-semibold leading-6 tracking-[0.3px] text-text-primary">Descrição</th>
              <th className="pb-5 text-[18px] font-semibold leading-6 tracking-[0.3px] text-text-primary">Categorias</th>
              <th className="pb-5 text-[18px] font-semibold leading-6 tracking-[0.3px] text-text-primary">Conta/cartão</th>
              <th className="pb-5 text-[18px] font-semibold leading-6 tracking-[0.3px] text-text-primary">Parcelas</th>
              <th className="pb-5 text-[18px] font-semibold leading-6 tracking-[0.3px] text-text-primary">Valor</th>
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((row) => (
              <tr key={row.id}>
                <td className="py-2">
                  <div className="flex h-6 w-6 items-center justify-center overflow-hidden rounded-full border border-border-default bg-bg-surface">
                    {row.memberAvatar ? (
                      <img src={row.memberAvatar} alt={row.memberName} className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-[10px] font-semibold text-text-secondary">{row.memberName[0]}</span>
                    )}
                  </div>
                </td>
                <td className="py-2 text-xs tracking-[0.3px] text-text-primary">{row.dateLabel}</td>
                <td className="py-2">
                  <span className="inline-flex items-center gap-1.5 text-xs tracking-[0.3px] text-text-primary">
                    <span className="text-[var(--color-red-600)]">
                      <ArrowUpIcon />
                    </span>
                    {row.description}
                  </span>
                </td>
                <td className="py-2 text-xs tracking-[0.3px] text-text-primary">{row.category}</td>
                <td className="py-2 text-xs tracking-[0.3px] text-text-primary">{row.accountLabel}</td>
                <td className="py-2 text-xs tracking-[0.3px] text-text-primary">{row.installmentLabel}</td>
                <td className="py-2 text-xs tracking-[0.3px] text-text-primary">{row.amountLabel}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <footer className="mt-10 flex items-center justify-between">
        <p className="text-base font-semibold tracking-[0.3px] text-text-primary">
          Mostrando {rows.length === 0 ? 0 : startIndex + 1} a {Math.min(startIndex + PAGE_SIZE, rows.length)} de{' '}
          {rows.length}
        </p>
        <div className="flex items-center gap-4 text-base font-semibold tracking-[0.3px] text-text-primary">
          <button
            type="button"
            className="disabled:opacity-40"
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={safePage === 1}
            aria-label="Página anterior"
          >
            ←
          </button>
          {[1, 2, 3, 4, 5].map((number) => (
            <button
              key={number}
              type="button"
              onClick={() => setPage(Math.min(number, totalPages))}
              className={number === safePage ? 'text-text-primary' : 'text-text-secondary'}
            >
              {number}
            </button>
          ))}
          <button
            type="button"
            className="disabled:opacity-40"
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={safePage === totalPages}
            aria-label="Próxima página"
          >
            →
          </button>
        </div>
      </footer>
      </section>
      {showTypeModal ? (
        <ModalShell
          title="Filtrar extrato"
          onClose={() => setShowTypeModal(false)}
          widthClassName="max-w-[420px]"
        >
          <div className="space-y-2">
            {[
              { id: 'all', label: 'Todos' },
              { id: 'income', label: 'Receitas' },
              { id: 'expense', label: 'Despesas' },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  setTypeFilter(opt.id as 'all' | 'income' | 'expense')
                  setPage(1)
                  setShowTypeModal(false)
                }}
                className={`w-full rounded-md border border-border-default px-3 py-2 text-left text-sm ${
                  typeFilter === opt.id
                    ? 'bg-bg-inverse text-text-inverse'
                    : 'bg-[var(--color-neutral-100)] text-text-primary'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </ModalShell>
      ) : null}
    </>
  )
}
