# Sistema de Gestión de Prácticas FCT

Este documento detalla las especificaciones técnicas y requisitos funcionales para el desarrollo de la aplicación web de gestión de asignaciones de empresas para el alumnado en el periodo de Formación en Centros de Trabajo (FCT) del instituto.

---

## 🎯 Objetivo del Proyecto

El objetivo principal es desarrollar una aplicación web funcional, robusta y escalable para centralizar, automatizar y gestionar eficientemente todo lo relacionado con la asignación de empresas al alumnado para su periodo de prácticas curriculares.

---

## 💻 Stack Tecnológico

El proyecto está diseñado bajo una arquitectura de software moderna que separa de forma estricta la lógica de negocio de la interfaz de usuario:

* **Backend:** Python (`FastAPI`)
* **Frontend:** JavaScript (`React`) con diseño de componentes estilizados mediante `Tailwind CSS`.
* **Base de Datos:** Relacional (`PostgreSQL`) desplegada en contenedores aislados.
* **Contenerización:** Entorno unificado y portable mediante `Docker` y `Docker Compose`.
* **Control de Versiones (Git):** Uso obligatorio de un flujo de trabajo estructurado en equipo (ramas por funcionalidad y fusiones ordenadas).

---

## 📋 Requisitos Funcionales por Roles

La aplicación cuenta con una gestión de permisos y accesos segmentada en tres tipos de usuarios, además de una entidad independiente para el manejo de datos empresariales:

### 1. Administrador / Coordinador
* **Gestión de Ciclos:** Capacidad para crear, editar y dar de baja los ciclos formativos de formación profesional (especificando nombre, año de inicio y año de fin).
* **Gestión de Profesores:** Alta de docentes del centro y asignación de los mismos a sus respectivos ciclos formativos como tutores de grupo.
* **Configuración Global:** Definición y apertura de plazos y periodos válidos para la asignación de plazas.

### 2. Profesores (Gestores de Grupo)
* **Importación Masiva (CSV):** * Subida de un archivo CSV para matricular y dar de alta de golpe a todos los alumnos de una clase, incluyendo campos clave como su número de teléfono.
    * Subida homóloga mediante archivo CSV para el registro masivo de las empresas colaboradoras.
* **Seguimiento de Empresas:** Bitácora digital donde el profesor registra cada toma de contacto con una empresa, indicando el día, la hora concreta y observaciones detalladas de la reunión o llamada.
* **Gestión de Plazas:** Herramienta para indicar de forma dinámica cuántos alumnos acepta una empresa concreta y a qué ciclo formativo específico se vinculan dichas vacantes.
* **Asignación Dinámica:** Interfaz visual e interactiva (con selectores dinámicos o componentes ágiles) que permite asociar directamente a un alumno con una de las plazas libres de las empresas.

### 3. Alumno
* **Perfil y Currículum (CV):** Espacio personalizado para actualizar sus datos personales de contacto y subir su currículum vitae estrictamente en formato PDF.
* **Dashboard Personal:** Panel de control principal donde el alumno consulta a tiempo real el estado de sus prácticas:
    * *Estado:* Pendiente / Asignado.
    * *Detalles de asignación:* Nombre de la Empresa adjudicada, Dirección física de las prácticas, Tutor Laboral asignado y su Email de contacto.

### 4. Datos de Empresa (Entidades)
* **Ficha de la Empresa:** Datos generales compuestos por dirección postal, página web oficial, persona de contacto principal, email corporativo y teléfono.
* **Personal Vinculado:** * **1 Responsable Legal:** Datos de identidad obligatorios (Nombre y DNI).
    * **N Tutores Laborales:** Relación ilimitada de tutores asignados dentro de la empresa para guiar al alumno, incluyendo su DNI, nombre y teléfono directo de contacto.

---

## 🏗️ Requisitos Técnicos del Proyecto

Para garantizar el éxito, la mantenibilidad y la profesionalidad del desarrollo, el código debe regirse bajo las siguientes directrices estructurales:

### 1. Arquitectura y Código
* **Arquitectura Desacoplada:** Separación total y estricta entre el Frontend y el Backend utilizando una estrategia **API-First**. Toda la comunicación se realiza mediante peticiones HTTP estructuradas.
* **Estructura del Código:** Uso estricto de la modularidad y buenas prácticas del entorno de desarrollo. En Python, uso obligatorio de entornos virtuales (`venv`), segmentación de rutas, controladores, esquemas de validación y modelos ORM estructurados. Queda terminantemente prohibido el código "espagueti" concentrado en un solo archivo.
* **Clean Code (Código Limpio):**
    * Nombres de variables, funciones y clases altamente semánticos y en el idioma del equipo.
    * Modularidad extrema: funciones compactas (preferiblemente de menos de 20 líneas de código) enfocadas en una única responsabilidad (*Single Responsibility Principle*).
    * Tipado estricto en el código (haciendo uso de los *type hints* de Python y validaciones automáticas con Pantic).
* **Autenticación Segura (JWT):** Implementación de control de acceso basado en tokens **JWT (JSON Web Tokens)**. Los tokens cifrados gestionan los inicios de sesión, expiran de forma controlada y protegen las rutas del frontend y los endpoints del backend según el rol del usuario conectado.
* **Documentación Automatizada:** Uso nativo de **Swagger UI** y **OpenAPI** expuestos de forma interactiva directamente desde el servidor backend para probar y consultar el funcionamiento de todos los endpoints de la API en tiempo real.