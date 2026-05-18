import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * ProtectedRoute Component
 * Protege rutas verificando que el usuario esté autenticado y tenga el rol requerido.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Componente a renderizar si tiene acceso
 * @param {string|string[]} props.allowedRoles - Rol(es) permitidos para acceder (ej: 'admin', 'teacher', ['admin', 'teacher'])
 * @returns {React.ReactNode} - Componente protegido o redirección a login
 */
export function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth()

  // Mientras se carga la autenticación
  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-center'>
          <div className='inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white'></div>
          <p className='mt-4 text-slate-400'>Validando acceso...</p>
        </div>
      </div>
    )
  }

  // No autenticado - redirigir a login
  if (!user) {
    return <Navigate to='/auth/login' replace />
  }

  // Usuario autenticado pero sin rol requerido
  const rolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles]
  if (!rolesArray.includes(user.role)) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-center'>
          <h2 className='text-2xl font-bold text-red-500 mb-4'>Acceso Denegado</h2>
          <p className='text-slate-400 mb-6'>
            No tienes permisos para acceder a esta sección. Tu rol actual es:{' '}
            <span className='font-semibold text-white'>{user.role}</span>
          </p>
          <p className='text-slate-500 text-sm'>
            Roles permitidos: <span className='font-semibold'>{rolesArray.join(', ')}</span>
          </p>
          <a
            href='/'
            className='mt-6 inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition'
          >
            Volver al Dashboard
          </a>
        </div>
      </div>
    )
  }

  // Usuario autenticado y tiene el rol requerido
  return children
}
