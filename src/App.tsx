import { BrowserRouter } from 'react-router-dom'
import { FinanceProvider } from './contexts/FinanceContext'
import { AppRouter } from './routes/AppRouter'

function App() {
  return (
    <BrowserRouter>
      <FinanceProvider>
        <AppRouter />
      </FinanceProvider>
    </BrowserRouter>
  )
}

export default App
