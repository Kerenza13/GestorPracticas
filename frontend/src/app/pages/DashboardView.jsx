import { Link } from 'react-router-dom'

export function DashboardView() {
  const roles = [
    { name: 'Administrador', path: '/admin' },
    { name: 'Profesor', path: '/profesor' },
    { name: 'Alumno', path: '/alumno' },
  ]

  return (
    <div className='min-h-screen bg-gray-950 py-10'>
      <div className='mx-auto max-w-7xl space-y-10 px-6'>
        <section className='rounded-[32px] border border-slate-800 bg-slate-900/95 p-10 shadow-xl backdrop-blur-sm transition'>
          <p className='text-sm font-semibold uppercase tracking-[0.25em] text-slate-400'>Dashboard</p>
          <h1 className='mt-4 text-4xl font-semibold text-white'>Panel profesional de prácticas FCT</h1>
          <p className='mt-4 max-w-3xl text-slate-300'>Accede rápidamente a las funciones clave para administración, docente y alumno con una experiencia limpia, moderna y coherente.</p>
        </section>

        <section className='grid gap-6 md:grid-cols-3'>
          {roles.map(r => (
            <Link
              key={r.name}
              to={r.path}
              className='group rounded-[28px] border border-slate-800 bg-slate-900/95 p-8 text-center shadow-lg transition duration-300 hover:-translate-y-1 hover:border-slate-700 hover:shadow-2xl'
            >
              <span className='text-sm font-semibold uppercase tracking-[0.2em] text-slate-400 transition-colors duration-200 group-hover:text-white'>Acceso rápido</span>
              <h2 className='mt-6 text-3xl font-semibold text-white'>{r.name}</h2>
              <p className='mt-4 text-slate-400'>Gestiona todo lo necesario para {r.name.toLowerCase()} desde aquí.</p>
            </Link>
          ))}
        </section>
      </div>
    </div>
  )
}
