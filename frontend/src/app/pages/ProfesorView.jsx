import { useEffect, useState } from "react";
import {
  importAlumnos,
  importEmpresas,
  registerEmpresa,
  asignarAlumno,
  descargarCV,
  verEstadoPlazas,
  obtenerCiclos,
  obtenerAlumnos,
  registrarSeguimiento, // 🟢 Recuperado de tus cambios
  obtenerHistorialEmpresa, // 🟢 Recuperado de tus cambios
} from "../../api/api";
import { useAuth } from "../context/AuthContext";

export function ProfesorView() {
  const [alumnosFile, setAlumnosFile] = useState(null);
  const [empresasFile, setEmpresasFile] = useState(null);

  // Estados para Registro de Empresa (Cambios del main)
  const [companyNombre, setCompanyNombre] = useState("");
  const [companyDireccion, setCompanyDireccion] = useState("");
  const [companyWeb, setCompanyWeb] = useState("");
  const [companyContacto, setCompanyContacto] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [companyTelefono, setCompanyTelefono] = useState("");
  const [companyDni, setCompanyDni] = useState("");
  const [companyPlazas, setCompanyPlazas] = useState("1");

  // Estados para selectores y cargas (Cambios del main)
  const [alumnos, setAlumnos] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [ciclos, setCiclos] = useState([]);
  const [selectedAlumnoId, setSelectedAlumnoId] = useState("");
  const [selectedEmpresaId, setSelectedEmpresaId] = useState("");
  const [selectedCicloId, setSelectedCicloId] = useState("");
  const [teacherIdForAlumnos, setTeacherIdForAlumnos] = useState("");

  // Estados de tus funcionalidades (Recuperados de HEAD)
  const [profesorId, setProfesorId] = useState("");
  const [seguimientoEmpresaId, setSeguimientoEmpresaId] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [historialEmpresaId, setHistorialEmpresaId] = useState("");
  const [historial, setHistorial] = useState([]);

  const [plazasStatus, setPlazasStatus] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

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
        console.warn(
          "No se pudieron cargar los ciclos automáticamente:",
          err.message,
        );
      }
    };

    loadPlazas();
    loadCiclos();
  }, []);

  // Auto-load alumnos when the authenticated user is a profesor
  const { user } = useAuth();

  useEffect(() => {
    if (!user || user.role !== "profesor") return;

    const autoLoadAlumnos = async () => {
      try {
        // Try to fetch using the token-based endpoint; backend should return the professor's alumnos
        const data = await obtenerAlumnos();
        setAlumnos(data);
        setSelectedAlumnoId(data[0]?.id?.toString() || "");
        // intentar preseleccionar el ciclo a partir del primer alumno si existe
        const alumnoCicloId =
          data[0]?.ciclo?.id || data[0]?.ciclo_id || data[0]?.ciclo;
        if (alumnoCicloId) {
          setSelectedCicloId(
            alumnoCicloId?.toString ? alumnoCicloId.toString() : alumnoCicloId,
          );
        }
        setTeacherIdForAlumnos(user.sub?.toString() || "");
        setMessage("Alumnos cargados automáticamente");
      } catch (err) {
        console.warn(
          "No se pudieron cargar los alumnos automáticamente:",
          err.message,
        );
      }
    };

    autoLoadAlumnos();
  }, [user]);

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

  // 🟢 Tus funciones de seguimiento recuperadas y adaptadas
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

  return (
    <div className="bg-gray-950 py-10">
      <div className="mx-auto max-w-7xl space-y-10 px-4 sm:px-6 lg:px-8">
        <header className="rounded-[28px] border border-slate-800 bg-slate-900/95 p-8 shadow-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">
            Profesor / Gestor de grupo
          </p>
          <h1 className="mt-4 text-4xl font-semibold text-white">
            Gestión de alumnos, empresas y plazas
          </h1>
          <p className="mt-4 text-slate-300">
            Importa listados masivos, registra el seguimiento de contactos y
            organiza plazas de empresa para tu grupo.
          </p>
        </header>

        {(message || error) && (
          <div className="grid gap-4">
            {message && (
              <div className="rounded-3xl bg-emerald-500/10 px-5 py-4 text-emerald-200">
                {message}
              </div>
            )}
            {error && (
              <div className="rounded-3xl bg-red-500/10 px-5 py-4 text-red-200">
                {error}
              </div>
            )}
          </div>
        )}

        <section className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
          <div className="rounded-[28px] border border-slate-800 bg-slate-900/95 p-8 shadow-lg">
            <h2 className="text-2xl font-semibold text-white">
              Importación masiva
            </h2>
            <p className="mt-3 text-slate-400">
              Sube tus listados de alumnos o empresas en CSV para matricular y
              registrar datos de forma rápida.
            </p>
            <form onSubmit={handleImportAlumnos} className="mt-6 space-y-4">
              <label className="block rounded-3xl border border-slate-700 bg-slate-950 p-4">
                <span className="text-sm font-medium text-slate-200">
                  CSV alumnos
                </span>
                <input
                  type="file"
                  accept=".csv"
                  className="mt-3 w-full text-sm text-slate-200"
                  onChange={(event) =>
                    setAlumnosFile(event.target.files?.[0] || null)
                  }
                />
              </label>
              <button
                type="submit"
                className="w-full rounded-3xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
              >
                Importar alumnos
              </button>
            </form>
            <form onSubmit={handleImportEmpresas} className="mt-6 space-y-4">
              <label className="block rounded-3xl border border-slate-700 bg-slate-950 p-4">
                <span className="text-sm font-medium text-slate-200">
                  CSV empresas
                </span>
                <input
                  type="file"
                  accept=".csv"
                  className="mt-3 w-full text-sm text-slate-200"
                  onChange={(event) =>
                    setEmpresasFile(event.target.files?.[0] || null)
                  }
                />
              </label>
              <button
                type="submit"
                className="w-full rounded-3xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
              >
                Importar empresas
              </button>
            </form>
          </div>

          <div className="rounded-[28px] border border-slate-800 bg-slate-900/95 p-8 shadow-lg">
            <h2 className="text-2xl font-semibold text-white">
              Registrar empresa manualmente
            </h2>
            <p className="mt-3 text-slate-400">
              Introduce los datos de una empresa para crearla sin necesidad de
              CSV.
            </p>
            <form onSubmit={handleRegisterEmpresa} className="mt-6 space-y-4">
              <input
                value={companyNombre}
                onChange={(event) => setCompanyNombre(event.target.value)}
                className="w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-slate-600"
                placeholder="Nombre de la empresa"
                required
              />
              <input
                value={companyDireccion}
                onChange={(event) => setCompanyDireccion(event.target.value)}
                className="w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-slate-600"
                placeholder="Dirección"
                required
              />
              <input
                value={companyWeb}
                onChange={(event) => setCompanyWeb(event.target.value)}
                className="w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-slate-600"
                placeholder="Web"
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  value={companyContacto}
                  onChange={(event) => setCompanyContacto(event.target.value)}
                  className="w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-slate-600"
                  placeholder="Contacto"
                  required
                />
                <input
                  value={companyEmail}
                  onChange={(event) => setCompanyEmail(event.target.value)}
                  type="email"
                  className="w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-slate-600"
                  placeholder="Email de tutor"
                  required
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  value={companyTelefono}
                  onChange={(event) => setCompanyTelefono(event.target.value)}
                  className="w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-slate-600"
                  placeholder="Teléfono"
                  required
                />
                <input
                  value={companyDni}
                  onChange={(event) => setCompanyDni(event.target.value)}
                  className="w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-slate-600"
                  placeholder="DNI responsable"
                  required
                />
              </div>
              <input
                value={companyPlazas}
                onChange={(event) => setCompanyPlazas(event.target.value)}
                type="number"
                min="1"
                className="w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-slate-600"
                placeholder="Plazas disponibles"
                required
              />
              <button
                type="submit"
                className="w-full rounded-3xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
              >
                Registrar empresa
              </button>
            </form>
          </div>
        </section>

        {/* 🟢 SECCIÓN DE SEGUIMIENTO E HISTORIAL REINTEGRADA */}
        <section className="grid gap-6 xl:grid-cols-2">
          <div className="rounded-[28px] border border-slate-800 bg-slate-900/95 p-8 shadow-lg">
            <h2 className="text-2xl font-semibold text-white">
              Registrar seguimiento
            </h2>
            <form onSubmit={handleSeguimiento} className="mt-6 space-y-4">
              <input
                value={seguimientoEmpresaId}
                onChange={(e) => setSeguimientoEmpresaId(e.target.value)}
                type="number"
                className="w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-slate-600"
                placeholder="ID de la empresa"
                required
              />
              <input
                value={profesorId}
                onChange={(e) => setProfesorId(e.target.value)}
                type="number"
                className="w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-slate-600"
                placeholder="ID del profesor"
                required
              />
              <textarea
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
                className="w-full h-24 rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-slate-600 resize-none"
                placeholder="Observaciones de la reunión o llamada..."
                required
              />
              <button
                type="submit"
                className="w-full rounded-3xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
              >
                Guardar contacto
              </button>
            </form>
          </div>

          <div className="rounded-[28px] border border-slate-800 bg-slate-900/95 p-8 shadow-lg">
            <h2 className="text-2xl font-semibold text-white">
              Historial de la empresa
            </h2>
            <form onSubmit={loadHistorial} className="mt-6 flex gap-2">
              <input
                value={historialEmpresaId}
                onChange={(e) => setHistorialEmpresaId(e.target.value)}
                type="number"
                className="w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-slate-600"
                placeholder="ID de la empresa para buscar"
                required
              />
              <button
                type="submit"
                className="rounded-3xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Buscar
              </button>
            </form>
            <div className="mt-4 space-y-3 max-h-48 overflow-y-auto pr-2">
              {historial.length === 0 ? (
                <p className="text-sm text-slate-500 italic text-center py-4">
                  No se han cargado registros históricos.
                </p>
              ) : (
                historial.map((item, index) => (
                  <div
                    key={index}
                    className="rounded-2xl border border-slate-800 bg-slate-950 p-3 text-sm text-slate-300"
                  >
                    <p className="font-semibold text-slate-100">
                      Profesor ID: {item.profesor_id}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      {item.fecha || "Fecha no registrada"}
                    </p>
                    <p className="mt-2 bg-slate-900/50 p-2 rounded-xl text-slate-200">
                      {item.observaciones}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <div className="rounded-[28px] border border-slate-800 bg-slate-900/95 p-8 shadow-lg">
            <h2 className="text-2xl font-semibold text-white">
              Estado de plazas
            </h2>
            <p className="mt-3 text-slate-400">
              Estado actual de plazas por empresa.
            </p>
            <div className="mt-6 space-y-4">
              {plazasStatus.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-slate-700 bg-slate-950 p-8 text-center text-slate-400">
                  No hay información de plazas disponible.
                </div>
              ) : (
                <div className="space-y-4">
                  {plazasStatus.map((empresa) => (
                    <div
                      key={empresa.id}
                      className="rounded-3xl border border-slate-700 bg-slate-950 p-4"
                    >
                      <p className="font-semibold text-white">
                        {empresa.nombre}
                      </p>
                      <p className="text-sm text-slate-400">
                        Total: {empresa.totales} • Libres: {empresa.libres}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-800 bg-slate-900/95 p-8 shadow-lg">
            <h2 className="text-2xl font-semibold text-white">
              Asignar alumno a empresa
            </h2>
            <p className="mt-3 text-slate-400">
              Selecciona alumno, empresa y ciclo desde los desplegables para
              registrar la asignación.
            </p>
            <form onSubmit={handleAssignAlumno} className="mt-6 space-y-4">
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-sm font-medium text-slate-200">
                      ID profesor
                    </span>
                    <div className="mt-2 flex gap-2">
                      <input
                        value={teacherIdForAlumnos}
                        onChange={(event) =>
                          setTeacherIdForAlumnos(event.target.value)
                        }
                        className="w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-slate-600"
                        placeholder="ID del profesor"
                        type="number"
                      />
                      <button
                        type="button"
                        onClick={handleLoadAlumnos}
                        className="rounded-3xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
                      >
                        Cargar alumnos
                      </button>
                    </div>
                  </label>
                </div>

                <label className="block">
                  <span className="text-sm font-medium text-slate-200">
                    Alumno
                  </span>
                  <select
                    value={selectedAlumnoId}
                    onChange={(event) =>
                      setSelectedAlumnoId(event.target.value)
                    }
                    className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-slate-600"
                    required
                  >
                    <option value="" disabled>
                      Selecciona un alumno
                    </option>
                    {alumnos.map((alumno) => (
                      <option key={alumno.id} value={alumno.id}>
                        {alumno.full_name || alumno.nombre || alumno.email}
                      </option>
                    ))}
                  </select>
                </label>

                <button
                  type="button"
                  onClick={handleDownloadCV}
                  className="w-full rounded-3xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Descargar CV del alumno
                </button>

                <label className="block">
                  <span className="text-sm font-medium text-slate-200">
                    Empresa
                  </span>
                  <select
                    value={selectedEmpresaId}
                    onChange={(event) =>
                      setSelectedEmpresaId(event.target.value)
                    }
                    className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-slate-600"
                    required
                  >
                    <option value="" disabled>
                      Selecciona una empresa
                    </option>
                    {empresas.map((empresa) => (
                      <option key={empresa.id} value={empresa.id}>
                        {empresa.nombre}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="text-sm font-medium text-slate-200">
                    Ciclo
                  </span>
                  <select
                    value={selectedCicloId}
                    onChange={(event) => setSelectedCicloId(event.target.value)}
                    className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-slate-600"
                    required
                  >
                    <option value="" disabled>
                      Selecciona un ciclo
                    </option>
                    {ciclos.map((ciclo) => (
                      <option key={ciclo.id} value={ciclo.id}>
                        {ciclo.nombre}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <button
                type="submit"
                className="w-full rounded-3xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
              >
                Asignar alumno
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}
