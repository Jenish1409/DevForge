import { Link, NavLink, useLocation } from 'react-router-dom'
import { Terminal, ArrowRight } from 'lucide-react'
import ThemeToggle from '../ThemeToggle'

const navLinkClass = ({ isActive }) =>
  `text-sm font-medium transition-colors ${
    isActive
      ? 'text-emerald-400'
      : 'text-zinc-400 hover:text-zinc-200'
  }`

export default function Navbar() {
  const { pathname } = useLocation()

  const featuresHref = pathname === '/' ? '#features' : '/#features'

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-900 shadow-lg shadow-emerald-500/10 group-hover:border-emerald-500/40 transition-colors">
            <Terminal className="h-4 w-4 text-emerald-400" />
          </div>
          <span className="text-lg font-semibold tracking-tight text-zinc-100">
            Dev<span className="text-emerald-400">Forge</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <NavLink to="/" end className={navLinkClass}>
            Home
          </NavLink>
          <a href={featuresHref} className="text-sm font-medium text-zinc-400 hover:text-zinc-200 transition-colors">
            Features
          </a>
          <NavLink to="/contact" className={navLinkClass}>
            Contact Us
          </NavLink>
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            to="/login"
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-500 transition-colors"
          >
            Start Mocking
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </header>
  )
}
