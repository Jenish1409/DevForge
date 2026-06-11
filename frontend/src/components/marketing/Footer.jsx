import { Link } from 'react-router-dom'
import { Terminal, Coffee } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-zinc-950">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Terminal className="h-4 w-4 text-emerald-400" />
              <span className="font-semibold text-zinc-100">DevForge</span>
            </div>
            <p className="max-w-sm text-sm text-zinc-500 leading-relaxed">
              The API mocking platform for developers who&apos;d rather ship features than
              argue about response schemas in Slack.
            </p>
          </div>

          <div className="flex gap-12">
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-zinc-500 mb-3">Navigate</p>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/" className="text-zinc-400 hover:text-emerald-400 transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <a href="/#features" className="text-zinc-400 hover:text-emerald-400 transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <Link to="/contact" className="text-zinc-400 hover:text-emerald-400 transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="text-zinc-400 hover:text-emerald-400 transition-colors">
                    Login
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-zinc-500 mb-3">Legal-ish</p>
              <ul className="space-y-2 text-sm text-zinc-500">
                <li>No warranty expressed</li>
                <li>No warranty implied</li>
                <li>Definitely no refunds</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-zinc-800 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-2 text-xs text-zinc-500">
            <Coffee className="h-3.5 w-3.5 text-amber-500/80" />
            Built with sweat, tears, and too much caffeine.
          </p>
          <p className="text-xs text-zinc-600 font-mono">
            © {new Date().getFullYear()} DevForge · mock responsibly
          </p>
        </div>
      </div>
    </footer>
  )
}
