import { useAuth } from './context/AuthContext'
import LoginView from './components/LoginView'
import Dashboard from './components/Dashboard'

export default function App() {
  const { isAuthenticated } = useAuth()

  return isAuthenticated ? <Dashboard /> : <LoginView />
}
