# Endpoints adicionales necesarios para la app

Esta app frontend ya usa varios endpoints existentes, pero para que todas las funciones descritas en la UI y en los flujos de alumno/profesor funcionen de forma consistente, faltan algunos endpoints o mejoras en los actuales.

## Endpoints que el frontend utiliza y no están listados en la API actual

- `GET /ciclos/` — Listar ciclos disponibles
  - Se necesita para poblar el desplegable de ciclos al asignar alumnos y al mostrar ciclos en el frontend.

## Endpoints recomendados para mejorar la app y evitar soluciones provisionales

- `POST /empresas/` — Crear una empresa manualmente
  - Actualmente el frontend usa `POST /empresas/importar` con un CSV de una sola fila para dar de alta una empresa manualmente.
  - Un endpoint dedicado `POST /empresas/` con un payload JSON haría más clara la funcionalidad y mejoraría la experiencia.

- `GET /empresas/` — Listar todas las empresas
  - El frontend necesita un listado de empresas para mostrar en desplegables y para asignaciones.
  - Si `GET /empresas/estado-plazas` devuelve una lista completa de empresas con plazas, entonces este endpoint puede no ser estrictamente necesario.

## Endpoints recomendados para flujos basados en el usuario autenticado

- `GET /mis-alumnos/` sin parámetros
  - Idealmente debería devolver los alumnos del profesor autenticado usando el token.
  - Esto evita la necesidad de que el profesor introduzca manualmente su propio `profesor_id` en la UI.

- `GET /alumnos/mi-perfil` o similar para el alumno autenticado
  - Aunque `GET /alumno/dashboard` cubre el dashboard, un endpoint específico para perfil de alumno puede separar claramente datos de login del estado de prácticas.

## Endpoint opcional para mejorar la respuesta en el dashboard de alumno

- `GET /alumno/dashboard` debería devolver al menos:
  - `nombre`
  - `email`
  - `telefono` o `telefono_contacto`
  - `ciclo` o `ciclo_nombre`
  - `estado` o `estado_asignacion`
  - `empresa` o `empresa_nombre`
  - `direccion`
  - `tutor_laboral`
  - `email_contacto`

Esto ya está previsto en el frontend, pero es importante que el backend devuelva esos campos con nombres consistentes.

## Endpoint para la subida de CV

- `POST /alumnos/subir-cv` — Subir un archivo CV del alumno
  - Ya existe en la lista de endpoints.
  - El frontend aún debería implementar el formulario y la lógica para subir el archivo.

## Resumen

### Endpoints sugeridos para añadir

- `GET /ciclos/`
- `POST /empresas/`
- `GET /empresas/`
- `GET /mis-alumnos/` sin parámetros (usando autenticación)

### Endpoints ya compatibles y útiles

- `POST /register`
- `POST /login`
- `POST /ciclos/`
- `PUT /profesores/{profesor_id}/asignar-ciclo`
- `POST /alumnos/importar`
- `POST /empresas/importar`
- `POST /asignar/`
- `POST /seguimiento/`
- `GET /mis-alumnos/`
- `GET /empresas/{empresa_id}/seguimientos`
- `GET /descargar-cv/{alumno_id}`
- `GET /empresas/estado-plazas`
- `GET /seguimientos/{empresa_id}`
- `POST /alumnos/subir-cv`
- `GET /alumno/dashboard`
