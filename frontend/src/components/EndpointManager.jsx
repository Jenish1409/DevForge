import { useState, useEffect, useCallback } from 'react'
import { Plus, Loader2, Route, Pencil, Trash2 } from 'lucide-react'
import { fetchEndpoints, createEndpoint, updateEndpoint, deleteEndpoint } from '../api/endpoints'
import MethodBadge from './MethodBadge'
import EndpointFormDrawer from './EndpointFormDrawer'

export default function EndpointManager({ projectId }) {
  const [endpoints, setEndpoints] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingEndpoint, setEditingEndpoint] = useState(null)

  const loadEndpoints = useCallback(async () => {
    if (!projectId) return
    setLoading(true)
    setError('')
    try {
      const data = await fetchEndpoints(projectId)
      setEndpoints(data)
    } catch (err) {
      setError(err.message || 'Failed to load endpoints')
      setEndpoints([])
    } finally {
      setLoading(false)
    }
  }, [projectId])

  useEffect(() => {
    loadEndpoints()
  }, [loadEndpoints])

  function openCreateDrawer() {
    setEditingEndpoint(null)
    setDrawerOpen(true)
  }

  function openEditDrawer(endpoint) {
    setEditingEndpoint(endpoint)
    setDrawerOpen(true)
  }

  function closeDrawer() {
    setDrawerOpen(false)
    setEditingEndpoint(null)
  }

  async function handleCreate(payload) {
    const created = await createEndpoint(projectId, payload)
    setEndpoints((prev) => [...prev, created])
  }

  async function handleUpdate(endpointId, payload) {
    const updated = await updateEndpoint(projectId, endpointId, payload)
    setEndpoints((prev) => prev.map((ep) => (ep.id === endpointId ? updated : ep)))
  }

  async function handleDelete(endpointId) {
    if (!confirm('Are you sure you want to delete this endpoint?')) return
    try {
      await deleteEndpoint(projectId, endpointId)
      setEndpoints((prev) => prev.filter((ep) => ep.id !== endpointId))
    } catch (err) {
      setError(err.message || 'Failed to delete endpoint')
    }
  }

  if (!projectId) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <Route className="w-10 h-10 text-zinc-300 dark:text-zinc-700 mx-auto mb-3" />
          <p className="text-sm text-zinc-500">Select a project to manage endpoints</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 shrink-0">
        <div>
          <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">Endpoints</h3>
          <p className="text-xs text-zinc-500 mt-0.5">
            {endpoints.length} mock route{endpoints.length !== 1 ? 's' : ''} configured
          </p>
        </div>
        <button
          onClick={openCreateDrawer}
          className="flex items-center gap-2 rounded-lg bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700 border border-zinc-300 dark:border-zinc-700 px-3.5 py-2 text-sm font-medium text-zinc-800 dark:text-zinc-200 shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Endpoint
        </button>
      </div>

      <div className="flex-1 overflow-auto px-6 pb-6">
        {error && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-16 text-zinc-500">
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            Loading endpoints…
          </div>
        ) : endpoints.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-800 bg-white/50 dark:bg-transparent">
            <Route className="w-8 h-8 text-zinc-300 dark:text-zinc-700 mb-3" />
            <p className="text-sm text-zinc-500">No endpoints yet</p>
            <button
              onClick={openCreateDrawer}
              className="mt-3 text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 dark:hover:text-emerald-300 transition-colors"
            >
              Create your first endpoint
            </button>
          </div>
        ) : (
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm dark:shadow-none bg-white dark:bg-transparent transition-colors">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/80">
                  <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider w-28">
                    Method
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    Path
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider w-24">
                    Status
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider hidden md:table-cell">
                    Content Type
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider hidden lg:table-cell">
                    Response Preview
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider w-24">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
                {endpoints.map((ep) => (
                  <tr key={ep.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                    <td className="px-4 py-3">
                      <MethodBadge method={ep.method} />
                    </td>
                    <td className="px-4 py-3 font-mono text-zinc-800 dark:text-zinc-300">{ep.path}</td>
                    <td className="px-4 py-3 font-mono text-zinc-600 dark:text-zinc-400">{ep.statusCode}</td>
                    <td className="px-4 py-3 font-mono text-xs text-zinc-500 hidden md:table-cell">
                      {ep.contentType}
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <code className="block max-w-md truncate text-xs font-mono text-zinc-500">
                        {ep.responseBody}
                      </code>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditDrawer(ep)}
                          title="Edit endpoint"
                          className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(ep.id)}
                          title="Delete endpoint"
                          className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/15 text-red-600 dark:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <EndpointFormDrawer
        open={drawerOpen}
        onClose={closeDrawer}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        endpoint={editingEndpoint}
      />
    </div>
  )
}