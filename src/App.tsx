import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { FinanceProvider } from './contexts/FinanceContext'
import { AppRouter } from './routes/AppRouter'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <FinanceProvider>
          <AppRouter />
        </FinanceProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
