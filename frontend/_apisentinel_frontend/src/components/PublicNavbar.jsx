import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LayoutDashboard } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { useState, useEffect } from 'react';

export default function PublicNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isAuthenticated = !!localStorage.getItem('token');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 dark:bg-gray-950/95 backdrop-blur-md shadow-sm shadow-gray-900/5' : 'bg-white/80 dark:bg-gray-950/80 backdrop-blur-md'} border-b border-gray-200/80 dark:border-gray-800/80`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-3 group">
              <img src="/apisentinel_logo.png" alt="ApiSentinel" className="h-9 w-auto transition-transform group-hover:scale-105" />
              <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-white">ApiSentinel</span>
            </Link>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path}
                className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-150 ${
                  isActive(link.path)
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800/50'
                }`}>
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            {isAuthenticated ? (
              <Link to="/dashboard" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-sm shadow-blue-600/25 hover:-translate-y-0.5">
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-sm font-medium transition-colors px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50">Log in</Link>
                <Link to="/register" className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-all hover:-translate-y-0.5 shadow-sm">Get Started</Link>
              </>
            )}
          </div>

          {/* Mobile controls */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 animate-slide-up">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path} onClick={() => setIsOpen(false)}
                className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}>
                {link.name}
              </Link>
            ))}
            <div className="pt-2 pb-1 border-t border-gray-100 dark:border-gray-800 mt-2 space-y-2">
              {isAuthenticated ? (
                <Link to="/dashboard" onClick={() => setIsOpen(false)} className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold">
                  <LayoutDashboard className="w-4 h-4" /> Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsOpen(false)} className="block w-full text-center px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Log in</Link>
                  <Link to="/register" onClick={() => setIsOpen(false)} className="block w-full text-center px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold">Get Started</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
