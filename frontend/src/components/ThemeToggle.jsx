import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

export default function ThemeToggle({ className = '' }) {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`relative inline-flex items-center rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800/80 p-1 transition-colors hover:bg-zinc-200 dark:hover:bg-zinc-800 ${className}`}
    >
      <span
        className={`absolute top-1 left-1 w-7 h-7 rounded-md bg-white dark:bg-zinc-700 shadow-sm transition-transform duration-200 ease-out ${
          isDark ? 'translate-x-7' : 'translate-x-0'
        }`}
      />
      <span className="relative z-10 flex items-center justify-center w-7 h-7">
        <Sun className={`w-3.5 h-3.5 transition-colors ${!isDark ? 'text-amber-500' : 'text-zinc-500'}`} />
      </span>
      <span className="relative z-10 flex items-center justify-center w-7 h-7">
        <Moon className={`w-3.5 h-3.5 transition-colors ${isDark ? 'text-blue-400' : 'text-zinc-400'}`} />
      </span>
    </button>
  )
}
