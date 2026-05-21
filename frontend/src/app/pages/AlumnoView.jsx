import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { verDashboardAlumno, subirCV } from '../../api/api' // 🟢 Importamos subirCV

export function AlumnoView() {
  const { user } = useAuth()
  const [alumno, setAlumno] = useState(null)
  const [loading, setLoading] = useState(true)
  
  // 🟢 Estados para controlar el archivo y los mensajes de feedback
  const [cvFile, setCvFile] = useState(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [subiendo, setSubiendo] = useState(false)

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

  // 🟢 Función para manejar el envío del archivo PDF al backend
  const handleUploadCV = async (event) => {
    event.preventDefault()
    setMessage('')
    setError('')

    if (!cvFile) {
      setError('Por favor, selecciona un archivo PDF primero.')
      return
    }

    try {
      setSubiendo(true)
      const result = await subirCV(cvFile) // Llama a tu función de api.js
      setMessage(result.mensaje || '¡Currículum subido correctamente!')
      setCvFile(null)
      event.target.reset() // Limpia el input del archivo en el HTML
    } catch (err) {
      setError(err.message || 'Error al subir el currículum')
    } finally {
      setSubiendo(false)
    }
  }

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

          {/* 🟢 SECCIÓN DE SUBIDA DE CV ACTUALIZADA CON SU FORMULARIO */}
          <div className='rounded-[28px] border border-slate-800 bg-slate-900/95 p-8 shadow-lg flex flex-col justify-between'>
            <div>
              <h2 className='text-2xl font-semibold text-white'>Subir currículum</h2>
              <p className='mt-3 text-slate-400'>Adjunta tu CV en formato PDF para que la empresa y el tutor lo revisen.</p>
              
              {/* Mensajes en pantalla */}
              {message && <p className="mt-3 text-sm text-green-400 font-medium">{message}</p>}
              {error && <p className="mt-3 text-sm text-red-400 font-medium">{error}</p>}
            </div>

            <form onSubmit={handleUploadCV} className="mt-6 space-y-4">
              <label className='block rounded-3xl border border-slate-700 bg-slate-950 px-4 py-5 text-slate-200 cursor-pointer'>
                <span className='block text-sm font-medium'>Documento CV</span>
                <input 
                  type='file' 
                  accept=".pdf" // Solo permite PDFs
                  className='mt-4 w-full text-sm file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-slate-200 hover:file:bg-slate-700' 
                  onChange={(e) => setCvFile(e.target.files[0])} // Guarda el archivo seleccionado
                />
              </label>
              
              <button 
                type="submit" 
                disabled={subiendo}
                className={`w-full text-white font-medium text-sm py-2 px-4 rounded-2xl transition ${
                  subiendo ? 'bg-blue-800 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {subiendo ? 'Subiendo...' : 'Subir Currículum'}
              </button>
            </form>
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