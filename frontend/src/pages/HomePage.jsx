import { Link } from 'react-router-dom'
import {
  Zap,
  Timer,
  Shield,
  Terminal,
  ArrowRight,
  BookOpen,
  Braces,
} from 'lucide-react'

const FEATURES = [
  {
    icon: Zap,
    title: 'Instant Mocking',
    accent: 'text-emerald-400',
    glow: 'shadow-emerald-500/10',
    border: 'border-emerald-500/20 hover:border-emerald-500/40',
    description:
      'Mock APIs faster than your PM changes requirements. Spin up endpoints in seconds — no Spring Boot project, no 47-layer architecture, no existential crisis.',
  },
  {
    icon: Timer,
    title: 'Dynamic Delays',
    accent: 'text-cyan-400',
    glow: 'shadow-cyan-500/10',
    border: 'border-cyan-500/20 hover:border-cyan-500/40',
    description:
      'Simulate slow networks without deploying to production and praying. Add latency on purpose, for once. Guaranteed to not give you a LeetCode Time Limit Exceeded (TLE) error.',
  },
  {
    icon: Shield,
    title: 'Project Isolation',
    accent: 'text-violet-400',
    glow: 'shadow-violet-500/10',
    border: 'border-violet-500/20 hover:border-violet-500/40',
    description:
      'Keep your side-project mocks separate from your "this is definitely production" mocks. API keys, isolated projects, zero chance of returning `{ "user": "admin" }` to the wrong team.',
  },
  {
    icon: Braces,
    title: 'JSON Without the Java',
    accent: 'text-amber-400',
    glow: 'shadow-amber-500/10',
    border: 'border-amber-500/20 hover:border-amber-500/40',
    description:
      'Skip writing 50 classes of Java boilerplate just to return a JSON object. Paste your response body. Pick a status code. Go touch grass. We promise our servers won\'t reply with "It works on my machine".',
  },
]

export default function HomePage() {
  return (
    <>
      <section className="relative mx-auto max-w-6xl px-4 pt-20 pb-24 sm:px-6 sm:pt-28 sm:pb-32">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-mono text-emerald-400">
            <Terminal className="h-3.5 w-3.5" />
            v1.0 — now with 100% fewer YAML nightmares
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-zinc-50 sm:text-6xl lg:text-7xl">
            Forge mock APIs.
            <br />
            <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              Skip the boilerplate.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-400 leading-relaxed sm:text-xl">
            DevForge lets you spin up fake backends before your backend team finishes
            their standup. Mock APIs faster than your PM changes requirements — and with
            significantly less emotional damage.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/login"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-xl shadow-emerald-500/25 hover:bg-emerald-500 transition-colors"
            >
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#features"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900/50 px-6 py-3 text-sm font-semibold text-zinc-300 hover:border-zinc-600 hover:bg-zinc-800/50 transition-colors"
            >
              <BookOpen className="h-4 w-4" />
              Read Docs
            </a>
          </div>

          <div className="mt-14 rounded-xl border border-zinc-800 bg-zinc-900/60 p-1 shadow-2xl shadow-black/40">
            <div className="flex items-center gap-2 border-b border-zinc-800 px-4 py-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
              <span className="ml-2 font-mono text-[11px] text-zinc-500">~/devforge/mock.sh</span>
            </div>
            <pre className="overflow-x-auto p-5 text-left text-sm leading-relaxed font-mono">
              <code>
                <span className="text-zinc-500">$</span>{' '}
                <span className="text-emerald-400">curl</span>{' '}
                <span className="text-zinc-300">http://localhost:8080/mock/your-project/users</span>
                {'\n\n'}
                <span className="text-cyan-400">{'{'}</span>
                {'\n'}
                {'  '}
                <span className="text-violet-400">&quot;id&quot;</span>
                <span className="text-zinc-500">:</span>{' '}
                <span className="text-amber-300">1</span>
                <span className="text-zinc-500">,</span>
                {'\n'}
                {'  '}
                <span className="text-violet-400">&quot;name&quot;</span>
                <span className="text-zinc-500">:</span>{' '}
                <span className="text-emerald-300">&quot;Not A Real User&quot;</span>
                <span className="text-zinc-500">,</span>
                {'\n'}
                {'  '}
                <span className="text-violet-400">&quot;status&quot;</span>
                <span className="text-zinc-500">:</span>{' '}
                <span className="text-emerald-300">&quot;mocked&quot;</span>
                {'\n'}
                <span className="text-cyan-400">{'}'}</span>
                {'\n\n'}
                <span className="text-zinc-600"># No DTOs were harmed in the making of this response.</span>
              </code>
            </pre>
          </div>
        </div>
      </section>

      <section id="features" className="relative border-t border-zinc-800/80 bg-zinc-900/30 py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center mb-14">
            <p className="text-xs font-medium uppercase tracking-widest text-emerald-500 mb-3">Features</p>
            <h2 className="text-3xl font-bold text-zinc-100 sm:text-4xl">
              Everything you need.
              <br />
              <span className="text-zinc-500">Nothing your manager will ask for.</span>
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className={`group rounded-xl border bg-zinc-900/50 p-6 transition-all hover:bg-zinc-900/80 shadow-lg ${feature.glow} ${feature.border}`}
              >
                <div className={`mb-4 inline-flex rounded-lg border border-zinc-800 bg-zinc-950 p-2.5 ${feature.accent}`}>
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-zinc-100 mb-2">{feature.title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <p className="text-zinc-500 text-sm mb-6">
              Still reading? Your frontend team is waiting on that API contract.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-medium text-sm transition-colors"
            >
              Stop procrastinating — start mocking
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
