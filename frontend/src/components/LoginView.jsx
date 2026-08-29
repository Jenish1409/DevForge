import { useState, useRef, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Terminal, Loader2, ArrowLeft, ShieldCheck, Home } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import ThemeToggle from './ThemeToggle'
import { useToast } from '../context/ToastContext'

export default function LoginView() {
  const navigate = useNavigate()
  const { login, registerInit, registerVerify } = useAuth()
  const { showToast } = useToast()

  const [mode, setMode] = useState('login')
  const [signupStep, setSignupStep] = useState('form') // 'form' | 'otp'

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', ''])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const otpRefs = useRef([])

  const isLogin = mode === 'login'

  function switchMode(nextMode) {
    setMode(nextMode)
    setSignupStep('form')
    setUsername('')
    setEmail('')
    setPassword('')
    setOtpDigits(['', '', '', '', '', ''])
    setError('')
  }

  // Password validation helpers
  const passwordErrors = []
  if (password.length > 0 && password.length < 8) passwordErrors.push('Min 8 characters')
  if (password.length > 0 && !/\d/.test(password)) passwordErrors.push('At least 1 digit')
  const isPasswordValid = password.length >= 8 && /\d/.test(password)

  // === LOGIN ===
  async function handleLoginSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(username, password)
      showToast('Welcome back to DevForge!', 'success')
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err.message || 'Login failed')
      showToast(err.message || 'Login failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  // === SIGNUP STEP 1: Send OTP ===
  async function handleSignUpSubmit(e) {
    e.preventDefault()
    if (!isPasswordValid) return
    setError('')
    setLoading(true)
    try {
      await registerInit(username, email, password)
      showToast('Verification code sent to your email!', 'success')
      setSignupStep('otp')
    } catch (err) {
      setError(err.message || 'Registration failed')
      showToast(err.message || 'Registration failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  // === SIGNUP STEP 2: Verify OTP ===
  async function handleOtpSubmit(e) {
    e?.preventDefault()
    const otp = otpDigits.join('')
    if (otp.length !== 6) return
    setError('')
    setLoading(true)
    try {
      await registerVerify(email, otp, username, password)
      showToast('Account created successfully!', 'success')
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err.message || 'Verification failed')
      showToast(err.message || 'Verification failed', 'error')
      setOtpDigits(['', '', '', '', '', ''])
      otpRefs.current[0]?.focus()
    } finally {
      setLoading(false)
    }
  }

  function handleOtpChange(index, value) {
    if (!/^\d?$/.test(value)) return // only allow single digits
    const updated = [...otpDigits]
    updated[index] = value
    setOtpDigits(updated)

    // Auto-advance to next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus()
    }

    // Auto-submit when all 6 digits are entered
    if (value && index === 5 && updated.every((d) => d !== '')) {
      setTimeout(() => {
        const otp = updated.join('')
        if (otp.length === 6) handleOtpVerify(updated)
      }, 100)
    }
  }

  async function handleOtpVerify(digits) {
    const otp = digits.join('')
    if (otp.length !== 6) return
    setError('')
    setLoading(true)
    try {
      await registerVerify(email, otp, username, password)
      showToast('Account created successfully!', 'success')
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err.message || 'Verification failed')
      showToast(err.message || 'Verification failed', 'error')
      setOtpDigits(['', '', '', '', '', ''])
      otpRefs.current[0]?.focus()
    } finally {
      setLoading(false)
    }
  }

  function handleOtpKeyDown(index, e) {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpRefs.current[index - 1]?.focus()
    }
  }

  function handleOtpPaste(e) {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (pasted.length === 0) return
    const updated = [...otpDigits]
    for (let i = 0; i < 6; i++) {
      updated[i] = pasted[i] || ''
    }
    setOtpDigits(updated)
    const nextEmpty = updated.findIndex((d) => d === '')
    otpRefs.current[nextEmpty === -1 ? 5 : nextEmpty]?.focus()
    if (updated.every((d) => d !== '')) {
      setTimeout(() => handleOtpVerify(updated), 100)
    }
  }

  // Focus first OTP input when entering the OTP step
  useEffect(() => {
    if (signupStep === 'otp') {
      // Delay focus to let the CSS slide transition complete, and use preventScroll
      // to stop the browser from auto-scrolling the overflow-hidden container,
      // which causes a double-shift UI bug.
      setTimeout(() => {
        otpRefs.current[0]?.focus({ preventScroll: true })
      }, 500)
    }
  }, [signupStep])

  const inputClass =
    'w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 outline-none transition-colors'

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-100 dark:bg-zinc-950 px-4 transition-colors animate-fade-in">
      <div className="absolute top-4 left-4 z-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm px-3 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <Home className="w-4 h-4" />
          Home
        </Link>
      </div>
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
            <div className="flex justify-center mb-6">
              <img src="/logo.png" alt="DevForge Logo" className="h-14 w-auto drop-shadow-md" />
            </div>
            <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">
              {signupStep === 'otp' ? 'Verify Email' : 'Welcome'}
            </h1>
            <p className="text-sm text-zinc-500 mt-1">
              {signupStep === 'otp'
                ? `Enter the 6-digit code sent to ${email}`
                : 'API Mocking & Monitoring Platform'}
            </p>
          </div>

          {/* Tab Switcher - hidden during OTP step */}
          {signupStep !== 'otp' && (
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
          )}

          {/* ============ LOGIN FORM ============ */}
          {isLogin ? (
            <form onSubmit={handleLoginSubmit} className="px-8 pb-8 pt-4 space-y-4 animate-fade-in">
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
                    Signing inÃ¢â‚¬Â¦
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>
          ) : (
            <div className="relative overflow-hidden w-full">
              <div
                className="flex transition-transform duration-500 ease-out"
                style={{
                  transform: signupStep === 'otp' ? 'translateX(-50%)' : 'translateX(0%)',
                  width: '200%',
                }}
              >
                {/* ============ SIGNUP STEP 1: FORM ============ */}
                <form onSubmit={handleSignUpSubmit} className="w-1/2 shrink-0 px-8 pb-8 pt-4 space-y-4">
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
                      placeholder="Min 8 chars, 1 digit"
                    />
                    {password.length > 0 && passwordErrors.length > 0 && (
                      <div className="mt-1.5 flex flex-wrap gap-2">
                        {passwordErrors.map((err) => (
                          <span key={err} className="text-[11px] text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded px-1.5 py-0.5">
                            {err}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !isPasswordValid}
                    className="w-full flex items-center justify-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors mt-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Sending verification codeÃ¢â‚¬Â¦
                      </>
                    ) : (
                      'Send Verification Code'
                    )}
                  </button>
                </form>

                {/* ============ SIGNUP STEP 2: OTP ============ */}
                <form onSubmit={handleOtpSubmit} className="w-1/2 shrink-0 px-8 pb-8 pt-4 space-y-5">
                  {error && (
                    <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-600 dark:text-red-400">
                      {error}
                    </div>
                  )}

                  <div className="flex justify-center gap-2.5" onPaste={handleOtpPaste}>
                    {otpDigits.map((digit, i) => (
                      <input
                        key={i}
                        ref={(el) => (otpRefs.current[i] = el)}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(i, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(i, e)}
                        className="w-12 h-14 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-center text-xl font-mono font-semibold text-zinc-900 dark:text-zinc-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all"
                      />
                    ))}
                  </div>

                  <div className="text-center space-y-1">
                    <p className="text-xs text-zinc-500">
                      Code expires in 5 minutes
                    </p>
                    <p className="text-[11px] text-zinc-400 dark:text-zinc-500">
                      Don't see the email? Please check your spam folder.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || otpDigits.some((d) => !d)}
                    className="w-full flex items-center justify-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        VerifyingÃ¢â‚¬Â¦
                      </>
                    ) : (
                      'Verify & Create Account'
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSignupStep('form')
                      setOtpDigits(['', '', '', '', '', ''])
                      setError('')
                    }}
                    className="w-full flex items-center justify-center gap-2 text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Back to form
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-zinc-500 dark:text-zinc-600 mt-6">DevForge &mdash; Built by Jenish Raichura</p>
      </div>
    </div>
  )
}
