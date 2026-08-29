import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { ArrowRight, Menu, X } from 'lucide-react'
import ThemeToggle from '../ThemeToggle'

const navLinkClass = ({ isActive }) =>
  `text-sm font-medium transition-all duration-200 ${
    isActive
      ? 'text-emerald-600 dark:text-emerald-400'
      : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
  }`

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { pathname } = useLocation()
  const featuresHref = pathname === '/' ? '#features' : '/#features'

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200/60 dark:border-zinc-800/50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl transition-colors">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
          <img src="/logo.png" alt="DevForge" className="h-9 w-auto group-hover:scale-105 transition-transform duration-300" />
          <span className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            Dev<span className="text-emerald-600 dark:text-emerald-400">Forge</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <NavLink to="/" end className={navLinkClass}>Home</NavLink>
          <a href={featuresHref} className="text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Features</a>
          <NavLink to="/about" className={navLinkClass}>About</NavLink>
          <NavLink to="/contact" className={navLinkClass}>Contact</NavLink>
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            to="/login"
            className="hidden sm:inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-500 hover:shadow-emerald-500/30 hover:-translate-y-0.5 transition-all duration-300 active:scale-95"
          >
            Get Started
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-200/60 dark:border-zinc-800/50 bg-white/95 dark:bg-zinc-950/95 px-4 py-4 space-y-3 backdrop-blur-xl">
          <NavLink to="/" end className="block text-sm font-medium text-zinc-600 dark:text-zinc-300" onClick={() => setMobileMenuOpen(false)}>Home</NavLink>
          <a href={featuresHref} className="block text-sm font-medium text-zinc-600 dark:text-zinc-300" onClick={() => setMobileMenuOpen(false)}>Features</a>
          <NavLink to="/about" className="block text-sm font-medium text-zinc-600 dark:text-zinc-300" onClick={() => setMobileMenuOpen(false)}>About</NavLink>
          <NavLink to="/contact" className="block text-sm font-medium text-zinc-600 dark:text-zinc-300" onClick={() => setMobileMenuOpen(false)}>Contact</NavLink>
          <Link to="/login" className="block text-center rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white mt-2" onClick={() => setMobileMenuOpen(false)}>
            Get Started
          </Link>
        </div>
      )}
    </header>
  )
}