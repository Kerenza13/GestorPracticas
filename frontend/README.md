# GestorPracticas Frontend

## Overview

This frontend is a React + Vite single-page application for the Gestor de Prácticas project.
It supports authentication, role-based protected routes, and communication with a backend API.

Key features:
- React 19 + Vite 8
- Tailwind CSS for styling
- React Router DOM for client-side routing
- JWT-based authentication with protected routes
- Role-based access for `admin`, `teacher`, and `student`

## Tech Stack

- `react`
- `react-dom`
- `react-router-dom`
- `vite`
- `tailwindcss`
- `eslint`

## Getting Started

1. Open a terminal in `frontend/`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
4. Edit `.env` and set the backend URL:
   ```env
   VITE_API_URL=http://localhost:8000
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

## Available Scripts

- `npm run dev` — Start the frontend in development mode
- `npm run build` — Build the app for production
- `npm run preview` — Preview the production build locally
- `npm run lint` — Run ESLint on the frontend source

## Environment Variables

The frontend reads the backend base URL from `VITE_API_URL`.

Example in `.env.example`:
```env
VITE_API_URL=http://localhost:8000
```

Optional:
- `VITE_DEBUG=true`

## Project Structure

- `src/App.jsx` — top-level app wrapper with `AuthProvider` and router
- `src/app/router/router.jsx` — route definitions and protected route wiring
- `src/app/context/AuthContext.jsx` — authentication state, login/logout/register, JWT validation
- `src/app/components/ProtectedRoute.jsx` — route guard for authenticated and role-based access
- `src/api/api.js` — backend request helpers and REST API wrappers
- `src/app/layout/Layout.jsx` — app layout with navigation and footer
- `src/app/pages/` — pages for dashboard, auth, admin, profesor, and alumno views

## Routing and Access Control

Routes defined by the app:

- `/` — public dashboard
- `/auth/:mode` — authentication page (`login` / `register`)
- `/admin` — protected, only `admin`
- `/profesor` — protected, `teacher` and `admin`
- `/alumno` — protected, `student` and `admin`
- `*` — redirect to `/`

Protected routes use `ProtectedRoute` and `AuthContext` to verify:
- whether a user is authenticated
- whether the user role is allowed for that route
- token expiration before rendering protected content

## Authentication Flow

- `AuthContext` loads token data from `localStorage` on app start.
- Tokens are decoded with `parseJWT()` to read payload fields.
- Expired tokens are rejected with `isTokenExpired()`.
- Login stores:
  - `fp_token`
  - `fp_role`
  - `fp_email`
  - `fp_nombre`
- Unauthorized access redirects to `/auth/login`.
- Unauthorized role access shows an "Acceso Denegado" page.

## Backend API Endpoints Used

The frontend expects the backend to provide the following endpoints:

- `POST /register`
- `POST /login`
- `POST /ciclos/`
- `GET /ciclos/`
- `POST /alumnos/importar`
- `POST /empresas/importar`
- `POST /asignar/`
- `POST /seguimiento/`
- `GET /mis-alumnos/`
- `GET /empresas/estado-plazas`
- `GET /empresas/{empresa_id}/seguimientos`
- `GET /descargar-cv/{alumno_id}`
- `GET /seguimientos/{empresa_id}`
- `POST /alumnos/subir-cv`
- `GET /alumno/dashboard`

### Notes on API integration

- The frontend sends `Authorization: Bearer <token>` for protected requests.
- Some features currently use CSV import workarounds for company registration.
- Ensure CORS is enabled on the backend for the `VITE_API_URL` origin.

## Notes

- The backend must validate JWT signatures and not rely only on frontend token decoding.
- Use the `.env.example` file as a template for local configuration.
- If the backend base URL changes, update `VITE_API_URL` accordingly.

## Useful Files

- `NEEDED_API_ENDPOINTS.md` — list of backend endpoints that the frontend expects
- `.env.example` — example environment configuration

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
