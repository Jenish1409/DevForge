import { useState } from 'react'
import { Mail, Send, MessageSquare } from 'lucide-react'

export default function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
  }

  const inputClass =
    'w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition-colors'

  return (
    <section className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-xl">
        <div className="text-center mb-10">
          <div className="mb-4 inline-flex items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 p-3">
            <MessageSquare className="h-6 w-6 text-emerald-400" />
          </div>
          <h1 className="text-3xl font-bold text-zinc-100 sm:text-4xl">Contact Us</h1>
          <p className="mt-4 text-zinc-400 leading-relaxed">
            Got feedback, a feature request, or a strongly worded opinion about REST vs GraphQL?
            Drop us a line. We read every message* — eventually.
          </p>
          <p className="mt-2 text-xs text-zinc-600 font-mono">
            * delivery not guaranteed. messages may be routed to /dev/null.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6 sm:p-8 shadow-xl shadow-black/20"
        >
          <div className="space-y-5">
            <div>
              <label htmlFor="contact-name" className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">
                Name
              </label>
              <input
                id="contact-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Jane Developer"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="contact-email" className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
                <input
                  id="contact-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@company.com"
                  className={`${inputClass} pl-10`}
                />
              </div>
            </div>

            <div>
              <label htmlFor="contact-message" className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">
                Message
              </label>
              <textarea
                id="contact-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={6}
                placeholder="Dear DevForge team, why does my mock return 404 when I clearly configured 200? (It's always a trailing slash.)"
                className={`${inputClass} resize-none`}
              />
            </div>
          </div>

          <button
            type="submit"
            className="mt-6 w-full flex items-center justify-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 hover:border-zinc-600 px-4 py-3 text-sm font-mono font-medium text-zinc-300 hover:text-zinc-100 transition-colors"
          >
            <Send className="h-4 w-4" />
            Send to /dev/null
          </button>

          <p className="mt-4 text-center text-[11px] text-zinc-600 font-mono">
            {'>'} echo $MESSAGE | mail -s "help" /dev/null && echo "Sent! (probably)"
          </p>
        </form>
      </div>
    </section>
  )
}
