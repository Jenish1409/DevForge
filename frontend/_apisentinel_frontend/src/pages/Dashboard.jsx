import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Plus, Server, LogOut, CheckCircle, XCircle, AlertCircle, Clock, ShieldCheck } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';

export default function Dashboard() {
  const [apis, setApis] = useState([]);
  const [summary, setSummary] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingApi, setEditingApi] = useState(null);
  const [now, setNow] = useState(Date.now());
  const [userRole, setUserRole] = useState(localStorage.getItem('role') || 'ROLE_USER');

  const [newApi, setNewApi] = useState({ name: '', url: '', method: 'GET', intervalSeconds: 60, apiKey: '' });
  const navigate = useNavigate();

  const fetchApis = async () => {
    try {
      const res = await api.get('/apis');
      setApis(res.data.data);

      const summaryRes = await api.get('/apis/summary');
      setSummary(summaryRes.data.data);
    } catch (err) {
      if (err.response?.status === 401) handleLogout();
    }
  };

  // Sync role from DB on every Dashboard mount (picks up SQL-level role changes)
  const syncRole = async () => {
    try {
      const res = await api.get('/auth/me');
      const liveRole = res.data?.data?.role || 'ROLE_USER';
      if (liveRole !== localStorage.getItem('role')) {
        localStorage.setItem('role', liveRole);
        setUserRole(liveRole);
      }
    } catch { /* silently ignore — JWT still valid, just couldn't sync */ }
  };

  useEffect(() => {
    syncRole();
    fetchApis();
    const interval = setInterval(fetchApis, 10000); // refresh data every 10 seconds
    const tick = setInterval(() => setNow(Date.now()), 1000); // tick every second for live relative times
    return () => { clearInterval(interval); clearInterval(tick); };
  }, []);


  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleAddApi = async (e) => {
    e.preventDefault();
    try {
      await api.post('/apis', newApi);
      setIsModalOpen(false);
      setNewApi({ name: '', url: '', method: 'GET', intervalSeconds: 60, apiKey: '' });
      fetchApis();
    } catch (err) {
      alert('Failed to add API');
    }
  };

  const handleEditApi = async (e) => {
    e.preventDefault();
    if (!editingApi) return;
    try {
      await api.put(`/apis/${editingApi.id}`, editingApi);
      setIsEditModalOpen(false);
      setEditingApi(null);
      fetchApis();
    } catch (err) {
      alert('Failed to update API');
    }
  };

  const handleToggleApi = async (e, apiId) => {
    e.preventDefault();
    e.stopPropagation(); // prevent card click
    try {
      await api.patch(`/apis/${apiId}/toggle`);
      fetchApis();
    } catch (err) {
      alert('Failed to toggle API');
    }
  };

  const handleDeleteApi = async (e, apiId) => {
    e.preventDefault();
    e.stopPropagation(); // prevent card click
    if (window.confirm("Are you sure you want to delete this monitored API? All history will be lost.")) {
      try {
        await api.delete(`/apis/${apiId}`);
        fetchApis();
      } catch (err) {
        alert('Failed to delete API');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-200">
      <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10 w-full transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-3">
              <img src="/apisentinel_logo.png" alt="ApiSentinel" className="h-10 w-auto transition-transform hover:scale-105" />
              <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-white">ApiSentinel</span>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              {userRole === 'ROLE_ADMIN' && (
                <Link to="/admin" className="flex items-center gap-1.5 text-xs font-semibold bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 px-3 py-1.5 rounded-lg border border-purple-100 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Admin
                </Link>
              )}
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300 hidden sm:block">{localStorage.getItem('email')}</span>
              <button onClick={handleLogout} className="text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors bg-gray-50 dark:bg-gray-800 p-2 rounded-full hover:bg-red-50 dark:hover:bg-gray-700">
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Dashboard Summary Metrics */}
        {summary && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5 mb-8">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 flex flex-col justify-between hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total APIs</p>
                <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg"><Server className="w-5 h-5 text-blue-600 dark:text-blue-400" /></div>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-4">{summary.totalApis}</p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 flex flex-col justify-between hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">APIs UP</p>
                <div className="p-2 bg-green-50 dark:bg-green-900/30 rounded-lg"><CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" /></div>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-4">{summary.upApis}</p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 flex flex-col justify-between hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">APIs DOWN</p>
                <div className="p-2 bg-red-50 dark:bg-red-900/30 rounded-lg"><XCircle className="w-5 h-5 text-red-600 dark:text-red-400" /></div>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-4">{summary.downApis}</p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 flex flex-col justify-between hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Incidents Today</p>
                <div className="p-2 bg-orange-50 dark:bg-orange-900/30 rounded-lg"><AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400" /></div>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-4">{summary.incidentsToday}</p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 flex flex-col justify-between hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg Latency</p>
                <div className="p-2 bg-purple-50 dark:bg-purple-900/30 rounded-lg"><Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" /></div>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-4">
                {Math.round(summary.avgResponseTime)}ms
              </p>
            </div>
          </div>
        )}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Monitored Services</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-shine-effect flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-500 transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
          >
            <Plus className="h-4 w-4" /> Add API
          </button>
        </div>

        {apis.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100">
            <Server className="mx-auto h-12 w-12 text-gray-300" />
            <h3 className="mt-4 text-sm font-medium text-gray-900 dark:text-white">No APIs registered</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by creating a new API monitor.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {apis.map((apiItem) => (
              <div
                key={apiItem.id}
                onClick={() => navigate(`/api/${apiItem.id}`)}
                className="bg-white dark:bg-gray-900 overflow-hidden rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all cursor-pointer group">
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate group-hover:text-blue-600 transition-colors">{apiItem.name}</h3>
                    {apiItem.currentStatus === 'UP' ? (
                      <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700 ring-1 ring-inset ring-green-600/20">
                        <CheckCircle className="w-3 h-3 justify-center mr-1" /> UP
                      </span>
                    ) : apiItem.currentStatus === 'DOWN' ? (
                      <span className="inline-flex items-center rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700 ring-1 ring-inset ring-red-600/10">
                        <XCircle className="w-3 h-3 justify-center mr-1" /> DOWN
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-gray-50 dark:bg-gray-800 px-2.5 py-1 text-xs font-semibold text-gray-600 ring-1 ring-inset ring-gray-500/10">
                        PENDING
                      </span>
                    )}
                  </div>

                  {apiItem.rateLimitUntil && new Date(apiItem.rateLimitUntil) > new Date() && (
                    <div className="mt-3 flex items-start gap-2 text-xs font-medium text-amber-700 bg-amber-50 dark:bg-amber-900/30 dark:text-amber-400 p-2 rounded-md border border-amber-200 dark:border-amber-800">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <p>Rate limit detected. Monitoring paused for 5 minutes.</p>
                    </div>
                  )}

                  <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 truncate" title={apiItem.url}>
                    <span className="font-semibold text-gray-700 dark:text-gray-300 mr-2">{apiItem.method}</span>
                    {apiItem.url}
                  </p>

                  <div className="mt-6 grid grid-cols-2 gap-4 border-t border-gray-100 pt-4">
                    <div>
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Uptime</p>
                      <p className={`mt-1 text-lg font-semibold ${apiItem.uptimePercentage != null && apiItem.uptimePercentage < 50
                          ? 'text-red-600 dark:text-red-400'
                          : apiItem.uptimePercentage != null && apiItem.uptimePercentage < 99
                            ? 'text-amber-600 dark:text-amber-400'
                            : 'text-gray-900 dark:text-white'
                        }`}>
                        {apiItem.uptimePercentage != null ? apiItem.uptimePercentage.toFixed(2) : '—'}%
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Avg Response</p>
                      <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">{Math.round(apiItem.averageResponseTime || 0)}ms</p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
                    <div>
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Recent Activity</p>
                      <div className="flex gap-0.5 items-end h-4">
                        {apiItem.recentStatuses && apiItem.recentStatuses.length > 0 ? (
                          [...apiItem.recentStatuses].reverse().map((st, i) => (
                            <div key={i} className={`w-1.5 h-full rounded-sm ${st === 'UP' ? 'bg-green-500' : 'bg-red-500'}`} title={st} />
                          ))
                        ) : (
                          <span className="text-xs text-gray-400 italic">No checks yet</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2 border-t border-gray-100 dark:border-gray-800 pt-4">
                    <button
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); setEditingApi(apiItem); setIsEditModalOpen(true); }}
                      className="text-xs font-medium text-blue-600 hover:text-blue-800 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 dark:hover:text-blue-300 px-3 py-1.5 rounded-md flex-1 text-center transition-colors">
                      Edit
                    </button>
                    <button
                      onClick={(e) => handleToggleApi(e, apiItem.id)}
                      className={`text-xs font-medium px-3 py-1.5 rounded-md flex-1 text-center transition-colors ${apiItem.enabled === false ? 'text-green-600 hover:text-green-800 bg-green-50 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50 dark:hover:text-green-300' : 'text-gray-600 hover:text-gray-800 bg-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200'}`}>
                      {apiItem.enabled === false ? 'Resume' : 'Pause'}
                    </button>
                    <button
                      onClick={(e) => handleDeleteApi(e, apiItem.id)}
                      className="text-xs font-medium text-red-600 hover:text-red-800 bg-red-50 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 dark:hover:text-red-300 px-3 py-1.5 rounded-md flex-1 text-center transition-colors">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Add API Modal */}
      {isModalOpen && (
        <div className="relative z-50">
          <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity" onClick={() => setIsModalOpen(false)} />
          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <div className="relative transform overflow-hidden rounded-xl bg-white dark:bg-gray-900 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg border border-gray-100">
                <form onSubmit={handleAddApi}>
                  <div className="bg-white dark:bg-gray-900 px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                    <h3 className="text-xl font-semibold leading-6 text-gray-900 dark:text-white mb-6">Register a new Monitor</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">API Name</label>
                        <input type="text" required value={newApi.name} onChange={e => setNewApi({ ...newApi, name: e.target.value })} className="mt-1 block w-full rounded-md border-0 py-2.5 px-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm" placeholder="e.g. Production Login Service" />
                      </div>
                      <div className="flex gap-4">
                        <div className="w-1/3">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Method</label>
                          <select value={newApi.method} onChange={e => setNewApi({ ...newApi, method: e.target.value })} className="mt-1 block w-full rounded-md border-0 py-2.5 px-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm">
                            <option value="GET">GET</option>
                            <option value="POST">POST</option>
                            <option value="PUT">PUT</option>
                            <option value="DELETE">DELETE</option>
                          </select>
                        </div>
                        <div className="w-2/3">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">URL</label>
                          <input type="url" required value={newApi.url} onChange={e => setNewApi({ ...newApi, url: e.target.value })} className="mt-1 block w-full rounded-md border-0 py-2.5 px-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm" placeholder="https://api.example.com/v1/status" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Check Interval (seconds)</label>
                        <input type="number" min="30" required value={newApi.intervalSeconds} onChange={e => setNewApi({ ...newApi, intervalSeconds: parseInt(e.target.value) })} className="mt-1 block w-full rounded-md border-0 py-2.5 px-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">API Key Header (optional, AES Encrypted)</label>
                        <input type="password" value={newApi.apiKey} onChange={e => setNewApi({ ...newApi, apiKey: e.target.value })} className="mt-1 block w-full rounded-md border-0 py-2.5 px-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm" placeholder="Bearer your-api-token" />
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 px-4 py-4 sm:flex sm:flex-row-reverse sm:px-6 border-t border-gray-100">
                    <button type="submit" className="inline-flex w-full justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto transition-colors">Register</button>
                    <button type="button" onClick={() => setIsModalOpen(false)} className="mt-3 inline-flex w-full justify-center rounded-lg bg-white dark:bg-gray-800 px-4 py-2 text-sm font-semibold text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 sm:mt-0 sm:w-auto transition-colors">Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit API Modal */}
      {isEditModalOpen && editingApi && (
        <div className="relative z-50">
          <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity" onClick={() => setIsEditModalOpen(false)} />
          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <div className="relative transform overflow-hidden rounded-xl bg-white dark:bg-gray-900 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg border border-gray-100">
                <form onSubmit={handleEditApi}>
                  <div className="bg-white dark:bg-gray-900 px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                    <h3 className="text-xl font-semibold leading-6 text-gray-900 dark:text-white mb-6">Edit Monitor</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">API Name</label>
                        <input type="text" required value={editingApi.name} onChange={e => setEditingApi({ ...editingApi, name: e.target.value })} className="mt-1 block w-full rounded-md border-0 py-2.5 px-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm" />
                      </div>
                      <div className="flex gap-4">
                        <div className="w-1/3">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Method</label>
                          <select value={editingApi.method} onChange={e => setEditingApi({ ...editingApi, method: e.target.value })} className="mt-1 block w-full rounded-md border-0 py-2.5 px-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm">
                            <option value="GET">GET</option>
                            <option value="POST">POST</option>
                            <option value="PUT">PUT</option>
                            <option value="DELETE">DELETE</option>
                          </select>
                        </div>
                        <div className="w-2/3">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">URL</label>
                          <input type="url" required value={editingApi.url} onChange={e => setEditingApi({ ...editingApi, url: e.target.value })} className="mt-1 block w-full rounded-md border-0 py-2.5 px-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Check Interval (seconds)</label>
                        <input type="number" min="30" required value={editingApi.intervalSeconds} onChange={e => setEditingApi({ ...editingApi, intervalSeconds: parseInt(e.target.value) })} className="mt-1 block w-full rounded-md border-0 py-2.5 px-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">API Key Header (optional, AES Encrypted)</label>
                        <input type="password" value={editingApi.apiKey || ''} onChange={e => setEditingApi({ ...editingApi, apiKey: e.target.value })} className="mt-1 block w-full rounded-md border-0 py-2.5 px-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm" placeholder="Enter new API key (leaves unchanged if blank)" />
                        <p className="mt-1 text-xs text-gray-500">Only fill this if you want to update the existing API key.</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 px-4 py-4 sm:flex sm:flex-row-reverse sm:px-6 border-t border-gray-100">
                    <button type="submit" className="inline-flex w-full justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto transition-colors">Save Changes</button>
                    <button type="button" onClick={() => setIsEditModalOpen(false)} className="mt-3 inline-flex w-full justify-center rounded-lg bg-white dark:bg-gray-800 px-4 py-2 text-sm font-semibold text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 sm:mt-0 sm:w-auto transition-colors">Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
