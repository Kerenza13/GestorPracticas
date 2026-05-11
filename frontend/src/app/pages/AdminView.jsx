export function AdminView() {
  const cards = ['Ciclos', 'Profesores', 'Configuración', 'Asignaciones']

  return (
    <div className='min-h-screen bg-gray-950 py-10'>
      <div className='mx-auto max-w-7xl space-y-8 px-6'>
        <header className='rounded-[28px] border border-slate-800 bg-slate-900/95 p-8 shadow-xl'>
          <p className='text-sm font-semibold uppercase tracking-[0.25em] text-slate-400'>Administración</p>
          <h1 className='mt-4 text-4xl font-semibold text-white'>Centro de control administrativo</h1>
          <p className='mt-4 text-slate-300'>Monitorea y configura todo lo relacionado con ciclos, profesores, asignaciones y ajustes globales.</p>
        </header>

        <div className='grid gap-6 md:grid-cols-2 xl:grid-cols-4'>
          {cards.map(card => (
            <div key={card} className='rounded-[28px] border border-slate-800 bg-slate-900/95 p-8 shadow-lg transition duration-300 hover:-translate-y-1 hover:border-slate-700'>
              <h2 className='text-xl font-semibold text-white'>{card}</h2>
              <p className='mt-3 text-slate-400'>Visualiza y edita {card.toLowerCase()} con controles rápidos y claridad.</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}