import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { ArrowLeft, Activity, Clock, AlertCircle, CheckCircle, XCircle, BarChart3, ShieldCheck, Zap, Info, List, RefreshCw } from 'lucide-react';
import api from '../services/api';
import ThemeToggle from '../components/ThemeToggle';

export default function ApiDetails() {
  const { id } = useParams();
  const [apiDetails, setApiDetails] = useState(null);
  const [history, setHistory] = useState([]);
  const [pieStats, setPieStats] = useState({ up: 0, down: 0, total: 0 });
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(Date.now());

  const COLORS = ['#22c55e', '#ef4444']; // Green for UP, Red for DOWN

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white/95 dark:bg-gray-800/95 p-3 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
          <p className="font-bold text-gray-900 dark:text-white mb-2">{data.time}</p>
          <p className="text-sm text-blue-600 dark:text-blue-400">
            Response Time: <span className="font-semibold">{data.responseTime}ms</span>
          </p>
          <p className={`text-sm mt-1 font-semibold ${data.status === 'UP' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            Status: {data.status} {data.statusCode ? `(HTTP ${data.statusCode})` : ''}
          </p>
        </div>
      );
    }
    return null;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [detailsRes, histRes, incRes] = await Promise.all([
          api.get(`/apis/${id}`),
          api.get(`/apis/${id}/history`),
          api.get(`/apis/${id}/incidents`)
        ]);

        setApiDetails(detailsRes.data.data);

        // Calculate full distribution for Pie chart
        const upCount = histRes.data.data.filter(h => h.status === 'UP').length;
        const downCount = histRes.data.data.filter(h => h.status === 'DOWN').length;
        setPieStats({ up: upCount, down: downCount, total: histRes.data.data.length });

        // Limit the area chart to the latest 60 requests to prevent cluttered messy graphs
        const recentHistory = histRes.data.data.slice(0, 60);

        // Reverse history so oldest is first for the graph left-to-right
        const chartData = [...recentHistory].reverse().map(item => ({
          time: new Date(item.checkedAt).toLocaleTimeString('en-IN', {
            timeZone: 'Asia/Kolkata',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true,
          }),
          responseTime: item.responseTimeMs,
          status: item.status,
          statusCode: item.statusCode
        }));

        setHistory(chartData);
        setIncidents(incRes.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 10000); // refresh data every 10 seconds
    const tick = setInterval(() => setNow(Date.now()), 1000); // tick every second for live relative times
    return () => { clearInterval(interval); clearInterval(tick); };
  }, [id]);

  if (loading || !apiDetails) {
    return <div className="flex justify-center items-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  }

  const pieData = [
    { name: 'Up', value: pieStats.up },
    { name: 'Down', value: pieStats.down }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-12 transition-colors duration-200">
      <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10 w-full mb-8 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link to="/dashboard" className="flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors font-medium">
              <ArrowLeft className="h-5 w-5 mr-2" /> Back to Dashboard
            </Link>
            <div className="flex items-center space-x-3">
              <ThemeToggle />
              <span className={`px-3 py-1 text-xs font-semibold rounded-full ${apiDetails.status === 'UP' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}>
                {apiDetails.status}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">{apiDetails.method}</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* Header Section */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 p-8 transform transition-all hover:shadow-md">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">{apiDetails.name}</h1>
          <a href={apiDetails.url} target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-800 mt-2 block break-all font-mono text-sm max-w-2xl">
            {apiDetails.url}
          </a>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 flex items-center space-x-4 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
            <div className="p-3 bg-green-50 dark:bg-green-900/30 rounded-lg">
              <ShieldCheck className="h-8 w-8 text-green-500 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Uptime</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{apiDetails.uptimePercentage?.toFixed(2) || 100}%</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 flex items-center space-x-4 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
              <Zap className="h-8 w-8 text-blue-500 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg Response Time</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{Math.round(apiDetails.averageResponseTime || 0)} <span className="text-sm font-normal text-gray-500 dark:text-gray-400">ms</span></p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 flex items-center space-x-4 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
            <div className="p-3 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
              <Clock className="h-8 w-8 text-purple-500 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Check Interval</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{apiDetails.intervalSeconds} <span className="text-sm font-normal text-gray-500 dark:text-gray-400">sec</span></p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 flex items-center space-x-4 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
            <div className="p-3 bg-orange-50 dark:bg-orange-900/30 rounded-lg">
              <List className="h-8 w-8 text-orange-500 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Checks</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{apiDetails.totalChecks || 0}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Analytics Card (Takes up 2/3 width on large screens) */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Activity className="text-blue-600 h-6 w-6" />
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Response Time (Latest 60 checks)</h2>
              </div>
              <div className="flex items-center text-xs text-gray-500 bg-gray-50 dark:bg-gray-800 px-3 py-1.5 rounded-full border border-gray-100 dark:border-gray-700">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse mr-2" />
                Auto-updates
              </div>
            </div>

            <div className="h-80 w-full">
              {history.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={history} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <defs>
                      <linearGradient id="colorResponseTime" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" opacity={0.5} />
                    <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={10} minTickGap={30} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dx={-10} />
                    <RechartsTooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="responseTime"
                      stroke="#3B82F6"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorResponseTime)"
                      activeDot={{ r: 6, fill: '#2563EB', strokeWidth: 0, shadowBlur: 10, shadowColor: 'rgba(37, 99, 235, 0.5)' }}
                      animationDuration={1500}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400">No data available yet</div>
              )}
            </div>
          </div>

          {/* Distribution Pie Chart */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="text-blue-600 h-6 w-6" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Uptime Distribution</h2>
            </div>
            <div className="h-64 w-full">
              {history.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400 text-sm">Waiting for checks...</div>
              )}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-4">Based on {pieStats.total} logged health checks.</p>
          </div>
        </div>

        {/* Incident Timeline */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center gap-2">
            <Clock className="text-blue-600 h-6 w-6" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Incident History</h2>
          </div>

          <div className="px-6 py-4">
            {incidents.length > 0 ? (
              <div className="flow-root">
                <ul className="-mb-8">
                  {incidents.map((incident, incidentIdx) => (
                    <li key={incident.id}>
                      <div className="relative pb-8">
                        {incidentIdx !== incidents.length - 1 ? (
                          <span className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                        ) : null}
                        <div className="relative flex space-x-3">
                          <div>
                            <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white dark:ring-gray-900 ${incident.statusChange === 'DOWN' ? 'bg-red-500' : 'bg-green-500'
                              }`}>
                              {incident.statusChange === 'DOWN' ? (
                                <XCircle className="h-5 w-5 text-white" aria-hidden="true" />
                              ) : (
                                <CheckCircle className="h-5 w-5 text-white" aria-hidden="true" />
                              )}
                            </span>
                          </div>
                          <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                            <div>
                              <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center flex-wrap gap-2">
                                <span>Status changed to <span className={`font-medium ${incident.statusChange === 'DOWN' ? 'text-red-600' : 'text-green-600'}`}>{incident.statusChange}</span></span>
                                {incident.reason && incident.statusChange === 'DOWN' && (
                                  <span className="inline-flex items-center rounded-md bg-red-50 dark:bg-red-900/30 px-2 py-1 text-xs font-medium text-red-700 dark:text-red-400 ring-1 ring-inset ring-red-600/10 dark:ring-red-500/20">
                                    {incident.reason}
                                  </span>
                                )}
                              </p>
                            </div>
                            <div className="whitespace-nowrap text-right text-sm text-gray-500 dark:text-gray-400">
                              <time dateTime={incident.timestamp}>{new Date(incident.timestamp).toLocaleString()}</time>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="text-center py-10">
                <CheckCircle className="mx-auto h-12 w-12 text-green-300 mb-3" />
                <p className="text-sm text-gray-500 dark:text-gray-400">No incidents recorded. 100% uptime!</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
