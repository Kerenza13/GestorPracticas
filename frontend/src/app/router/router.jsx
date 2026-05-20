import { createBrowserRouter, Navigate } from 'react-router-dom'
import { Layout } from '../layout/Layout'
import { DashboardView } from '../pages/DashboardView'
import { AdminView } from '../pages/AdminView'
import { ProfesorView } from '../pages/ProfesorView'
import { AlumnoView } from '../pages/AlumnoView'
import { Auth } from '../pages/Auth'
import { ProtectedRoute } from '../components/ProtectedRoute'

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <DashboardView />,
      },
      {
        path: '/auth/:mode',
        element: <Auth />,
      },
      {
        path: '/admin',
        element: (
          <ProtectedRoute allowedRoles='admin'>
            <AdminView />
          </ProtectedRoute>
        ),
      },
      {
        path: '/profesor',
        element: (
          <ProtectedRoute allowedRoles={['teacher', 'admin']}>
            <ProfesorView />
          </ProtectedRoute>
        ),
      },
      {
        path: '/alumno',
        element: (
          <ProtectedRoute allowedRoles={['student', 'admin']}>
            <AlumnoView />
          </ProtectedRoute>
        ),
      },
      {
        path: '*',
        element: <Navigate to='/' replace />,
      },
    ],
  },
])

export default router
