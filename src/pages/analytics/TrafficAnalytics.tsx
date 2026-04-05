import { Link } from 'react-router-dom'
import { ArrowLeft, Users, Eye, Globe, Smartphone } from 'lucide-react'

/** Traffic analytics detail page with visitor sources and device breakdown. */
export default function TrafficAnalytics() {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Link to="/analytics" className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6">
        <ArrowLeft className="w-4 h-4" />
        Back to Analytics
      </Link>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Traffic Analytics</h1>
      <p className="text-gray-500 mb-8">Visitor sources, page views, and device breakdown</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Unique Visitors', value: '0', icon: Users },
          { label: 'Page Views', value: '0', icon: Eye },
          { label: 'Referral Sources', value: '0', icon: Globe },
          { label: 'Mobile %', value: '0%', icon: Smartphone },
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
        <Globe className="w-12 h-12 mx-auto mb-3 opacity-30" />
        <p>Traffic data will appear here once your store receives visitors.</p>
        <p className="text-xs mt-1">Enable Google Analytics in Store Settings for enhanced tracking.</p>
      </div>
    </div>
  )
}
