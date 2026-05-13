import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function Auth() {
  const { mode } = useParams()
  const navigate = useNavigate()
  const { login, register, loading } = useAuth()
  const isLogin = mode === 'login'
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('student')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setMessage('')
    setError('')

    try {
      if (isLogin) {
        const result = await login({ email, password })
        if (result.role === 'admin') navigate('/admin')
        else if (result.role === 'teacher') navigate('/profesor')
        else navigate('/alumno')
      } else {
        await register({ nombre, email, password, role })
        setMessage('Registro completado. Ahora inicia sesión.')
        setNombre('')
        setEmail('')
        setPassword('')
        setRole('student')
        navigate('/auth/login')
      }
    } catch (err) {
      setError(err.message || 'Error en la autenticación')
    }
  }

  return (
    <div className='flex min-h-full items-center justify-center bg-gray-950 px-4 py-12 sm:px-6'>
      <form onSubmit={handleSubmit} className='w-full max-w-md rounded-[32px] border border-slate-800 bg-slate-900/95 p-8 shadow-2xl sm:p-10'>
        <div className='mb-8'>
          <p className='text-sm font-semibold uppercase tracking-[0.25em] text-slate-400'>Acceso seguro</p>
          <h2 className='mt-4 text-3xl font-semibold text-white'>
            {isLogin ? 'Iniciar sesión' : 'Registrarse'}
          </h2>
          <p className='mt-3 text-slate-400'>Inicia sesión con tu cuenta para acceder al panel de prácticas o crea una nueva cuenta si todavía no estás registrado.</p>
          <p className='mt-2 text-sm text-slate-400'>La aplicación está preparada para integrarse con JWT y API REST para autenticación segura.</p>
        </div>

        <div className='space-y-4'>
          {!isLogin && (
            <input
              value={nombre}
              onChange={(event) => setNombre(event.target.value)}
              className='w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-slate-600'
              placeholder='Nombre completo'
              required
            />
          )}
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            type='email'
            className='w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-slate-600'
            placeholder='Correo electrónico'
            required
          />
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            type='password'
            className='w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-slate-600'
            placeholder='Contraseña'
            required
          />
          {!isLogin && (
            <select
              value={role}
              onChange={(event) => setRole(event.target.value)}
              className='w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-slate-600'
            >
              <option value='student'>Alumno</option>
              <option value='teacher'>Profesor</option>
              <option value='admin'>Administrador</option>
            </select>
          )}
        </div>

        {error && <div className='mt-4 rounded-2xl bg-red-500/10 px-4 py-3 text-sm text-red-200'>{error}</div>}
        {message && <div className='mt-4 rounded-2xl bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200'>{message}</div>}

        <button
          type='submit'
          disabled={loading}
          className='mt-8 w-full rounded-2xl bg-slate-100 px-5 py-3 text-base font-semibold text-slate-950 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50'
        >
          {isLogin ? 'Entrar' : 'Crear cuenta'}
        </button>

        <p className='mt-6 text-center text-sm text-slate-400'>
          {isLogin ? (
            <span onClick={() => navigate('/auth/register')} className='cursor-pointer font-medium text-white underline'>
              Crear cuenta
            </span>
          ) : (
            <span onClick={() => navigate('/auth/login')} className='cursor-pointer font-medium text-white underline'>
              Ya tengo cuenta
            </span>
          )}
        </p>
      </form>
    </div>
  )
}