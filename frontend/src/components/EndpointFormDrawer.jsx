import { useState } from 'react'
import { X, Loader2 } from 'lucide-react'

const HTTP_METHODS = ['GET', 'POST', 'PUT', 'DELETE']

export default function EndpointFormDrawer({ open, onClose, onCreate }) {
  const [method, setMethod] = useState('GET')
  const [path, setPath] = useState('/')
  const [statusCode, setStatusCode] = useState(200)
  const [responseBody, setResponseBody] = useState('{\n  \n}')
  const [contentType, setContentType] = useState('application/json')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!open) return null

  function reset() {
    setMethod('GET')
    setPath('/')
    setStatusCode(200)
    setResponseBody('{\n  \n}')
    setContentType('application/json')
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
      await onCreate({ method, path, statusCode, responseBody, contentType })
      reset()
      onClose()
    } catch (err) {
      setError(err.message || 'Failed to create endpoint')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative w-full max-w-xl h-full flex flex-col border-l border-zinc-800 bg-zinc-900 shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 shrink-0">
          <div>
            <h2 className="text-lg font-semibold text-zinc-100">Create Endpoint</h2>
            <p className="text-xs text-zinc-500 mt-0.5">Define a new mock route</p>
          </div>
          <button
            onClick={handleClose}
            className="p-1 rounded-md text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-400">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">
                Method
              </label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-100 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30"
              >
                {HTTP_METHODS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">
                Status Code
              </label>
              <input
                type="number"
                value={statusCode}
                onChange={(e) => setStatusCode(Number(e.target.value))}
                min={100}
                max={599}
                required
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-100 font-mono outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">
              Path
            </label>
            <input
              type="text"
              value={path}
              onChange={(e) => setPath(e.target.value)}
              required
              placeholder="/users"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-100 font-mono outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">
              Content Type
            </label>
            <input
              type="text"
              value={contentType}
              onChange={(e) => setContentType(e.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-100 font-mono outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30"
            />
          </div>

          <div className="flex-1">
            <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">
              Response Body
            </label>
            <div className="rounded-lg border border-zinc-700 overflow-hidden">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800/80 border-b border-zinc-700">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
                <span className="ml-2 text-[10px] text-zinc-500 font-mono">response.json</span>
              </div>
              <textarea
                value={responseBody}
                onChange={(e) => setResponseBody(e.target.value)}
                rows={14}
                spellCheck={false}
                className="w-full bg-zinc-950 px-4 py-3 text-sm text-emerald-300/90 font-mono leading-relaxed outline-none resize-none"
                placeholder='{"key": "value"}'
              />
            </div>
          </div>
        </form>

        <div className="shrink-0 flex justify-end gap-3 px-6 py-4 border-t border-zinc-800">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-sm font-medium text-white transition-colors"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Create Endpoint
          </button>
        </div>
      </div>
    </div>
  )
}
