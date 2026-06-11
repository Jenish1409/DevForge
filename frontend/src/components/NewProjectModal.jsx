import { useState } from 'react'
import { X, Loader2 } from 'lucide-react'

const fieldClass =
  'w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition-colors'

export default function NewProjectModal({ open, onClose, onCreate }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [requireApiKey, setRequireApiKey] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!open) return null

  function reset() {
    setName('')
    setDescription('')
    setRequireApiKey(false)
    setError('')
  }

  function handleClose() {
    reset()
    onClose()
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await onCreate({ name, description, requireApiKey })
      reset()
      onClose()
    } catch (err) {
      setError(err.message || 'Failed to create project')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 dark:bg-black/60 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative w-full max-w-lg rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xl transition-colors">
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">New Project</h2>
          <button
            onClick={handleClose}
            className="p-1 rounded-md text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1.5 uppercase tracking-wider">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className={fieldClass}
              placeholder="My API Project"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1.5 uppercase tracking-wider">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className={`${fieldClass} resize-none`}
              placeholder="Optional description"
            />
          </div>

          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={requireApiKey}
              onChange={(e) => setRequireApiKey(e.target.checked)}
              className="w-4 h-4 rounded border-zinc-400 dark:border-zinc-600 bg-white dark:bg-zinc-950 text-emerald-500 focus:ring-emerald-500/30 focus:ring-offset-0"
            />
            <span className="text-sm text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-800 dark:group-hover:text-zinc-300 transition-colors">
              Require API key for mock requests
            </span>
          </label>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-sm font-medium text-white shadow-sm transition-colors"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
