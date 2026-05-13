import { Outlet } from 'react-router-dom'
import { Navbar } from '../components/NavBar'
import { Footer } from '../components/Footer'

export function Layout() {
  return (
    <div className='flex min-h-screen flex-col bg-gray-950 text-slate-100'>
      <Navbar />
      <main className='flex-1'>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}