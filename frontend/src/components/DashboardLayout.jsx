import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useLocation, Outlet } from 'react-router-dom'
import { FolderKanban, Plus, LogOut, Activity, Boxes } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { fetchProjects, createProject, deleteProject } from '../api/projects'
import ThemeToggle from './ThemeToggle'
import TopHeader from './TopHeader'
import EndpointManager from './EndpointManager'
import NewProjectModal from './NewProjectModal'
import { useToast } from '../context/ToastContext'

export default function DashboardLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { logout } = useAuth()
  const { showToast } = useToast()

  const isMonitoring = location.pathname.startsWith('/dashboard/monitoring')

  // ─── Mock Engine State ───
  const [projects, setProjects] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)

  const loadProjects = useCallback(async () => {
    setLoading(true)
    try {
      const data = await fetchProjects()
      setProjects(data)
      setSelectedId((prev) => {
        if (prev && data.some((p) => p.id === prev)) return prev
        return data.length > 0 ? data[0].id : null
      })
    } catch {
      setProjects([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!isMonitoring) loadProjects()
  }, [loadProjects, isMonitoring])

  async function handleCreateProject(payload) {
    try {
      const created = await createProject(payload)
      setProjects((prev) => [...prev, created])
      setSelectedId(created.id)
      showToast(`Project "${created.name}" created!`, 'success')
    } catch (err) {
      showToast(err.message || 'Failed to create project', 'error')
    }
  }

  async function handleDeleteProject() {
    if (!selectedId) return
    const name = activeProject?.name || 'Project'
    try {
      await deleteProject(selectedId)
      setProjects((prev) => {
        const remaining = prev.filter((p) => p.id !== selectedId)
        setSelectedId(remaining.length > 0 ? remaining[0].id : null)
        return remaining
      })
      showToast(`Project "${name}" deleted.`, 'success')
    } catch (err) {
      showToast(err.message || 'Failed to delete project', 'error')
    }
  }

  function handleLogout() {
    logout()
    navigate('/')
  }

  const activeProject = projects.find((p) => p.id === selectedId) ?? null

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-zinc-100 dark:bg-zinc-950 transition-colors animate-fade-in">
      {/* ─── Sidebar ─── */}
      <aside className="w-full md:w-64 shrink-0 flex flex-col max-h-[35vh] md:max-h-full md:h-full border-b md:border-b-0 md:border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 transition-colors">
        {/* Logo */}
        <div className="px-4 py-5 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <img src="/logo.png" alt="DevForge Logo" className="h-10 w-auto object-contain drop-shadow-sm shrink-0" />
              <div className="min-w-0">
                <h1 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">DevForge</h1>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Workspace</p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>

        {/* ─── Mode Toggle ─── */}
        <div className="px-3 pt-3 pb-1">
          <div className="flex rounded-lg bg-zinc-100 dark:bg-zinc-800 p-0.5 border border-zinc-200 dark:border-zinc-700">
            <button
              onClick={() => navigate('/dashboard')}
              className={`flex-1 flex items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium transition-all duration-200 ${
                !isMonitoring
                  ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300'
              }`}
            >
              <Boxes className="w-3.5 h-3.5" />
              Mock Engine
            </button>
            <button
              onClick={() => navigate('/dashboard/monitoring')}
              className={`flex-1 flex items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium transition-all duration-200 ${
                isMonitoring
                  ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              Live Sentinel
            </button>
          </div>
        </div>

        {/* ─── Mock Sidebar Content (only when in mock mode) ─── */}
        {!isMonitoring && (
          <>
            <div className="px-3 py-3">
              <button
                onClick={() => setModalOpen(true)}
                className="w-full flex items-center justify-center gap-2 rounded-lg border border-dashed border-emerald-500/50 dark:border-emerald-500/40 bg-emerald-50 dark:bg-emerald-500/5 hover:bg-emerald-100 dark:hover:bg-emerald-500/10 hover:border-emerald-500/70 dark:hover:border-emerald-500/60 px-3 py-2.5 text-sm font-medium text-emerald-700 dark:text-emerald-400 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              >
                <Plus className="w-4 h-4" />
                New Project
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto px-3 pb-3 space-y-2">
              {loading && (
                <div className="space-y-2">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="h-14 w-full bg-zinc-100 dark:bg-zinc-800/45 rounded-lg animate-pulse border border-zinc-200/40 dark:border-zinc-800/40 flex flex-col justify-center px-3 gap-1.5">
                      <div className="h-3 w-2/3 bg-zinc-200 dark:bg-zinc-700 rounded"></div>
                      <div className="h-2 w-1/2 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
                    </div>
                  ))}
                </div>
              )}
              {!loading && projects.length === 0 && (
                <p className="px-3 py-2 text-xs text-zinc-500">No projects yet</p>
              )}
              {!loading && projects.map((project) => {
                const isSelected = selectedId === project.id
                return (
                  <button
                    key={project.id}
                    onClick={() => setSelectedId(project.id)}
                    className={`w-full text-left rounded-lg px-3 py-2.5 transition-all duration-200 border hover:-translate-y-0.5 ${
                      isSelected
                        ? 'bg-emerald-50 dark:bg-zinc-800 border-emerald-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-md border-l-[3px] border-l-emerald-500'
                        : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/30 hover:text-zinc-900 dark:hover:text-zinc-200 border-transparent'
                    }`}
                  >
                    <p className="text-sm font-medium truncate">{project.name}</p>
                    {project.description && (
                      <p className="text-xs text-zinc-500 truncate mt-0.5">{project.description}</p>
                    )}
                  </button>
                )
              })}
            </nav>
          </>
        )}

        {/* ─── Monitoring Sidebar (when in monitoring mode) ─── */}
        {isMonitoring && (
          <div className="flex-1 flex flex-col items-center justify-center px-4 text-center">
            <Activity className="w-8 h-8 text-emerald-500 dark:text-emerald-400 mb-3 opacity-60" />
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Real-time API health monitoring, uptime tracking & automated alerts.
            </p>
          </div>
        )}

        {/* Sign Out */}
        <div className="px-3 py-3 border-t border-zinc-200 dark:border-zinc-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ─── Main Content ─── */}
      <div className="flex-1 flex flex-col min-w-0">
        {!isMonitoring ? (
          <>
            <TopHeader project={activeProject} onDeleteProject={handleDeleteProject} />
            <EndpointManager projectId={selectedId} />
          </>
        ) : (
          <Outlet />
        )}
      </div>

      {/* New Project Modal */}
      <NewProjectModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreate={handleCreateProject}
      />
    </div>
  )
}