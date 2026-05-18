import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

/**
 * Items de navegación con roles permitidos
 * Cada rol solo verá los items que le corresponden
 */
const navItemsConfig = [
  { label: 'Administración', to: '/admin', allowedRoles: ['admin'] },
  { label: 'Gestión de Clases', to: '/profesor', allowedRoles: ['teacher', 'admin'] },
  { label: 'Mi Asignación', to: '/alumno', allowedRoles: ['student', 'admin'] },
]

/**
 * Filtra los items de navegación según el rol del usuario
 * @param {string|null} role - Rol del usuario actual
 * @returns {Array} - Items filtrados para mostrar
 */
function getFilteredNavItems(role) {
  if (!role) return []
  return navItemsConfig.filter((item) => item.allowedRoles.includes(role))
}

export function Navbar() {
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)
  const { user, logout } = useAuth()
  const navItems = getFilteredNavItems(user?.role)

  const getRoleLabel = (role) => {
    const roleLabels = {
      admin: 'Administrador',
      teacher: 'Profesor',
      student: 'Alumno',
    }
    return roleLabels[role] || role.toUpperCase()
  }

  return (
    <nav className='sticky top-0 z-20 border-b border-slate-800 bg-slate-950/95 backdrop-blur-lg shadow-sm'>
      <div className='mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 sm:py-4'>
        <Link to='/' className='flex-shrink-0' onClick={() => setIsOpen(false)}>
          <div>
            <p className='text-lg font-semibold text-white sm:text-xl'>FCT Manager</p>
            <p className='hidden text-xs text-slate-400 sm:block'>Gestión integral de prácticas</p>
          </div>
        </Link>

        <div className='hidden flex-wrap items-center gap-2 sm:flex'>
          {navItems.map((item) => {
            const active = location.pathname === item.to
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`rounded-full px-3 py-2 text-xs font-medium transition sm:px-4 sm:py-2 sm:text-sm ${
                  active ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-200 hover:bg-slate-800'
                }`}
              >
                {item.label}
              </Link>
            )
          })}

          {user ? (
            <>
              <span className='rounded-full bg-slate-800 px-3 py-2 text-xs font-medium text-slate-300 sm:px-4 sm:py-2 sm:text-sm'>
                {getRoleLabel(user.role)}
              </span>
              <button
                onClick={() => {
                  logout()
                  setIsOpen(false)
                }}
                className='rounded-full bg-red-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-red-700 sm:px-4 sm:py-2 sm:text-sm'
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <Link
              to='/auth/login'
              className='rounded-full bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-700 sm:px-4 sm:py-2 sm:text-sm'
            >
              Iniciar Sesión
            </Link>
          )}
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className='inline-flex items-center justify-center rounded-lg p-2 text-slate-200 hover:bg-slate-800 sm:hidden'
          aria-label='Toggle menu'
        >
          <svg
            className={`h-6 w-6 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16M4 18h16' />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div className='border-t border-slate-800 bg-slate-900/50 px-4 py-4 sm:hidden'>
          <div className='space-y-2'>
            {navItems.map((item) => {
              const active = location.pathname === item.to
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setIsOpen(false)}
                  className={`block rounded-lg px-4 py-2 text-sm font-medium transition ${
                    active ? 'bg-blue-600 text-white' : 'text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
            {user && (
              <div className='border-t border-slate-700 pt-2'>
                <p className='px-4 py-2 text-xs font-medium text-slate-400'>
                  Usuario: {getRoleLabel(user.role)}
                </p>
              </div>
            )}
            {user ? (
              <button
                onClick={() => {
                  logout()
                  setIsOpen(false)
                }}
                className='block w-full rounded-lg bg-red-600 px-4 py-2 text-left text-sm font-semibold text-white transition hover:bg-red-700'
              >
                Cerrar sesión
              </button>
            ) : (
              <Link
                to='/auth/login'
                onClick={() => setIsOpen(false)}
                className='block rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700'
              >
                Iniciar Sesión
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}