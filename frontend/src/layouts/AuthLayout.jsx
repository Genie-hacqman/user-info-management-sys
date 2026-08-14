import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(124,58,237,0.22),_transparent_25%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.20),_transparent_18%),linear-gradient(180deg,_#020817_0%,_#0f172a_100%)] text-slate-100">
      <Navbar />
      <div className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6">
        <div className="grid w-full max-w-6xl overflow-hidden rounded-[28px] border border-white/10 bg-slate-900/70 shadow-[0_30px_80px_rgba(15,23,42,0.8)] backdrop-blur-xl lg:grid-cols-2">
          <div className="hidden bg-[linear-gradient(135deg,_rgba(124,58,237,0.96),_rgba(59,130,246,0.92),_rgba(15,23,42,0.95))] p-8 text-white lg:flex lg:flex-col lg:justify-between sm:p-10">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-violet-100">Sly Auth</p>
              <h1 className="mt-6 text-4xl font-bold leading-tight">Secure access</h1>
            </div>
            <div className="space-y-6">
              <div className="h-px w-20 bg-white/30" />
              <p className="max-w-sm text-base leading-7 text-violet-100/90">
                Production-ready authentication for user and admin workflows with role-based access control.
              </p>
            </div>
          </div>

          <div className="p-6 sm:p-10">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}
