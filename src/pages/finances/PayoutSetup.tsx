import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, CreditCard, Building2, ExternalLink, CheckCircle, AlertCircle } from 'lucide-react'
import api from '../../lib/api'

interface PayoutConfig {
  stripeConnected: boolean
  stripeAccountId: string | null
  stripeOnboardingUrl: string | null
  payoutsEnabled: boolean
}

/** Payout setup page -- connect Stripe Express, verify identity, and configure payouts. */
export default function PayoutSetup() {
  const [config, setConfig] = useState<PayoutConfig>({
    stripeConnected: false,
    stripeAccountId: null,
    stripeOnboardingUrl: null,
    payoutsEnabled: false,
  })
  const [loading, setLoading] = useState(true)
  const [connecting, setConnecting] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get('/payments/connect/status')
        setConfig(prev => res.data?.data ?? res.data ?? prev)
      } catch { /* offline */ }
      setLoading(false)
    }
    load()
  }, [])

  async function startOnboarding() {
    setConnecting(true)
    try {
      const res = await api.post('/payments/connect/onboarding')
      const url = res.data?.data?.url ?? res.data?.url
      if (url) {
        window.location.href = url
      }
    } catch { /* offline */ }
    setConnecting(false)
  }

  if (loading) {
    return (
      <div className="p-6 max-w-3xl mx-auto animate-pulse space-y-4">
        <div className="h-8 bg-gray-100 rounded w-1/3" />
        <div className="h-48 bg-gray-100 rounded-xl" />
      </div>
    )
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Link to="/finances/payouts" className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6">
        <ArrowLeft className="w-4 h-4" />
        Back to Payouts
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mb-1">Payout Setup</h1>
      <p className="text-gray-500 mb-8">Connect your payment account to receive earnings</p>

      {/* Stripe Connect Status */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            config.stripeConnected ? 'bg-green-50' : 'bg-gray-100'
          }`}>
            <CreditCard className={`w-6 h-6 ${config.stripeConnected ? 'text-green-600' : 'text-gray-400'}`} />
          </div>
          <div className="flex-1">
            <h2 className="font-semibold text-gray-900">Stripe Connect</h2>
            <p className="text-sm text-gray-500 mt-1">
              {config.stripeConnected
                ? 'Your Stripe account is connected and ready to receive payouts.'
                : 'Connect your Stripe account to start receiving payouts from your sales.'
              }
            </p>
            {config.stripeConnected && (
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-1.5 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-green-700">Account Connected</span>
                </div>
                {config.payoutsEnabled ? (
                  <div className="flex items-center gap-1.5 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-green-700">Payouts Enabled</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-sm">
                    <AlertCircle className="w-4 h-4 text-amber-500" />
                    <span className="text-amber-700">Complete verification</span>
                  </div>
                )}
              </div>
            )}
          </div>
          {!config.stripeConnected && (
            <button
              onClick={startOnboarding}
              disabled={connecting}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-60"
            >
              <ExternalLink className="w-4 h-4" />
              {connecting ? 'Connecting...' : 'Connect Stripe'}
            </button>
          )}
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-900 mb-4">How Payouts Work</h2>
        <div className="space-y-4">
          {[
            { step: '1', title: 'Connect Your Account', desc: 'Link your bank account via Stripe Express for secure, direct deposits.' },
            { step: '2', title: 'Earn Commissions', desc: 'When customers purchase from your store, you earn your markup split (50% of the markup you set).' },
            { step: '3', title: 'Automatic Payouts', desc: 'Earnings are automatically transferred to your bank account on a rolling basis.' },
          ].map(({ step, title, desc }) => (
            <div key={step} className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 text-sm font-bold flex items-center justify-center flex-shrink-0">
                {step}
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900">{title}</h3>
                <p className="text-xs text-gray-500">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing Info */}
      <div className="mt-6 p-4 rounded-xl bg-gray-50 border border-gray-200">
        <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
          <Building2 className="w-4 h-4" />
          Commission Structure
        </h3>
        <ul className="text-xs text-gray-500 space-y-1">
          <li>10% platform fee on each sale (deducted from base price)</li>
          <li>Your markup (10-45%) is split 50/50 between you and Zewbie</li>
          <li>Example: $100 base + 20% markup = $120 sale. You earn $10 commission.</li>
        </ul>
      </div>
    </div>
  )
}
