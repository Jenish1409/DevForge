import { useState } from 'react'
import { Copy, Check, KeyRound, Trash2, RotateCcw } from 'lucide-react'
import { getMockBaseUrl } from '../api/client'
import { rotateApiKey } from '../api/projects'
import DeleteProjectModal from './DeleteProjectModal'
import { useToast } from '../context/ToastContext'

export default function TopHeader({ project, onDeleteProject }) {
  const [copiedUrl, setCopiedUrl] = useState(false)
  const [copiedKey, setCopiedKey] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  
  // API Key Rotation State
  const [rotateConfirmOpen, setRotateConfirmOpen] = useState(false)
  const [isRotating, setIsRotating] = useState(false)
  const [newlyRotatedKey, setNewlyRotatedKey] = useState(null)
  const [hasRotated, setHasRotated] = useState(false)

  const { showToast } = useToast()

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
    showToast('Base URL copied to clipboard!', 'success')
    setTimeout(() => setCopiedUrl(false), 2000)
  }

  async function handleCopyKey() {
    // If it was just created, it's in project.apiKey
    const keyToCopy = newlyRotatedKey || project.apiKey
    if (!keyToCopy) return

    await navigator.clipboard.writeText(keyToCopy)
    setCopiedKey(true)
    showToast('API Key copied to clipboard!', 'success')
    setTimeout(() => setCopiedKey(false), 2000)
  }

  function handleDeleteConfirm() {
    onDeleteProject?.()
    setDeleteModalOpen(false)
  }

  async function handleRotateConfirm() {
    try {
      setIsRotating(true)
      const data = await rotateApiKey(project.id)
      
      setNewlyRotatedKey(data.apiKey)
      setHasRotated(true) // Marks the original project.apiKey as invalid
      showToast('API Key rotated successfully!', 'success')
    } catch (err) {
      showToast(err.message, 'error')
      setRotateConfirmOpen(false)
    } finally {
      setIsRotating(false)
    }
  }

  function closeRotateModal() {
    setRotateConfirmOpen(false)
    setNewlyRotatedKey(null) // hide it forever from memory
  }

  // Determine what key to display in the header (if any)
  // If we've rotated, the old project.apiKey is invalid. We just show masked.
  // If newlyRotatedKey is still in state, we technically could show it, but it's displayed in the modal.
  const displayKey = !hasRotated && project.apiKey ? project.apiKey : null

  return (
    <>
      <header className="h-14 shrink-0 flex items-center justify-between gap-4 px-6 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/30 backdrop-blur-sm transition-colors">
        <div className="flex items-center gap-3 min-w-0">
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 truncate">{project.name}</h2>
          
          {project.requireApiKey && (
            <div className="flex items-center gap-2">
              {displayKey ? (
                <button
                  onClick={handleCopyKey}
                  title="Copy API key"
                  className="inline-flex items-center gap-1.5 shrink-0 rounded-md border border-amber-500/40 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/10 hover:bg-amber-100 dark:hover:bg-amber-500/15 px-2 py-0.5 text-xs font-mono text-amber-700 dark:text-amber-400 transition-colors"
                >
                  <KeyRound className="w-3 h-3" />
                  {copiedKey ? 'Copied!' : displayKey.slice(0, 8) + '…'}
                </button>
              ) : (
                <span 
                  title="API Key (Masked)"
                  className="inline-flex items-center gap-1.5 shrink-0 rounded-md border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 px-2 py-0.5 text-xs font-mono text-zinc-500 dark:text-zinc-400"
                >
                  <KeyRound className="w-3 h-3" />
                  ••••••••••••••••••••••••
                </span>
              )}

              <button
                onClick={() => setRotateConfirmOpen(true)}
                title="Regenerate API Key"
                className="inline-flex items-center justify-center p-1.5 rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:hover:text-zinc-100 dark:hover:bg-zinc-700 transition-colors shadow-sm"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
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

      {/* Rotate API Key Modal */}
      {rotateConfirmOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-zinc-900/50 dark:bg-black/60 backdrop-blur-sm px-4 animate-fade-in">
          <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-6 transform transition-all scale-in">
            {!newlyRotatedKey ? (
              <>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                  Regenerate API Key?
                </h3>
                <p className="text-sm text-red-600 dark:text-red-400 mb-6 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 p-3 rounded-lg">
                  <strong>Are you sure?</strong> This will immediately invalidate your old API key and any applications currently using it will break.
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setRotateConfirmOpen(false)}
                    disabled={isRotating}
                    className="px-4 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleRotateConfirm}
                    disabled={isRotating}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-500 rounded-lg disabled:opacity-50 transition-colors shadow-sm"
                  >
                    {isRotating ? (
                      <>
                        <RotateCcw className="w-4 h-4 animate-spin" />
                        Regenerating...
                      </>
                    ) : (
                      'Yes, Regenerate'
                    )}
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-lg font-semibold text-emerald-600 dark:text-emerald-400 mb-4 flex items-center gap-2">
                  <Check className="w-5 h-5 bg-emerald-100 dark:bg-emerald-500/20 rounded-full p-0.5" />
                  New API Key Generated
                </h3>
                
                <p className="text-sm font-medium text-amber-600 dark:text-amber-400 mb-3 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 p-3 rounded-lg">
                  Copy this key now. You will not be able to see it again after closing this window.
                </p>

                <div className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg mb-6 group">
                  <code className="text-sm font-mono text-zinc-800 dark:text-zinc-200 break-all select-all">
                    {newlyRotatedKey}
                  </code>
                  <button
                    onClick={async () => {
                      await navigator.clipboard.writeText(newlyRotatedKey)
                      showToast('New API Key copied!', 'success')
                    }}
                    className="shrink-0 p-2 text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 bg-white dark:bg-zinc-900 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 border border-zinc-200 dark:border-zinc-800 rounded-md transition-colors shadow-sm ml-3"
                    title="Copy to Clipboard"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="flex justify-end">
                  <button
                    onClick={closeRotateModal}
                    className="px-5 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors shadow-sm"
                  >
                    I have copied it
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}