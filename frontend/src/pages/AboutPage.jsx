import { Terminal, Code2, Cpu, Database, Globe, Check, X as XIcon } from 'lucide-react'

function GithubIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  )
}

function LinkedinIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

const FRICTION_POINTS = [
  'Blocked by incomplete API specs',
  'Staging servers silently failing',
  'Backend boilerplate for simple mocks',
  'No alerts when endpoints degrade',
]

const FLOW_POINTS = [
  'Spin up mock endpoints in seconds',
  'Isolated sandboxes with API key auth',
  'Configurable latency simulation',
  'Real-time monitoring with email alerts',
]

const TECH_STACK = [
  { icon: Code2, name: 'React + Vite + Tailwind', tag: 'Responsive UI' },
  { icon: Cpu, name: 'Java 25 + Spring Boot 3', tag: 'Async Engine' },
  { icon: Database, name: 'PostgreSQL + Redis', tag: 'Sub-ms Cache' },
  { icon: Globe, name: 'Brevo SMTP', tag: 'Transactional Email' },
]

export default function AboutPage() {
  return (
    <section className="relative mx-auto max-w-5xl px-4 py-20 sm:px-6 sm:py-28 animate-fade-in">
      {/* Header */}
      <div className="text-center mb-16">
        <div className="mb-5 inline-flex items-center justify-center rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 p-3 shadow-sm">
          <Terminal className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          About DevForge
        </h1>
        <p className="mt-3 text-zinc-500 dark:text-zinc-400 text-sm max-w-md mx-auto">
          API Mocking and Live Monitoring — one platform.
        </p>
      </div>

      {/* Problem / Solution Contrast */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-16">
        {/* Friction */}
        <div className="rounded-2xl border border-rose-200/60 dark:border-rose-500/15 bg-white dark:bg-zinc-950 p-6 sm:p-8 transition-all duration-300 hover:shadow-lg hover:shadow-rose-500/5">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-6">The Friction</h2>
          <ul className="space-y-4">
            {FRICTION_POINTS.map((item) => (
              <li key={item} className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                <div className="flex items-center justify-center w-6 h-6 rounded-md bg-rose-50 dark:bg-rose-500/10 shrink-0">
                  <XIcon className="w-3.5 h-3.5 text-rose-500" />
                </div>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Flow */}
        <div className="rounded-2xl border border-emerald-200/60 dark:border-emerald-500/15 bg-white dark:bg-zinc-950 p-6 sm:p-8 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/5">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-6">The Flow</h2>
          <ul className="space-y-4">
            {FLOW_POINTS.map((item) => (
              <li key={item} className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                <div className="flex items-center justify-center w-6 h-6 rounded-md bg-emerald-50 dark:bg-emerald-500/10 shrink-0">
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                </div>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Tech Stack */}
      <div className="mb-16">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-6">Architecture</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {TECH_STACK.map((tech) => (
            <div
              key={tech.name}
              className="group rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300 dark:hover:border-emerald-500/30 hover:shadow-md hover:shadow-emerald-500/5"
            >
              <div className="flex items-center justify-center w-10 h-10 mx-auto rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 mb-3 group-hover:scale-110 transition-transform duration-300">
                <tech.icon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 mb-1">{tech.name}</h3>
              <p className="text-[10px] text-zinc-500 font-mono">{tech.tag}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Developer Bio */}
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-6 sm:p-8 transition-all duration-300 hover:shadow-xl hover:shadow-zinc-500/5">
        <div className="flex flex-col sm:flex-row items-start gap-5">
          <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 text-white text-xl font-bold shrink-0 shadow-lg shadow-emerald-500/20">
            JR
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Jenish Raichura</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 mb-4">
              Full-stack developer. Built DevForge from the ground up as a showcase of modern web engineering.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://github.com/Jenish1409/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 px-3.5 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 transition-all duration-300 hover:-translate-y-0.5 active:scale-95"
              >
                <GithubIcon className="w-4 h-4" />
                GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/jenish-raichura-9b535727b/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 px-3.5 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 transition-all duration-300 hover:-translate-y-0.5 active:scale-95"
              >
                <LinkedinIcon className="w-4 h-4" />
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}