import { Link } from 'react-router-dom'
import { ArrowLeft, Users, Heart, Clock, DollarSign } from 'lucide-react'

/** Customer analytics page with demographics, retention, and lifetime value. */
export default function CustomerAnalytics() {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Link to="/analytics" className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6">
        <ArrowLeft className="w-4 h-4" />
        Back to Analytics
      </Link>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Customer Analytics</h1>
      <p className="text-gray-500 mb-8">Understand your customers better</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Customers', value: '0', icon: Users },
          { label: 'Repeat Rate', value: '0%', icon: Heart },
          { label: 'Avg LTV', value: '$0.00', icon: DollarSign },
          { label: 'Avg Time to Purchase', value: 'N/A', icon: Clock },
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
        <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
        <p>Customer insights will appear here once customers start purchasing.</p>
      </div>
    </div>
  )
}
