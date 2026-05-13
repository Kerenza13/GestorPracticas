import { useState } from 'react'
import { createCycle, asignarCicloAProfesor } from '../../api/api'

export function AdminView() {
  const [nombre, setNombre] = useState('')
  const [inicio, setInicio] = useState('2025')
  const [fin, setFin] = useState('2026')
  const [profesorId, setProfesorId] = useState('')
  const [cicloId, setCicloId] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleCreateCycle = async (event) => {
    event.preventDefault()
    setMessage('')
    setError('')

    try {
      await createCycle({ nombre, inicio: Number(inicio), fin: Number(fin) })
      setMessage('Ciclo creado correctamente')
      setNombre('')
      setInicio('2025')
      setFin('2026')
    } catch (err) {
      setError(err.message || 'No se pudo crear el ciclo')
    }
  }

  const handleAssignCycle = async (event) => {
    event.preventDefault()
    setMessage('')
    setError('')

    try {
      await asignarCicloAProfesor({ profesor_id: Number(profesorId), ciclo_id: Number(cicloId) })
      setMessage('Tutoría asignada al profesor')
      setProfesorId('')
      setCicloId('')
    } catch (err) {
      setError(err.message || 'No se pudo asignar el ciclo')
    }
  }

  return (
    <div className='bg-gray-950 py-10'>
      <div className='mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8'>
        <header className='rounded-[28px] border border-slate-800 bg-slate-900/95 p-8 shadow-xl'>
          <p className='text-sm font-semibold uppercase tracking-[0.25em] text-slate-400'>Administración</p>
          <h1 className='mt-4 text-3xl font-semibold text-white sm:text-4xl'>Centro de control administrativo</h1>
          <p className='mt-4 text-slate-300'>Monitorea y configura todo lo relacionado con ciclos, profesores, asignaciones y ajustes globales.</p>
        </header>

        {(message || error) && (
          <div className='grid gap-4'>
            {message && <div className='rounded-3xl bg-emerald-500/10 px-5 py-4 text-emerald-200'>{message}</div>}
            {error && <div className='rounded-3xl bg-red-500/10 px-5 py-4 text-red-200'>{error}</div>}
          </div>
        )}

        <section className='grid gap-6 lg:grid-cols-[1.4fr_1fr]'>
          <div className='rounded-[28px] border border-slate-800 bg-slate-900/95 p-8 shadow-lg'>
            <h2 className='text-2xl font-semibold text-white'>Crear nuevo ciclo</h2>
            <p className='mt-3 text-slate-400'>Registra un nuevo ciclo formativo para que el equipo docente pueda asignar alumnos correctamente.</p>

            <form onSubmit={handleCreateCycle} className='mt-6 space-y-4'>
              <input
                value={nombre}
                onChange={(event) => setNombre(event.target.value)}
                className='w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-slate-600'
                placeholder='Nombre del ciclo'
                required
              />
              <div className='grid gap-4 sm:grid-cols-2'>
                <input
                  value={inicio}
                  onChange={(event) => setInicio(event.target.value)}
                  className='w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-slate-600'
                  placeholder='Año inicio'
                  type='number'
                  required
                />
                <input
                  value={fin}
                  onChange={(event) => setFin(event.target.value)}
                  className='w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-slate-600'
                  placeholder='Año fin'
                  type='number'
                  required
                />
              </div>
              <button type='submit' className='w-full rounded-3xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200'>
                Crear ciclo
              </button>
            </form>
          </div>

          <div className='rounded-[28px] border border-slate-800 bg-slate-900/95 p-8 shadow-lg'>
            <h2 className='text-2xl font-semibold text-white'>Asignar ciclo a profesor</h2>
            <p className='mt-3 text-slate-400'>Asigna un ciclo de tutoría a un profesor existente utilizando su ID.</p>

            <form onSubmit={handleAssignCycle} className='mt-6 space-y-4'>
              <input
                value={profesorId}
                onChange={(event) => setProfesorId(event.target.value)}
                className='w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-slate-600'
                placeholder='ID del profesor'
                type='number'
                required
              />
              <input
                value={cicloId}
                onChange={(event) => setCicloId(event.target.value)}
                className='w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-slate-600'
                placeholder='ID del ciclo'
                type='number'
                required
              />
              <button type='submit' className='w-full rounded-3xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200'>
                Asignar ciclo
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  )
}
