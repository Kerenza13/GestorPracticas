import { createContext, useContext, useEffect, useState } from 'react'
import * as api from '../../api/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const email = localStorage.getItem('fp_email')
    const role = localStorage.getItem('fp_role')
    const nombre = localStorage.getItem('fp_nombre')
    return email && role ? { email, role, nombre } : null
  })
  const [loading, setLoading] = useState(false)

  const login = async ({ email, password }) => {
    setLoading(true)
    try {
      const data = await api.login({ username: email, password })
      localStorage.setItem('fp_token', data.access_token)
      localStorage.setItem('fp_role', data.role)
      localStorage.setItem('fp_email', email)
      setUser({ email, role: data.role, nombre: '' })
      return data
    } finally {
      setLoading(false)
    }
  }

  const register = async ({ nombre, email, password, role }) => {
    setLoading(true)
    try {
      const data = await api.register({ nombre, email, password, role })
      localStorage.setItem('fp_nombre', nombre)
      return data
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('fp_token')
    localStorage.removeItem('fp_role')
    localStorage.removeItem('fp_email')
    localStorage.removeItem('fp_nombre')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider')
  }
  return context
}
