import { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
const userNavItems = [{
  to: '/dashboard',
  label: 'Dashboard',
  icon: '📊'
}, {
  to: '/dashboard/profile',
  label: 'Profile',
  icon: '👤'
}, {
  to: '/dashboard/edit-profile',
  label: 'Edit Profile',
  icon: '✏️'
}, {
  to: '/dashboard/change-password',
  label: 'Change Password',
  icon: '🔐'
}, {
  to: '/dashboard/settings',
  label: 'Account Settings',
  icon: '⚙️'
}, {
  to: '/dashboard/notifications',
  label: 'Notifications',
  icon: '🔔'
}];
export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const {
    user,
    logout
  } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  return <div className="flex min-h-screen w-full overflow-x-hidden bg-slate-950 text-slate-100">
      <div className={`fixed inset-y-0 left-0 z-50 w-[82vw] max-w-72 border-r border-white/10 bg-slate-950/95 shadow-[0_0_60px_rgba(15,23,42,0.75)] backdrop-blur-xl transition-transform lg:relative lg:w-72 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#8b5cf6,#3b82f6)] text-lg font-bold text-white shadow-lg shadow-violet-500/30">
              M
            </div>
            <h2 className="text-xl font-bold text-white">MyAccount</h2>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="rounded-lg border border-white/10 p-2 text-slate-300 hover:text-white lg:hidden">
            ✕
          </button>
        </div>
        <nav className="space-y-2 px-4 py-6">
          {userNavItems.map(item => <Link key={item.to} to={item.to} onClick={() => setSidebarOpen(false)} className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-300 transition hover:bg-violet-500/10 hover:text-white">
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>)}
          <button onClick={handleLogout} className="mt-6 flex w-full items-center gap-3 rounded-xl border-t border-white/10 px-4 py-3 pt-6 text-red-400 transition hover:bg-red-500/10">
            <span className="text-xl">🚪</span>
            <span className="font-medium">Logout</span>
          </button>
        </nav>
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="sticky top-0 z-40 flex items-center justify-between gap-3 border-b border-white/10 bg-slate-950/80 px-4 py-4 shadow-[0_8px_24px_rgba(2,6,23,0.45)] backdrop-blur-xl sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="rounded-lg border border-white/10 p-2 text-slate-200 hover:bg-slate-900 lg:hidden">
              ☰
            </button>
            <div className="hidden min-w-0 items-center md:flex">
              <input type="text" placeholder="Search anything..." className="w-48 rounded-xl border border-white/10 bg-slate-900/80 px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-400 outline-none ring-0 transition focus:border-violet-400 lg:w-64" />
            </div>
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            <button className="rounded-full border border-white/10 bg-slate-900 p-2.5 text-xl text-slate-200 hover:bg-slate-800">🔔</button>
            <div className="flex min-w-0 items-center gap-3 border-l border-white/10 pl-3 sm:pl-4">
              <div className="min-w-0 text-right">
                <p className="truncate text-sm font-semibold text-white">{user?.fullName || 'User'}</p>
                <p className="text-xs text-slate-400">User</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[linear-gradient(135deg,#8b5cf6,#3b82f6)] font-bold text-white">
                {user?.fullName?.charAt(0) || 'U'}
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-auto">
          <div className="w-full min-w-0 p-4 sm:p-6 lg:p-8">
            <Outlet />
          </div>
        </div>
      </div>
    </div>;
}
