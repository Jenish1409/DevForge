import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import { ArrowLeft, Activity, Clock, CheckCircle, XCircle, BarChart3, ShieldCheck, Zap, List } from 'lucide-react'
import { fetchApiDetails, fetchApiHistory, fetchApiIncidents } from '../api/monitoring'

export default function MonitoringApiDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [apiDetails, setApiDetails] = useState(null)
  const [history, setHistory] = useState([])
  const [pieStats, setPieStats] = useState({ up: 0, down: 0, total: 0 })
  const [incidents, setIncidents] = useState([])
  const [loading, setLoading] = useState(true)

  const COLORS = ['#10b981', '#ef4444']

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white/95 dark:bg-zinc-800/95 p-3 rounded-xl shadow-lg border border-zinc-100 dark:border-zinc-700 text-sm">
          <p className="font-bold text-zinc-900 dark:text-white mb-1">{data.time}</p>
          <p className="text-emerald-600 dark:text-emerald-400">Response: <span className="font-semibold">{data.responseTime}ms</span></p>
          <p className={`mt-0.5 font-semibold ${data.status === 'UP' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
            {data.status} {data.statusCode ? `(HTTP ${data.statusCode})` : ''}
          </p>
        </div>
      )
    }
    return null
  }

  useEffect(() => {
    const load = async () => {
      try {
        const [dRes, hRes, iRes] = await Promise.all([
          fetchApiDetails(id),
          fetchApiHistory(id),
          fetchApiIncidents(id),
        ])
        setApiDetails(dRes.data)
        const hist = hRes.data || []
        const upCount = hist.filter(h => h.status === 'UP').length
        const downCount = hist.filter(h => h.status === 'DOWN').length
        setPieStats({ up: upCount, down: downCount, total: hist.length })
        const recent = hist.slice(0, 60)
        setHistory([...recent].reverse().map(item => ({
          time: new Date(item.checkedAt).toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }),
          responseTime: item.responseTimeMs,
          status: item.status,
          statusCode: item.statusCode,
        })))
        setIncidents(iRes.data || [])
      } catch (err) { console.error(err) }
      finally { setLoading(false) }
    }
    load()
    const interval = setInterval(load, 10000)
    return () => clearInterval(interval)
  }, [id])

  if (loading || !apiDetails) {
    return <div className="flex-1 flex justify-center items-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600"></div></div>
  }

  const pieData = [{ name: 'Up', value: pieStats.up }, { name: 'Down', value: pieStats.down }]

  return (
    <div className="flex-1 overflow-y-auto bg-zinc-100 dark:bg-zinc-950 transition-colors">
      {/* Sub-nav */}
      <div className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 px-6 py-3 flex items-center justify-between sticky top-0 z-10">
        <button onClick={() => navigate('/dashboard/monitoring')} className="flex items-center text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors font-medium">
          <ArrowLeft className="h-4 w-4 mr-1.5" /> Back to Monitors
        </button>
        <div className="flex items-center gap-2">
          <span className={`px-2.5 py-0.5 text-[10px] font-semibold rounded-full ${apiDetails.currentStatus === 'UP' ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-400' : 'bg-red-100 dark:bg-red-500/20 text-red-800 dark:text-red-400'}`}>
            {apiDetails.currentStatus}
          </span>
          <span className="text-xs text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full">{apiDetails.method}</span>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
          <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-white tracking-tight">{apiDetails.name}</h1>
          <a href={apiDetails.url} target="_blank" rel="noreferrer" className="text-emerald-600 hover:text-emerald-500 mt-1 block break-all font-mono text-xs">{apiDetails.url}</a>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Uptime', value: `${apiDetails.uptimePercentage?.toFixed(2) || 100}%`, icon: ShieldCheck, color: 'emerald' },
            { label: 'Avg Response', value: `${Math.round(apiDetails.averageResponseTime || 0)}ms`, icon: Zap, color: 'blue' },
            { label: 'Check Interval', value: `${apiDetails.intervalSeconds}s`, icon: Clock, color: 'violet' },
            { label: 'Total Checks', value: apiDetails.totalChecks || 0, icon: List, color: 'amber' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 flex items-center gap-4 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300">
              <div className={`p-2.5 bg-${color}-50 dark:bg-${color}-500/10 rounded-lg`}>
                <Icon className={`h-6 w-6 text-${color}-500 dark:text-${color}-400`} />
              </div>
              <div>
                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{label}</p>
                <p className="text-xl font-bold text-zinc-900 dark:text-white">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Activity className="text-emerald-600 h-5 w-5" />
                <h2 className="text-base font-bold text-zinc-900 dark:text-white">Response Time (Last 60)</h2>
              </div>
              <div className="flex items-center text-[10px] text-zinc-500 bg-zinc-50 dark:bg-zinc-800 px-2.5 py-1 rounded-full border border-zinc-100 dark:border-zinc-700">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse mr-1.5" />Live
              </div>
            </div>
            <div className="h-72 w-full">
              {history.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={history} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <defs>
                      <linearGradient id="colorRT" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" opacity={0.5} />
                    <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 11 }} dy={10} minTickGap={30} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 11 }} dx={-10} />
                    <RechartsTooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="responseTime" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRT)" activeDot={{ r: 5, fill: '#059669', strokeWidth: 0 }} animationDuration={1500} />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-zinc-400 text-sm">No data yet</div>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5">
            <div className="flex items-center gap-2 mb-3">
              <BarChart3 className="text-emerald-600 h-5 w-5" />
              <h2 className="text-base font-bold text-zinc-900 dark:text-white">Uptime Distribution</h2>
            </div>
            <div className="h-56 w-full">
              {history.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={75} paddingAngle={5} dataKey="value">
                      {pieData.map((_, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}
                    </Pie>
                    <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-zinc-400 text-sm">Waiting...</div>
              )}
            </div>
            <p className="text-[10px] text-zinc-500 text-center mt-2">Based on {pieStats.total} checks</p>
          </div>
        </div>

        {/* Incidents */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
          <div className="p-5 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-2">
            <Clock className="text-emerald-600 h-5 w-5" />
            <h2 className="text-base font-bold text-zinc-900 dark:text-white">Incident History</h2>
          </div>
          <div className="px-5 py-4">
            {incidents.length > 0 ? (
              <div className="flow-root">
                <ul className="-mb-8">
                  {incidents.map((incident, idx) => (
                    <li key={incident.id}>
                      <div className="relative pb-8">
                        {idx !== incidents.length - 1 && <span className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-zinc-200 dark:bg-zinc-700" />}
                        <div className="relative flex space-x-3">
                          <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white dark:ring-zinc-900 ${incident.statusChange === 'DOWN' ? 'bg-red-500' : 'bg-emerald-500'}`}>
                            {incident.statusChange === 'DOWN' ? <XCircle className="h-4 w-4 text-white" /> : <CheckCircle className="h-4 w-4 text-white" />}
                          </span>
                          <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                            <p className="text-sm text-zinc-500 dark:text-zinc-400 flex items-center flex-wrap gap-2">
                              <span>Status changed to <span className={`font-medium ${incident.statusChange === 'DOWN' ? 'text-red-600' : 'text-emerald-600'}`}>{incident.statusChange}</span></span>
                              {incident.reason && incident.statusChange === 'DOWN' && (
                                <span className="inline-flex items-center rounded-md bg-red-50 dark:bg-red-500/10 px-2 py-0.5 text-[10px] font-medium text-red-700 dark:text-red-400 ring-1 ring-inset ring-red-600/10">{incident.reason}</span>
                              )}
                            </p>
                            <div className="whitespace-nowrap text-right text-xs text-zinc-500">{new Date(incident.timestamp).toLocaleString()}</div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="mx-auto h-10 w-10 text-emerald-300 mb-2" />
                <p className="text-sm text-zinc-500">No incidents — 100% uptime!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}