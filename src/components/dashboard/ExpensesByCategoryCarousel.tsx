import { useEffect, useMemo, useRef, useState } from 'react'
import { useFinance } from '../../hooks/useFinance'

type CategoryRow = {
  category: string
  total: number
  percentage: number
}

const DONUT_COLORS = [
  'var(--color-accent-primary)',
  'var(--color-neutral-1000)',
  'var(--color-neutral-500)',
  'var(--color-blue-600)',
  'var(--color-green-600)',
  'var(--color-red-600)',
]

function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

function clampPercentage(value: number): number {
  return Math.max(0, Math.min(100, value))
}

export function ExpensesByCategoryCarousel() {
  const finance = useFinance()
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const [isHovering, setIsHovering] = useState(false)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const dragStartXRef = useRef(0)
  const dragStartScrollRef = useRef(0)

  const rows = useMemo<CategoryRow[]>(() => {
    return finance.calculateExpensesByCategory().map((row) => ({
      category: row.category,
      total: row.total,
      percentage: finance.calculateCategoryPercentage(row.total),
    }))
  }, [finance])

  const updateScrollState = () => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 4)
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4)
  }

  useEffect(() => {
    updateScrollState()
    const onResize = () => updateScrollState()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [rows.length])

  const scrollByAmount = (amount: number) => {
    const el = scrollRef.current
    if (!el) return
    el.scrollBy({ left: amount, behavior: 'smooth' })
  }

  const onWheel: React.WheelEventHandler<HTMLDivElement> = (event) => {
    const el = scrollRef.current
    if (!el) return
    if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return
    event.preventDefault()
    el.scrollLeft += event.deltaY
    updateScrollState()
  }

  const onMouseDown: React.MouseEventHandler<HTMLDivElement> = (event) => {
    const el = scrollRef.current
    if (!el) return
    setIsDragging(true)
    dragStartXRef.current = event.clientX
    dragStartScrollRef.current = el.scrollLeft
  }

  const onMouseMove: React.MouseEventHandler<HTMLDivElement> = (event) => {
    if (!isDragging) return
    const el = scrollRef.current
    if (!el) return
    const delta = event.clientX - dragStartXRef.current
    el.scrollLeft = dragStartScrollRef.current - delta
    updateScrollState()
  }

  const onMouseUpOrLeave = () => {
    setIsDragging(false)
  }

  return (
    <section className="rounded-[var(--radius-lg)] border border-border-default bg-bg-surface p-4 md:p-6">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-text-primary">Gastos por categoria</h2>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-[var(--radius-md)] border border-dashed border-border-default p-6 text-center text-sm text-text-secondary">
          Sem despesas no periodo selecionado.
        </div>
      ) : (
        <div
          className="relative"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => {
            setIsHovering(false)
            onMouseUpOrLeave()
          }}
        >
          <div
            ref={scrollRef}
            className={`no-scrollbar flex gap-3 overflow-x-auto pr-2 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'} touch-pan-x`}
            onScroll={updateScrollState}
            onWheel={onWheel}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUpOrLeave}
          >
            {rows.map((row, index) => {
              const percent = clampPercentage(row.percentage)
              const color = DONUT_COLORS[index % DONUT_COLORS.length]
              return (
                <article
                  key={row.category}
                  className="min-w-[160px] max-w-[160px] rounded-[var(--radius-md)] border border-border-default bg-bg-surface p-3 transition-colors hover:border-[var(--color-accent-primary)]"
                >
                  <div className="mx-auto mb-3 grid h-16 w-16 place-items-center rounded-full bg-[var(--color-neutral-100)]">
                    <div
                      className="grid h-16 w-16 place-items-center rounded-full"
                      style={{
                        background: `conic-gradient(${color} ${percent}%, var(--color-neutral-200) ${percent}% 100%)`,
                      }}
                    >
                      <div className="grid h-10 w-10 place-items-center rounded-full bg-bg-surface text-[10px] font-semibold text-text-primary">
                        {percent.toFixed(1)}%
                      </div>
                    </div>
                  </div>

                  <p className="truncate text-center text-xs font-medium text-text-secondary" title={row.category}>
                    {row.category}
                  </p>
                  <p className="mt-1 text-center text-sm font-semibold text-text-primary">
                    {formatCurrency(row.total)}
                  </p>
                </article>
              )
            })}
          </div>

          <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-bg-surface to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-bg-surface to-transparent" />

          {isHovering ? (
            <>
              <button
                type="button"
                onClick={() => scrollByAmount(-200)}
                disabled={!canScrollLeft}
                className="absolute left-1 top-1/2 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-border-default bg-bg-surface shadow-[var(--shadow-sidebar-toggle)] disabled:opacity-40 md:flex"
                aria-label="Voltar categorias"
              >
                ←
              </button>
              <button
                type="button"
                onClick={() => scrollByAmount(200)}
                disabled={!canScrollRight}
                className="absolute right-1 top-1/2 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-border-default bg-bg-surface shadow-[var(--shadow-sidebar-toggle)] disabled:opacity-40 md:flex"
                aria-label="Avancar categorias"
              >
                →
              </button>
            </>
          ) : null}
        </div>
      )}
    </section>
  )
}
