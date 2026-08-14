import { useAuth } from '../../context/AuthContext'
import { Link } from 'react-router-dom'

const localeMap = {
  English: 'en-US',
  Spanish: 'es-ES',
  French: 'fr-FR',
  Arabic: 'ar-EG',
}

const getSettings = () => {
  try {
    return JSON.parse(localStorage.getItem('sly-user-settings') || '{}')
  } catch {
    return {}
  }
}

const formatWithPreferences = (value, options = {}) => {
  const settings = getSettings()
  const locale = localeMap[settings.language] || 'en-US'
  const timeZone = settings.timezone || 'UTC'

  if (!value) return 'N/A'

  return new Intl.DateTimeFormat(locale, {
    timeZone,
    ...options,
  }).format(new Date(value))
}

export default function DashboardPage() {
  const { user } = useAuth()
  const settings = user?.settings || getSettings()

  const memberSince = user?.createdAt ? formatWithPreferences(user.createdAt, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }) : 'N/A'

  const profileCompletion = Math.min(
    100,
    Math.round(
      [user?.name, user?.email].filter(Boolean).length / 2 * 100
    )
  )

  const lastLogin = user?.lastLogin
    ? formatWithPreferences(user.lastLogin, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      })
    : 'Just now'

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white">Welcome, {user?.name || 'User'}</h1>
          <p className="mt-2 text-slate-400">Manage your account and profile settings</p>
        </div>
        <div className="h-16 w-16 rounded-xl bg-linear-to-br from-violet-500 to-blue-500 flex items-center justify-center text-2xl font-bold text-white shadow-lg">
          {(user?.name || 'U').charAt(0).toUpperCase()}
        </div>
      </div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-6 hover:border-violet-500/50 transition">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Account Status</p>
              <p className="mt-3 text-2xl font-bold text-white">Active</p>
            </div>
            <div className="text-3xl">✅</div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-6 hover:border-blue-500/50 transition">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Member Since</p>
              <p className="mt-3 text-2xl font-bold text-white">{memberSince}</p>
            </div>
            <div className="text-3xl">📅</div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-6 hover:border-emerald-500/50 transition">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Profile</p>
              <p className="mt-3 text-2xl font-bold text-white">{profileCompletion}%</p>
            </div>
            <div className="text-3xl">📊</div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-6 hover:border-orange-500/50 transition">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Role</p>
              <p className="mt-3 text-2xl font-bold text-white capitalize">{user?.role || 'user'}</p>
            </div>
            <div className="text-3xl">👤</div>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Account Info */}
          <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-6">
            <h2 className="text-lg font-bold text-white mb-6">Account Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-lg bg-slate-900/50 p-4">
                <p className="text-xs font-semibold text-slate-400 uppercase mb-2">Full Name</p>
                <p className="text-base font-semibold text-white">{user?.name || 'N/A'}</p>
              </div>
              <div className="rounded-lg bg-slate-900/50 p-4">
                <p className="text-xs font-semibold text-slate-400 uppercase mb-2">Email</p>
                <p className="text-base font-semibold text-white break-all">{user?.email || 'N/A'}</p>
              </div>
              <div className="rounded-lg bg-slate-900/50 p-4">
                <p className="text-xs font-semibold text-slate-400 uppercase mb-2">Last Login</p>
                <p className="text-base font-semibold text-white">{lastLogin}</p>
              </div>
              <div className="rounded-lg bg-slate-900/50 p-4">
                <p className="text-xs font-semibold text-slate-400 uppercase mb-2">2FA Status</p>
                <p className={`text-base font-semibold ${settings.twoFactorAuth ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {settings.twoFactorAuth ? 'Enabled' : 'Disabled'}
                </p>
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <Link
                to="/dashboard/edit-profile"
                className="flex-1 rounded-lg bg-linear-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 px-4 py-2 font-medium text-white transition text-center"
              >
                Edit Profile
              </Link>
              <Link
                to="/dashboard/change-password"
                className="flex-1 rounded-lg border border-slate-600 hover:border-slate-500 px-4 py-2 font-medium text-slate-200 transition text-center"
              >
                Change Password
              </Link>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-6">
            <h2 className="text-lg font-bold text-white mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Link
                to="/dashboard/settings"
                className="rounded-lg border border-slate-700 hover:border-slate-600 hover:bg-slate-900/50 p-4 transition flex items-center gap-3"
              >
                <span className="text-2xl">⚙️</span>
                <div>
                  <p className="font-semibold text-white text-sm">Settings</p>
                  <p className="text-xs text-slate-400">Manage preferences</p>
                </div>
              </Link>
              <Link
                to="/dashboard/notifications"
                className="rounded-lg border border-slate-700 hover:border-slate-600 hover:bg-slate-900/50 p-4 transition flex items-center gap-3"
              >
                <span className="text-2xl">🔔</span>
                <div>
                  <p className="font-semibold text-white text-sm">Notifications</p>
                  <p className="text-xs text-slate-400">Notification center</p>
                </div>
              </Link>
              <Link
                to="/dashboard/profile"
                className="rounded-lg border border-slate-700 hover:border-slate-600 hover:bg-slate-900/50 p-4 transition flex items-center gap-3"
              >
                <span className="text-2xl">👤</span>
                <div>
                  <p className="font-semibold text-white text-sm">View Profile</p>
                  <p className="text-xs text-slate-400">Full profile</p>
                </div>
              </Link>
              <Link
                to="/"
                className="rounded-lg border border-red-700/50 hover:border-red-600 hover:bg-red-500/10 p-4 transition flex items-center gap-3"
              >
                <span className="text-2xl">🚪</span>
                <div>
                  <p className="font-semibold text-red-400 text-sm">Logout</p>
                  <p className="text-xs text-slate-400">Sign out</p>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Profile Card */}
          <div className="rounded-xl border border-slate-700 bg-linear-to-br from-slate-800/50 to-slate-900/50 p-6 text-center">
            <div className="h-20 w-20 rounded-xl bg-linear-to-br from-violet-500 to-blue-500 flex items-center justify-center text-3xl font-bold text-white shadow-lg mx-auto mb-4">
              {(user?.name || 'U').charAt(0).toUpperCase()}
            </div>
            <h3 className="text-lg font-bold text-white">{user?.name || 'User'}</h3>
            <p className="text-sm text-slate-400 mt-1 break-all">{user?.email}</p>
            <div className="mt-4 pt-4 border-t border-slate-700">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                profileCompletion === 100 
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              }`}>
                {profileCompletion}% Complete
              </span>
            </div>
          </div>

          {/* Security Info */}
          <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-6">
            <h3 className="font-bold text-white mb-4">Security</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-slate-700">
                <span className="text-sm text-slate-300">Password</span>
                <span className="text-xs font-semibold text-emerald-400">✓ Secure</span>
              </div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-700">
                <span className="text-sm text-slate-300">2-Factor Auth</span>
                <span className={`text-xs font-semibold ${settings.twoFactorAuth ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {settings.twoFactorAuth ? '✓ On' : '○ Off'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-300">Email Verified</span>
                <span className="text-xs font-semibold text-emerald-400">✓ Yes</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
