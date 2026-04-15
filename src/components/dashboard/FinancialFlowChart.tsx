import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

type FlowPoint = {
  month: string
  receitas: number
  despesas: number
}

const MOCK_FLOW_DATA: FlowPoint[] = [
  { month: 'JAN', receitas: 0, despesas: 0 },
  { month: 'FEV', receitas: 4200, despesas: 2500 },
  { month: 'MAR', receitas: 8200, despesas: 5200 },
  { month: 'ABR', receitas: 11000, despesas: 7400 },
  { month: 'MAI', receitas: 10300, despesas: 8200 },
  { month: 'JUN', receitas: 7800, despesas: 7900 },
  { month: 'JUL', receitas: 7000, despesas: 6800 },
]

function formatCompactCurrency(value: number): string {
  if (value >= 1000) {
    return `R$ ${(value / 1000).toLocaleString('pt-BR', {
      maximumFractionDigits: 1,
    })}k`
  }
  return `R$ ${value.toLocaleString('pt-BR')}`
}

function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

function ChartLegend() {
  return (
    <div className="flex items-center gap-4 text-xs font-medium text-text-secondary">
      <span className="inline-flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-full bg-[var(--color-chart-income)]" />
        Receitas
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-full bg-[var(--color-chart-expense)]" />
        Despesas
      </span>
    </div>
  )
}

type TooltipProps = {
  active?: boolean
  payload?: Array<{ value: number; dataKey: string }>
  label?: string
}

function FlowTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload?.length) return null
  const receitas = payload.find((x) => x.dataKey === 'receitas')?.value ?? 0
  const despesas = payload.find((x) => x.dataKey === 'despesas')?.value ?? 0

  return (
    <div className="min-w-[170px] rounded-[var(--radius-md)] border border-border-default bg-bg-surface p-3 shadow-[var(--shadow-sidebar-toggle)]">
      <p className="mb-1 text-sm font-semibold text-text-primary">{label}</p>
      <p className="text-xs font-medium text-[var(--color-chart-income-strong)]">
        Receitas: {formatCurrency(receitas)}
      </p>
      <p className="mt-0.5 text-xs font-medium text-text-primary">
        Despesas: {formatCurrency(despesas)}
      </p>
    </div>
  )
}

export function FinancialFlowChart() {
  return (
    <section className="rounded-[var(--radius-lg)] border border-border-default bg-bg-surface p-4 md:p-6">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="inline-flex items-center gap-2 text-base font-semibold text-text-primary">
          <span className="text-[var(--color-chart-income)]">📈</span>
          Fluxo financeiro
        </h2>
        <ChartLegend />
      </div>

      <div className="h-[260px] rounded-[var(--radius-md)] bg-[var(--color-chart-bg)] p-2 md:h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={MOCK_FLOW_DATA} margin={{ top: 12, right: 12, left: 4, bottom: 8 }}>
            <defs>
              <linearGradient id="incomeFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-chart-income)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="var(--color-chart-income)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="expenseFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-chart-expense)" stopOpacity={0.1} />
                <stop offset="100%" stopColor="var(--color-chart-expense)" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              stroke="var(--color-chart-grid)"
              strokeDasharray="4 4"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--color-text-secondary)', fontSize: 11, fontWeight: 600 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--color-text-secondary)', fontSize: 11 }}
              tickFormatter={formatCompactCurrency}
              width={56}
            />
            <Tooltip
              content={<FlowTooltip />}
              cursor={{ stroke: 'var(--color-chart-grid-strong)', strokeWidth: 1 }}
            />

            <Area
              type="monotone"
              dataKey="receitas"
              stroke="var(--color-chart-income)"
              strokeWidth={3}
              fill="url(#incomeFill)"
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0, fill: 'var(--color-chart-income)' }}
            />
            <Area
              type="monotone"
              dataKey="despesas"
              stroke="var(--color-chart-expense)"
              strokeWidth={3}
              fill="url(#expenseFill)"
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0, fill: 'var(--color-chart-expense)' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}
