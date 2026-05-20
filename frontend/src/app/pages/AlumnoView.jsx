import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { verDashboardAlumno } from '../../api/api'

export function AlumnoView() {
  const { user } = useAuth()
  const [alumno, setAlumno] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAlumno = async () => {
      try {
        const data = await verDashboardAlumno()
        setAlumno(data)
      } catch (err) {
        console.error('Error al cargar datos del alumno:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchAlumno()
  }, [])

  const nombre = user?.nombre || user?.email || '—'
  const email = user?.email || '—'
  const telefono = alumno?.telefono || alumno?.telefono_contacto || '—'
  const ciclo = alumno?.ciclo || alumno?.ciclo_nombre || alumno?.cicloName || alumno?.cicloAlumno || '—'

  const situacion = alumno?.estado || alumno?.status || alumno?.estado_asignacion || alumno?.situacion || 'Pendiente'
  const empresa = alumno?.empresa || alumno?.empresa?.nombre || alumno?.empresa_nombre || '—'
  const direccion = alumno?.direccion || alumno?.empresa?.direccion || '—'
  const tutorLaboral = alumno?.tutor_laboral || alumno?.tutor || alumno?.persona_contacto || '—'
  const emailContacto = alumno?.email_contacto || alumno?.email_tutor || '—'

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
              <p><span className='font-semibold text-white'>Nombre:</span> {loading ? 'Cargando...' : nombre}</p>
              <p><span className='font-semibold text-white'>Email:</span> {loading ? 'Cargando...' : email}</p>
              <p><span className='font-semibold text-white'>Teléfono:</span> {loading ? 'Cargando...' : telefono}</p>
              <p><span className='font-semibold text-white'>Ciclo:</span> {loading ? 'Cargando...' : ciclo}</p>
            </div>
            <p className='mt-6 text-sm text-slate-400'>Los datos del alumno se cargan desde el backend para mostrar nombre, email y ciclo de forma correcta.</p>
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
          <div className='mt-6 grid gap-4 lg:grid-cols-2'>
            <div className='rounded-3xl bg-slate-950 p-6'>
              <p className='text-sm uppercase tracking-[0.2em] text-slate-400'>Situación</p>
              <p className='mt-3 text-2xl font-semibold text-white'>{loading ? 'Cargando...' : situacion}</p>
            </div>
            <div className='rounded-3xl bg-slate-950 p-6'>
              <p className='text-sm uppercase tracking-[0.2em] text-slate-400'>Empresa</p>
              <p className='mt-3 text-xl font-semibold text-white'>{loading ? 'Cargando...' : empresa}</p>
            </div>
            <div className='rounded-3xl bg-slate-950 p-6'>
              <p className='text-sm uppercase tracking-[0.2em] text-slate-400'>Dirección</p>
              <p className='mt-3 text-xl font-semibold text-white'>{loading ? 'Cargando...' : direccion}</p>
            </div>
            <div className='rounded-3xl bg-slate-950 p-6'>
              <p className='text-sm uppercase tracking-[0.2em] text-slate-400'>Tutor laboral</p>
              <p className='mt-3 text-xl font-semibold text-white'>{loading ? 'Cargando...' : tutorLaboral}</p>
            </div>
            <div className='rounded-3xl bg-slate-950 p-6 lg:col-span-2'>
              <p className='text-sm uppercase tracking-[0.2em] text-slate-400'>Email de contacto</p>
              <p className='mt-3 text-xl font-semibold text-white'>{loading ? 'Cargando...' : emailContacto}</p>
            </div>
          </div>
          <p className='mt-6 text-sm text-slate-400'>Los datos de asignación se muestran según la información recibida del backend.</p>
        </section>
      </div>
    </div>
  )
}