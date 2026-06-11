import { useNavigate } from 'react-router-dom'
import { FolderKanban, Plus, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import ThemeToggle from './ThemeToggle'

export default function Sidebar({ projects, selectedId, onSelect, onNewProject, loading }) {
  const navigate = useNavigate()
  const { logout } = useAuth()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <aside className="w-64 shrink-0 flex flex-col border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 transition-colors">
      <div className="px-4 py-5 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex items-center justify-center w-8 h-8 rounded-md bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shrink-0">
              <FolderKanban className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="min-w-0">
              <h1 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">DevForge</h1>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Projects</p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </div>

      <div className="px-3 py-3">
        <button
          onClick={onNewProject}
          className="w-full flex items-center justify-center gap-2 rounded-lg border border-dashed border-emerald-500/50 dark:border-emerald-500/40 bg-emerald-50 dark:bg-emerald-500/5 hover:bg-emerald-100 dark:hover:bg-emerald-500/10 hover:border-emerald-500/70 dark:hover:border-emerald-500/60 px-3 py-2.5 text-sm font-medium text-emerald-700 dark:text-emerald-400 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Project
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-3 space-y-0.5">
        {loading && (
          <p className="px-3 py-2 text-xs text-zinc-500">Loading projects…</p>
        )}
        {!loading && projects.length === 0 && (
          <p className="px-3 py-2 text-xs text-zinc-500">No projects yet</p>
        )}
        {projects.map((project) => {
          const isSelected = selectedId === project.id
          return (
            <button
              key={project.id}
              onClick={() => onSelect(project.id)}
              className={`w-full text-left rounded-lg px-3 py-2.5 transition-all border ${
                isSelected
                  ? 'bg-emerald-50 dark:bg-zinc-800 border-emerald-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm border-l-[3px] border-l-emerald-500'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-200 border-transparent'
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
  )
}
