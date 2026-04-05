import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Package, Clock, CheckCircle, Truck, XCircle } from 'lucide-react'
import api from '../../lib/api'

interface Order {
  id: string
  orderNumber: string
  customerEmail: string
  status: string
  totalPrice: number
  createdAt: string
  items: number
}

const STATUS_MAP: Record<string, { icon: typeof Clock; color: string; bg: string }> = {
  PENDING: { icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
  CONFIRMED: { icon: CheckCircle, color: 'text-blue-600', bg: 'bg-blue-50' },
  PROCESSING: { icon: Package, color: 'text-purple-600', bg: 'bg-purple-50' },
  SHIPPED: { icon: Truck, color: 'text-cyan-600', bg: 'bg-cyan-50' },
  DELIVERED: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
  CANCELLED: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50' },
}

/** Lists all orders with search, status filtering, and quick status indicators. */
export default function OrderList() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  useEffect(() => {
    async function load() {
      try {
        const params: Record<string, string> = {}
        if (statusFilter) params.status = statusFilter
        const res = await api.get('/orders/mine', { params })
        setOrders(res.data?.data ?? res.data ?? [])
      } catch {
        setOrders([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [statusFilter])

  const filtered = orders.filter((o) =>
    o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
    o.customerEmail.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-500 mt-1">{orders.length} total orders</p>
        </div>
        <Link
          to="/orders/stats"
          className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium hover:bg-gray-50"
        >
          Order Stats
        </Link>
      </div>

      <div className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order number or email..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 text-sm"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
        >
          <option value="">All Status</option>
          {Object.keys(STATUS_MAP).map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No orders found.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((order) => {
            const cfg = STATUS_MAP[order.status] ?? STATUS_MAP.PENDING
            const Icon = cfg.icon
            return (
              <Link
                key={order.id}
                to={`/orders/${order.id}`}
                className="flex items-center justify-between p-4 rounded-xl border border-gray-200 bg-white hover:shadow-sm transition-shadow"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg ${cfg.bg} flex items-center justify-center`}>
                    <Icon className={`w-4 h-4 ${cfg.color}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">#{order.orderNumber}</p>
                    <p className="text-xs text-gray-400">{order.customerEmail}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">${(order.totalPrice / 100).toFixed(2)}</p>
                  <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
