import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Server, CheckCircle, XCircle, AlertCircle, Clock } from 'lucide-react'
import {
  fetchMonitoredApis,
  fetchMonitoringSummary,
  createMonitoredApi,
  updateMonitoredApi,
  deleteMonitoredApi,
  toggleMonitoredApi,
} from '../api/monitoring'
import { useToast } from '../context/ToastContext'

export default function MonitoringDashboard() {
  const [apis, setApis] = useState([])
  const [summary, setSummary] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingApi, setEditingApi] = useState(null)
  const [newApi, setNewApi] = useState({ name: '', url: '', method: 'GET', intervalSeconds: 60, apiKey: '', authHeaderName: 'Authorization' })
  const navigate = useNavigate()
  const { showToast } = useToast()

  const loadData = async () => {
    try {
      const [apisRes, summaryRes] = await Promise.all([
        fetchMonitoredApis(),
        fetchMonitoringSummary(),
      ])
      setApis(apisRes.data || [])
      setSummary(summaryRes.data || null)
    } catch (err) {
      console.error('Failed to fetch monitoring data', err)
    }
  }

  useEffect(() => {
    loadData()
    const interval = setInterval(loadData, 10000)
    return () => clearInterval(interval)
  }, [])

  const handleAddApi = async (e) => {
    e.preventDefault()
    try {
      await createMonitoredApi(newApi)
      setIsModalOpen(false)
      setNewApi({ name: '', url: '', method: 'GET', intervalSeconds: 60, apiKey: '', authHeaderName: 'Authorization' })
      showToast('API registered for monitoring!', 'success')
      loadData()
    } catch (err) {
      showToast(err.message || 'Failed to add API', 'error')
    }
  }

  const handleEditApi = async (e) => {
    e.preventDefault()
    if (!editingApi) return
    try {
      await updateMonitoredApi(editingApi.id, editingApi)
      setIsEditModalOpen(false)
      setEditingApi(null)
      showToast('API updated!', 'success')
      loadData()
    } catch (err) {
      showToast(err.message || 'Failed to update API', 'error')
    }
  }

  const handleToggle = async (e, id) => {
    e.stopPropagation()
    try {
      await toggleMonitoredApi(id)
      loadData()
    } catch { showToast('Failed to toggle', 'error') }
  }

  const handleDelete = async (e, id) => {
    e.stopPropagation()
    if (!confirm('Delete this monitor and all its history?')) return
    try {
      await deleteMonitoredApi(id)
      showToast('Monitor deleted', 'success')
      loadData()
    } catch { showToast('Failed to delete', 'error') }
  }

  const inputCls = 'mt-1 block w-full rounded-lg border-0 py-2.5 px-3 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white ring-1 ring-inset ring-zinc-300 dark:ring-zinc-700 focus:ring-2 focus:ring-inset focus:ring-emerald-500 text-sm transition-colors'

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-zinc-100 dark:bg-zinc-950 transition-colors">
      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
          {[
            { label: 'Total APIs', value: summary.totalApis, icon: Server, color: 'blue' },
            { label: 'APIs UP', value: summary.upApis, icon: CheckCircle, color: 'emerald' },
            { label: 'APIs DOWN', value: summary.downApis, icon: XCircle, color: 'red' },
            { label: 'Incidents Today', value: summary.incidentsToday, icon: AlertCircle, color: 'amber' },
            { label: 'Avg Latency', value: `${Math.round(summary.avgResponseTime)}ms`, icon: Clock, color: 'violet' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{label}</p>
                <div className={`p-1.5 bg-${color}-50 dark:bg-${color}-500/10 rounded-lg`}>
                  <Icon className={`w-4 h-4 text-${color}-600 dark:text-${color}-400`} />
                </div>
              </div>
              <p className="text-2xl font-bold text-zinc-900 dark:text-white">{value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Header + Add button */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Monitored Services</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-500 transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
        >
          <Plus className="h-4 w-4" /> Add API
        </button>
      </div>

      {/* API Cards */}
      {apis.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
          <Server className="mx-auto h-10 w-10 text-zinc-300 dark:text-zinc-600" />
          <h3 className="mt-3 text-sm font-medium text-zinc-900 dark:text-white">No APIs registered</h3>
          <p className="mt-1 text-xs text-zinc-500">Get started by adding a new API monitor.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {apis.map((item) => (
            <div
              key={item.id}
              onClick={() => navigate(`/dashboard/monitoring/${item.id}`)}
              className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-white truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{item.name}</h3>
                  {item.currentStatus === 'UP' ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 ring-1 ring-inset ring-emerald-600/20">
                      <CheckCircle className="w-3 h-3" /> UP
                    </span>
                  ) : item.currentStatus === 'DOWN' ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-red-50 dark:bg-red-500/10 px-2 py-0.5 text-[10px] font-semibold text-red-700 dark:text-red-400 ring-1 ring-inset ring-red-600/10">
                      <XCircle className="w-3 h-3" /> DOWN
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 text-[10px] font-semibold text-zinc-500">PENDING</span>
                  )}
                </div>

                {item.rateLimitUntil && new Date(item.rateLimitUntil) > new Date() && (
                  <div className="mb-2 flex items-start gap-1.5 text-[10px] font-medium text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 p-1.5 rounded-md border border-amber-200 dark:border-amber-800">
                    <AlertCircle className="w-3 h-3 shrink-0 mt-0.5" />
                    <span>Rate limited &mdash; paused 5 min</span>
                  </div>
                )}

                <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate" title={item.url}>
                  <span className="font-semibold text-zinc-600 dark:text-zinc-300 mr-1.5">{item.method}</span>
                  {item.url}
                </p>

                <div className="mt-4 grid grid-cols-2 gap-3 border-t border-zinc-100 dark:border-zinc-800 pt-3">
                  <div>
                    <p className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400">Uptime</p>
                    <p className={`mt-0.5 text-base font-semibold ${
                      item.uptimePercentage != null && item.uptimePercentage < 50 ? 'text-red-600 dark:text-red-400'
                      : item.uptimePercentage != null && item.uptimePercentage < 99 ? 'text-amber-600 dark:text-amber-400'
                      : 'text-zinc-900 dark:text-white'
                    }`}>
                      {item.uptimePercentage != null ? item.uptimePercentage.toFixed(2) : '&mdash;'}%
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400">Avg Response</p>
                    <p className="mt-0.5 text-base font-semibold text-zinc-900 dark:text-white">{Math.round(item.averageResponseTime || 0)}ms</p>
                  </div>
                </div>

                <div className="mt-3 border-t border-zinc-100 dark:border-zinc-800 pt-3">
                  <p className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400 mb-1">Recent Activity</p>
                  <div className="flex gap-0.5 items-end h-3">
                    {item.recentStatuses && item.recentStatuses.length > 0 ? (
                      [...item.recentStatuses].reverse().map((st, i) => (
                        <div key={i} className={`w-1.5 h-full rounded-sm ${st === 'UP' ? 'bg-emerald-500' : 'bg-red-500'}`} title={st} />
                      ))
                    ) : (
                      <span className="text-[10px] text-zinc-400 italic">No checks yet</span>
                    )}
                  </div>
                </div>

                <div className="mt-3 flex gap-2 border-t border-zinc-100 dark:border-zinc-800 pt-3">
                  <button
                    onClick={(e) => { e.stopPropagation(); setEditingApi(item); setIsEditModalOpen(true); }}
                    className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 px-2.5 py-1 rounded-md flex-1 text-center transition-colors"
                  >Edit</button>
                  <button
                    onClick={(e) => handleToggle(e, item.id)}
                    className={`text-[10px] font-medium px-2.5 py-1 rounded-md flex-1 text-center transition-colors ${item.enabled === false ? 'text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10' : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}
                  >{item.enabled === false ? 'Resume' : 'Pause'}</button>
                  <button
                    onClick={(e) => handleDelete(e, item.id)}
                    className="text-[10px] font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 px-2.5 py-1 rounded-md flex-1 text-center transition-colors"
                  >Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add API Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50">
          <div className="fixed inset-0 bg-zinc-900/50 dark:bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="fixed inset-0 z-10 flex items-center justify-center p-4">
            <div className="relative w-full max-w-lg bg-white dark:bg-zinc-900 rounded-xl shadow-2xl border border-zinc-200 dark:border-zinc-800 transform transition-all">
              <form onSubmit={handleAddApi}>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-5">Register a New Monitor</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">API Name</label>
                      <input type="text" required value={newApi.name} onChange={e => setNewApi({ ...newApi, name: e.target.value })} className={inputCls} placeholder="e.g. Production Login API" />
                    </div>
                    <div className="flex gap-3">
                      <div className="w-1/3">
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Method</label>
                        <select value={newApi.method} onChange={e => setNewApi({ ...newApi, method: e.target.value })} className={inputCls}>
                          <option value="GET">GET</option>
                          <option value="POST">POST</option>
                          <option value="PUT">PUT</option>
                          <option value="DELETE">DELETE</option>
                        </select>
                      </div>
                      <div className="w-2/3">
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">URL</label>
                        <input type="url" required value={newApi.url} onChange={e => setNewApi({ ...newApi, url: e.target.value })} className={inputCls} placeholder="https://api.example.com/health" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Check Interval (seconds)</label>
                      <input type="number" min="30" required value={newApi.intervalSeconds} onChange={e => setNewApi({ ...newApi, intervalSeconds: parseInt(e.target.value) })} className={inputCls} />
                    </div>
                    <div className="flex gap-3">
                      <div className="w-1/2">
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Auth Header</label>
                        <input type="text" value={newApi.authHeaderName} onChange={e => setNewApi({ ...newApi, authHeaderName: e.target.value })} className={inputCls} placeholder="e.g. Authorization" />
                      </div>
                      <div className="w-1/2">
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Auth Token</label>
                        <input type="password" value={newApi.apiKey} onChange={e => setNewApi({ ...newApi, apiKey: e.target.value })} className={inputCls} placeholder="e.g. Bearer xyz" />
                      </div>
                    </div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                      <strong>Tip:</strong> For Mock Engine, use <code>X-Api-Key</code> and raw token. For OAuth, use <code>Authorization</code> and <code>Bearer your-token</code>.
                    </p>
                  </div>
                </div>
                <div className="bg-zinc-50 dark:bg-zinc-800/50 px-6 py-4 flex justify-end gap-3 border-t border-zinc-200 dark:border-zinc-800 rounded-b-xl">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Cancel</button>
                  <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors shadow-sm">Register</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit API Modal */}
      {isEditModalOpen && editingApi && (
        <div className="fixed inset-0 z-50">
          <div className="fixed inset-0 bg-zinc-900/50 dark:bg-black/60 backdrop-blur-sm" onClick={() => setIsEditModalOpen(false)} />
          <div className="fixed inset-0 z-10 flex items-center justify-center p-4">
            <div className="relative w-full max-w-lg bg-white dark:bg-zinc-900 rounded-xl shadow-2xl border border-zinc-200 dark:border-zinc-800">
              <form onSubmit={handleEditApi}>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-5">Edit Monitor</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">API Name</label>
                      <input type="text" required value={editingApi.name} onChange={e => setEditingApi({ ...editingApi, name: e.target.value })} className={inputCls} />
                    </div>
                    <div className="flex gap-3">
                      <div className="w-1/3">
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Method</label>
                        <select value={editingApi.method} onChange={e => setEditingApi({ ...editingApi, method: e.target.value })} className={inputCls}>
                          <option value="GET">GET</option>
                          <option value="POST">POST</option>
                          <option value="PUT">PUT</option>
                          <option value="DELETE">DELETE</option>
                        </select>
                      </div>
                      <div className="w-2/3">
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">URL</label>
                        <input type="url" required value={editingApi.url} onChange={e => setEditingApi({ ...editingApi, url: e.target.value })} className={inputCls} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Check Interval (seconds)</label>
                      <input type="number" min="30" required value={editingApi.intervalSeconds} onChange={e => setEditingApi({ ...editingApi, intervalSeconds: parseInt(e.target.value) })} className={inputCls} />
                    </div>
                    <div className="flex gap-3">
                      <div className="w-1/2">
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Auth Header</label>
                        <input type="text" value={editingApi.authHeaderName || 'Authorization'} onChange={e => setEditingApi({ ...editingApi, authHeaderName: e.target.value })} className={inputCls} />
                      </div>
                      <div className="w-1/2">
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Auth Token</label>
                        <input type="password" value={editingApi.apiKey || ''} onChange={e => setEditingApi({ ...editingApi, apiKey: e.target.value })} className={inputCls} placeholder="Leave blank to keep unchanged" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-zinc-50 dark:bg-zinc-800/50 px-6 py-4 flex justify-end gap-3 border-t border-zinc-200 dark:border-zinc-800 rounded-b-xl">
                  <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Cancel</button>
                  <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors shadow-sm">Save</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
