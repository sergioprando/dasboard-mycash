export const APP_ROUTES = {
  dashboard: '/',
  cards: '/cartoes',
  transactions: '/transacoes',
  profile: '/perfil',
  goals: '/objetivos',
} as const

export type AppRouteKey = keyof typeof APP_ROUTES
