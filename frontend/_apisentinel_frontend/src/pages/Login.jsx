import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { Mail, Lock, LogIn, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.data.token);
      localStorage.setItem('userId', res.data.data.id);
      localStorage.setItem('email', res.data.data.email);
      localStorage.setItem('role', res.data.data.role || 'ROLE_USER');
      navigate('/dashboard');
    } catch {
      setError('Invalid email or password.');
    } finally { setLoading(false); }
  };

  const inputClass = "w-full rounded-xl border-0 py-3 pl-10 pr-4 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-200 dark:ring-slate-700 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-blue-600 sm:text-sm transition-all outline-none";

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Left decorative panel - hidden on mobile */}
      <div className="hidden lg:flex lg:w-2/5 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 flex-col justify-between p-12 relative overflow-hidden">
        {/* Floating blobs */}
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

        <div className="relative z-10 space-y-6">
          <div className="space-y-3">
            {['Real-time uptime monitoring', 'Instant email alerts', 'Incident history & analytics', 'Secure AES-encrypted API keys'].map(f => (
              <div key={f} className="flex items-center gap-3 text-blue-100">
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <div className="w-2 h-2 rounded-full bg-white" />
                </div>
                <span className="text-sm font-medium">{f}</span>
              </div>
            ))}
          </div>
          <blockquote className="border-l-2 border-white/30 pl-4 text-blue-100 text-sm italic leading-relaxed">
            "Know when your APIs go down before your users do."
          </blockquote>
        </div>

        <p className="text-blue-300/70 text-xs relative z-10">© {new Date().getFullYear()} ApiSentinel</p>
      </div>

      {/* Right: form panel */}
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

          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Welcome back</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Sign in to your dashboard</p>

          {error && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-red-700 dark:text-red-400 text-sm font-medium">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleLogin}>
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
              {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <LogIn className="w-4 h-4" />}
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-blue-600 hover:text-blue-500 transition-colors">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
