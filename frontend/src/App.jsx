import { RouterProvider } from 'react-router-dom'
import router from './app/router/router'
import { AuthProvider } from './app/context/AuthContext'

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}