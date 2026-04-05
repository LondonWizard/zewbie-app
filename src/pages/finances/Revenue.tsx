import { useEffect, useState } from 'react'
import { DollarSign, TrendingUp, TrendingDown, Package, ShoppingBag } from 'lucide-react'
import api from '../../lib/api'
import StatCardGrid from '../../components/StatCardGrid'

interface RevenueStats {
  totalRevenue: number
  totalCommissions: number
  totalOrders: number
  averageOrderValue: number
  revenueChange: number
  topProducts: Array<{ name: string; revenue: number; orders: number }>
}

/** Revenue analytics dashboard showing earnings breakdown and top products. */
export default function Revenue() {
  const [stats, setStats] = useState<RevenueStats>({
    totalRevenue: 0,
    totalCommissions: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    revenueChange: 0,
    topProducts: [],
  })
  const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('30d')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const res = await api.get('/analytics/revenue', { params: { period } })
        setStats(prev => res.data?.data ?? res.data ?? prev)
      } catch { /* use defaults */ }
      setLoading(false)
    }
    load()
  }, [period])

  const cards = [
    { label: 'Total Revenue', value: stats.totalRevenue, icon: DollarSign, format: 'currency' as const },
    { label: 'Your Commissions', value: stats.totalCommissions, icon: TrendingUp, format: 'currency' as const },
    { label: 'Total Orders', value: stats.totalOrders, icon: ShoppingBag, format: 'number' as const },
    { label: 'Avg Order Value', value: stats.averageOrderValue, icon: Package, format: 'currency' as const },
  ]

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Revenue</h1>
          <p className="text-gray-500 mt-1">Track your earnings and sales performance</p>
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

      {stats.revenueChange !== 0 && (
        <div className={`flex items-center gap-2 px-4 py-3 rounded-lg mb-6 ${
          stats.revenueChange > 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          {stats.revenueChange > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          <span className="text-sm font-medium">
            {Math.abs(stats.revenueChange)}% {stats.revenueChange > 0 ? 'increase' : 'decrease'} from previous period
          </span>
        </div>
      )}

      {/* Top Products */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Top Products</h2>
        </div>
        {stats.topProducts.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {stats.topProducts.map((p, i) => (
              <div key={i} className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-gray-100 text-xs font-medium flex items-center justify-center">
                    {i + 1}
                  </span>
                  <span className="text-sm font-medium">{p.name}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-semibold">${(p.revenue / 100).toFixed(2)}</span>
                  <span className="text-xs text-gray-400 ml-2">{p.orders} orders</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-gray-400 text-sm">
            No sales data yet. Revenue will appear here once you start making sales.
          </div>
        )}
      </div>
    </div>
  )
}
