import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, TrendingUp, Package, DollarSign, Clock, ShoppingBag } from 'lucide-react'
import api from '../../lib/api'
import StatCardGrid from '../../components/StatCardGrid'

interface OrderStatsData {
  totalOrders: number
  pendingOrders: number
  completedOrders: number
  totalRevenue: number
  avgFulfillmentTime: string
  conversionRate: number
}

/** Order statistics dashboard with key fulfillment and revenue metrics. */
export default function OrderStats() {
  const [stats, setStats] = useState<OrderStatsData>({
    totalOrders: 0, pendingOrders: 0, completedOrders: 0,
    totalRevenue: 0, avgFulfillmentTime: 'N/A', conversionRate: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get('/orders/stats')
        setStats(prev => res.data?.data ?? res.data ?? prev)
      } catch { /* use defaults */ }
      setLoading(false)
    }
    load()
  }, [])

  const cards = [
    { label: 'Total Orders', value: stats.totalOrders, icon: ShoppingBag, format: 'number' as const },
    { label: 'Pending', value: stats.pendingOrders, icon: Clock, format: 'number' as const },
    { label: 'Completed', value: stats.completedOrders, icon: Package, format: 'number' as const },
    { label: 'Revenue', value: stats.totalRevenue, icon: DollarSign, format: 'currency' as const },
    { label: 'Avg Fulfillment', value: stats.avgFulfillmentTime, icon: TrendingUp, format: 'text' as const },
    { label: 'Conversion Rate', value: stats.conversionRate, icon: TrendingUp, format: 'percent' as const },
  ]

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <Link to="/orders" className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6">
        <ArrowLeft className="w-4 h-4" />
        Back to Orders
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mb-1">Order Statistics</h1>
      <p className="text-gray-500 mb-8">Overview of your order fulfillment performance</p>

      <StatCardGrid cards={cards} loading={loading} columns="grid-cols-2 md:grid-cols-3" />
    </div>
  )
}
