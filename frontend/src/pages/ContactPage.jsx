import { useState } from 'react'
import { Mail, Send, MessageSquare, Loader2, CheckCircle } from 'lucide-react'
import { submitContact } from '../api/auth'
import { useToast } from '../context/ToastContext'

export default function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const { showToast } = useToast()

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)
    try {
      await submitContact(name, email, message)
      setSuccess(true)
      showToast("Message sent! We'll get back to you soon.", 'success')
      setName('')
      setEmail('')
      setMessage('')
    } catch (err) {
      setError(err.message || 'Failed to send message')
      showToast(err.message || 'Failed to send message', 'error')
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    'w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-4 py-3 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition-colors'

  return (
    <section className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-xl">
        <div className="text-center mb-10">
          <div className="mb-4 inline-flex items-center justify-center rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 p-3">
            <MessageSquare className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 sm:text-4xl">Contact Us</h1>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Got feedback, a feature request, or a strongly worded opinion about REST vs GraphQL?
            Drop us a line. We read every message.
          </p>
        </div>

        {success ? (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10 p-8 text-center">
            <CheckCircle className="w-12 h-12 text-emerald-600 dark:text-emerald-400 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">Message Sent!</h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">
              Thanks for reaching out. We&apos;ll get back to you soon.
            </p>
            <button
              onClick={() => setSuccess(false)}
              className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 dark:hover:text-emerald-300 transition-colors"
            >
              Send another message
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-6 sm:p-8 shadow-xl shadow-zinc-300/20 dark:shadow-black/20 transition-colors"
          >
            {error && (
              <div className="rounded-lg border border-red-500/30 bg-red-50 dark:bg-red-500/10 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 mb-5">
                {error}
              </div>
            )}

            <div className="space-y-5">
              <div>
                <label htmlFor="contact-name" className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1.5 uppercase tracking-wider">
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
                <label htmlFor="contact-email" className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1.5 uppercase tracking-wider">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 dark:text-zinc-600" />
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
                <label htmlFor="contact-message" className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1.5 uppercase tracking-wider">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows={6}
                  placeholder="Your message..."
                  className={`${inputClass} resize-none`}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full flex items-center justify-center gap-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-3 text-sm font-medium text-white shadow-sm transition-colors"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending…
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Send Message
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
