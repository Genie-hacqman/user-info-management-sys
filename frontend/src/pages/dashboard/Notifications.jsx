import { useEffect, useState } from 'react'

const STORAGE_KEY = 'sly-user-notifications'

const defaultNotifications = [
  {
    id: 1,
    title: 'Profile updated',
    message: 'Your personal information was updated successfully.',
    time: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
    read: false,
    type: 'account',
  },
  {
    id: 2,
    title: 'Password changed',
    message: 'Your password was changed successfully and your session was secured.',
    time: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    read: true,
    type: 'security',
  },
  {
    id: 3,
    title: 'New login detected',
    message: 'A new sign-in was detected from a trusted device.',
    time: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    read: false,
    type: 'security',
  },
]

const getNotifications = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved !== null) {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed)) return parsed
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultNotifications))
    return defaultNotifications
  } catch (error) {
    console.error('Unable to load notifications:', error)
    return defaultNotifications
  }
}

const formatTime = (isoString) => {
  const date = new Date(isoString)
  if (Number.isNaN(date.getTime())) return 'Just now'

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(getNotifications)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications))
    window.dispatchEvent(new Event('notifications-updated'))
  }, [notifications])

  const unreadCount = notifications.filter((item) => !item.read).length

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, read: true } : item)),
    )
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, read: true })))
  }

  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Notifications</h1>
          <p className="mt-2 text-slate-600">
            {unreadCount > 0 ? `${unreadCount} unread updates` : 'All caught up'}
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={markAllAsRead}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Mark all as read
          </button>
        )}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-4">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`flex items-start justify-between gap-4 rounded-xl border p-4 transition ${
                  notification.read
                    ? 'border-slate-200 bg-slate-50'
                    : 'border-blue-200 bg-blue-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm text-white">
                    {notification.type === 'security' ? '🔐' : 'ℹ️'}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-slate-900">{notification.title}</p>
                      {!notification.read && (
                        <span className="rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                          New
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-slate-600">{notification.message}</p>
                    <p className="mt-2 text-xs text-slate-500">{formatTime(notification.time)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {!notification.read && (
                    <button
                      type="button"
                      onClick={() => markAsRead(notification.id)}
                      className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-medium text-white hover:bg-slate-800"
                    >
                      Mark read
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => deleteNotification(notification.id)}
                    className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700 hover:bg-red-100"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-500">
              No notifications yet.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
