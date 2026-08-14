import { useState } from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const adminNavItems = [
  { to: '/admin', label: 'Dashboard', icon: '📊' },
  { to: '/admin/users-directory', label: 'Users', icon: '👥' },
  { to: '/admin/users', label: 'User Management', icon: '👨‍💼' },
  { to: '/admin/reports', label: 'Reports', icon: '📈' },
  { to: '/admin/activity', label: 'System Activity', icon: '⚙️' },
  { to: '/admin/settings', label: 'Settings', icon: '🔧' },
]

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 border-r border-white/10 bg-slate-950/95 shadow-[0_0_60px_rgba(15,23,42,0.75)] backdrop-blur-xl transition-transform lg:relative lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#f59e0b,#f97316)] text-lg font-bold text-white shadow-lg shadow-amber-500/30">
              A
            </div>
            <h2 className="text-xl font-bold text-white">AdminPanel</h2>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg border border-white/10 p-2 text-slate-300 hover:text-white lg:hidden"
          >
            ✕
          </button>
        </div>
        <nav className="space-y-2 px-4 py-6">
          {adminNavItems.map((item, idx) => (
            <Link
              key={idx}
              to={item.to}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-300 transition hover:bg-amber-500/10 hover:text-white"
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="mt-6 flex w-full items-center gap-3 rounded-xl border-t border-white/10 px-4 py-3 pt-6 text-red-400 transition hover:bg-red-500/10"
          >
            <span className="text-lg">🚪</span>
            <span className="text-sm font-medium">Logout</span>
          </button>
        </nav>
      </div>
      <div className="flex flex-1 flex-col">
        <div className="sticky top-0 z-40 flex items-center justify-between border-b border-white/10 bg-slate-950/80 px-6 py-4 shadow-[0_8px_24px_rgba(2,6,23,0.45)] backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="rounded-lg border border-white/10 p-2 text-slate-200 hover:bg-slate-900 lg:hidden"
            >
              ☰
            </button>
          </div>
          <div className="flex items-center gap-4">
            <button className="rounded-full border border-white/10 bg-slate-900 p-2.5 text-xl text-slate-200 hover:bg-slate-800">🔔</button>
            <div className="flex items-center gap-3 border-l border-white/10 pl-4">
              <div className="text-right">
                <p className="text-sm font-semibold text-white">{user?.fullName || 'Admin'}</p>
                <p className="text-xs text-amber-400">Administrator</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[linear-gradient(135deg,#f59e0b,#f97316)] font-bold text-white">
                {user?.fullName?.charAt(0) || 'A'}
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-auto">
          <div className="p-6 lg:p-8">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}
