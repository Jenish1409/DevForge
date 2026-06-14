import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Terminal, ArrowRight, Menu, X } from 'lucide-react'
import ThemeToggle from '../ThemeToggle'

const navLinkClass = ({ isActive }) =>
  `text-sm font-medium transition-colors ${
    isActive
      ? 'text-emerald-600 dark:text-emerald-400'
      : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
  }`

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { pathname } = useLocation()

  const featuresHref = pathname === '/' ? '#features' : '/#features'

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md transition-colors">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
          <img src="/logo.png" alt="DevForge Logo" className="h-10 w-auto object-contain drop-shadow-sm group-hover:scale-105 transition-transform" />
          <span className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            Dev<span className="text-emerald-600 dark:text-emerald-400">Forge</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <NavLink to="/" end className={navLinkClass}>
            Home
          </NavLink>
          <a href={featuresHref} className="text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors">
            Features
          </a>
          <NavLink to="/about" className={navLinkClass}>
            About
          </NavLink>
          <NavLink to="/contact" className={navLinkClass}>
            Contact
          </NavLink>
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            to="/login"
            className="hidden sm:inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-500 transition-colors"
          >
            Start Mocking
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-b border-zinc-200 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-900/95 px-4 py-4 space-y-4 shadow-lg backdrop-blur-md">
          <NavLink to="/" end className="block text-sm font-medium text-zinc-600 dark:text-zinc-300" onClick={() => setMobileMenuOpen(false)}>Home</NavLink>
          <a href={featuresHref} className="block text-sm font-medium text-zinc-600 dark:text-zinc-300" onClick={() => setMobileMenuOpen(false)}>Features</a>
          <NavLink to="/about" className="block text-sm font-medium text-zinc-600 dark:text-zinc-300" onClick={() => setMobileMenuOpen(false)}>About</NavLink>
          <NavLink to="/contact" className="block text-sm font-medium text-zinc-600 dark:text-zinc-300" onClick={() => setMobileMenuOpen(false)}>Contact</NavLink>
          <div className="pt-2">
            <Link
              to="/login"
              className="inline-flex w-full justify-center items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-500 transition-colors"
            >
              Start Mocking
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
