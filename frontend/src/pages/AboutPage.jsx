import { Terminal, Code2, Cpu, Database, Globe } from 'lucide-react'

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

const TECH_STACK = [
  { icon: Code2, name: 'React + Vite', description: 'Modern frontend with lightning-fast HMR' },
  { icon: Cpu, name: 'Spring Boot', description: 'Enterprise-grade Java backend with JWT security' },
  { icon: Database, name: 'PostgreSQL + Redis', description: 'Persistent storage with high-speed caching via Upstash' },
  { icon: Globe, name: 'Brevo Email', description: 'Transactional email for OTP verification & contact forms' },
]

export default function AboutPage() {
  return (
    <section className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="mb-4 inline-flex items-center justify-center rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 p-3">
            <Terminal className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 sm:text-4xl">
            About DevForge
          </h1>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-xl mx-auto">
            A full-stack API mocking platform built to help developers prototype faster
            without waiting on backend teams.
          </p>
        </div>

        {/* About the Project */}
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-6 sm:p-8 shadow-xl shadow-zinc-300/20 dark:shadow-black/20 transition-colors mb-10">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-4">The Project</h2>
          <div className="space-y-4 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            <p>
              <strong className="text-zinc-900 dark:text-zinc-200">DevForge</strong> is a production-grade API mocking platform
              that lets you create, manage, and test mock API endpoints in real-time. Instead of waiting for your
              backend team to finish building endpoints, you can spin up mock routes with custom response bodies,
              status codes, and simulated network delays — all from a clean, modern dashboard.
            </p>
            <p>
              The platform features secure OTP-based registration with email verification, project-level API key
              isolation, a Redis cache-aside pattern for blazing-fast mock responses, and graceful cache fault
              tolerance that ensures zero downtime even when Redis goes offline.
            </p>
            <p>
              Built as a full-stack monorepo with a React/Vite frontend and a Java Spring Boot backend,
              DevForge demonstrates modern software engineering practices including JWT authentication,
              cascading database operations, transactional email delivery, and responsive dark/light theming.
            </p>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-5 px-1">Tech Stack</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {TECH_STACK.map((tech) => (
              <div
                key={tech.name}
                className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-5 transition-colors hover:border-emerald-300 dark:hover:border-emerald-500/30"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20">
                    <tech.icon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{tech.name}</h3>
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-500 leading-relaxed">{tech.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Developer Card */}
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-6 sm:p-8 shadow-xl shadow-zinc-300/20 dark:shadow-black/20 transition-colors">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-5">Built By</h2>
          <div className="flex flex-col sm:flex-row items-start gap-5">
            <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 text-white text-2xl font-bold shrink-0 shadow-lg shadow-emerald-500/20">
              JR
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Jenish Raichura</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 mb-4 leading-relaxed">
                Full-stack developer passionate about building clean, production-grade applications.
                DevForge was built from the ground up as a showcase of modern Java + React engineering — from
                JWT-secured APIs and Redis caching to OTP email flows and responsive UI design.
              </p>
              <div className="flex items-center gap-3">
                <a
                  href="https://github.com/Jenish1409/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 px-3.5 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 transition-colors"
                >
                  <GithubIcon className="w-4 h-4" />
                  GitHub
                </a>
                <a
                  href="https://www.linkedin.com/in/jenish-raichura-9b535727b/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 px-3.5 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 transition-colors"
                >
                  <LinkedinIcon className="w-4 h-4" />
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
