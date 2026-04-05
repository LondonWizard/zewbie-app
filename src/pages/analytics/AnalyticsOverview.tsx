import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BarChart3, Users, Eye, ShoppingCart, TrendingUp } from 'lucide-react'
import api from '../../lib/api'
import StatCardGrid from '../../components/StatCardGrid'

interface AnalyticsData {
  visitors: number
  pageViews: number
  orders: number
  revenue: number
  conversionRate: number
  visitorsChange: number
}

/** High-level analytics overview with key metrics and navigation to detail views. */
export default function AnalyticsOverview() {
  const [data, setData] = useState<AnalyticsData>({
    visitors: 0, pageViews: 0, orders: 0, revenue: 0,
    conversionRate: 0, visitorsChange: 0,
  })
  const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('30d')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const res = await api.get('/analytics/overview', { params: { period } })
        setData(prev => res.data?.data ?? res.data ?? prev)
      } catch { /* use defaults */ }
      setLoading(false)
    }
    load()
  }, [period])

  const cards = [
    { label: 'Visitors', value: data.visitors, icon: Users, format: 'number' as const },
    { label: 'Page Views', value: data.pageViews, icon: Eye, format: 'number' as const },
    { label: 'Orders', value: data.orders, icon: ShoppingCart, format: 'number' as const },
    { label: 'Revenue', value: data.revenue, icon: TrendingUp, format: 'currency' as const },
  ]

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-500 mt-1">Understand how your store is performing</p>
        </div>
        <div className="flex border border-gray-200 rounded-lg overflow-hidden">
          {(['7d', '30d', '90d'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 text-xs font-medium ${
                period === p ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {p === '7d' ? '7 Days' : p === '30d' ? '30 Days' : '90 Days'}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <StatCardGrid cards={cards} loading={loading} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { to: '/analytics/sales', label: 'Sales Analytics', desc: 'Revenue trends, top products, conversion funnels' },
          { to: '/analytics/traffic', label: 'Traffic Analytics', desc: 'Visitor sources, page views, bounce rates' },
          { to: '/analytics/customers', label: 'Customer Analytics', desc: 'Demographics, retention, lifetime value' },
        ].map(({ to, label, desc }) => (
          <Link
            key={to}
            to={to}
            className="p-5 rounded-xl border border-gray-200 bg-white hover:shadow-md transition-shadow"
          >
            <BarChart3 className="w-5 h-5 text-gray-400 mb-2" />
            <h3 className="font-semibold text-gray-900">{label}</h3>
            <p className="text-xs text-gray-500 mt-1">{desc}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
