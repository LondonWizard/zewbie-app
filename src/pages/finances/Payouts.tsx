import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { DollarSign, Clock, CheckCircle, AlertCircle, Settings } from 'lucide-react'
import api from '../../lib/api'

interface Payout {
  id: string
  amount: number
  status: 'pending' | 'processing' | 'completed' | 'failed'
  method: string
  createdAt: string
  completedAt: string | null
}

const STATUS_CONFIG = {
  pending: { icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50', label: 'Pending' },
  processing: { icon: Clock, color: 'text-blue-500', bg: 'bg-blue-50', label: 'Processing' },
  completed: { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-50', label: 'Completed' },
  failed: { icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-50', label: 'Failed' },
}

/** Payout history page showing all completed and pending payouts. */
export default function Payouts() {
  const [payouts, setPayouts] = useState<Payout[]>([])
  const [loading, setLoading] = useState(true)
  const [balance, setBalance] = useState({ available: 0, pending: 0 })

  useEffect(() => {
    async function load() {
      try {
        const [payoutsRes, balanceRes] = await Promise.allSettled([
          api.get('/payments/payouts'),
          api.get('/payments/balance'),
        ])
        if (payoutsRes.status === 'fulfilled') {
          setPayouts(payoutsRes.value.data?.data ?? payoutsRes.value.data ?? [])
        }
        if (balanceRes.status === 'fulfilled') {
          setBalance(prev => balanceRes.value.data?.data ?? balanceRes.value.data ?? prev)
        }
      } catch { /* offline */ }
      setLoading(false)
    }
    load()
  }, [])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payouts</h1>
          <p className="text-gray-500 mt-1">Track your earnings and transfer history</p>
        </div>
        <Link
          to="/finances/payouts/setup"
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium hover:bg-gray-50"
        >
          <Settings className="w-4 h-4" />
          Payout Settings
        </Link>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-xs text-gray-500 mb-1">Available Balance</p>
          <p className="text-3xl font-bold text-gray-900">${(balance.available / 100).toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-xs text-gray-500 mb-1">Pending Balance</p>
          <p className="text-3xl font-bold text-amber-600">${(balance.pending / 100).toFixed(2)}</p>
        </div>
      </div>

      {/* Payout History */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Payout History</h2>
        </div>
        {loading ? (
          <div className="p-4 space-y-3">
            {[1, 2, 3].map((i) => <div key={i} className="h-14 bg-gray-100 rounded animate-pulse" />)}
          </div>
        ) : payouts.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">
            <DollarSign className="w-10 h-10 mx-auto mb-2 opacity-50" />
            No payouts yet. Payouts will appear here once you start earning commissions.
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {payouts.map((payout) => {
              const config = STATUS_CONFIG[payout.status]
              const Icon = config.icon
              return (
                <div key={payout.id} className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full ${config.bg} flex items-center justify-center`}>
                      <Icon className={`w-4 h-4 ${config.color}`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">${(payout.amount / 100).toFixed(2)}</p>
                      <p className="text-xs text-gray-400">{payout.method}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${config.bg} ${config.color}`}>
                      {config.label}
                    </span>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(payout.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
