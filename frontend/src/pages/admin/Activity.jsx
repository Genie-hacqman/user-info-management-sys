import { useEffect, useMemo, useState } from 'react'
import PageHeader from '../../components/PageHeader'
import userService from '../../services/userService'

export default function SystemActivityPage() {
  const [refreshTick, setRefreshTick] = useState(0)
  const [users, setUsers] = useState([])

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const { data } = await userService.getUsers()
        setUsers(data || [])
      } catch (error) {
        console.error('Failed to load activity users:', error)
        setUsers([])
      }
    }

    const handleChange = () => {
      setRefreshTick((value) => value + 1)
      loadUsers()
    }

    loadUsers()
    window.addEventListener('sly-user-data-updated', handleChange)

    return () => window.removeEventListener('sly-user-data-updated', handleChange)
  }, [refreshTick])

  const activityLog = useMemo(() => {
    const events = []

    users.forEach((user) => {
      const name = user.name || 'User'
      const email = user.email || 'unknown@example.com'

      if (user.registeredAt) {
        events.push({
          type: 'User Registration',
          user: name,
          email,
          time: user.registeredAt,
          icon: '📝',
          severity: 'info',
        })
      }

      if (user.lastLogin) {
        events.push({
          type: 'User Login',
          user: name,
          email,
          time: user.lastLogin,
          icon: '🔓',
          severity: 'success',
        })
      }

      if (user.updatedAt && String(user.updatedAt) !== String(user.createdAt || '')) {
        events.push({
          type: 'User Profile Updated',
          user: name,
          email,
          time: user.updatedAt,
          icon: '✏️',
          severity: 'info',
        })
      }

      if (user.lastPasswordResetByAdmin) {
        events.push({
          type: 'Password Reset by Admin',
          user: name,
          email,
          time: user.lastPasswordResetByAdmin,
          icon: '🔐',
          severity: 'info',
        })
      }

      if (user.status) {
        events.push({
          type: user.status === 'Active' ? 'User Account Activated' : 'User Account Updated',
          user: name,
          email,
          time: user.updatedAt || user.lastLogin || user.createdAt || new Date().toISOString(),
          icon: user.status === 'Active' ? '✅' : '🚫',
          severity: user.status === 'Active' ? 'success' : 'warning',
        })
      }
    })

    return events
      .sort((a, b) => new Date(b.time) - new Date(a.time))
      .slice(0, 12)
      .map((event) => ({
        ...event,
        timeLabel: new Date(event.time).toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
        }),
      }))
  }, [users])

  const activityStats = useMemo(() => {
    const total = activityLog.length
    const loginAttempts = activityLog.filter((item) => item.type === 'User Login').length
    const securityAlerts = activityLog.filter((item) => item.severity === 'warning').length
    const newRegistrations = activityLog.filter((item) => item.type === 'User Registration').length

    return [
      { label: 'Total Activities', value: total.toString(), icon: '📊' },
      { label: 'Logins', value: loginAttempts.toString(), icon: '🔓' },
      { label: 'Warnings', value: securityAlerts.toString(), icon: '⚠️' },
      { label: 'New Registrations', value: newRegistrations.toString(), icon: '🆕' },
    ]
  }, [activityLog])

  return (
    <div className="space-y-8">
      <PageHeader
        pretitle="🔍 Monitoring"
        title="System Activity Log"
        description="Real-time system activity, user actions, and security events."
      />
      <div className="rounded-xl border border-slate-700 bg-slate-800 p-6 shadow-md">
        <div className="grid gap-4 md:grid-cols-4">
          <div>
            <label className="block text-sm font-medium text-slate-300">Filter by Type</label>
            <select className="mt-2 w-full rounded-lg border border-slate-600 bg-slate-700 px-4 py-2 text-slate-100 focus:border-amber-500 focus:ring-amber-500">
              <option>All Activities</option>
              <option>User Registration</option>
              <option>Login Attempts</option>
              <option>Profile Updates</option>
              <option>Security Events</option>
              <option>System Events</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300">Severity Level</label>
            <select className="mt-2 w-full rounded-lg border border-slate-600 bg-slate-700 px-4 py-2 text-slate-100 focus:border-amber-500 focus:ring-amber-500">
              <option>All Levels</option>
              <option>Info</option>
              <option>Warning</option>
              <option>Alert</option>
              <option>Success</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300">Time Range</label>
            <select className="mt-2 w-full rounded-lg border border-slate-600 bg-slate-700 px-4 py-2 text-slate-100 focus:border-amber-500 focus:ring-amber-500">
              <option>Last Hour</option>
              <option>Last 24 Hours</option>
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300">Search User</label>
            <input
              type="text"
              placeholder="Search by name or email..."
              className="mt-2 w-full rounded-lg border border-slate-600 bg-slate-700 px-4 py-2 text-slate-100 placeholder-slate-500 focus:border-amber-500 focus:ring-amber-500"
            />
          </div>
        </div>
      </div>
      <div className="space-y-3">
        {activityLog.length > 0 ? activityLog.map((activity, idx) => {
          const severityColors = {
            info: 'border-blue-500/30 bg-blue-900/20 text-blue-300',
            warning: 'border-amber-500/30 bg-amber-900/20 text-amber-300',
            alert: 'border-red-500/30 bg-red-900/20 text-red-300',
            success: 'border-green-500/30 bg-green-900/20 text-green-300',
          }

          return (
            <div
              key={`${activity.type}-${activity.email}-${idx}`}
              className={`rounded-xl border-l-4 ${severityColors[activity.severity]} border border-slate-700 bg-slate-800 p-6 shadow-md hover:shadow-lg transition`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">{activity.icon}</div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{activity.type}</h3>
                    <div className="mt-2 space-y-1">
                      <p className="text-sm text-slate-300">
                        <span className="font-medium">User:</span> {activity.user}
                      </p>
                      <p className="text-sm text-slate-400">{activity.email}</p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium text-slate-400">{activity.timeLabel}</p>
                  <span
                    className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                      activity.severity === 'info'
                        ? 'bg-blue-500/20 text-blue-300'
                        : activity.severity === 'warning'
                          ? 'bg-amber-500/20 text-amber-300'
                          : activity.severity === 'alert'
                            ? 'bg-red-500/20 text-red-300'
                            : 'bg-green-500/20 text-green-300'
                    }`}
                  >
                    {activity.severity}
                  </span>
                </div>
              </div>
            </div>
          )
        }) : (
          <div className="rounded-xl border border-dashed border-slate-700 bg-slate-800/50 px-6 py-12 text-center text-sm text-slate-400">
            No recent system activity yet.
          </div>
        )}
      </div>
      <div className="text-center">
        <button className="rounded-lg border border-slate-600 px-6 py-3 font-medium text-amber-400 hover:bg-slate-800 transition">
          Load More Activities
        </button>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        {activityStats.map((stat, idx) => (
          <div key={idx} className="rounded-xl border border-slate-700 bg-slate-800 p-6 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">{stat.label}</p>
                <p className="mt-2 text-3xl font-bold text-white">{stat.value}</p>
              </div>
              <div className="text-3xl">{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
