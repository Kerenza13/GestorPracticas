El objetivo es hacer una aplicación web funcional para gestionar todo lo relacionado con la asignación de empresas a alumnado para el periodo de prácticas en el instituto.
Stack Tecnológico
Backend: PHP (Vanilla o Symfony) O Python (Django/FastAPI).
Frontend: JavaScript (React, Vue o Vanilla JS con componentes).
Base de Datos: Relacional (MySQL/PostgreSQL)
Git: Uso obligatorio de un flujo de trabajo..

📋 Requisitos Funcionales por Roles
1. Administrador / Coordinador
Gestión de Ciclos: Crear ciclos (nombre, año inicio, año fin).
Gestión de Profesores: Asignar profesores a ciclos.
Configuración Global: Definir periodos de asignación.
2. Profesores (Gestores de grupo)
Importación Masiva: Subir un CSV para matricular a todos los alumnos de una clase de golpe. Hacer lo mismo para subir empresas con un csv.
Seguimiento de Empresas: Un profesor puede registrar que ha contactado un empresa un dia y hora concreto.
Gestión de Plazas: Indicar cuántos alumnos de qué ciclo acepta una empresa.
Asignación Dinámica: Una vista tipo "drag & drop" o selector donde asocia un alumno a una plaza disponible de una empresa.
3. Alumno
Perfil y CV: Subir su currículum (PDF) y actualizar sus datos de contacto.
Dashboard: Ver el estado de su asignación (Pendiente / Asignado a [Nombre Empresa] / Tutor Laboral: [Nombre]).
4. Datos de Empresa (Entidades)
Empresa: Dirección, Web, Persona contacto, Email, Teléfono.
Personal: 1 Responsable legal (DNI) y N Tutores laborales (DNI, Teléfono).

Requisitos del Proyecto
1. Estructura y Código
Arquitectura: Separación clara entre Frontend y Backend (API-First).
Estructura de Código: Uso estricto de clases y namespaces en PHP y entornos virtuales con módulos en Python. Nada de código "espagueti" en un solo archivo.
Clean Code: Nombres de variables semánticos, funciones de menos de 20 líneas y tipado en Python/PHP.
Documentación: Uso de Swagger/OpenAPI para documentar los endpoints.
Requisito extra: Implementar JWT (JSON Web Tokens) para la autenticación entre el front y los dos backends.