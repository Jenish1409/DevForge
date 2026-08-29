import { Link } from 'react-router-dom'
import {
  Zap,
  Clock,
  Shield,
  Activity,
  Mail,
  ArrowRight,
  Sparkles,
} from 'lucide-react'

/* ─────────────────────────────────────────────
   Bento Grid Sub-Components
   ───────────────────────────────────────────── */

function BentoMockEngine() {
  return (
    <div className="md:col-span-2 group relative rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-6 overflow-hidden transition-all duration-300 hover:border-emerald-300 dark:hover:border-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/5 hover:-translate-y-0.5">
      <div className="flex items-center gap-3 mb-5">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 group-hover:scale-110 transition-transform duration-300">
          <Zap className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Instant Mock Routes</h3>
          <p className="text-[11px] text-zinc-500">Define. Deploy. Done.</p>
        </div>
      </div>
      <div className="rounded-xl bg-zinc-950 p-4 font-mono text-xs leading-relaxed overflow-hidden border border-zinc-800">
        <div className="flex items-center gap-2 text-zinc-500 text-[10px] mb-3 pb-2 border-b border-zinc-800/80">
          <span className="h-2 w-2 rounded-full bg-emerald-500/60" />
          <span>mock_config.yaml</span>
        </div>
        <pre className="text-emerald-400/90 whitespace-pre">{`route: /api/v1/users
method: GET
status: 200
content_type: application/json
response:
  id: 42
  username: "jenish_dev"
  role: "lead_developer"
  status: "active"`}</pre>
      </div>
    </div>
  )
}

function BentoLatency() {
  return (
    <div className="group relative rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-6 overflow-hidden transition-all duration-300 hover:border-cyan-300 dark:hover:border-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/5 hover:-translate-y-0.5">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/20 group-hover:scale-110 transition-transform duration-300">
          <Clock className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Latency Control</h3>
          <p className="text-[11px] text-zinc-500">Simulate real lag.</p>
        </div>
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-zinc-400 font-mono">delay_ms</span>
          <span className="text-3xl font-extrabold font-mono text-cyan-500 dark:text-cyan-400 tabular-nums">2000</span>
        </div>
        <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
          <div className="h-full w-2/3 bg-gradient-to-r from-cyan-500 to-cyan-300 rounded-full animate-pulse" />
        </div>
        <p className="text-[10px] text-zinc-500 font-mono">threshold: 3000ms</p>
      </div>
    </div>
  )
}

function BentoIsolation() {
  return (
    <div className="group relative rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-6 overflow-hidden transition-all duration-300 hover:border-violet-300 dark:hover:border-violet-500/30 hover:shadow-xl hover:shadow-violet-500/5 hover:-translate-y-0.5">
      <div className="flex items-center gap-3 mb-5">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-500/10 border border-violet-200 dark:border-violet-500/20 group-hover:scale-110 transition-transform duration-300">
          <Shield className="w-5 h-5 text-violet-600 dark:text-violet-400" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Project Sandboxes</h3>
          <p className="text-[11px] text-zinc-500">Isolated & secured.</p>
        </div>
      </div>
      <div className="space-y-2 font-mono text-xs">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800">
          <span className="text-violet-500 shrink-0">&#8594;</span>
          <span className="text-zinc-500 dark:text-zinc-400 shrink-0">API-Key:</span>
          <span className="text-violet-600 dark:text-violet-400 truncate">df_key_42a8b9c...</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800">
          <span className="text-emerald-500 shrink-0">&#10003;</span>
          <span className="text-zinc-500 dark:text-zinc-400 shrink-0">Origin:</span>
          <span className="text-emerald-600 dark:text-emerald-400">devforge-sandbox</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-50/80 dark:bg-emerald-500/5 border border-emerald-200/60 dark:border-emerald-500/10">
          <span className="text-emerald-500 shrink-0">&#10003;</span>
          <span className="text-emerald-700 dark:text-emerald-400 font-semibold">200 OK</span>
        </div>
      </div>
    </div>
  )
}

function BentoSentinel() {
  return (
    <div className="md:col-span-2 group relative rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-6 overflow-hidden transition-all duration-300 hover:border-rose-300 dark:hover:border-rose-500/30 hover:shadow-xl hover:shadow-rose-500/5 hover:-translate-y-0.5">
      <div className="flex items-center gap-3 mb-5">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 group-hover:scale-110 transition-transform duration-300">
          <Activity className="w-5 h-5 text-rose-600 dark:text-rose-400" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Live Sentinel Engine</h3>
          <p className="text-[11px] text-zinc-500">Real-time observability.</p>
        </div>
      </div>
      <div className="rounded-xl bg-zinc-950 p-4 font-mono text-xs overflow-hidden border border-zinc-800">
        <div className="flex items-center gap-2 text-zinc-500 text-[10px] mb-3 pb-2 border-b border-zinc-800/80">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>monitoring &middot; live</span>
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-zinc-400">GET api.myapp.com/health</span>
            <span className="text-emerald-400 font-semibold">200 &#10003;</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-zinc-500">&#9500;&#9472; Latency</span>
            <span className="text-cyan-400">142ms</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-zinc-500">&#9500;&#9472; Uptime</span>
            <span className="text-emerald-400">99.97%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-zinc-500">&#9492;&#9472; Next poll</span>
            <span className="text-zinc-400">58s</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function BentoAlerts() {
  return (
    <div className="md:col-span-3 group relative rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-6 overflow-hidden transition-all duration-300 hover:border-amber-300 dark:hover:border-amber-500/30 hover:shadow-xl hover:shadow-amber-500/5 hover:-translate-y-0.5">
      <div className="flex flex-col md:flex-row md:items-start gap-6">
        <div className="flex items-center gap-3 md:w-1/3 md:pt-1">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 group-hover:scale-110 transition-transform duration-300 shrink-0">
            <Mail className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Instant Alerts</h3>
            <p className="text-[11px] text-zinc-500">Email on failure. Zero config.</p>
          </div>
        </div>
        <div className="flex-1 rounded-xl bg-zinc-950 p-4 font-mono text-xs overflow-hidden border border-zinc-800">
          <div className="flex items-center gap-2 text-zinc-500 text-[10px] mb-3 pb-2 border-b border-zinc-800/80">
            <span className="h-2 w-2 rounded-full bg-amber-500/60" />
            <span>alert_payload.json</span>
          </div>
          <pre className="text-amber-400/90 whitespace-pre">{`{
  "event": "endpoint_degraded",
  "url": "api.myapp.com/v1/users",
  "expected": 200,
  "received": 503,
  "latency_ms": 4250,
  "action": "Email sent to dev@team.com"
}`}</pre>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   Main Page Component
   ───────────────────────────────────────────── */

export default function HomePage() {
  return (
    <div className="space-y-24 pb-8">

      {/* ── Hero ── */}
      <section className="relative mx-auto max-w-4xl px-4 pt-20 sm:pt-28 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 text-xs font-mono text-emerald-700 dark:text-emerald-400 mb-8 animate-fade-in">
          <Sparkles className="h-3.5 w-3.5 text-emerald-500 animate-pulse" />
          <span>Mock & Monitor Platform</span>
        </div>

        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] text-zinc-950 dark:text-zinc-50 mb-6 animate-fade-in">
          Mock in seconds.
          <br />
          <span className="bg-gradient-to-r from-emerald-600 via-cyan-600 to-emerald-600 dark:from-emerald-400 dark:via-cyan-400 dark:to-emerald-400 bg-clip-text text-transparent">
            Monitor forever.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-zinc-500 dark:text-zinc-400 max-w-lg mx-auto mb-10 animate-fade-in">
          Zero backend setup. Instant alerts. Stop waiting and start shipping.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-500 hover:shadow-emerald-500/35 hover:-translate-y-0.5 transition-all duration-300 active:scale-95"
          >
            Get Started for Free
            <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href="#features"
            className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/40 px-7 py-3.5 text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-700 hover:-translate-y-0.5 transition-all duration-300 active:scale-95"
          >
            View Features
          </a>
        </div>
      </section>

      {/* ── Features Bento Grid ── */}
      <section id="features" className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="text-center mb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-500 mb-3">
            Platform
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Everything you need.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <BentoMockEngine />
          <BentoLatency />
          <BentoIsolation />
          <BentoSentinel />
          <BentoAlerts />
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="mx-auto max-w-3xl px-4 text-center">
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 p-10 sm:p-14 transition-all duration-300 hover:shadow-xl hover:shadow-zinc-500/5">
          <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-3">
            Ship faster. Sleep better.
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-8 max-w-md mx-auto">
            Prototype without backend blockers. Monitor without missing a beat.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm px-7 py-3.5 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/35 hover:-translate-y-0.5 transition-all duration-300 active:scale-95"
          >
            Start Building Now
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}