import { createContext, useContext, useState, useCallback } from 'react'
import { X, CheckCircle2, AlertCircle, Info } from 'lucide-react'

const ToastContext = createContext(null)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const showToast = useCallback((message, type = 'success', duration = 4000) => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      removeToast(id)
    }, duration)
  }, [])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {/* Toast floating container */}
      <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-3 max-w-sm w-full px-4 sm:px-0 pointer-events-none">
        {toasts.map((t) => {
          let bg = 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800'
          let text = 'text-zinc-800 dark:text-zinc-200'
          let icon = <Info className="w-5 h-5 text-blue-500 shrink-0" />

          if (t.type === 'success') {
            bg = 'bg-emerald-50/95 dark:bg-zinc-900/95 border-emerald-500/20 dark:border-emerald-500/15 backdrop-blur-md shadow-emerald-500/5'
            icon = <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
          } else if (t.type === 'error') {
            bg = 'bg-red-50/95 dark:bg-zinc-900/95 border-red-500/20 dark:border-red-500/15 backdrop-blur-md shadow-red-500/5'
            icon = <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
          } else if (t.type === 'info') {
            bg = 'bg-zinc-50/95 dark:bg-zinc-900/95 border-zinc-200 dark:border-zinc-800/80 backdrop-blur-md'
            icon = <Info className="w-5 h-5 text-zinc-500 dark:text-zinc-400 shrink-0" />
          }

          return (
            <div
              key={t.id}
              className={`flex items-start gap-3 p-4 rounded-xl border shadow-lg pointer-events-auto transition-all duration-300 transform translate-y-0 opacity-100 animate-slide-in ${bg} ${text}`}
            >
              {icon}
              <div className="flex-1 text-sm font-medium leading-relaxed">{t.message}</div>
              <button
                onClick={() => removeToast(t.id)}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 shrink-0 transition-colors p-0.5 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}
