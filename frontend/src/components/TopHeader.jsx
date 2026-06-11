import { useState } from 'react'
import { Copy, Check, KeyRound, Trash2 } from 'lucide-react'
import { getMockBaseUrl } from '../api/client'
import DeleteProjectModal from './DeleteProjectModal'

export default function TopHeader({ project, onDeleteProject }) {
  const [copiedUrl, setCopiedUrl] = useState(false)
  const [copiedKey, setCopiedKey] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)

  if (!project) {
    return (
      <header className="h-14 shrink-0 flex items-center px-6 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/30 backdrop-blur-sm transition-colors">
        <p className="text-sm text-zinc-500">Select a project to get started</p>
      </header>
    )
  }

  const mockUrl = getMockBaseUrl(project.id)

  async function handleCopyUrl() {
    await navigator.clipboard.writeText(mockUrl)
    setCopiedUrl(true)
    setTimeout(() => setCopiedUrl(false), 2000)
  }

  async function handleCopyKey() {
    await navigator.clipboard.writeText(project.apiKey)
    setCopiedKey(true)
    setTimeout(() => setCopiedKey(false), 2000)
  }

  function handleDeleteConfirm() {
    onDeleteProject?.()
    setDeleteModalOpen(false)
  }

  return (
    <>
      <header className="h-14 shrink-0 flex items-center justify-between gap-4 px-6 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/30 backdrop-blur-sm transition-colors">
        <div className="flex items-center gap-3 min-w-0">
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 truncate">{project.name}</h2>
          {project.requireApiKey && project.apiKey && (
            <button
              onClick={handleCopyKey}
              title="Copy API key"
              className="inline-flex items-center gap-1.5 shrink-0 rounded-md border border-amber-500/40 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/10 hover:bg-amber-100 dark:hover:bg-amber-500/15 px-2 py-0.5 text-xs font-mono text-amber-700 dark:text-amber-400 transition-colors"
            >
              <KeyRound className="w-3 h-3" />
              {copiedKey ? 'Copied!' : project.apiKey.slice(0, 8) + '…'}
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setDeleteModalOpen(true)}
            className="flex items-center gap-2 rounded-lg border border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/15 px-3 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Delete Project</span>
          </button>

          <button
            onClick={handleCopyUrl}
            className="flex items-center gap-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 px-3 py-1.5 text-xs font-mono text-zinc-700 dark:text-zinc-300 transition-colors"
          >
            {copiedUrl ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Copy Base URL</span>
                <span className="sm:hidden">Copy URL</span>
              </>
            )}
          </button>
        </div>
      </header>

      <DeleteProjectModal
        open={deleteModalOpen}
        projectName={project.name}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
      />
    </>
  )
}