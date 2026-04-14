import { APP_ROUTES } from '../../constants/routes'
import {
  IconCard,
  IconHome,
  IconList,
  IconTarget,
  IconUser,
} from './SidebarIcons'

export const mobileNavItems = [
  { label: 'Home', path: APP_ROUTES.dashboard, Icon: IconHome, end: true },
  { label: 'Cartões', path: APP_ROUTES.cards, Icon: IconCard },
  { label: 'Transações', path: APP_ROUTES.transactions, Icon: IconList },
  { label: 'Perfil', path: APP_ROUTES.profile, Icon: IconUser },
  { label: 'Objetivos', path: APP_ROUTES.goals, Icon: IconTarget },
]
