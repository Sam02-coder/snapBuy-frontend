import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { tokenStorage } from '../services/api'
import { authService } from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => tokenStorage.getUser())
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Keep tabs in sync if the user logs out in another tab.
    function handleStorage(e) {
      if (e.key === 'ecom_access_token' && !e.newValue) {
        setUser(null)
      }
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  const login = useCallback(async (credentials) => {
    setLoading(true)
    try {
      const loggedInUser = await authService.login(credentials)
      setUser(loggedInUser)
      return loggedInUser
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    await authService.logout()
    setUser(null)
  }, [])

  const updateUser = useCallback((patch) => {
    setUser((prev) => {
      const next = { ...prev, ...patch }
      const stored = tokenStorage.getUser()
      localStorage.setItem('ecom_user', JSON.stringify({ ...stored, ...patch }))
      return next
    })
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
