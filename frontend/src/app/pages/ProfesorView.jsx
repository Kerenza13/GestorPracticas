import { useEffect, useState } from "react";
import {
  importAlumnos,
  importEmpresas,
  registerEmpresa,
  asignarAlumno,
  registrarSeguimiento,
  descargarCV,
  verEstadoPlazas,
  obtenerCiclos,
  obtenerAlumnos,
  obtenerHistorialEmpresa,
} from "../../api/api";

export function ProfesorView() {
  // Estados de archivos y mensajes
  const [alumnosFile, setAlumnosFile] = useState(null);
  const [empresasFile, setEmpresasFile] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Estados del Formulario de Registro de Empresa Manual
  const [companyNombre, setCompanyNombre] = useState("");
  const [companyDireccion, setCompanyDireccion] = useState("");
  const [companyWeb, setCompanyWeb] = useState("");
  const [companyContacto, setCompanyContacto] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [companyTelefono, setCompanyTelefono] = useState("");
  const [companyDni, setCompanyDni] = useState("");
  const [companyPlazas, setCompanyPlazas] = useState("1");

  // Estados de datos de la API
  const [alumnos, setAlumnos] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [ciclos, setCiclos] = useState([]);
  const [plazasStatus, setPlazasStatus] = useState([]);
  const [historial, setHistorial] = useState([]);

  // Estados de Selección / IDs
  const [selectedAlumnoId, setSelectedAlumnoId] = useState("");
  const [selectedEmpresaId, setSelectedEmpresaId] = useState("");
  const [selectedCicloId, setSelectedCicloId] = useState("");
  const [teacherIdForAlumnos, setTeacherIdForAlumnos] = useState("");
  
  // Seguimiento e Historial
  const [seguimientoEmpresaId, setSeguimientoEmpresaId] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [profesorId, setProfesorId] = useState("");
  const [historialEmpresaId, setHistorialEmpresaId] = useState("");

  // Carga inicial de datos de la API al montar el componente
  useEffect(() => {
    const loadPlazas = async () => {
      try {
        const data = await verEstadoPlazas();
        setPlazasStatus(data);
        setEmpresas(data);
      } catch (err) {
        setError(err.message || "No se pudo cargar el estado de plazas");
      }
    };

    const loadCiclos = async () => {
      try {
        const data = await obtenerCiclos();
        setCiclos(data);
      } catch (err) {
        console.warn("No se pudieron cargar los ciclos automáticamente:", err.message);
      }
    };

    loadPlazas();
    loadCiclos();
  }, []);

  // Manejadores de eventos (Handlers)
  const handleLoadAlumnos = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    if (!teacherIdForAlumnos) {
      setError("Introduce el ID del profesor para cargar sus alumnos");
      return;
    }

    try {
      const data = await obtenerAlumnos(Number(teacherIdForAlumnos));
      setAlumnos(data);
      setSelectedAlumnoId(data[0]?.id?.toString() || "");
      setMessage("Alumnos cargados correctamente");
    } catch (err) {
      setError(err.message || "No se pudieron cargar los alumnos");
    }
  };

  const handleImportAlumnos = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    if (!alumnosFile) {
      setError("Selecciona un archivo CSV de alumnos");
      return;
    }

    try {
      const result = await importAlumnos(alumnosFile);
      setMessage(result.mensaje);
      setAlumnosFile(null);
      event.target.reset();
    } catch (err) {
      setError(err.message || "Error al importar alumnos");
    }
  };

  const handleImportEmpresas = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    if (!empresasFile) {
      setError("Selecciona un archivo CSV de empresas");
      return;
    }

    try {
      const result = await importEmpresas(empresasFile);
      setMessage(result.mensaje);
      setEmpresasFile(null);
      event.target.reset();
      const data = await verEstadoPlazas();
      setPlazasStatus(data);
      setEmpresas(data);
    } catch (err) {
      setError(err.message || "Error al importar empresas");
    }
  };

  const handleRegisterEmpresa = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    try {
      const result = await registerEmpresa({
        nombre: companyNombre,
        direccion: companyDireccion,
        web: companyWeb,
        contacto: companyContacto,
        email: companyEmail,
        telefono: companyTelefono,
        dni: companyDni,
        plazas: Number(companyPlazas),
      });
      setMessage(result.mensaje);
      setCompanyNombre("");
      setCompanyDireccion("");
      setCompanyWeb("");
      setCompanyContacto("");
      setCompanyEmail("");
      setCompanyTelefono("");
      setCompanyDni("");
      setCompanyPlazas("1");
      const data = await verEstadoPlazas();
      setPlazasStatus(data);
      setEmpresas(data);
    } catch (err) {
      setError(err.message || "Error al registrar la empresa");
    }
  };

  const handleAssignAlumno = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    if (!selectedAlumnoId || !selectedEmpresaId || !selectedCicloId) {
      setError("Selecciona alumno, empresa y ciclo antes de asignar");
      return;
    }

    try {
      const result = await asignarAlumno({
        alumno_id: Number(selectedAlumnoId),
        empresa_id: Number(selectedEmpresaId),
        ciclo_id: Number(selectedCicloId),
      });
      setMessage(result.mensaje);
      setSelectedAlumnoId("");
      setSelectedEmpresaId("");
      setSelectedCicloId("");
      const data = await verEstadoPlazas();
      setPlazasStatus(data);
      setEmpresas(data);
    } catch (err) {
      setError(err.message || "Error al asignar el alumno");
    }
  };

  const handleSeguimiento = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    try {
      const result = await registrarSeguimiento({
        empresa_id: Number(seguimientoEmpresaId),
        profesor_id: Number(profesorId),
        observaciones,
      });
      setMessage(result.mensaje);
      setSeguimientoEmpresaId("");
      setObservaciones("");
      setProfesorId("");
    } catch (err) {
      setError(err.message || "Error al registrar seguimiento");
    }
  };

  const loadHistorial = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    try {
      const data = await obtenerHistorialEmpresa(Number(historialEmpresaId));
      setHistorial(data);
    } catch (err) {
      setError(err.message || "Error al obtener el historial");
    }
  };

  const handleDownloadCV = async () => {
    setMessage("");
    setError("");

    if (!selectedAlumnoId) {
      setError("Selecciona un alumno para descargar su CV");
      return;
    }

    try {
      await descargarCV(Number(selectedAlumnoId));
      setMessage("Descarga iniciada para el CV del alumno seleccionado");
    } catch (err) {
      setError(err.message || "Error al descargar el CV");
    }
  };

  return (
    <div className="bg-gray-950 py-10 min-h-screen">
      <div className="mx-auto max-w-7xl space-y-10 px-4 sm:px-6 lg:px-8">
        
        {/* CABECERA */}
        <header className="rounded-[28px] border border-slate-800 bg-slate-900/95 p-8 shadow-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">
            Profesor / Gestor de grupo
          </p>
          <h1 className="mt-4 text-4xl font-semibold text-white">
            Gestión de alumnos, empresas y plazas
          </h1>
          <p className="mt-4 text-slate-300">
            Importa listados masivos, registra el seguimiento de contactos y organiza plazas de empresa para tu grupo.
          </p>
        </header>

        {/* FEEDBACK GLOBAL */}
        {(message || error) && (
          <div className={`p-4 rounded-2xl border ${message ? 'bg-green-950/40 border-green-800 text-green-400' : 'bg-red-950/40 border-red-800 text-red-400'}`}>
            <p className="text-sm font-medium">{message || error}</p>
          </div>
        )}

        {/* BLOQUE 1: IMPORTACIÓN Y SEGUIMIENTO */}
        <section className="grid gap-6 xl:grid-cols-[1.2fr_1.8fr]">
          
          {/* IMPORTACIÓN MASIVA */}
          <div className="rounded-[28px] border border-slate-800 bg-slate-900/95 p-8 shadow-lg space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-white">Importación masiva</h2>
              <p className="mt-1 text-sm text-slate-400">Sube tus listados en formato CSV.</p>
            </div>

            <form onSubmit={handleImportAlumnos} className="space-y-3">
              <label className="block rounded-2xl border border-slate-800 bg-slate-950 p-4 cursor-pointer hover:border-slate-700 transition">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2">CSV Alumnos</span>
                <input type="file" accept=".csv" className="w-full text-sm text-slate-300 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:bg-slate-800 file:text-slate-200" onChange={(e) => setAlumnosFile(e.target.files[0])} />
              </label>
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm py-2 px-4 rounded-xl transition">Importar Alumnos</button>
            </form>

            <hr className="border-slate-800" />

            <form onSubmit={handleImportEmpresas} className="space-y-3">
              <label className="block rounded-2xl border border-slate-800 bg-slate-950 p-4 cursor-pointer hover:border-slate-700 transition">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2">CSV Empresas</span>
                <input type="file" accept=".csv" className="w-full text-sm text-slate-300 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:bg-slate-800 file:text-slate-200" onChange={(e) => setEmpresasFile(e.target.files[0])} />
              </label>
              <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm py-2 px-4 rounded-xl transition">Importar Empresas</button>
            </form>
          </div>

          {/* SEGUIMIENTO DE EMPRESAS */}
          <div className="rounded-[28px] border border-slate-800 bg-slate-900/95 p-8 shadow-lg grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-semibold text-white">Nuevo Seguimiento</h2>
                <p className="mt-1 text-sm text-slate-400">Registra reuniones o llamadas.</p>
              </div>
              <form onSubmit={handleSeguimiento} className="space-y-3">
                <select className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-slate-700" value={seguimientoEmpresaId} onChange={(e) => setSeguimientoEmpresaId(e.target.value)} required>
                  <option value="">Selecciona Empresa...</option>
                  {empresas.map((emp) => (<option key={emp.id} value={emp.id}>{emp.nombre}</option>))}
                </select>
                <input type="number" placeholder="ID de Profesor" className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl px-3 py-2 text-sm" value={profesorId} onChange={(e) => setProfesorId(e.target.value)} required />
                <textarea placeholder="Observaciones de la gestión..." rows="3" className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl px-3 py-2 text-sm" value={observaciones} onChange={(e) => setObservaciones(e.target.value)} required></textarea>
                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm py-2 px-4 rounded-xl transition">Añadir Registro</button>
              </form>
            </div>

            <div className="space-y-4 border-t md:border-t-0 md:border-l border-slate-800 md:pl-6 pt-6 md:pt-0">
              <div>
                <h2 className="text-2xl font-semibold text-white">Historial</h2>
                <p className="mt-1 text-sm text-slate-400">Consulta gestiones pasadas.</p>
              </div>
              <form onSubmit={loadHistorial} className="flex gap-2">
                <select className="flex-1 bg-slate-950 border border-slate-800 text-slate-200 rounded-xl px-3 py-2 text-sm" value={historialEmpresaId} onChange={(e) => setHistorialEmpresaId(e.target.value)} required>
                  <option value="">Selecciona Empresa...</option>
                  {empresas.map((emp) => (<option key={emp.id} value={emp.id}>{emp.nombre}</option>))}
                </select>
                <button type="submit" className="bg-slate-800 hover:bg-slate-700 text-white px-4 rounded-xl text-sm transition">Ver</button>
              </form>
              <div className="bg-slate-950 rounded-2xl border border-slate-800 p-3 max-h-[170px] overflow-y-auto space-y-2">
                {historial.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-4">No hay registros cargados aún.</p>
                ) : (
                  historial.map((hist) => (
                    <div key={hist.id} className="p-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300">
                      <p className="font-semibold text-slate-400">{hist.fecha_contacto || "Reciente"}</p>
                      <p className="mt-1 text-slate-200">{hist.observaciones}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </section>

        {/* BLOQUE 2: PLAZAS Y ASIGNACIÓN */}
        <section className="grid gap-6 xl:grid-cols-2">
          
          {/* ESTADO DE PLAZAS */}
          <div className="rounded-[28px] border border-slate-800 bg-slate-900/95 p-8 shadow-lg space-y-4">
            <div>
              <h2 className="text-2xl font-semibold text-white">Estado de plazas ocupadas</h2>
              <p className="mt-1 text-sm text-slate-400">Control en tiempo real de vacantes disponibles.</p>
            </div>
            <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden max-h-[340px] overflow-y-auto">
              <table className="w-full text-left border-collapse text-sm text-slate-300">
                <thead className="bg-slate-900 text-xs font-semibold text-slate-400 uppercase border-b border-slate-800">
                  <tr>
                    <th className="p-3">Empresa</th>
                    <th className="p-3 text-center">Totales</th>
                    <th className="p-3 text-center">Libres</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900">
                  {plazasStatus.length === 0 ? (
                    <tr><td colSpan="3" className="p-4 text-center text-xs text-slate-500">No hay datos de empresas.</td></tr>
                  ) : (
                    plazasStatus.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-900/40">
                        <td className="p-3 font-medium text-white">{item.nombre}</td>
                        <td className="p-3 text-center">{item.totales}</td>
                        <td className="p-3 text-center"><span className={`px-2 py-0.5 rounded-full text-xs font-bold ${item.libres > 0 ? 'bg-green-950 text-green-400' : 'bg-red-950 text-red-400'}`}>{item.libres}</span></td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* ASIGNACIÓN MANUAL / SELECTOR COMPLETO Y DESCARGA CV */}
          <div className="rounded-[28px] border border-slate-800 bg-slate-900/95 p-8 shadow-lg space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-white">Asignación Directa y CVs</h2>
              <p className="mt-1 text-sm text-slate-400">Vincula alumnos a plazas e inspecciona currículums.</p>
            </div>

            {/* Paso previo obligatorio: cargar alumnos de la BD */}
            <form onSubmit={handleLoadAlumnos} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex gap-3 items-end">
              <div className="flex-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">ID Tutor / Profe</label>
                <input type="number" placeholder="Ej: 1" className="w-full bg-slate-900 border border-slate-800 text-slate-200 rounded-xl px-3 py-1.5 text-sm" value={teacherIdForAlumnos} onChange={(e) => setTeacherIdForAlumnos(e.target.value)} required />
              </div>
              <button type="submit" className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-1.5 rounded-xl text-sm transition font-medium">Cargar Alumnos</button>
            </form>

            <form onSubmit={handleAssignAlumno} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold uppercase text-slate-400 block mb-1">1. Alumno de tu grupo</label>
                  <select className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl px-3 py-2 text-sm" value={selectedAlumnoId} onChange={(e) => setSelectedAlumnoId(e.target.value)}>
                    <option value="">Selecciona Alumno...</option>
                    {alumnos.map((a) => (<option key={a.id} value={a.id}>{a.full_name || a.email}</option>))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase text-slate-400 block mb-1">2. Empresa de Destino</label>
                  <select className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl px-3 py-2 text-sm" value={selectedEmpresaId} onChange={(e) => setSelectedEmpresaId(e.target.value)}>
                    <option value="">Selecciona Empresa...</option>
                    {empresas.map((e) => (<option key={e.id} value={e.id}>{e.nombre}</option>))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase text-slate-400 block mb-1">3. Ciclo Formativo</label>
                <select className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl px-3 py-2 text-sm" value={selectedCicloId} onChange={(e) => setSelectedCicloId(e.target.value)}>
                  <option value="">Selecciona Ciclo...</option>
                  {ciclos.map((c) => (<option key={c.id} value={c.id}>{c.nombre}</option>))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                <button type="button" onClick={handleDownloadCV} className="border border-slate-700 hover:bg-slate-800 text-slate-200 text-sm py-2 px-4 rounded-xl transition font-medium">📥 Descargar CV PDF</button>
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 px-4 rounded-xl transition font-medium">Asociar a la Plaza</button>
              </div>
            </form>
          </div>
        </section>

      </div>
    </div>
  );
}