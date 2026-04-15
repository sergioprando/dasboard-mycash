import { useMemo, useState } from 'react'
import { useFinance } from '../../hooks/useFinance'
import type { Transaction } from '../../types'
import { formatCurrencyBRL, formatDateBR } from '../../utils/formatters'
import { NewTransactionModal } from '../dashboard/modals/NewTransactionModal'

type TypeFilter = 'all' | 'income' | 'expense'
type StatusFilter = 'all' | 'pending' | 'completed'

function matchesText(transaction: Transaction, query: string): boolean {
  if (!query.trim()) return true
  const value = query.toLocaleLowerCase('pt-BR')
  return (
    transaction.description.toLocaleLowerCase('pt-BR').includes(value) ||
    transaction.category.toLocaleLowerCase('pt-BR').includes(value)
  )
}

export function TransactionsPage() {
  const { transactions, familyMembers, updateTransaction } = useFinance()
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [selectedMemberId, setSelectedMemberId] = useState<string>('all')
  const [showNewTransactionModal, setShowNewTransactionModal] = useState(false)

  const filtered = useMemo(() => {
    return transactions
      .filter((transaction) => (typeFilter === 'all' ? true : transaction.type === typeFilter))
      .filter((transaction) =>
        statusFilter === 'all' ? true : transaction.status === statusFilter,
      )
      .filter((transaction) =>
        selectedMemberId === 'all' ? true : transaction.memberId === selectedMemberId,
      )
      .filter((transaction) => matchesText(transaction, search))
      .sort((a, b) => (a.date < b.date ? 1 : -1))
  }, [transactions, typeFilter, statusFilter, selectedMemberId, search])

  const summary = useMemo(() => {
    let totalIncome = 0
    let totalExpense = 0
    let pendingCount = 0

    for (const transaction of filtered) {
      if (transaction.type === 'income') totalIncome += transaction.value
      if (transaction.type === 'expense') totalExpense += transaction.value
      if (transaction.status === 'pending') pendingCount += 1
    }

    return {
      totalIncome,
      totalExpense,
      net: totalIncome - totalExpense,
      pendingCount,
    }
  }, [filtered])

  return (
    <>
      <section className="animate-page-in space-y-4">
        <header className="animate-card-in rounded-[var(--radius-lg)] border border-border-default bg-bg-surface p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-text-primary">Transações</h1>
              <p className="mt-1 text-sm text-text-secondary">
                Visualize, filtre e atualize rapidamente lançamentos de toda a família.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowNewTransactionModal(true)}
              className="h-11 rounded-full bg-bg-inverse px-5 text-sm font-semibold text-text-inverse"
            >
              + Nova transação
            </button>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-4">
            <div className="rounded-[var(--radius-md)] border border-border-default bg-[var(--color-neutral-100)] p-4">
              <p className="text-xs text-text-secondary">Receitas filtradas</p>
              <p className="mt-1 text-lg font-semibold text-text-primary">
                {formatCurrencyBRL(summary.totalIncome)}
              </p>
            </div>
            <div className="rounded-[var(--radius-md)] border border-border-default bg-[var(--color-neutral-100)] p-4">
              <p className="text-xs text-text-secondary">Despesas filtradas</p>
              <p className="mt-1 text-lg font-semibold text-text-primary">
                {formatCurrencyBRL(summary.totalExpense)}
              </p>
            </div>
            <div className="rounded-[var(--radius-md)] border border-border-default bg-[var(--color-neutral-100)] p-4">
              <p className="text-xs text-text-secondary">Saldo líquido</p>
              <p className="mt-1 text-lg font-semibold text-text-primary">{formatCurrencyBRL(summary.net)}</p>
            </div>
            <div className="rounded-[var(--radius-md)] border border-border-default bg-[var(--color-neutral-100)] p-4">
              <p className="text-xs text-text-secondary">Pendentes</p>
              <p className="mt-1 text-lg font-semibold text-text-primary">{summary.pendingCount}</p>
            </div>
          </div>
        </header>

        <section className="animate-card-in rounded-[var(--radius-lg)] border border-border-default bg-bg-surface p-6">
          <div className="mb-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar por descrição/categoria"
              className="rounded-md border border-border-default px-3 py-2 text-sm"
            />
            <select
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value as TypeFilter)}
              className="rounded-md border border-border-default px-3 py-2 text-sm"
            >
              <option value="all">Todos os tipos</option>
              <option value="income">Receitas</option>
              <option value="expense">Despesas</option>
            </select>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
              className="rounded-md border border-border-default px-3 py-2 text-sm"
            >
              <option value="all">Todos os status</option>
              <option value="pending">Pendentes</option>
              <option value="completed">Concluídas</option>
            </select>
            <select
              value={selectedMemberId}
              onChange={(event) => setSelectedMemberId(event.target.value)}
              className="rounded-md border border-border-default px-3 py-2 text-sm"
            >
              <option value="all">Todos os membros</option>
              {familyMembers.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))}
            </select>
          </div>

          <div className="overflow-x-auto hidden md:block">
            <table className="min-w-[920px] w-full table-fixed">
              <thead>
                <tr className="text-left">
                  <th className="pb-3 text-sm font-semibold text-text-primary">Data</th>
                  <th className="pb-3 text-sm font-semibold text-text-primary">Descrição</th>
                  <th className="pb-3 text-sm font-semibold text-text-primary">Categoria</th>
                  <th className="pb-3 text-sm font-semibold text-text-primary">Tipo</th>
                  <th className="pb-3 text-sm font-semibold text-text-primary">Valor</th>
                  <th className="pb-3 text-sm font-semibold text-text-primary">Status</th>
                  <th className="pb-3 text-sm font-semibold text-text-primary">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((transaction) => (
                  <tr key={transaction.id}>
                    <td className="py-2 text-sm text-text-primary">{formatDateBR(transaction.date)}</td>
                    <td className="py-2 text-sm text-text-primary">{transaction.description}</td>
                    <td className="py-2 text-sm text-text-secondary">{transaction.category}</td>
                    <td className="py-2">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                          transaction.type === 'income'
                            ? 'bg-[var(--color-green-100)] text-[var(--color-green-600)]'
                            : 'bg-[var(--color-red-100)] text-[var(--color-red-600)]'
                        }`}
                      >
                        {transaction.type === 'income' ? 'Receita' : 'Despesa'}
                      </span>
                    </td>
                    <td className="py-2 text-sm font-semibold text-text-primary">
                      {formatCurrencyBRL(transaction.value)}
                    </td>
                    <td className="py-2">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                          transaction.status === 'completed'
                            ? 'bg-[var(--color-green-100)] text-[var(--color-green-600)]'
                            : 'bg-[var(--color-neutral-200)] text-text-secondary'
                        }`}
                      >
                        {transaction.status === 'completed' ? 'Concluída' : 'Pendente'}
                      </span>
                    </td>
                    <td className="py-2">
                      <button
                        type="button"
                        onClick={() =>
                          updateTransaction(transaction.id, {
                            status:
                              transaction.status === 'completed'
                                ? 'pending'
                                : 'completed',
                            isPaid: transaction.status !== 'completed',
                          })
                        }
                        className="rounded-full border border-border-default px-3 py-1 text-xs font-semibold text-text-primary"
                      >
                        {transaction.status === 'completed'
                          ? 'Marcar pendente'
                          : 'Marcar concluída'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="space-y-3 md:hidden">
            {filtered.map((transaction) => (
              <article
                key={transaction.id}
                className="rounded-[var(--radius-md)] border border-border-default bg-[var(--color-neutral-100)] p-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-text-primary">{transaction.description}</p>
                  <span className="text-sm font-semibold text-text-primary">
                    {formatCurrencyBRL(transaction.value)}
                  </span>
                </div>
                <p className="mt-1 text-xs text-text-secondary">
                  {formatDateBR(transaction.date)} · {transaction.category}
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                      transaction.status === 'completed'
                        ? 'bg-[var(--color-green-100)] text-[var(--color-green-600)]'
                        : 'bg-[var(--color-neutral-200)] text-text-secondary'
                    }`}
                  >
                    {transaction.status === 'completed' ? 'Concluída' : 'Pendente'}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      updateTransaction(transaction.id, {
                        status: transaction.status === 'completed' ? 'pending' : 'completed',
                        isPaid: transaction.status !== 'completed',
                      })
                    }
                    className="rounded-full border border-border-default px-3 py-1 text-xs font-semibold text-text-primary"
                  >
                    {transaction.status === 'completed' ? 'Marcar pendente' : 'Marcar concluída'}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </section>

      {showNewTransactionModal ? (
        <NewTransactionModal onClose={() => setShowNewTransactionModal(false)} />
      ) : null}
    </>
  )
}
