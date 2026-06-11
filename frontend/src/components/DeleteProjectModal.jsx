import { AlertTriangle, X } from 'lucide-react'

export default function DeleteProjectModal({ open, projectName, onClose, onConfirm }) {
  if (!open) return null

  function handleConfirm() {
    onConfirm?.()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 dark:bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xl transition-colors">
        <div className="flex items-start justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Delete Project</h2>
              <p className="text-xs text-zinc-500 mt-0.5">This action cannot be undone</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-5">
          <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Are you sure you want to delete{' '}
            <span className="font-medium text-zinc-900 dark:text-zinc-200">{projectName}</span>? All mock endpoints
            and configuration for this project will be permanently removed.
          </p>
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t border-zinc-200 dark:border-zinc-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-sm font-medium text-white shadow-sm transition-colors"
          >
            Delete Project
          </button>
        </div>
      </div>
    </div>
  )
}
