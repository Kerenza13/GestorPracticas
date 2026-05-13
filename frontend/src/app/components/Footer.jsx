export function Footer() {
  return (
    <footer className='border-t border-slate-800 bg-slate-950/95 py-6 text-slate-400'>
      <div className='mx-auto flex max-w-7xl flex-col gap-6 px-4 text-sm sm:px-6 lg:flex-row lg:items-center lg:justify-between'>
        <div>
          <p className='font-semibold text-white'>FCT Manager</p>
          <p className='mt-2 max-w-md text-slate-400'>Aplicación de gestión de prácticas para administradores, profesores y alumnos. Diseño adaptativo para móviles, tablet y escritorio.</p>
        </div>
        <div className='flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:gap-6'>
          <span>© 2026 FCT Manager</span>
        </div>
      </div>
    </footer>
  )
}
