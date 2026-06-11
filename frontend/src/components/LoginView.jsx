import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Terminal, Loader2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import ThemeToggle from './ThemeToggle'

export default function LoginView() {
  const navigate = useNavigate()
  const { login, register } = useAuth()

  const [mode, setMode] = useState('login')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const isLogin = mode === 'login'

  function switchMode(nextMode) {
    setMode(nextMode)
    setUsername('')
    setEmail('')
    setPassword('')
    setError('')
  }

  async function handleLoginSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(username, password)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  async function handleSignUpSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register(username, email, password)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    'w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 outline-none transition-colors'

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-100 dark:bg-zinc-950 px-4 transition-colors">
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-900/80 backdrop-blur-sm shadow-xl dark:shadow-2xl shadow-zinc-300/40 dark:shadow-emerald-500/5 ring-1 ring-zinc-200/60 dark:ring-0 transition-colors">
          <div className="px-8 pt-8 pb-2 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 mb-4 shadow-sm dark:shadow-lg dark:shadow-emerald-500/10">
              <Terminal className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">DevForge</h1>
            <p className="text-sm text-zinc-500 mt-1">API Mocking Platform</p>
          </div>

          <div className="px-8 pt-4">
            <div className="flex rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-950 p-1">
              <button
                type="button"
                onClick={() => switchMode('login')}
                className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
                  isLogin
                    ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => switchMode('signup')}
                className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
                  !isLogin
                    ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
                }`}
              >
                Sign Up
              </button>
            </div>
          </div>

          {isLogin ? (
            <form onSubmit={handleLoginSubmit} className="px-8 pb-8 pt-4 space-y-4">
              {error && (
                <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-600 dark:text-red-400">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="username" className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1.5 uppercase tracking-wider">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoComplete="username"
                  className={`${inputClass} focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30`}
                  placeholder="Enter username"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1.5 uppercase tracking-wider">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className={`${inputClass} focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30`}
                  placeholder="Enter password"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors mt-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Signing in…
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignUpSubmit} className="px-8 pb-8 pt-4 space-y-4">
              {error && (
                <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-600 dark:text-red-400">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="signup-username" className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1.5 uppercase tracking-wider">
                  Username
                </label>
                <input
                  id="signup-username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoComplete="username"
                  className={`${inputClass} focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30`}
                  placeholder="Choose a username"
                />
              </div>

              <div>
                <label htmlFor="signup-email" className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1.5 uppercase tracking-wider">
                  Email
                </label>
                <input
                  id="signup-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className={`${inputClass} focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30`}
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label htmlFor="signup-password" className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1.5 uppercase tracking-wider">
                  Password
                </label>
                <input
                  id="signup-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  className={`${inputClass} focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30`}
                  placeholder="Choose a password"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors mt-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating account…
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-xs text-zinc-500 dark:text-zinc-600 mt-6">
          Connect to your local DevForge backend
        </p>
      </div>
    </div>
  )
}
