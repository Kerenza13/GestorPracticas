import { useEffect, useState } from "react";
import {
  importAlumnos,
  importEmpresas,
  asignarAlumno,
  registrarSeguimiento,
  verEstadoPlazas,
  obtenerHistorialEmpresa,
} from "../../api/api";

export function ProfesorView() {
  const [alumnosFile, setAlumnosFile] = useState(null);
  const [empresasFile, setEmpresasFile] = useState(null);
  const [assignAlumnoId, setAssignAlumnoId] = useState("");
  const [assignEmpresaId, setAssignEmpresaId] = useState("");
  const [assignCicloId, setAssignCicloId] = useState("");
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
      } catch (err) {
        setError(err.message || "No se pudo cargar el estado de plazas");
      }
    };
    loadPlazas();
  }, []);

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
    } catch (err) {
      setError(err.message || "Error al importar empresas");
    }
  };

  const handleAssignAlumno = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    try {
      const result = await asignarAlumno({
        alumno_id: Number(assignAlumnoId),
        empresa_id: Number(assignEmpresaId),
        ciclo_id: Number(assignCicloId),
      });
      setMessage(result.mensaje);
      setAssignAlumnoId("");
      setAssignEmpresaId("");
      setAssignCicloId("");
      const data = await verEstadoPlazas();
      setPlazasStatus(data);
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

        <section className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
          <div className="rounded-[28px] border border-slate-800 bg-slate-900/95 p-8 shadow-lg">
            <h2 className="text-2xl font-semibold text-white">
              Importación masiva
            </h2>
            <p className="mt-3 text-slate-400">
              Sube tus listados de alumnos o empresas en CSV para matricular y
              registrar datos de forma rápida.
            </p>

            {/* Mostramos mensajes de éxito o error si existen */}
            {message && (
              <p className="mt-3 text-sm text-green-400 font-medium">
                {message}
              </p>
            )}
            {error && (
              <p className="mt-3 text-sm text-red-400 font-medium">{error}</p>
            )}

            <div className="mt-6 space-y-6">
              {/* Formulario 1: Alumnos */}
              <form onSubmit={handleImportAlumnos} className="space-y-3">
                <label className="block rounded-3xl border border-slate-700 bg-slate-950 p-4 cursor-pointer">
                  <span className="text-sm font-medium text-slate-200">
                    CSV alumnos
                  </span>
                  <input
                    type="file"
                    accept=".csv"
                    className="mt-3 w-full text-sm text-slate-200"
                    onChange={(e) => setAlumnosFile(e.target.files[0])} // 🟢 Guardamos el archivo seleccionado
                  />
                </label>
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm py-2 px-4 rounded-2xl transition"
                >
                  Importar Alumnos
                </button>
              </form>

              <hr className="border-slate-800" />

              {/* Formulario 2: Empresas */}
              <form onSubmit={handleImportEmpresas} className="space-y-3">
                <label className="block rounded-3xl border border-slate-700 bg-slate-950 p-4 cursor-pointer">
                  <span className="text-sm font-medium text-slate-200">
                    CSV empresas
                  </span>
                  <input
                    type="file"
                    accept=".csv"
                    className="mt-3 w-full text-sm text-slate-200"
                    onChange={(e) => setEmpresasFile(e.target.files[0])} // 🟢 Guardamos el archivo seleccionado
                  />
                </label>
                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm py-2 px-4 rounded-2xl transition"
                >
                  Importar Empresas
                </button>
              </form>
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-800 bg-slate-900/95 p-8 shadow-lg">
            <h2 className="text-2xl font-semibold text-white">
              Seguimiento de empresas
            </h2>
            <p className="mt-3 text-slate-400">
              Registra contactos con empresas, fechas y responsables para llevar
              el historial de cada gestión.
            </p>
            <div className="mt-6 rounded-3xl border border-dashed border-slate-700 bg-slate-950 p-8 text-center text-slate-400">
              Aquí aparecerán los registros de seguimiento de empresas.
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <div className="rounded-[28px] border border-slate-800 bg-slate-900/95 p-8 shadow-lg">
            <h2 className="text-2xl font-semibold text-white">
              Gestión de plazas
            </h2>
            <p className="mt-3 text-slate-400">
              Define cuántos alumnos acepta cada empresa y qué ciclos pueden
              optar a cada plaza.
            </p>
            <div className="mt-6 rounded-3xl border border-dashed border-slate-700 bg-slate-950 p-8 text-center text-slate-400">
              Configura las plazas disponibles para cada empresa.
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-800 bg-slate-900/95 p-8 shadow-lg">
            <h2 className="text-2xl font-semibold text-white">
              Asignación dinámica
            </h2>
            <p className="mt-3 text-slate-400">
              Asocia alumnos a plazas disponibles con una vista tipo tablero o
              selector interactivo.
            </p>
            <div className="mt-6 rounded-[24px] border border-dashed border-slate-700 bg-slate-950 p-8 text-center text-slate-400">
              Aquí se mostrará el área de asignación cuando esté integrada.
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
