import { Outlet } from 'react-router-dom'
import { Navbar } from '../components/NavBar'

export function Layout() {
  return (
    <div className='min-h-screen bg-gray-950 text-slate-100'>
      <Navbar />
      <Outlet />
    </div>
  )
}