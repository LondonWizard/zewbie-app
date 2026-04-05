import { Link } from 'react-router-dom'
import { ArrowLeft, TrendingUp, DollarSign, ShoppingBag, Target } from 'lucide-react'

/** Sales analytics detail page with revenue trends and conversion metrics. */
export default function SalesAnalytics() {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Link to="/analytics" className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6">
        <ArrowLeft className="w-4 h-4" />
        Back to Analytics
      </Link>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Sales Analytics</h1>
      <p className="text-gray-500 mb-8">Revenue trends, top products, and conversion metrics</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Revenue', value: '$0.00', icon: DollarSign },
          { label: 'Avg Order Value', value: '$0.00', icon: TrendingUp },
          { label: 'Total Orders', value: '0', icon: ShoppingBag },
          { label: 'Conversion Rate', value: '0%', icon: Target },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500">{label}</span>
              <Icon className="w-4 h-4 text-gray-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-400">
        <TrendingUp className="w-12 h-12 mx-auto mb-3 opacity-30" />
        <p>Sales chart will appear here once data is available.</p>
        <p className="text-xs mt-1">Data requires a connected Supabase database with orders.</p>
      </div>
    </div>
  )
}
