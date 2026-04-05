import { useEffect, useState } from 'react'
import { Bell, CheckCheck, Package, DollarSign, AlertCircle, Info } from 'lucide-react'
import api from '../../lib/api'

interface Notification {
  id: string
  type: string
  title: string
  message: string
  read: boolean
  sentAt: string
}

const TYPE_ICONS: Record<string, typeof Bell> = {
  ORDER: Package,
  PAYMENT: DollarSign,
  ALERT: AlertCircle,
  INFO: Info,
}

/** Notification center listing all user notifications with mark-as-read actions. */
export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get('/notifications')
        setNotifications(res.data?.data ?? res.data ?? [])
      } catch {
        setNotifications([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  async function markRead(id: string) {
    try {
      await api.patch(`/notifications/${id}/read`)
      setNotifications(notifications.map((n) => n.id === id ? { ...n, read: true } : n))
    } catch { /* offline */ }
  }

  async function markAllRead() {
    try {
      await api.patch('/notifications/read-all')
      setNotifications(notifications.map((n) => ({ ...n, read: true })))
    } catch { /* offline */ }
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-500 mt-1">
            {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-blue-600 hover:bg-blue-50"
          >
            <CheckCheck className="w-4 h-4" />
            Mark all read
          </button>
        )}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />)}
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <Bell className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No notifications yet.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((notif) => {
            const Icon = TYPE_ICONS[notif.type] ?? Bell
            return (
              <button
                key={notif.id}
                onClick={() => !notif.read && markRead(notif.id)}
                className={`w-full text-left flex items-start gap-3 p-4 rounded-xl border transition-colors ${
                  notif.read ? 'border-gray-100 bg-white' : 'border-blue-100 bg-blue-50/50'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  notif.read ? 'bg-gray-100' : 'bg-blue-100'
                }`}>
                  <Icon className={`w-4 h-4 ${notif.read ? 'text-gray-400' : 'text-blue-600'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${notif.read ? 'text-gray-700' : 'text-gray-900 font-medium'}`}>
                    {notif.title}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{notif.message}</p>
                  <p className="text-xs text-gray-300 mt-1">
                    {new Date(notif.sentAt).toLocaleString()}
                  </p>
                </div>
                {!notif.read && (
                  <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-2" />
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
