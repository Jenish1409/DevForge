import { useState } from 'react'
import { Copy, Check, KeyRound } from 'lucide-react'
import { getMockBaseUrl } from '../api/client'

export default function TopHeader({ project }) {
  const [copiedUrl, setCopiedUrl] = useState(false)
  const [copiedKey, setCopiedKey] = useState(false)

  if (!project) {
    return (
      <header className="h-14 shrink-0 flex items-center px-6 border-b border-zinc-800 bg-zinc-900/30">
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

  return (
    <header className="h-14 shrink-0 flex items-center justify-between gap-4 px-6 border-b border-zinc-800 bg-zinc-900/30">
      <div className="flex items-center gap-3 min-w-0">
        <h2 className="text-base font-semibold text-zinc-100 truncate">{project.name}</h2>
        {project.requireApiKey && project.apiKey && (
          <button
            onClick={handleCopyKey}
            title="Copy API key"
            className="inline-flex items-center gap-1.5 shrink-0 rounded-md border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/15 px-2 py-0.5 text-xs font-mono text-amber-400 transition-colors"
          >
            <KeyRound className="w-3 h-3" />
            {copiedKey ? 'Copied!' : project.apiKey.slice(0, 8) + '…'}
          </button>
        )}
      </div>

      <button
        onClick={handleCopyUrl}
        className="shrink-0 flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800/50 hover:bg-zinc-800 px-3 py-1.5 text-xs font-mono text-zinc-300 transition-colors"
      >
        {copiedUrl ? (
          <>
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-emerald-400">Copied!</span>
          </>
        ) : (
          <>
            <Copy className="w-3.5 h-3.5" />
            Copy Base URL
          </>
        )}
      </button>
    </header>
  )
}
