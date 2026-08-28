import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import ThemeToggle from '../components/ThemeToggle';
import {
  Users, Trash2, ShieldCheck, ShieldX, Mail, X,
  Search, RefreshCw, AlertTriangle, ChevronDown, ChevronRight,
  CheckCircle, XCircle, Clock, Globe
} from 'lucide-react';

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const navigate = useNavigate();

  const [msgModal, setMsgModal] = useState(null);
  const [msgSubject, setMsgSubject] = useState('');
  const [msgBody, setMsgBody] = useState('');
  const [msgLoading, setMsgLoading] = useState(false);
  const [msgSuccess, setMsgSuccess] = useState('');
  const [deleteModal, setDeleteModal] = useState(null);

  const [toast, setToast] = useState(null);
  const showToast = (msg, isError = false) => {
    setToast({ msg, isError });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data.data || []);
    } catch (err) {
      if (err.response?.status === 403) navigate('/dashboard');
      else showToast('Failed to load users.', true);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleRoleToggle = async (user) => {
    const newRole = user.role === 'ROLE_ADMIN' ? 'ROLE_USER' : 'ROLE_ADMIN';
    try {
      await api.patch(`/admin/users/${user.id}/role`, { role: newRole });
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, role: newRole } : u));
      showToast(`${user.email} is now ${newRole === 'ROLE_ADMIN' ? 'Admin' : 'User'}`);

      // If we changed our OWN role, sync localStorage so the Admin link in Dashboard updates
      const myEmail = localStorage.getItem('email');
      if (user.email === myEmail) {
        localStorage.setItem('role', newRole);
        // If we just demoted ourselves, redirect out of admin panel
        if (newRole === 'ROLE_USER') {
          setTimeout(() => navigate('/dashboard'), 1500);
        }
      }
    } catch { showToast('Failed to update role.', true); }
  };

  const handleDelete = async () => {
    if (!deleteModal) return;
    try {
      await api.delete(`/admin/users/${deleteModal.id}`);
      setUsers(prev => prev.filter(u => u.id !== deleteModal.id));
      showToast(`${deleteModal.email} deleted.`);
      setDeleteModal(null);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete user.', true);
    }
  };

  const handleSendMessage = async () => {
    if (!msgSubject.trim() || !msgBody.trim()) return;
    setMsgLoading(true);
    try {
      await api.post(`/admin/users/${msgModal.id}/message`, { subject: msgSubject, message: msgBody });
      setMsgSuccess('Message sent successfully!');
      setTimeout(() => { setMsgModal(null); setMsgSubject(''); setMsgBody(''); setMsgSuccess(''); }, 1500);
    } catch { showToast('Failed to send message.', true); } finally { setMsgLoading(false); }
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium' }) : '—';
  const formatTime = (d) => d ? new Date(d).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'short', timeStyle: 'short' }) : '—';

  const filtered = users.filter(u => u.email.toLowerCase().includes(search.toLowerCase()));
  const adminCount = users.filter(u => u.role === 'ROLE_ADMIN').length;
  const totalApis = users.reduce((s, u) => s + (u.apiCount ?? 0), 0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-200">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-medium animate-pulse ${toast.isError ? 'bg-red-600 text-white' : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'}`}>
          {toast.msg}
        </div>
      )}

      {/* Navbar */}
      <nav className="bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between h-16 items-center">
          <Link to="/dashboard" className="flex items-center gap-3">
            <img src="/apisentinel_logo.png" alt="ApiSentinel" className="h-9 w-auto transition-transform hover:scale-105" />
            <span className="font-bold text-xl text-gray-900 dark:text-white">ApiSentinel</span>
            <span className="ml-2 text-xs font-semibold bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-2 py-0.5 rounded-full">ADMIN</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">← Dashboard</Link>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Panel</h1>
          <p className="mt-1 text-gray-500 dark:text-gray-400">Manage users, roles, and send messages. Click a row to expand user details.</p>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Users', value: users.length, icon: Users, color: 'blue' },
            { label: 'Admins', value: adminCount, icon: ShieldCheck, color: 'purple' },
            { label: 'Regular Users', value: users.length - adminCount, icon: Users, color: 'green' },
            { label: 'Total APIs', value: totalApis, icon: Globe, color: 'orange' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white dark:bg-gray-900 rounded-xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-4">
              <div className={`p-3 rounded-xl bg-${color}-50 dark:bg-${color}-900/20`}>
                <Icon className={`w-5 h-5 text-${color}-600 dark:text-${color}-400`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Search + refresh */}
        <div className="flex gap-3 mb-5">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search by email…" value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <button onClick={fetchUsers} className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" /></div>
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center text-gray-400 dark:text-gray-500">No users found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    {['', 'User', 'Role', 'APIs', 'Incidents', 'Last Active', 'Actions'].map(h => (
                      <th key={h} className="px-5 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(user => (
                    <>
                      <tr key={user.id}
                        className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
                        onClick={() => setExpandedId(expandedId === user.id ? null : user.id)}>
                        {/* Expand toggle */}
                        <td className="px-4 py-4 w-8">
                          <div className="text-gray-400">{expandedId === user.id ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}</div>
                        </td>
                        <td className="px-5 py-4">
                          <p className="font-semibold text-gray-900 dark:text-white">{user.email}</p>
                          <p className="text-xs text-gray-400">Joined {formatDate(user.createdAt)}</p>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${user.role === 'ROLE_ADMIN' ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}>
                            {user.role === 'ROLE_ADMIN' ? <ShieldCheck className="w-3 h-3" /> : <Users className="w-3 h-3" />}
                            {user.role === 'ROLE_ADMIN' ? 'Admin' : 'User'}
                          </span>
                        </td>
                        <td className="px-5 py-4 font-medium text-gray-700 dark:text-gray-300">{user.apiCount ?? 0}</td>
                        <td className="px-5 py-4 font-medium text-gray-700 dark:text-gray-300">{user.incidentCount ?? 0}</td>
                        <td className="px-5 py-4 text-gray-500 dark:text-gray-400 text-xs">{formatTime(user.lastActivity)}</td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                            <button onClick={() => handleRoleToggle(user)} title={user.role === 'ROLE_ADMIN' ? 'Demote to User' : 'Promote to Admin'}
                              className={`p-1.5 rounded-lg transition-colors ${user.role === 'ROLE_ADMIN' ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 hover:bg-purple-100' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
                              {user.role === 'ROLE_ADMIN' ? <ShieldX className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                            </button>
                            <button onClick={() => { setMsgModal(user); setMsgSubject(''); setMsgBody(''); setMsgSuccess(''); }} title="Send Email"
                              className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors">
                              <Mail className="w-4 h-4" />
                            </button>
                            <button onClick={() => setDeleteModal(user)} title="Delete User"
                              className="p-1.5 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* ── Expanded row: API details ── */}
                      {expandedId === user.id && (
                        <tr key={`exp-${user.id}`} className="bg-blue-50/50 dark:bg-blue-950/20 border-b border-gray-100 dark:border-gray-800">
                          <td colSpan={7} className="px-6 py-5">
                            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                              Monitored APIs ({user.apis?.length ?? 0})
                            </p>
                            {!user.apis || user.apis.length === 0 ? (
                              <p className="text-sm text-gray-400 italic">No APIs monitored yet.</p>
                            ) : (
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                {user.apis.map(a => (
                                  <div key={a.id} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4 flex flex-col gap-2 shadow-sm">
                                    <div className="flex items-start justify-between gap-2">
                                      <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">{a.name}</p>
                                      <span className={`shrink-0 inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                                        a.status === 'UP' ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                        : a.status === 'DOWN' ? 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                                      }`}>
                                        {a.status === 'UP' ? <CheckCircle className="w-3 h-3" /> : a.status === 'DOWN' ? <XCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                                        {a.status}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-xs font-bold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-1.5 py-0.5 rounded">{a.method}</span>
                                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate" title={a.url}>{a.url}</p>
                                    </div>
                                    <div className="flex items-center justify-between mt-1">
                                      <p className="text-xs text-gray-500 dark:text-gray-400">Uptime</p>
                                      <p className={`text-xs font-bold ${a.uptimePercent >= 99 ? 'text-green-600 dark:text-green-400' : a.uptimePercent >= 50 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400'}`}>
                                        {a.uptimePercent?.toFixed(1)}%
                                      </p>
                                    </div>
                                    <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-1.5 mt-1">
                                      <div className={`h-1.5 rounded-full ${a.uptimePercent >= 99 ? 'bg-green-500' : a.uptimePercent >= 50 ? 'bg-amber-500' : 'bg-red-500'}`}
                                        style={{ width: `${Math.min(a.uptimePercent ?? 0, 100)}%` }} />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* ── Send Message Modal ── */}
      {msgModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm" onClick={() => setMsgModal(null)} />
          <div className="relative z-10 w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Send Message</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">To: {msgModal.email}</p>
              </div>
              <button onClick={() => setMsgModal(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"><X className="w-5 h-5" /></button>
            </div>
            {msgSuccess ? (
              <div className="flex items-center gap-2 text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 p-4 rounded-xl text-sm font-medium">
                <ShieldCheck className="w-5 h-5" />{msgSuccess}
              </div>
            ) : (
              <div className="space-y-4">
                <input type="text" placeholder="Subject" value={msgSubject} onChange={e => setMsgSubject(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                <textarea rows={5} placeholder="Message body…" value={msgBody} onChange={e => setMsgBody(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none" />
                <div className="flex gap-3">
                  <button onClick={() => setMsgModal(null)} className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Cancel</button>
                  <button onClick={handleSendMessage} disabled={msgLoading || !msgSubject.trim() || !msgBody.trim()}
                    className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-500 disabled:opacity-60 transition-colors flex items-center justify-center gap-2">
                    {msgLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                    {msgLoading ? 'Sending…' : 'Send'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Delete Confirm Modal ── */}
      {deleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm" onClick={() => setDeleteModal(null)} />
          <div className="relative z-10 w-full max-w-sm bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 p-6">
            <div className="flex flex-col items-center text-center gap-3">
              <div className="p-3 bg-red-50 dark:bg-red-900/30 rounded-full"><AlertTriangle className="w-7 h-7 text-red-600 dark:text-red-400" /></div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Delete User</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Permanently delete <span className="font-semibold text-gray-800 dark:text-gray-200">{deleteModal.email}</span>?
                <br />This removes all {deleteModal.apiCount} APIs, check history, and incidents. Cannot be undone.
              </p>
              <div className="flex gap-3 w-full mt-2">
                <button onClick={() => setDeleteModal(null)} className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Cancel</button>
                <button onClick={handleDelete} className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-500 transition-colors flex items-center justify-center gap-2">
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
