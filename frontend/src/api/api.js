const rawApiUrl = import.meta.env.VITE_API_URL
const BASE_URL = rawApiUrl && rawApiUrl !== 'undefined' ? rawApiUrl.replace(/\/$/, '') : 'http://localhost:8000';

const buildUrl = (path) => {
  if (typeof path !== 'string') {
    throw new Error('Invalid API path')
  }
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${BASE_URL}${normalizedPath}`
}

const parseResponse = async (response) => {
  const contentType = response.headers.get('content-type')
  const data = contentType?.includes('application/json') ? await response.json() : null

  if (!response.ok) {
    const message = data?.detail || data?.mensaje || data?.error || response.statusText
    throw new Error(message || 'Error en la petición')
  }

  return data
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('fp_token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

const request = async (path, options = {}) => {
  const url = buildUrl(path)
  const response = await fetch(url, options)
  return parseResponse(response)
}

export const register = async ({ nombre, email, password, role = 'student' }) => {
  return request('/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre, email, password, role }),
  })
}

export const login = async ({ username, password }) => {
  return request('/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })
}

export const createCycle = async ({ nombre, inicio, fin }) => {
  return request('/ciclos/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify({ nombre, inicio, fin }),
  })
}

export const importAlumnos = async (file) => {
  const formData = new FormData()
  formData.append('file', file)
  return request('/alumnos/importar', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: formData,
  })
}

export const importEmpresas = async (file) => {
  const formData = new FormData()
  formData.append('file', file)
  return request('/empresas/importar', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: formData,
  })
}

export const registerEmpresa = async ({ nombre, direccion, web, contacto, email, telefono, dni, plazas }) => {
  const csvContent = `${nombre},${direccion},${web},${contacto},${email},${telefono},${dni},${plazas}\n`
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const formData = new FormData()
  formData.append('file', blob, 'empresa.csv')
  return request('/empresas/importar', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: formData,
  })
}

export const obtenerCiclos = async () => {
  return request('/ciclos/', {
    method: 'GET',
    headers: getAuthHeaders(),
  })
}

export const obtenerAlumnos = async (profesor_id) => {
  const path = profesor_id ? `/mis-alumnos/?profesor_id=${profesor_id}` : '/mis-alumnos/'
  return request(path, {
    method: 'GET',
    headers: getAuthHeaders(),
  })
}

export const asignarAlumno = async ({ alumno_id, empresa_id, ciclo_id }) => {
  return request('/asignar/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify({ alumno_id, empresa_id, ciclo_id }),
  })
}

export const registrarSeguimiento = async ({ empresa_id, profesor_id, observaciones }) => {
  return request('/seguimiento/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify({ empresa_id, profesor_id, observaciones }),
  })
}

export const asignarCicloAProfesor = async ({ profesor_id, ciclo_id }) => {
  return request(`/profesores/${profesor_id}/asignar-ciclo?ciclo_id=${ciclo_id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
  })
}

export const obtenerMisAlumnos = async (profesor_id) => {
  return request(`/mis-alumnos/?profesor_id=${profesor_id}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  })
}

export const obtenerHistorialEmpresa = async (empresa_id) => {
  return request(`/empresas/${empresa_id}/seguimientos`, {
    method: 'GET',
    headers: getAuthHeaders(),
  })
}

export const subirCV = async (file) => {
  const formData = new FormData()
  formData.append('file', file)
  return request('/alumnos/subir-cv', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: formData,
  })
}

export const verDashboardAlumno = async () => {
  return request('/alumno/dashboard', {
    method: 'GET',
    headers: getAuthHeaders(),
  })
}

export const descargarCV = async (alumno_id) => {
  const response = await fetch(`${BASE_URL}/descargar-cv/${alumno_id}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(errorText || 'Error al descargar el CV')
  }

  const blob = await response.blob()
  const url = window.URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = `cv_${alumno_id}.pdf`
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  window.URL.revokeObjectURL(url)
}

export const verEstadoPlazas = async () => {
  return request('/empresas/estado-plazas', {
    method: 'GET',
    headers: getAuthHeaders(),
  })
}
