import { FolderKanban, Plus, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Sidebar({ projects, selectedId, onSelect, onNewProject, loading }) {
  const { logout } = useAuth()

  return (
    <aside className="w-64 shrink-0 flex flex-col border-r border-zinc-800 bg-zinc-900/50">
      <div className="px-4 py-5 border-b border-zinc-800">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-8 h-8 rounded-md bg-zinc-800 border border-zinc-700">
            <FolderKanban className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-zinc-100">DevForge</h1>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Projects</p>
          </div>
        </div>
      </div>

      <div className="px-3 py-3">
        <button
          onClick={onNewProject}
          className="w-full flex items-center justify-center gap-2 rounded-lg border border-dashed border-emerald-500/40 bg-emerald-500/5 hover:bg-emerald-500/10 hover:border-emerald-500/60 px-3 py-2.5 text-sm font-medium text-emerald-400 transition-colors"
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
        {projects.map((project) => (
          <button
            key={project.id}
            onClick={() => onSelect(project.id)}
            className={`w-full text-left rounded-lg px-3 py-2.5 transition-colors ${
              selectedId === project.id
                ? 'bg-zinc-800 border border-zinc-700 text-zinc-100'
                : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200 border border-transparent'
            }`}
          >
            <p className="text-sm font-medium truncate">{project.name}</p>
            {project.description && (
              <p className="text-xs text-zinc-500 truncate mt-0.5">{project.description}</p>
            )}
          </button>
        ))}
      </nav>

      <div className="px-3 py-3 border-t border-zinc-800">
        <button
          onClick={logout}
          className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
