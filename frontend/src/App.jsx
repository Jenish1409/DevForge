import { Routes, Route } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop'

import PublicLayout from './layouts/PublicLayout'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import LoginView from './components/LoginView'
import DashboardLayout from './components/DashboardLayout'
import MonitoringDashboard from './pages/MonitoringDashboard'
import MonitoringApiDetails from './pages/MonitoringApiDetails'
import ProtectedRoute from './components/ProtectedRoute'
import GuestRoute from './components/GuestRoute'

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
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

      {/* Dashboard shell with dual-mode sidebar (Mock Engine / Live Sentinel) */}
      <Route
        path="dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        {/* Mock Engine is rendered inline by DashboardLayout when path is /dashboard */}
        {/* Live Sentinel routes use <Outlet /> */}
        <Route path="monitoring" element={<MonitoringDashboard />} />
        <Route path="monitoring/:id" element={<MonitoringApiDetails />} />
      </Route>
    </Routes>
    </>
  )
}