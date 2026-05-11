export function ProfesorView() {
  return (
    <div className='min-h-screen bg-gray-950 py-10'>
      <div className='mx-auto max-w-7xl space-y-10 px-6'>
        <header className='rounded-[28px] border border-slate-800 bg-slate-900/95 p-8 shadow-xl'>
          <p className='text-sm font-semibold uppercase tracking-[0.25em] text-slate-400'>Profesor / Gestor de grupo</p>
          <h1 className='mt-4 text-4xl font-semibold text-white'>Gestión de alumnos, empresas y plazas</h1>
          <p className='mt-4 text-slate-300'>Importa listados masivos, registra el seguimiento de contactos y organiza plazas de empresa para tu grupo.</p>
        </header>

        <section className='grid gap-6 xl:grid-cols-[1.5fr_1fr]'>
          <div className='rounded-[28px] border border-slate-800 bg-slate-900/95 p-8 shadow-lg'>
            <h2 className='text-2xl font-semibold text-white'>Importación masiva</h2>
            <p className='mt-3 text-slate-400'>Sube tus listados de alumnos o empresas en CSV para matricular y registrar datos de forma rápida.</p>
            <div className='mt-6 space-y-4'>
              <label className='block rounded-3xl border border-slate-700 bg-slate-950 p-4'>
                <span className='text-sm font-medium text-slate-200'>CSV alumnos</span>
                <input type='file' className='mt-3 w-full text-sm text-slate-200' />
              </label>
              <label className='block rounded-3xl border border-slate-700 bg-slate-950 p-4'>
                <span className='text-sm font-medium text-slate-200'>CSV empresas</span>
                <input type='file' className='mt-3 w-full text-sm text-slate-200' />
              </label>
            </div>
          </div>

          <div className='rounded-[28px] border border-slate-800 bg-slate-900/95 p-8 shadow-lg'>
            <h2 className='text-2xl font-semibold text-white'>Seguimiento de empresas</h2>
            <p className='mt-3 text-slate-400'>Registra contactos con empresas, fechas y responsables para llevar el historial de cada gestión.</p>
            <div className='mt-6 rounded-3xl border border-dashed border-slate-700 bg-slate-950 p-8 text-center text-slate-400'>
              Aquí aparecerán los registros de seguimiento de empresas.
            </div>
          </div>
        </section>

        <section className='grid gap-6 xl:grid-cols-2'>
          <div className='rounded-[28px] border border-slate-800 bg-slate-900/95 p-8 shadow-lg'>
            <h2 className='text-2xl font-semibold text-white'>Gestión de plazas</h2>
            <p className='mt-3 text-slate-400'>Define cuántos alumnos acepta cada empresa y qué ciclos pueden optar a cada plaza.</p>
            <div className='mt-6 rounded-3xl border border-dashed border-slate-700 bg-slate-950 p-8 text-center text-slate-400'>
              Configura las plazas disponibles para cada empresa.
            </div>
          </div>

          <div className='rounded-[28px] border border-slate-800 bg-slate-900/95 p-8 shadow-lg'>
            <h2 className='text-2xl font-semibold text-white'>Asignación dinámica</h2>
            <p className='mt-3 text-slate-400'>Asocia alumnos a plazas disponibles con una vista tipo tablero o selector interactivo.</p>
            <div className='mt-6 rounded-[24px] border border-dashed border-slate-700 bg-slate-950 p-8 text-center text-slate-400'>
              Aquí se mostrará el área de asignación cuando esté integrada.
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}