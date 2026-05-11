import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'

const navItems = [
  { label: 'Admin', to: '/admin' },
  { label: 'Profesor', to: '/profesor' },
  { label: 'Alumno', to: '/alumno' },
]

export function Navbar() {
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className='sticky top-0 z-20 border-b border-slate-800 bg-slate-950/95 backdrop-blur-lg shadow-sm'>
      <div className='mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 sm:py-4'>
        {/* Logo */}
        <Link to='/' className='flex-shrink-0' onClick={() => setIsOpen(false)}>
          <div>
            <p className='text-lg font-semibold text-white sm:text-xl'>FCT Manager</p>
            <p className='hidden text-xs text-slate-400 sm:block'>Gestión integral de prácticas</p>
          </div>
        </Link>

        {/* Mobile menu button */}
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

        {/* Desktop menu */}
        <div className='hidden flex-wrap items-center gap-2 sm:flex'>
          {navItems.map(item => {
            const active = location.pathname === item.to
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`rounded-full px-3 py-2 text-xs font-medium transition sm:px-4 sm:py-2 sm:text-sm ${
                  active ? 'bg-slate-100 text-slate-950' : 'text-slate-200 hover:bg-slate-800'
                }`}
              >
                {item.label}
              </Link>
            )
          })}

          <Link
            to='/auth/login'
            className='rounded-full bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-950 transition hover:bg-slate-200 sm:px-4 sm:py-2 sm:text-sm'
          >
            Auth
          </Link>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className='border-t border-slate-800 bg-slate-900/50 px-4 py-4 sm:hidden'>
          <div className='space-y-2'>
            {navItems.map(item => {
              const active = location.pathname === item.to
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setIsOpen(false)}
                  className={`block rounded-lg px-4 py-2 text-sm font-medium transition ${
                    active
                      ? 'bg-slate-100 text-slate-950'
                      : 'text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
            <Link
              to='/auth/login'
              onClick={() => setIsOpen(false)}
              className='block rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-200'
            >
              Auth
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}