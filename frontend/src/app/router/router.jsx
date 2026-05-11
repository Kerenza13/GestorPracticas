import { createBrowserRouter } from 'react-router-dom'
import { Layout } from '../layout/Layout'
import { DashboardView } from '../pages/DashboardView'
import { AdminView } from '../pages/AdminView'
import { ProfesorView } from '../pages/ProfesorView'
import { AlumnoView } from '../pages/AlumnoView'
import { Auth } from '../pages/Auth'

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <DashboardView /> },
      { path: '/admin', element: <AdminView /> },
      { path: '/profesor', element: <ProfesorView /> },
      { path: '/alumno', element: <AlumnoView /> },
      { path: '/auth/:mode', element: <Auth /> },
    ],
  },
])

export default router
