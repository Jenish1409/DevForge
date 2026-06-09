import { useState } from 'react'
import { Terminal, Loader2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function LoginView() {
  const { login } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(username, password)
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 backdrop-blur-sm shadow-2xl shadow-emerald-500/5">
          <div className="px-8 pt-8 pb-2 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-zinc-800 border border-zinc-700 mb-4 shadow-lg shadow-emerald-500/10">
              <Terminal className="w-6 h-6 text-emerald-400" />
            </div>
            <h1 className="text-2xl font-semibold text-zinc-100 tracking-tight">DevForge</h1>
            <p className="text-sm text-zinc-500 mt-1">API Mocking Platform</p>
          </div>

          <form onSubmit={handleSubmit} className="px-8 pb-8 pt-4 space-y-4">
            {error && (
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-400">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="username" className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition-colors"
                placeholder="Enter username"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition-colors"
                placeholder="Enter password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2.5 text-sm font-medium text-white transition-colors mt-2"
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
        </div>

        <p className="text-center text-xs text-zinc-600 mt-6">
          Connect to your local DevForge backend
        </p>
      </div>
    </div>
  )
}
