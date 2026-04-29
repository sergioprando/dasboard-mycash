export const APP_ROUTES = {
  login: '/login',
  dashboard: '/',
  cards: '/cartoes',
  transactions: '/transacoes',
  profile: '/perfil',
  goals: '/objetivos',
  designSystem: '/DesignSystem',
} as const

export type AppRouteKey = keyof typeof APP_ROUTES
