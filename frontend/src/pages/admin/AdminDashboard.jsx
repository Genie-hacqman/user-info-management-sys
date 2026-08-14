import { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Button from '../../components/Button'
import { useAuth } from '../../hooks/useAuth'
import userService from '../../services/userService'

const getRegistrationOverview = (users) => {
  const summary = new Map()

  users.forEach((user) => {
    const dateKey = user.registeredAt || new Date().toISOString().slice(0, 10)
    if (!summary.has(dateKey)) {
      summary.set(dateKey, { date: dateKey, total: 0, staff: 0 })
    }

    const bucket = summary.get(dateKey)
    bucket.total += 1

    if (['Admin', 'Manager', 'Support'].includes(user.role)) {
      bucket.staff += 1
    }
  })

  return [...summary.values()]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(-7)
    .map((item) => ({
      ...item,
      label: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    }))
}

export default function AdminDashboardPage() {
  const { user: currentUser } = useAuth()
  const [selectedMetric, setSelectedMetric] = useState(null)
  const [refreshing, setRefreshing] = useState(false)
  const [users, setUsers] = useState([])
  const [refreshTick, setRefreshTick] = useState(0)

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const { data } = await userService.getUsers()
        setUsers(data || [])
      } catch (error) {
        console.error('Failed to load dashboard users:', error)
        setUsers([])
      }
    }

    const handleRefreshTick = () => {
      setRefreshTick((value) => value + 1)
      loadUsers()
    }

    loadUsers()
    window.addEventListener('sly-user-data-updated', handleRefreshTick)

    return () => window.removeEventListener('sly-user-data-updated', handleRefreshTick)
  }, [refreshTick])

  const latestLoginUser = useMemo(() => {
    const loginUsers = [...users].filter((user) => user.lastLogin)
    if (!loginUsers.length) return currentUser

    return loginUsers.sort((a, b) => new Date(b.lastLogin) - new Date(a.lastLogin))[0]
  }, [users, currentUser])

  const metrics = useMemo(() => {
    const totalUsers = users.length
    const activeUsers = users.filter((u) => u.status === 'Active').length
    const inactiveUsers = users.filter((u) => u.status === 'Inactive').length
    const newUsers = users.filter((u) => {
      const regDate = new Date(u.registeredAt)
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      return regDate > thirtyDaysAgo
    }).length

    return [
      { label: 'Total Users', value: totalUsers.toString(), change: `+${totalUsers}`, trend: 'up', icon: '👥' },
      { label: 'Active Users', value: activeUsers.toString(), change: `+${activeUsers}`, trend: 'up', icon: '✅' },
      { label: 'New Users', value: newUsers.toString(), change: `+${newUsers}`, trend: 'up', icon: '🆕' },
      { label: 'Inactive Users', value: inactiveUsers.toString(), change: `+${inactiveUsers}`, trend: 'down', icon: '⏳' },
    ]
  }, [users])

  const overviewData = useMemo(() => getRegistrationOverview(users), [users])

  const recentUsers = useMemo(() => {
    return [...users]
      .sort((a, b) => {
        const aTime = a.lastLogin || a.registeredAt || a.createdAt || 0
        const bTime = b.lastLogin || b.registeredAt || b.createdAt || 0
        return new Date(bTime) - new Date(aTime)
      })
      .slice(0, 5)
  }, [users])

  const systemActivity = useMemo(() => {
    const events = []

    users.forEach((user) => {
      const name = user.name || 'User'

      if (user.lastLogin) {
        events.push({
          action: `${name} logged in`,
          time: user.lastLogin,
          icon: '🟢',
        })
      }

      if (user.lastPasswordResetByAdmin) {
        events.push({
          action: `${name} password reset by admin`,
          time: user.lastPasswordResetByAdmin,
          icon: '🔐',
        })
      }

      if (user.updatedAt && String(user.updatedAt) !== String(user.createdAt || '')) {
        events.push({
          action: `${name} updated profile`,
          time: user.updatedAt,
          icon: '✏️',
        })
      }

      if (user.status) {
        events.push({
          action: `${name} marked as ${user.status}`,
          time: user.updatedAt || user.createdAt || user.lastLogin || new Date().toISOString(),
          icon: user.status === 'Active' ? '✅' : '🚫',
        })
      }
    })

    return events
      .sort((a, b) => new Date(b.time) - new Date(a.time))
      .slice(0, 4)
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

  const handleRefresh = () => {
    setRefreshing(true)
    setTimeout(async () => {
      try {
        const { data } = await userService.getUsers()
        setUsers(data || [])
      } catch (error) {
        console.error('Failed to refresh dashboard users:', error)
      } finally {
        setRefreshing(false)
      }
    }, 300)
  }

  return (
    <div className="space-y-8">
      {/* Currently Logged In User Card */}
      {latestLoginUser && (
        <div className="rounded-xl border border-violet-700/50 bg-linear-to-r from-violet-900/30 to-blue-900/30 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-linear-to-br from-violet-500 to-blue-500 flex items-center justify-center text-white font-bold">
                {(latestLoginUser.name || 'U').charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm text-slate-300">Latest Login</p>
                <p className="text-xl font-bold text-white">{latestLoginUser.name || 'User'}</p>
                <p className="text-xs text-slate-400 mt-1">{latestLoginUser.email}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400">Login Time</p>
              <p className="text-lg font-semibold text-emerald-400">
                {latestLoginUser.lastLogin ? new Date(latestLoginUser.lastLogin).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                }) : 'Just Now'}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {latestLoginUser.lastLogin ? new Date(latestLoginUser.lastLogin).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                }) : 'Today'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <p className="mt-1 text-slate-400">System overview and management</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="px-4 py-2 rounded-lg bg-linear-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white font-medium transition disabled:opacity-50"
        >
          {refreshing ? '⟳ Refreshing...' : '⟳ Refresh'}
        </button>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, idx) => (
          <div
            key={idx}
            className="rounded-xl border border-slate-700 bg-slate-800/50 p-6 hover:border-slate-600 hover:bg-slate-800/80 transition"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{metric.label}</p>
                <p className="mt-3 text-3xl font-bold text-white">{metric.value}</p>
                <p className={`mt-2 text-xs font-medium ${metric.trend === 'up' ? 'text-emerald-400' : 'text-red-400'}`}>
                  {metric.change}
                </p>
              </div>
              <div className="text-3xl">{metric.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts & Recent Registrations */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Registration Overview */}
        <div className="lg:col-span-2 rounded-xl border border-slate-700 bg-slate-800/50 p-6">
          <h2 className="text-lg font-bold text-white mb-6">Registration Trend</h2>
          <div className="h-64 flex items-end justify-between gap-2">
            {overviewData.length > 0 ? (() => {
              const maxValue = Math.max(...overviewData.flatMap((item) => [item.total, item.staff]), 1)

              return overviewData.map((data, idx) => (
                <div key={`${data.date}-${idx}`} className="flex-1 flex flex-col gap-2 items-center h-full">
                  <div className="flex gap-1 items-end h-full w-full justify-center">
                    <div
                      className="flex-1 rounded-t bg-blue-500 hover:bg-blue-400 transition"
                      style={{ height: `${(data.total / maxValue) * 100}%`, minHeight: '4px' }}
                      title={`Total: ${data.total}`}
                    ></div>
                    <div
                      className="flex-1 rounded-t bg-emerald-500 hover:bg-emerald-400 transition"
                      style={{ height: `${(data.staff / maxValue) * 100}%`, minHeight: '4px' }}
                      title={`Staff: ${data.staff}`}
                    ></div>
                  </div>
                  <span className="text-xs text-slate-500 mt-2">{data.label}</span>
                </div>
              ))
            })() : (
              <div className="w-full text-center text-slate-400">No data available</div>
            )}
          </div>
          <div className="mt-6 flex gap-6 justify-center pt-4 border-t border-slate-700">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-xs text-slate-400">Total Users</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              <span className="text-xs text-slate-400">Staff</span>
            </div>
          </div>
        </div>

        {/* System Activity */}
        <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-6">
          <h2 className="text-lg font-bold text-white mb-6">System Activity</h2>
          <div className="space-y-3">
            {systemActivity.length > 0 ? systemActivity.map((activity, idx) => (
              <div key={`${activity.action}-${idx}`} className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-700/50 transition">
                <span className="text-lg shrink-0">{activity.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white">{activity.action}</p>
                  <p className="text-xs text-slate-400 mt-1">{activity.timeLabel}</p>
                </div>
              </div>
            )) : (
              <div className="rounded-lg border border-dashed border-slate-700 bg-slate-900/50 px-4 py-6 text-center text-sm text-slate-400">
                No recent activity yet
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Registrations */}
      <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-white">Recent Registrations</h2>
          <Link to="/admin/users" className="text-sm text-violet-400 hover:text-violet-300 font-medium">
            View All Users →
          </Link>
        </div>

        {recentUsers.length > 0 ? (
          <div className="grid gap-3">
            {recentUsers.map((user, idx) => (
              <div
                key={user.id || idx}
                className="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-900/50 hover:bg-slate-900 p-4 transition"
              >
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-linear-to-br from-violet-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm">
                    {(user.name || 'U').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">{user.name || 'Unknown'}</p>
                    <p className="text-xs text-slate-400">{user.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400">
                    {user.lastLogin ? new Date(user.lastLogin).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                    }) : (user.registeredAt || 'Recently')}
                  </p>
                  <span className="inline-block mt-1 px-2 py-1 text-xs font-medium bg-emerald-500/20 text-emerald-300 rounded">
                    {user.status || 'Active'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-slate-700 bg-slate-900/50 px-6 py-12 text-center text-sm text-slate-400">
            No users registered yet
          </div>
        )}
      </div>
    </div>
  )
}
