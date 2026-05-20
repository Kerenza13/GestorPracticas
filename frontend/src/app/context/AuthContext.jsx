import { createContext, useContext, useEffect, useState } from 'react'
import * as api from '../../api/api'

const AuthContext = createContext(null)

/**
 * Decodifica un JWT sin validar la firma (la validación se hace en el backend)
 * @param {string} token - JWT token
 * @returns {Object|null} - Payload del JWT o null si es inválido
 */
function parseJWT(token) {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch (err) {
    console.error('Error al decodificar JWT:', err)
    return null
  }
}

/**
 * Verifica si el token JWT está expirado
 * @param {string} token - JWT token
 * @returns {boolean} - true si está expirado, false si es válido
 */
function isTokenExpired(token) {
  const payload = parseJWT(token)
  if (!payload || !payload.exp) return true
  return payload.exp * 1000 < Date.now()
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Inicializar usuario desde localStorage al cargar
  useEffect(() => {
    const initializeAuth = () => {
      const token = localStorage.getItem('fp_token')

      if (token) {
        // Verificar si el token está expirado
        if (isTokenExpired(token)) {
          logout()
        } else {
          const payload = parseJWT(token)
          if (payload) {
            const email = localStorage.getItem('fp_email')
            const role = localStorage.getItem('fp_role')
            const nombre = localStorage.getItem('fp_nombre')

            if (email && role) {
              setUser({ email, role, nombre, sub: payload.sub })
            }
          }
        }
      }
      setLoading(false)
    }

    initializeAuth()
  }, [])

  const login = async ({ email, password }) => {
    setLoading(true)
    try {
      const data = await api.login({ username: email, password })
      const token = data.access_token

      // Verificar que el token sea válido
      const payload = parseJWT(token)
      if (!payload) {
        throw new Error('Token inválido recibido del servidor')
      }

      // Guardar token y datos en localStorage
      localStorage.setItem('fp_token', token)
      localStorage.setItem('fp_role', data.role)
      localStorage.setItem('fp_email', email)

      // El backend de login no devuelve nombre, solo rol y token.
      const storedNombre = localStorage.getItem('fp_nombre') || ''
      if (storedNombre) {
        localStorage.setItem('fp_nombre', storedNombre)
      }

      // Actualizar estado
      setUser({ email, role: data.role, nombre: storedNombre, sub: payload.sub })
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
