import { createContext, useContext, useState, useCallback } from 'react'
import { getToken } from '../api/client'
import { login as apiLogin, logout as apiLogout } from '../api/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!getToken())

  const login = useCallback(async (username, password) => {
    await apiLogin(username, password)
    setIsAuthenticated(true)
  }, [])

  const logout = useCallback(() => {
    apiLogout()
    setIsAuthenticated(false)
  }, [])

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
