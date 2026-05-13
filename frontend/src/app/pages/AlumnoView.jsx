export function AlumnoView() {
  return (
    <div className='bg-gray-950 py-10'>
      <div className='mx-auto max-w-7xl space-y-10 px-4 sm:px-6 lg:px-8'>
        <header className='rounded-[28px] border border-slate-800 bg-slate-900/95 p-8 shadow-xl'>
          <p className='text-sm font-semibold uppercase tracking-[0.25em] text-slate-400'>Alumno</p>
          <h1 className='mt-4 text-4xl font-semibold text-white'>Mi perfil y estado de prácticas</h1>
          <p className='mt-4 text-slate-300'>Sube tu CV, actualiza tus datos de contacto y consulta el estado de tu asignación con la empresa.</p>
        </header>

        <section className='grid gap-6 xl:grid-cols-[1.3fr_0.7fr]'>
          <div className='rounded-[28px] border border-slate-800 bg-slate-900/95 p-8 shadow-lg'>
            <h2 className='text-2xl font-semibold text-white'>Perfil del alumno</h2>
            <div className='mt-6 space-y-4 text-slate-300'>
              <p><span className='font-semibold text-white'>Nombre:</span> —</p>
              <p><span className='font-semibold text-white'>Email:</span> —</p>
              <p><span className='font-semibold text-white'>Teléfono:</span> —</p>
              <p><span className='font-semibold text-white'>Ciclo:</span> —</p>
            </div>
            <p className='mt-6 text-sm text-slate-400'>Los datos del alumno se cargarán desde el backend una vez que la cuenta esté activa.</p>
          </div>

          <div className='rounded-[28px] border border-slate-800 bg-slate-900/95 p-8 shadow-lg'>
            <h2 className='text-2xl font-semibold text-white'>Subir currículum</h2>
            <p className='mt-3 text-slate-400'>Adjunta tu CV en formato PDF para que la empresa y el tutor lo revisen.</p>
            <label className='mt-6 block rounded-3xl border border-slate-700 bg-slate-950 px-4 py-5 text-slate-200'>
              <span className='block text-sm font-medium'>Documento CV</span>
              <input type='file' className='mt-4 w-full text-sm' />
            </label>
          </div>
        </section>

        <section className='rounded-[28px] border border-slate-800 bg-slate-900/95 p-8 shadow-lg'>
          <h2 className='text-2xl font-semibold text-white'>Estado de la asignación</h2>
          <div className='mt-6 grid gap-4 lg:grid-cols-3'>
            <div className='rounded-3xl bg-slate-950 p-6'>
              <p className='text-sm uppercase tracking-[0.2em] text-slate-400'>Situación</p>
              <p className='mt-3 text-2xl font-semibold text-white'>—</p>
            </div>
            <div className='rounded-3xl bg-slate-950 p-6'>
              <p className='text-sm uppercase tracking-[0.2em] text-slate-400'>Empresa</p>
              <p className='mt-3 text-xl font-semibold text-white'>—</p>
            </div>
            <div className='rounded-3xl bg-slate-950 p-6'>
              <p className='text-sm uppercase tracking-[0.2em] text-slate-400'>Tutor laboral</p>
              <p className='mt-3 text-xl font-semibold text-white'>—</p>
            </div>
          </div>
          <p className='mt-6 text-sm text-slate-400'>Cuando se complete la asignación, aquí se mostrará el estado real del alumno.</p>
        </section>
      </div>
    </div>
  )
}