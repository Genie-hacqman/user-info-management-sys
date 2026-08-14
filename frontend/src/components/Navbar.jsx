import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const getNotificationCount = () => {
  try {
    const saved = localStorage.getItem('sly-user-notifications')
    const notifications = saved ? JSON.parse(saved) : []
    if (!Array.isArray(notifications)) return 0
    return notifications.filter((item) => !item.read).length
  } catch {
    return 0
  }
}

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [notificationCount, setNotificationCount] = useState(getNotificationCount)

  useEffect(() => {
    const syncNotifications = () => setNotificationCount(getNotificationCount())

    syncNotifications()
    window.addEventListener('notifications-updated', syncNotifications)
    window.addEventListener('storage', (event) => {
      if (event.key === 'sly-user-notifications') {
        syncNotifications()
      }
    })

    return () => {
      window.removeEventListener('notifications-updated', syncNotifications)
    }
  }, [])

  const navItems = [
    { to: '/', label: 'Home' },
    { to: '/dashboard', label: 'Dashboard', authOnly: true },
    { to: '/admin', label: 'Admin', authOnly: true, adminOnly: true },
  ]

  const visibleItems = navItems.filter((item) => {
    const normalizedRole = String(user?.role || '').toLowerCase()

    if (!isAuthenticated && item.authOnly) return false
    if (item.adminOnly && normalizedRole !== 'admin') return false
    return true
  })

  const handleLogout = () => {
    logout()
    setMobileMenuOpen(false)
  }

  return (
    <header className="border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link to="/" className="flex items-center gap-3 rounded-xl px-2 py-1 text-lg font-bold text-white transition hover:text-violet-200 focus:outline-none focus:ring-2 focus:ring-violet-400">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[linear-gradient(135deg,#8b5cf6,#3b82f6)] text-base shadow-lg shadow-violet-500/30">
            S
          </span>
          Sly Auth
        </Link>

        <button
          type="button"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="inline-flex rounded-lg border border-white/10 bg-slate-900 p-2 text-slate-200 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-400 md:hidden"
          aria-expanded={mobileMenuOpen}
          aria-label="Toggle navigation menu"
        >
          <span className="text-2xl">☰</span>
        </button>

        <nav className="hidden items-center gap-2 md:flex">
          {visibleItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-violet-400 ${
                  isActive ? 'bg-violet-500/15 text-violet-200' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard/notifications"
                className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-slate-900 text-lg text-slate-200 transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-400"
                aria-label="Open notifications"
                title="Notifications"
              >
                🔔
                {notificationCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                    {notificationCount > 9 ? '9+' : notificationCount}
                  </span>
                )}
              </Link>
              <span className="text-sm font-medium text-slate-200">Hi, {user?.fullName || user?.name || 'User'}</span>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-400 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/"
              className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-400 transition"
            >
              Login
            </Link>
          )}
        </div>
      </div>

      {mobileMenuOpen && (
        <nav className="border-t border-white/10 bg-slate-950 px-4 py-3 md:hidden">
          <div className="flex flex-col gap-2">
            {visibleItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-violet-400 ${
                    isActive ? 'bg-violet-500/15 text-violet-200' : 'text-slate-300 hover:bg-slate-800'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            {isAuthenticated ? (
              <>
                <div className="my-2 border-t border-white/10" />
                <Link
                  to="/dashboard/notifications"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-400"
                  aria-label="Open notifications"
                >
                  <span>Notifications</span>
                  {notificationCount > 0 && (
                    <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                      {notificationCount > 9 ? '9+' : notificationCount}
                    </span>
                  )}
                </Link>
                <span className="block px-3 py-2 text-sm font-medium text-slate-200">
                  Hi, {user?.fullName || user?.name || 'User'}
                </span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full rounded-lg bg-violet-600 px-3 py-2 text-sm font-medium text-white hover:bg-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-400 transition text-left"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-lg bg-violet-600 px-3 py-2 text-sm font-medium text-white hover:bg-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-400 transition text-center"
              >
                Login
              </Link>
            )}
          </div>
        </nav>
      )}
    </header>
  )
}
