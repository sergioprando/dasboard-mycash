import { useEffect, useMemo, useState } from 'react'
import { useFinance } from '../../hooks/useFinance'

type TypeFilter = 'all' | 'income' | 'expense'
type QuickRangeId = 'this-month' | 'last-month' | 'last-3-months' | 'this-year'

function toPtBrShort(dateIso: string): string {
  const date = new Date(`${dateIso}T00:00:00`)
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
}

function formatRange(startDate: string, endDate: string): string {
  const start = new Date(`${startDate}T00:00:00`)
  const end = new Date(`${endDate}T00:00:00`)
  const sameYear = start.getFullYear() === end.getFullYear()
  if (sameYear) {
    return `${toPtBrShort(startDate)} - ${toPtBrShort(endDate)}, ${end.getFullYear()}`
  }
  return `${toPtBrShort(startDate)}, ${start.getFullYear()} - ${toPtBrShort(endDate)}, ${end.getFullYear()}`
}

function getQuickRange(id: QuickRangeId): { startDate: string; endDate: string } {
  const now = new Date()
  const y = now.getFullYear()
  const m = now.getMonth()

  if (id === 'this-month') {
    const start = new Date(y, m, 1)
    const end = new Date(y, m + 1, 0)
    return {
      startDate: start.toISOString().slice(0, 10),
      endDate: end.toISOString().slice(0, 10),
    }
  }

  if (id === 'last-month') {
    const start = new Date(y, m - 1, 1)
    const end = new Date(y, m, 0)
    return {
      startDate: start.toISOString().slice(0, 10),
      endDate: end.toISOString().slice(0, 10),
    }
  }

  if (id === 'last-3-months') {
    const start = new Date(y, m - 2, 1)
    const end = new Date(y, m + 1, 0)
    return {
      startDate: start.toISOString().slice(0, 10),
      endDate: end.toISOString().slice(0, 10),
    }
  }

  const start = new Date(y, 0, 1)
  const end = new Date(y, 11, 31)
  return {
    startDate: start.toISOString().slice(0, 10),
    endDate: end.toISOString().slice(0, 10),
  }
}

export function DashboardHeader() {
  const {
    familyMembers,
    selectedMemberId,
    setSelectedMemberId,
    transactionType,
    setTransactionType,
    dateRange,
    setDateRange,
    searchText,
    setSearchText,
  } = useFinance()

  const [showTypePopover, setShowTypePopover] = useState(false)
  const [showDatePopover, setShowDatePopover] = useState(false)
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [localStartDate, setLocalStartDate] = useState(dateRange.startDate)
  const [localEndDate, setLocalEndDate] = useState(dateRange.endDate)

  useEffect(() => {
    setLocalStartDate(dateRange.startDate)
    setLocalEndDate(dateRange.endDate)
  }, [dateRange])

  useEffect(() => {
    if (showMobileFilters) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [showMobileFilters])

  const dateRangeLabel = useMemo(
    () => formatRange(dateRange.startDate, dateRange.endDate),
    [dateRange],
  )

  const applyDateRange = () => {
    if (!localStartDate || !localEndDate) return
    setDateRange({
      startDate: localStartDate,
      endDate: localEndDate,
    })
    setShowDatePopover(false)
    setShowMobileFilters(false)
  }

  const setQuickRange = (id: QuickRangeId) => {
    const range = getQuickRange(id)
    setLocalStartDate(range.startDate)
    setLocalEndDate(range.endDate)
    setDateRange(range)
  }

  const toggleMember = (memberId: string) => {
    setSelectedMemberId(selectedMemberId === memberId ? null : memberId)
  }

  const typeOptions: { id: TypeFilter; label: string }[] = [
    { id: 'all', label: 'Todos' },
    { id: 'income', label: 'Receitas' },
    { id: 'expense', label: 'Despesas' },
  ]

  return (
    <header className="rounded-[var(--radius-lg)] border border-border-default bg-bg-surface p-4 md:p-6">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex w-full flex-col gap-3 md:flex-row md:items-center md:gap-2 xl:w-auto">
          <label className="relative flex h-11 min-w-[220px] items-center rounded-full border border-border-default bg-[var(--color-neutral-100)] px-4 md:w-[280px]">
            <span className="mr-2 text-sm text-text-secondary">🔍</span>
            <input
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Pesquisar..."
              className="w-full bg-transparent text-sm text-text-primary outline-none placeholder:text-text-secondary"
            />
          </label>

          <div className="relative hidden md:block">
            <button
              type="button"
              onClick={() => setShowTypePopover((v) => !v)}
              className="flex h-11 min-w-[44px] items-center justify-center rounded-full border border-border-default bg-bg-surface px-4 text-sm font-medium"
            >
              ⚙️
            </button>
            {showTypePopover ? (
              <div className="absolute left-0 top-12 z-40 w-56 rounded-[var(--radius-md)] border border-border-default bg-bg-surface p-3 shadow-[var(--shadow-sidebar-toggle)]">
                <p className="mb-2 text-xs font-semibold uppercase text-text-secondary">
                  Tipo de Transação
                </p>
                <div className="flex gap-2">
                  {typeOptions.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setTransactionType(opt.id)}
                      className={`rounded-full px-3 py-2 text-xs font-medium ${
                        transactionType === opt.id
                          ? 'bg-bg-inverse text-text-inverse'
                          : 'bg-[var(--color-neutral-100)] text-text-secondary'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <div className="relative hidden md:block">
            <button
              type="button"
              onClick={() => setShowDatePopover((v) => !v)}
              className="flex h-11 items-center rounded-full border border-border-default bg-bg-surface px-4 text-sm"
            >
              📅 {dateRangeLabel}
            </button>

            {showDatePopover ? (
              <div className="absolute left-0 top-12 z-40 w-[340px] rounded-[var(--radius-md)] border border-border-default bg-bg-surface p-4 shadow-[var(--shadow-sidebar-toggle)]">
                <p className="mb-2 text-xs font-semibold uppercase text-text-secondary">
                  Período
                </p>
                <div className="mb-3 grid grid-cols-2 gap-2">
                  <input
                    type="date"
                    value={localStartDate}
                    onChange={(e) => setLocalStartDate(e.target.value)}
                    className="rounded-md border border-border-default px-2 py-2 text-sm"
                  />
                  <input
                    type="date"
                    value={localEndDate}
                    onChange={(e) => setLocalEndDate(e.target.value)}
                    className="rounded-md border border-border-default px-2 py-2 text-sm"
                  />
                </div>
                <div className="mb-3 flex flex-wrap gap-2">
                  <button type="button" onClick={() => setQuickRange('this-month')} className="rounded-full border border-border-default px-3 py-1 text-xs">Este mês</button>
                  <button type="button" onClick={() => setQuickRange('last-month')} className="rounded-full border border-border-default px-3 py-1 text-xs">Mês passado</button>
                  <button type="button" onClick={() => setQuickRange('last-3-months')} className="rounded-full border border-border-default px-3 py-1 text-xs">Últimos 3 meses</button>
                  <button type="button" onClick={() => setQuickRange('this-year')} className="rounded-full border border-border-default px-3 py-1 text-xs">Este ano</button>
                </div>
                <button
                  type="button"
                  onClick={applyDateRange}
                  className="w-full rounded-md bg-bg-inverse px-3 py-2 text-sm font-medium text-text-inverse"
                >
                  Aplicar período
                </button>
              </div>
            ) : null}
          </div>
        </div>

        <div className="flex w-full flex-col gap-3 md:flex-row md:items-center md:justify-between xl:w-auto">
          <div className="flex items-center">
            {familyMembers.map((member, index) => {
              const selected = selectedMemberId === member.id
              return (
                <button
                  key={member.id}
                  type="button"
                  onClick={() => toggleMember(member.id)}
                  title={member.name}
                  className={`relative h-10 w-10 overflow-hidden rounded-full border-2 bg-[var(--color-neutral-200)] transition ${
                    selected ? 'z-20 border-bg-inverse ring-2 ring-[var(--color-accent-primary)]' : 'border-bg-surface'
                  }`}
                  style={{ marginLeft: index === 0 ? 0 : -8 }}
                >
                  <img src={member.avatarUrl} alt={member.name} className="h-full w-full object-cover" />
                  {selected ? (
                    <span className="absolute bottom-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--color-accent-primary)] text-[10px] font-bold text-text-primary">
                      ✓
                    </span>
                  ) : null}
                </button>
              )
            })}

            <button
              type="button"
              className="ml-2 flex h-10 w-10 items-center justify-center rounded-full border border-border-default bg-[var(--color-neutral-100)] text-lg"
              title="Adicionar membro"
            >
              +
            </button>
          </div>

          <button
            type="button"
            className="h-11 rounded-full bg-bg-inverse px-5 text-sm font-semibold text-text-inverse md:min-w-[170px]"
          >
            + Nova Transação
          </button>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2 md:hidden">
        <button
          type="button"
          onClick={() => setShowMobileFilters(true)}
          className="flex h-11 min-w-[44px] items-center justify-center rounded-full border border-border-default bg-bg-surface px-4 text-sm font-medium"
        >
          ⚙️
        </button>
        <button
          type="button"
          onClick={() => setShowMobileFilters(true)}
          className="flex h-11 flex-1 items-center justify-center rounded-full border border-border-default bg-bg-surface px-4 text-sm"
        >
          📅 {dateRangeLabel}
        </button>
      </div>

      {showMobileFilters ? (
        <div className="fixed inset-0 z-[120] md:hidden">
          <div className="absolute inset-0 bg-[var(--color-overlay-scrim)]" onClick={() => setShowMobileFilters(false)} />
          <div className="absolute inset-x-0 bottom-0 top-[20%] rounded-t-[var(--radius-lg)] border-t border-border-default bg-bg-surface p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-base font-semibold">Filtros</h3>
              <button type="button" onClick={() => setShowMobileFilters(false)} className="h-10 w-10 rounded-full border border-border-default">✕</button>
            </div>

            <p className="mb-2 text-xs font-semibold uppercase text-text-secondary">Tipo de Transação</p>
            <div className="mb-4 flex gap-2">
              {typeOptions.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setTransactionType(opt.id)}
                  className={`rounded-full px-3 py-2 text-xs font-medium ${
                    transactionType === opt.id
                      ? 'bg-bg-inverse text-text-inverse'
                      : 'bg-[var(--color-neutral-100)] text-text-secondary'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <p className="mb-2 text-xs font-semibold uppercase text-text-secondary">Período</p>
            <div className="mb-3 grid grid-cols-1 gap-2">
              <input type="date" value={localStartDate} onChange={(e) => setLocalStartDate(e.target.value)} className="rounded-md border border-border-default px-2 py-2 text-sm" />
              <input type="date" value={localEndDate} onChange={(e) => setLocalEndDate(e.target.value)} className="rounded-md border border-border-default px-2 py-2 text-sm" />
            </div>
            <div className="mb-4 flex flex-wrap gap-2">
              <button type="button" onClick={() => setQuickRange('this-month')} className="rounded-full border border-border-default px-3 py-1 text-xs">Este mês</button>
              <button type="button" onClick={() => setQuickRange('last-month')} className="rounded-full border border-border-default px-3 py-1 text-xs">Mês passado</button>
              <button type="button" onClick={() => setQuickRange('last-3-months')} className="rounded-full border border-border-default px-3 py-1 text-xs">Últimos 3 meses</button>
              <button type="button" onClick={() => setQuickRange('this-year')} className="rounded-full border border-border-default px-3 py-1 text-xs">Este ano</button>
            </div>

            <button
              type="button"
              onClick={applyDateRange}
              className="h-12 w-full rounded-full bg-bg-inverse text-sm font-semibold text-text-inverse"
            >
              Aplicar Filtros
            </button>
          </div>
        </div>
      ) : null}
    </header>
  )
}
