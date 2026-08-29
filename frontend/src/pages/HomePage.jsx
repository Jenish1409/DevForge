import DynamicBackground from '../components/marketing/DynamicBackground'

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

/* Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
   Dynamic Background Effects
   Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ */
/* ─────────────────────────────────────────────
   Hero Visual — Floating Terminal Window
   ───────────────────────────────────────────── */

function HeroTerminal() {
  return (
    <div className="relative w-full animate-fade-in group">
      {/* Enhanced Pulsing Glow backdrop */}
      <div className="absolute -inset-10 bg-gradient-to-br from-emerald-500/20 via-transparent to-cyan-500/20 rounded-full blur-3xl pointer-events-none transition-all duration-1000 opacity-60 group-hover:opacity-100 group-hover:scale-105" />

      <div className="relative rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/60 shadow-2xl shadow-zinc-400/20 dark:shadow-black/40 overflow-hidden backdrop-blur-2xl transition-transform duration-500 hover:-translate-y-2 hover:shadow-emerald-500/10">
        {/* Window chrome */}
        <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 px-4 py-2.5 bg-zinc-50/80 dark:bg-zinc-900/60 backdrop-blur-md">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-red-400/80 hover:bg-red-500 transition-colors" />
            <span className="h-3 w-3 rounded-full bg-amber-400/80 hover:bg-amber-500 transition-colors" />
            <span className="h-3 w-3 rounded-full bg-emerald-400/80 hover:bg-emerald-500 transition-colors" />
          </div>
          <span className="font-mono text-[10px] text-zinc-400 font-medium tracking-wide">devforge-cli</span>
          <span className="w-12" />
        </div>

        {/* Terminal body */}
        <div className="p-5 font-mono text-xs leading-relaxed bg-zinc-950 text-zinc-300 space-y-3">
          {/* Command 1: Create mock */}
          <div className="group/cmd">
            <p className="text-zinc-500 transition-colors group-hover/cmd:text-zinc-400">
              <span className="text-emerald-400">$</span> devforge mock create --route /api/users --method GET
            </p>
            <p className="text-emerald-400/90 mt-1">&#10003; Mock route created &#8594; 200 OK</p>
          </div>

          {/* Command 2: Set latency */}
          <div className="group/cmd">
            <p className="text-zinc-500 transition-colors group-hover/cmd:text-zinc-400">
              <span className="text-emerald-400">$</span> devforge mock delay --ms 2000
            </p>
            <p className="text-cyan-400/90 mt-1">&#10003; Latency injected &#8594; 2000ms</p>
          </div>

          {/* Command 3: Monitor */}
          <div className="group/cmd">
            <p className="text-zinc-500 transition-colors group-hover/cmd:text-zinc-400">
              <span className="text-emerald-400">$</span> devforge sentinel watch --url api.myapp.com/health
            </p>
            <div className="mt-1 space-y-0.5">
              <p className="text-zinc-400">&#9500;&#9472; Status: <span className="text-emerald-400">200 &#10003;</span></p>
              <p className="text-zinc-400">&#9500;&#9472; Latency: <span className="text-cyan-400">142ms</span></p>
              <p className="text-zinc-400">&#9492;&#9472; Uptime: <span className="text-emerald-400">99.97%</span></p>
            </div>
          </div>

          {/* Cursor */}
          <p className="text-zinc-500">
            <span className="text-emerald-400">$</span>
            <span className="inline-block w-2 h-4 bg-emerald-400 ml-1 animate-pulse align-middle" />
          </p>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   Bento Grid Sub-Components
   ───────────────────────────────────────────── */

function BentoMockEngine() {
  return (
    <div className="md:col-span-2 group relative rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/50 p-6 overflow-hidden transition-all duration-500 hover:border-emerald-300 dark:hover:border-emerald-500/50 hover:shadow-2xl hover:shadow-emerald-500/10 hover:-translate-y-1 backdrop-blur-xl">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      <div className="relative z-10 flex items-center gap-3 mb-5">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
          <Zap className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">Instant Mock Routes</h3>
          <p className="text-[11px] text-zinc-500">Define. Deploy. Done.</p>
        </div>
      </div>
      <div className="relative z-10 rounded-xl bg-zinc-950 p-4 font-mono text-xs leading-relaxed overflow-hidden border border-zinc-800 shadow-inner group-hover:border-emerald-500/30 transition-colors duration-500">
        <div className="flex items-center gap-2 text-zinc-500 text-[10px] mb-3 pb-2 border-b border-zinc-800/80">
          <span className="h-2 w-2 rounded-full bg-emerald-500/60 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
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
    <div className="group relative rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/50 p-6 overflow-hidden transition-all duration-500 hover:border-cyan-300 dark:hover:border-cyan-500/50 hover:shadow-2xl hover:shadow-cyan-500/10 hover:-translate-y-1 backdrop-blur-xl">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      <div className="relative z-10 flex items-center gap-3 mb-6">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/20 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500">
          <Clock className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">Latency Control</h3>
          <p className="text-[11px] text-zinc-500">Simulate real lag.</p>
        </div>
      </div>
      <div className="relative z-10 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-zinc-400 font-mono">delay_ms</span>
          <span className="text-3xl font-extrabold font-mono text-cyan-500 dark:text-cyan-400 tabular-nums">2000</span>
        </div>
        <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
          <div className="h-full w-2/3 bg-gradient-to-r from-cyan-500 to-cyan-300 rounded-full animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.5)]" />
        </div>
        <p className="text-[10px] text-zinc-500 font-mono">threshold: 3000ms</p>
      </div>
    </div>
  )
}

function BentoIsolation() {
  return (
    <div className="group relative rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/50 p-6 overflow-hidden transition-all duration-500 hover:border-violet-300 dark:hover:border-violet-500/50 hover:shadow-2xl hover:shadow-violet-500/10 hover:-translate-y-1 backdrop-blur-xl">
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      <div className="relative z-10 flex items-center gap-3 mb-5">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-500/10 border border-violet-200 dark:border-violet-500/20 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
          <Shield className="w-5 h-5 text-violet-600 dark:text-violet-400" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">Project Sandboxes</h3>
          <p className="text-[11px] text-zinc-500">Isolated & secured.</p>
        </div>
      </div>
      <div className="relative z-10 space-y-2 font-mono text-xs">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 transition-colors group-hover:border-violet-500/30">
          <span className="text-violet-500 shrink-0">&#8594;</span>
          <span className="text-zinc-500 dark:text-zinc-400 shrink-0">API-Key:</span>
          <span className="text-violet-600 dark:text-violet-400 truncate">df_key_42a8b9c...</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 transition-colors group-hover:border-emerald-500/30">
          <span className="text-emerald-500 shrink-0">&#10003;</span>
          <span className="text-zinc-500 dark:text-zinc-400 shrink-0">Origin:</span>
          <span className="text-emerald-600 dark:text-emerald-400">devforge-sandbox</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-50/80 dark:bg-emerald-500/5 border border-emerald-200/60 dark:border-emerald-500/20 transition-colors group-hover:bg-emerald-500/10">
          <span className="text-emerald-500 shrink-0">&#10003;</span>
          <span className="text-emerald-700 dark:text-emerald-400 font-semibold">200 OK</span>
        </div>
      </div>
    </div>
  )
}

function BentoSentinel() {
  return (
    <div className="md:col-span-2 group relative rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/50 p-6 overflow-hidden transition-all duration-500 hover:border-rose-300 dark:hover:border-rose-500/50 hover:shadow-2xl hover:shadow-rose-500/10 hover:-translate-y-1 backdrop-blur-xl">
      <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      <div className="relative z-10 flex items-center gap-3 mb-5">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500">
          <Activity className="w-5 h-5 text-rose-600 dark:text-rose-400" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">Live Sentinel Engine</h3>
          <p className="text-[11px] text-zinc-500">Real-time observability.</p>
        </div>
      </div>
      <div className="relative z-10 rounded-xl bg-zinc-950 p-4 font-mono text-xs overflow-hidden border border-zinc-800 shadow-inner group-hover:border-rose-500/30 transition-colors duration-500">
        <div className="flex items-center gap-2 text-zinc-500 text-[10px] mb-3 pb-2 border-b border-zinc-800/80">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          <span>monitoring &middot; live</span>
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-zinc-400 transition-colors group-hover:text-zinc-300">GET api.myapp.com/health</span>
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
    <div className="md:col-span-3 group relative rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/50 p-6 overflow-hidden transition-all duration-500 hover:border-amber-300 dark:hover:border-amber-500/50 hover:shadow-2xl hover:shadow-amber-500/10 hover:-translate-y-1 backdrop-blur-xl">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      <div className="relative z-10 flex flex-col md:flex-row md:items-start gap-6">
        <div className="flex items-center gap-3 md:w-1/3 md:pt-1">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500 shrink-0">
            <Mail className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">Instant Alerts</h3>
            <p className="text-[11px] text-zinc-500">Email on failure. Zero config.</p>
          </div>
        </div>
        <div className="flex-1 rounded-xl bg-zinc-950 p-4 font-mono text-xs overflow-hidden border border-zinc-800 shadow-inner group-hover:border-amber-500/30 transition-colors duration-500">
          <div className="flex items-center gap-2 text-zinc-500 text-[10px] mb-3 pb-2 border-b border-zinc-800/80">
            <span className="h-2 w-2 rounded-full bg-amber-500/60 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
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
    <div className="relative overflow-hidden bg-zinc-50 dark:bg-zinc-950 transition-colors duration-700 min-h-screen">
      
      {/* ── Dynamic Moving Background ── */}
      <DynamicBackground />
      
      <div className="relative space-y-24 pb-16 z-10">

        {/* ── Hero — Asymmetric Split ── */}
        <section className="mx-auto max-w-7xl px-4 pt-16 sm:pt-20 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

            {/* Left: Copy */}
            <div className="lg:col-span-5 space-y-6 text-left animate-fade-in relative z-20">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 text-xs font-mono text-emerald-700 dark:text-emerald-400 transition-colors hover:bg-emerald-500/20 hover:border-emerald-500/40 cursor-default shadow-sm shadow-emerald-500/5">
                <Sparkles className="h-3.5 w-3.5 text-emerald-500 animate-pulse" />
                <span>Mock & Monitor Platform</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-zinc-950 dark:text-zinc-50 transition-all drop-shadow-sm">
                Mock in seconds.
                <br />
                <span className="bg-gradient-to-r from-emerald-600 via-cyan-600 to-emerald-600 dark:from-emerald-400 dark:via-cyan-400 dark:to-emerald-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-pulse" style={{ animationDuration: '4s' }}>
                  Monitor forever.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-300 max-w-md leading-relaxed transition-colors drop-shadow-sm">
                Zero backend setup. Instant alerts. Stop waiting and start shipping.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-500 hover:shadow-emerald-500/40 hover:-translate-y-0.5 transition-all duration-300 active:scale-95 group"
                >
                  Get Started for Free
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <a
                  href="#features"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white/70 dark:bg-zinc-800/40 px-6 py-3.5 text-sm font-semibold text-zinc-800 dark:text-zinc-200 hover:border-zinc-300 dark:hover:border-zinc-600 hover:bg-white dark:hover:bg-zinc-800 hover:-translate-y-0.5 transition-all duration-300 active:scale-95 backdrop-blur-md group shadow-sm shadow-zinc-900/5"
                >
                  View Features
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-emerald-500">&#8595;</span>
                </a>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-zinc-200/50 dark:border-zinc-800/50 max-w-xs transition-colors">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                <span className="font-mono text-xs text-zinc-500 dark:text-zinc-400 transition-colors hover:text-zinc-700 dark:hover:text-zinc-300 cursor-default">
                  Deployed on Render + Vercel
                </span>
              </div>
            </div>

            {/* Right: Terminal Visual */}
            <div className="lg:col-span-7 w-full z-20">
              <HeroTerminal />
            </div>
          </div>
        </section>

        {/* ── Features Bento Grid ── */}
        <section id="features" className="mx-auto max-w-5xl px-4 sm:px-6 relative z-20">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400 mb-3 transition-colors drop-shadow-sm">
              Platform
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 transition-colors drop-shadow-sm">
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
        <section className="mx-auto max-w-3xl px-4 text-center relative z-20">
          <div className="relative rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/50 p-10 sm:p-14 transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-500/10 hover:border-emerald-500/30 overflow-hidden backdrop-blur-xl group hover:-translate-y-1">
            {/* Dynamic hover backdrop */}
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            
            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-3 transition-colors">
                Ship faster. Sleep better.
              </h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-8 max-w-md mx-auto transition-colors">
                Prototype without backend blockers. Monitor without missing a beat.
              </p>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm px-7 py-3.5 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-0.5 transition-all duration-300 active:scale-95 group/btn"
              >
                Start Building Now
                <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1 group-hover/btn:scale-110" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}