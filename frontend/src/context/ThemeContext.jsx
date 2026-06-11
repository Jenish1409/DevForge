import { createContext, useContext, useEffect, useState, useCallback } from 'react'

const THEME_KEY = 'devforge_theme'

const ThemeContext = createContext(null)

function getInitialTheme() {
  if (typeof window === 'undefined') return 'dark'
  return localStorage.getItem(THEME_KEY) || 'dark'
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(getInitialTheme)

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
    root.style.colorScheme = theme
    localStorage.setItem(THEME_KEY, theme)
  }, [theme])

  const setTheme = useCallback((next) => {
    setThemeState(next)
  }, [])

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, isDark: theme === 'dark' }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
