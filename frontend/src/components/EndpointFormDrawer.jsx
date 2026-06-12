import { useState, useEffect } from 'react'
import { X, Loader2 } from 'lucide-react'

const HTTP_METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']

const STATUS_CODES = [
  { value: 200, label: '200 OK' },
  { value: 201, label: '201 Created' },
  { value: 204, label: '204 No Content' },
  { value: 400, label: '400 Bad Request' },
  { value: 401, label: '401 Unauthorized' },
  { value: 403, label: '403 Forbidden' },
  { value: 404, label: '404 Not Found' },
  { value: 500, label: '500 Server Error' },
  { value: 502, label: '502 Bad Gateway' },
  { value: 503, label: '503 Service Unavailable' }
]

const CONTENT_TYPES = [
  'application/json',
  'application/xml',
  'text/html',
  'text/plain',
]

const EMPTY_FORM = {
  method: 'GET',
  path: '/',
  statusCode: 200,
  responseBody: '{\n  \n}',
  contentType: 'application/json',
  networkDelay: 0,
}

const fieldClass =
  'w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition-colors'

export default function EndpointFormDrawer({ open, onClose, onCreate, onUpdate, endpoint }) {
  const isEdit = !!endpoint
  const [method, setMethod] = useState(EMPTY_FORM.method)
  const [path, setPath] = useState(EMPTY_FORM.path)
  const [statusCode, setStatusCode] = useState(EMPTY_FORM.statusCode)
  const [responseBody, setResponseBody] = useState(EMPTY_FORM.responseBody)
  const [contentType, setContentType] = useState(EMPTY_FORM.contentType)
  const [networkDelay, setNetworkDelay] = useState(EMPTY_FORM.networkDelay)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open) return

    if (endpoint) {
      setMethod(endpoint.method ?? EMPTY_FORM.method)
      setPath(endpoint.path ?? EMPTY_FORM.path)
      setStatusCode(endpoint.statusCode ?? EMPTY_FORM.statusCode)
      setResponseBody(endpoint.responseBody ?? EMPTY_FORM.responseBody)
      setContentType(endpoint.contentType ?? EMPTY_FORM.contentType)
      setNetworkDelay(endpoint.delayMs ?? EMPTY_FORM.networkDelay) // map delayMs to networkDelay
    } else {
      setMethod(EMPTY_FORM.method)
      setPath(EMPTY_FORM.path)
      setStatusCode(EMPTY_FORM.statusCode)
      setResponseBody(EMPTY_FORM.responseBody)
      setContentType(EMPTY_FORM.contentType)
      setNetworkDelay(EMPTY_FORM.networkDelay)
    }
    setError('')
  }, [open, endpoint])

  if (!open) return null

  function reset() {
    setMethod(EMPTY_FORM.method)
    setPath(EMPTY_FORM.path)
    setStatusCode(EMPTY_FORM.statusCode)
    setResponseBody(EMPTY_FORM.responseBody)
    setContentType(EMPTY_FORM.contentType)
    setNetworkDelay(EMPTY_FORM.networkDelay)
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

    const payload = { 
      method, 
      path, 
      statusCode, 
      responseBody, 
      contentType, 
      delayMs: networkDelay // map networkDelay to delayMs
    }

    try {
      if (isEdit) {
        await onUpdate(endpoint.id, payload)
      } else {
        await onCreate(payload)
      }
      reset()
      onClose()
    } catch (err) {
      setError(err.message || `Failed to ${isEdit ? 'update' : 'create'} endpoint`)
    } finally {
      setLoading(false)
    }
  }

  let badgeText = 'response.txt'
  let placeholderText = 'Your response body here...'
  if (contentType.includes('json')) {
    badgeText = 'response.json'
    placeholderText = '{\n  "key": "value"\n}'
  } else if (contentType.includes('xml')) {
    badgeText = 'response.xml'
    placeholderText = '<root>\n  <key>value</key>\n</root>'
  } else if (contentType.includes('html')) {
    badgeText = 'response.html'
    placeholderText = '<!DOCTYPE html>\n<html>\n  <body>\n    <h1>Hello</h1>\n  </body>\n</html>'
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/30 dark:bg-black/50 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative w-full max-w-xl h-full flex flex-col border-l border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xl transition-colors">
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 shrink-0">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              {isEdit ? 'Edit Endpoint' : 'Create Endpoint'}
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              {isEdit ? 'Update mock route configuration' : 'Define a new mock route'}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-1 rounded-md text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1.5 uppercase tracking-wider">
                Method
              </label>
              <select value={method} onChange={(e) => setMethod(e.target.value)} className={fieldClass}>
                {HTTP_METHODS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1.5 uppercase tracking-wider">
                Status Code
              </label>
              <select
                value={statusCode}
                onChange={(e) => setStatusCode(Number(e.target.value))}
                required
                className={`${fieldClass} font-mono`}
              >
                {/* Dynamically include the current statusCode if it's not in our predefined list (e.g. from a legacy edit) */}
                {!STATUS_CODES.some(c => c.value === statusCode) && (
                  <option value={statusCode}>{statusCode} Custom</option>
                )}
                {STATUS_CODES.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1.5 uppercase tracking-wider">
              Path
            </label>
            <input
              type="text"
              value={path}
              onChange={(e) => setPath(e.target.value)}
              required
              placeholder="/users"
              className={`${fieldClass} font-mono`}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1.5 uppercase tracking-wider">
              Content Type
            </label>
            <select
              value={contentType}
              onChange={(e) => setContentType(e.target.value)}
              className={`${fieldClass} font-mono`}
            >
              {!CONTENT_TYPES.includes(contentType) && contentType && (
                <option value={contentType}>{contentType}</option>
              )}
              {CONTENT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1.5 uppercase tracking-wider">
              Network Delay (ms)
            </label>
            <input
              type="number"
              value={networkDelay}
              onChange={(e) => setNetworkDelay(Number(e.target.value))}
              min={0}
              step={1}
              className={`${fieldClass} font-mono`}
            />
            <p className="mt-2 text-xs text-zinc-500 leading-relaxed">
              Note: This delay is additive. It adds to the server&apos;s baseline processing time to simulate slow networks.
            </p>
          </div>

          <div className="flex-1">
            <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1.5 uppercase tracking-wider">
              Response Body
            </label>
            <div className="rounded-lg border border-zinc-300 dark:border-zinc-700 overflow-hidden">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800/80 border-b border-zinc-200 dark:border-zinc-700">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
                <span className="ml-2 text-[10px] text-zinc-500 font-mono">{badgeText}</span>
              </div>
              <textarea
                value={responseBody}
                onChange={(e) => setResponseBody(e.target.value)}
                rows={14}
                spellCheck={false}
                className="w-full bg-zinc-50 dark:bg-zinc-950 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-300/90 font-mono leading-relaxed outline-none resize-none"
                placeholder={placeholderText}
              />
            </div>
          </div>
        </form>

        <div className="shrink-0 flex justify-end gap-3 px-6 py-4 border-t border-zinc-200 dark:border-zinc-800">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-sm text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-sm font-medium text-white shadow-sm transition-colors"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {isEdit ? 'Save Changes' : 'Create Endpoint'}
          </button>
        </div>
      </div>
    </div>
  )
}