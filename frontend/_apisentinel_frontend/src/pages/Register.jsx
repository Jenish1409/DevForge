import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { Mail, Lock, Eye, EyeOff, KeyRound, CheckCircle, ArrowLeft, RefreshCw, ShieldCheck } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';

const OTP_EXPIRY_SECONDS = 600;

export default function Register() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(OTP_EXPIRY_SECONDS);
  const timerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (step === 2) {
      setCountdown(OTP_EXPIRY_SECONDS);
      timerRef.current = setInterval(() => {
        setCountdown(c => { if (c <= 1) { clearInterval(timerRef.current); return 0; } return c - 1; });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [step]);

  const formatCountdown = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  const pct = (countdown / OTP_EXPIRY_SECONDS) * 100;
  const progressColor = countdown > 120 ? '#3b82f6' : countdown > 30 ? '#f59e0b' : '#ef4444';

  const handleRequestOtp = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      await api.post('/auth/register/request-otp', { email, password });
      setStep(2);
    } catch (err) {
      const res = err.response?.data;
      if (res?.data && typeof res.data === 'object') {
        // Backend returns field-specific errors like { password: "...", email: "..." }
        const messages = Object.values(res.data).join('. ');
        setError(messages);
      } else {
        setError(res?.message || 'Failed to send verification code.');
      }
    } finally { setLoading(false); }
  };

  const handleVerify = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      await api.post('/auth/register/verify-otp', { email, otp });
      setSuccess('Account created! Redirecting…');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) { setError(err.response?.data?.message || 'Invalid or expired verification code.');
    } finally { setLoading(false); }
  };

  const inputClass = "w-full rounded-xl border-0 py-3 pl-10 pr-4 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-200 dark:ring-slate-700 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-600 sm:text-sm transition-all outline-none";

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-2/5 bg-gradient-to-br from-indigo-600 via-blue-600 to-blue-700 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute top-20 -left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-0 w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl" />
        <Link to="/" className="flex items-center gap-3 relative z-10">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/5 rounded-2xl blur-xl" />
            <div className="relative bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/30 shadow-2xl shadow-white/10 ring-2 ring-white/20">
              <img src="/apisentinel_logo.png" alt="ApiSentinel" className="w-10 h-10 relative z-10 transition-transform group-hover:scale-105" />
            </div>
          </div>
          <span className="text-xl font-bold text-white">ApiSentinel</span>
        </Link>
        <div className="relative z-10 space-y-5">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 ring-1 ring-white/20">
            <ShieldCheck className="w-8 h-8 text-white mb-3" />
            <h3 className="text-white font-bold text-lg mb-2">Email Verified Registration</h3>
            <p className="text-blue-100 text-sm leading-relaxed">
              We verify your email with a one-time code before creating your account, ensuring only real developers join.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {['Free forever', 'AES-encrypted keys', 'JWT auth', 'Real-time monitoring'].map(f => (
              <div key={f} className="bg-white/10 rounded-xl px-3 py-2 text-blue-100 text-xs font-medium text-center backdrop-blur-sm">
                {f}
              </div>
            ))}
          </div>
        </div>
        <p className="text-blue-300/70 text-xs relative z-10">© {new Date().getFullYear()} ApiSentinel</p>
      </div>

      {/* Right: form */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden">
        {/* Subtle dot matrix background */}
        <div className="absolute inset-0 z-0 opacity-[0.15] dark:opacity-10 pointer-events-none"
             style={{ 
               backgroundImage: 'radial-gradient(circle, rgb(148 163 184 / 0.8) 1px, transparent 1px)', 
               backgroundSize: '24px 24px',
               animation: 'pan-matrix 4s linear infinite'
             }} />
        <div className="absolute top-4 left-4 z-10">
          <Link to="/" className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors bg-white dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-slate-700 shadow-sm">
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </Link>
        </div>
        <div className="absolute top-4 right-4 z-10"><ThemeToggle /></div>

        <div className="w-full max-w-sm relative z-10 backdrop-blur-sm bg-white/40 dark:bg-slate-900/40 p-8 sm:p-10 rounded-3xl border border-white/50 dark:border-slate-800/50 shadow-2xl shadow-blue-900/5">
          {/* Mobile logo */}
          <div className="flex lg:hidden justify-center mb-8">
            <div className="flex items-center gap-3">
              <img src="/apisentinel_logo.png" alt="ApiSentinel" className="w-11 h-11" />
              <span className="text-2xl font-extrabold text-gray-900 dark:text-white">ApiSentinel</span>
            </div>
          </div>

          {/* Step indicator */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              {[{ n: 1, label: 'Details' }, { n: 2, label: 'Verify' }].map((s, i) => (
                <div key={s.n} className="flex items-center gap-2 flex-1">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all ${step >= s.n ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'}`}>
                    {step > s.n ? <CheckCircle className="w-4 h-4" /> : s.n}
                  </div>
                  <span className={`text-xs font-medium ${step >= s.n ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>{s.label}</span>
                  {i < 1 && <div className={`flex-1 h-0.5 rounded-full ml-1 transition-all ${step > s.n ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}`} />}
                </div>
              ))}
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {step === 1 ? 'Create your account' : 'Check your email'}
            </h1>
            <div className="mt-1 space-y-1">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {step === 1 ? 'Start monitoring your APIs in minutes' : `We sent a 6-digit code to ${email}`}
              </p>
              {step === 2 && (
                <p className="text-xs text-amber-600 dark:text-amber-500 font-medium flex items-center gap-1.5 mt-2 bg-amber-50 dark:bg-amber-900/10 p-2 rounded-lg border border-amber-100 dark:border-amber-800/30">
                  <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  Don't see it? Please check your spam or junk folder.
                </p>
              )}
            </div>
          </div>

          {error && <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-red-700 dark:text-red-400 text-sm font-medium">{error}</div>}
          {success && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 text-green-700 dark:text-green-400 text-sm font-medium flex items-center gap-2">
              <CheckCircle className="w-4 h-4 flex-shrink-0" /> {success}
            </div>
          )}

          {/* Step 1 */}
          {step === 1 && (
            <form className="space-y-4" onSubmit={handleRequestOtp}>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="email" required placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} className={inputClass} />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type={showPassword ? 'text' : 'password'} required placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className={`${inputClass} pr-10`} />
                <button type="button" tabIndex={-1} onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <button type="submit" disabled={loading}
                className="btn-shine-effect w-full flex justify-center items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:bg-blue-400 py-3 text-sm font-semibold text-white transition-all shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 hover:-translate-y-0.5">
                {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Mail className="w-4 h-4" />}
                {loading ? 'Sending code…' : 'Send Verification Code'}
              </button>
              <p className="text-sm text-center text-gray-500 dark:text-gray-400">
                Already have an account?{' '}
                <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-500 transition-colors">Sign in</Link>
              </p>
            </form>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <form className="space-y-5" onSubmit={handleVerify}>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" required maxLength={6} placeholder="000000" value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                  className={`${inputClass} text-center text-2xl tracking-[0.5em] font-bold`} />
              </div>

              {/* Countdown timer with arc */}
              <div className="flex flex-col items-center gap-2">
                <div className="relative w-16 h-16">
                  <svg className="w-16 h-16 -rotate-90" viewBox="0 0 60 60">
                    <circle cx="30" cy="30" r="26" fill="none" stroke="#e5e7eb" strokeWidth="4" className="dark:stroke-gray-700" />
                    <circle cx="30" cy="30" r="26" fill="none" stroke={progressColor} strokeWidth="4"
                      strokeDasharray={`${2 * Math.PI * 26}`}
                      strokeDashoffset={`${2 * Math.PI * 26 * (1 - pct / 100)}`}
                      strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.5s' }} />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{formatCountdown(countdown)}</span>
                  </div>
                </div>
                <p className={`text-xs font-medium ${countdown > 0 ? 'text-gray-500 dark:text-gray-400' : 'text-red-500'}`}>
                  {countdown > 0 ? 'Code expires in' : 'Code expired'}
                </p>
              </div>

              <button type="submit" disabled={loading || countdown === 0}
                className="btn-shine-effect w-full flex justify-center items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:bg-blue-400 py-3 text-sm font-semibold text-white transition-all shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 hover:-translate-y-0.5">
                {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                {loading ? 'Verifying…' : 'Verify & Create Account'}
              </button>
              <button type="button" onClick={() => { setStep(1); setError(''); setOtp(''); }}
                className="w-full text-sm text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors text-center py-1">
                ← Change email address
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
