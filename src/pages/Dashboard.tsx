import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  DollarSign, ShoppingBag, Users,
  Store, Package, Bell, Palette, Plus,
} from 'lucide-react'
import api from '../lib/api'
import StatCardGrid from '../components/StatCardGrid'

interface DashboardData {
  revenue: number
  orders: number
  visitors: number
  products: number
  recentOrders: Array<{ id: string; orderNumber: string; totalPrice: number; status: string; createdAt: string }>
  unreadNotifications: number
}

/** Main dashboard with revenue summary, recent orders, and quick actions. */
export default function Dashboard() {
  const [data, setData] = useState<DashboardData>({
    revenue: 0, orders: 0, visitors: 0, products: 0,
    recentOrders: [], unreadNotifications: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [statsRes, ordersRes, notifsRes] = await Promise.allSettled([
          api.get('/analytics/overview', { params: { period: '30d' } }),
          api.get('/orders/mine', { params: { limit: 5 } }),
          api.get('/notifications/unread-count'),
        ])

        const stats = statsRes.status === 'fulfilled' ? (statsRes.value.data?.data ?? statsRes.value.data) : {}
        const orders = ordersRes.status === 'fulfilled' ? (ordersRes.value.data?.data ?? ordersRes.value.data ?? []) : []
        const notifs = notifsRes.status === 'fulfilled' ? (notifsRes.value.data?.data ?? notifsRes.value.data) : { count: 0 }

        setData({
          revenue: stats.revenue ?? 0,
          orders: stats.orders ?? 0,
          visitors: stats.visitors ?? 0,
          products: stats.products ?? 0,
          recentOrders: orders.slice(0, 5),
          unreadNotifications: notifs.count ?? 0,
        })
      } catch { /* offline */ }
      setLoading(false)
    }
    load()
  }, [])

  const statsCards = [
    { label: 'Revenue (30d)', value: data.revenue, icon: DollarSign, format: 'currency' as const, color: 'text-green-600' },
    { label: 'Orders (30d)', value: data.orders, icon: ShoppingBag, format: 'number' as const, color: 'text-blue-600' },
    { label: 'Visitors (30d)', value: data.visitors, icon: Users, format: 'number' as const, color: 'text-purple-600' },
    { label: 'Products', value: data.products, icon: Package, format: 'number' as const, color: 'text-amber-600' },
  ]

  const quickActions = [
    { label: 'Edit Store', icon: Palette, link: '/store/editor', color: 'bg-blue-50 text-blue-700' },
    { label: 'Add Products', icon: Plus, link: '/products/catalog', color: 'bg-green-50 text-green-700' },
    { label: 'View Orders', icon: ShoppingBag, link: '/orders', color: 'bg-purple-50 text-purple-700' },
    { label: 'Templates', icon: Store, link: '/store/templates', color: 'bg-amber-50 text-amber-700' },
  ]

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back! Here's what's happening with your store.</p>
        </div>
        {data.unreadNotifications > 0 && (
          <Link
            to="/account/notifications"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-700 text-xs font-medium"
          >
            <Bell className="w-3.5 h-3.5" />
            {data.unreadNotifications} unread
          </Link>
        )}
      </div>

      {/* Stats */}
      <div className="mb-8">
        <StatCardGrid cards={statsCards} loading={loading} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-2">
            {quickActions.map(({ label, icon: Icon, link, color }) => (
              <Link
                key={label}
                to={link}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl ${color} hover:opacity-80 transition-opacity`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium">{label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200">
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Recent Orders</h2>
            <Link to="/orders" className="text-xs text-blue-600 hover:underline">View all</Link>
          </div>
          {data.recentOrders.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {data.recentOrders.map((order) => (
                <Link
                  key={order.id}
                  to={`/orders/${order.id}`}
                  className="flex items-center justify-between px-4 py-3 hover:bg-gray-50"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">#{order.orderNumber}</p>
                    <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">${(order.totalPrice / 100).toFixed(2)}</p>
                    <span className="text-xs text-gray-400">{order.status}</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-400 text-sm">
              <ShoppingBag className="w-10 h-10 mx-auto mb-2 opacity-30" />
              No orders yet. Share your store to start getting orders!
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
