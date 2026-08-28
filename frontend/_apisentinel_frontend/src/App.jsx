import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ApiDetails from './pages/ApiDetails';
import Landing from './pages/Landing';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import NotFound from './pages/NotFound';
import AdminPage from './pages/AdminPage';
import ScrollToTop from './components/ScrollToTop';

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
}

function AdminRoute({ children }) {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  if (!token) return <Navigate to="/login" />;
  if (role !== 'ROLE_ADMIN') return <Navigate to="/dashboard" />;
  return children;
}

function MaintenanceBanner() {
  const isMaintenanceMode = import.meta.env.VITE_SHOW_MAINTENANCE_BANNER === 'true';
  if (!isMaintenanceMode) return null;
  return (
    <div className="bg-amber-500 text-white px-4 py-2.5 text-center text-sm font-semibold sticky top-0 z-[9999] shadow-md flex items-center justify-center gap-2">
      <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <span>Website under maintenance. Feel free to explore, but some features might be temporarily limited.</span>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <MaintenanceBanner />
      <ScrollToTop />
      <AppRoutes />
    </BrowserRouter>
  );
}

function AppRoutes() {
  const location = useLocation();
  return (
    <div
      key={location.pathname}
      style={{
        animation: 'page-enter 0.35s ease both',
        minHeight: '100vh',
      }}
    >
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/api/:id" element={<PrivateRoute><ApiDetails /></PrivateRoute>} />
        <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
        <Route path="/" element={<Landing />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
