import type { ComponentType } from 'react'

type FormatType = 'currency' | 'number' | 'percent' | 'text'

interface StatCard {
  label: string
  value: number | string
  icon: ComponentType<{ className?: string }>
  color?: string
  format?: FormatType
  link?: string
}

interface StatCardGridProps {
  cards: StatCard[]
  loading?: boolean
  columns?: string
}

function formatValue(value: number | string, format: FormatType): string {
  switch (format) {
    case 'currency':
      return `$${((value as number) / 100).toFixed(2)}`
    case 'percent':
      return `${value}%`
    case 'text':
      return String(value)
    case 'number':
    default:
      return (value as number).toLocaleString()
  }
}

/** Reusable stat card grid used across Dashboard, OrderStats, Revenue, and AnalyticsOverview. */
export default function StatCardGrid({ cards, loading = false, columns = 'grid-cols-2 lg:grid-cols-4' }: StatCardGridProps) {
  return (
    <div className={`grid ${columns} gap-4`}>
      {cards.map(({ label, value, icon: Icon, format = 'number' }) => (
        <div key={label} className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500">{label}</span>
            <Icon className="w-4 h-4 text-gray-400" />
          </div>
          <p className={`text-2xl font-bold text-gray-900 ${loading ? 'animate-pulse bg-gray-100 rounded h-8 w-20' : ''}`}>
            {!loading && formatValue(value, format)}
          </p>
        </div>
      ))}
    </div>
  )
}
