import { Outlet } from 'react-router-dom'
import Navbar from '../components/marketing/Navbar'
import Footer from '../components/marketing/Footer'

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-emerald-500/5 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[500px] rounded-full bg-cyan-500/5 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />
      </div>

      <Navbar />
      <main className="relative flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
