import { createContext, useContext, useState, useCallback } from 'react'
import * as authApi from '../api/auth'

const AuthContext = createContext(null)
const STORAGE_KEY = 'groove.user'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  })

  const persist = (u) => {
    setUser(u)
    if (u) localStorage.setItem(STORAGE_KEY, JSON.stringify(u))
    else localStorage.removeItem(STORAGE_KEY)
  }

  const login = useCallback(async (identifier, password) => {
    const { data } = await authApi.login({ identifier, password })
    persist(data.user)
    return data.user
  }, [])

  const register = useCallback(async (username, email, password, role) => {
    const { data } = await authApi.register({ username, email, password, role })
    persist(data.user)
    return data.user
  }, [])

  const logout = useCallback(async () => {
    try {
      await authApi.logout()
    } finally {
      persist(null)
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
