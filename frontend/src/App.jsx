import { Routes, Route } from 'react-router-dom'
import PublicLayout from './layouts/PublicLayout'
import HomePage from './pages/HomePage'
import ContactPage from './pages/ContactPage'
import LoginView from './components/LoginView'
import Dashboard from './components/Dashboard'
import ProtectedRoute from './components/ProtectedRoute'
import GuestRoute from './components/GuestRoute'

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        <Route path="contact" element={<ContactPage />} />
      </Route>

      <Route
        path="login"
        element={
          <GuestRoute>
            <LoginView />
          </GuestRoute>
        }
      />

      <Route
        path="dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}
