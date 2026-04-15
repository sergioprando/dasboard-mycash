export function formatCurrencyBRL(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

export function formatDateBR(isoDate: string): string {
  const [year, month, day] = isoDate.split('-')
  if (!year || !month || !day) return '--/--/----'
  return `${day}/${month}/${year}`
}

export function formatPercent(value: number, digits = 0): string {
  return `${value.toLocaleString('pt-BR', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })}%`
}

export function formatCompactCurrencyBRL(value: number): string {
  if (value >= 1000) {
    return `R$ ${(value / 1000).toLocaleString('pt-BR', {
      maximumFractionDigits: 1,
    })}k`
  }
  return `R$ ${value.toLocaleString('pt-BR')}`
}
