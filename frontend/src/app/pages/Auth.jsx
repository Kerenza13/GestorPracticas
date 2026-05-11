import { useNavigate, useParams } from 'react-router-dom'

export function Auth() {
  const { mode } = useParams()
  const navigate = useNavigate()
  const isLogin = mode === 'login'

  return (
    <div className='min-h-screen bg-gray-950 flex items-center justify-center px-6 py-12'>
      <div className='w-full max-w-md rounded-[32px] border border-slate-800 bg-slate-900/95 p-10 shadow-2xl'>
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
              className='w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-slate-600'
              placeholder='Nombre completo'
            />
          )}
          <input
            className='w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-slate-600'
            placeholder='Correo electrónico'
          />
          <input
            className='w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-slate-600'
            type='password'
            placeholder='Contraseña'
          />
        </div>

        <button
          onClick={() => navigate('/')}
          className='mt-8 w-full rounded-2xl bg-slate-100 px-5 py-3 text-base font-semibold text-slate-950 transition hover:bg-slate-200'
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
      </div>
    </div>
  )
}