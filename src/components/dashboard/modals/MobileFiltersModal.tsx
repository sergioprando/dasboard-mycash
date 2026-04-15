import { ModalShell } from './ModalShell'

type TypeFilter = 'all' | 'income' | 'expense'
type QuickRangeId = 'this-month' | 'last-month' | 'last-3-months' | 'this-year'

type MobileFiltersModalProps = {
  onClose: () => void
  transactionType: TypeFilter
  setTransactionType: (value: TypeFilter) => void
  localStartDate: string
  localEndDate: string
  setLocalStartDate: (value: string) => void
  setLocalEndDate: (value: string) => void
  setQuickRange: (id: QuickRangeId) => void
  applyDateRange: () => void
}

const typeOptions: { id: TypeFilter; label: string }[] = [
  { id: 'all', label: 'Todos' },
  { id: 'income', label: 'Receitas' },
  { id: 'expense', label: 'Despesas' },
]

export function MobileFiltersModal({
  onClose,
  transactionType,
  setTransactionType,
  localStartDate,
  localEndDate,
  setLocalStartDate,
  setLocalEndDate,
  setQuickRange,
  applyDateRange,
}: MobileFiltersModalProps) {
  return (
    <div className="md:hidden">
      <ModalShell title="Filtros" onClose={onClose} widthClassName="max-w-[560px]">
        <p className="mb-2 text-xs font-semibold uppercase text-text-secondary">Tipo de transação</p>
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
        <div className="mb-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setQuickRange('this-month')}
            className="rounded-full border border-border-default px-3 py-1 text-xs"
          >
            Este mês
          </button>
          <button
            type="button"
            onClick={() => setQuickRange('last-month')}
            className="rounded-full border border-border-default px-3 py-1 text-xs"
          >
            Mês passado
          </button>
          <button
            type="button"
            onClick={() => setQuickRange('last-3-months')}
            className="rounded-full border border-border-default px-3 py-1 text-xs"
          >
            Últimos 3 meses
          </button>
          <button
            type="button"
            onClick={() => setQuickRange('this-year')}
            className="rounded-full border border-border-default px-3 py-1 text-xs"
          >
            Este ano
          </button>
        </div>
        <button
          type="button"
          onClick={applyDateRange}
          className="h-11 w-full rounded-full bg-bg-inverse text-sm font-semibold text-text-inverse"
        >
          Aplicar filtros
        </button>
      </ModalShell>
    </div>
  )
}
