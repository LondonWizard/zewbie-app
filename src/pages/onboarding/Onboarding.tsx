import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight, ChevronLeft, Check, User, Store, Palette, Package, CreditCard } from 'lucide-react'
import { STORE_TEMPLATES } from '../../store-builder/templates'
import api from '../../lib/api'

const STEPS = [
  { key: 'profile', label: 'Profile', icon: User },
  { key: 'store', label: 'Store', icon: Store },
  { key: 'template', label: 'Template', icon: Palette },
  { key: 'products', label: 'Products', icon: Package },
  { key: 'payment', label: 'Payment', icon: CreditCard },
] as const

/** Multi-step onboarding wizard: Profile -> Store -> Template -> Products -> Payment. */
export default function Onboarding() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [saving, setSaving] = useState(false)

  const [profile, setProfile] = useState({ firstName: '', lastName: '', phone: '' })
  const [store, setStore] = useState({ name: '', slug: '', description: '' })
  const [selectedTemplate, setSelectedTemplate] = useState('')
  const [error, setError] = useState<string | null>(null)

  function next() { if (step < STEPS.length - 1) setStep(step + 1) }
  function prev() { if (step > 0) setStep(step - 1) }

  async function finish() {
    setSaving(true)
    setError(null)
    try {
      await api.put('/users/me', profile)
      await api.post('/stores', { ...store, templateId: selectedTemplate || undefined })
      navigate('/dashboard')
    } catch {
      setSaving(false)
      setError('Setup failed. Please check your connection and try again.')
    }
  }

  const canProceed = () => {
    switch (step) {
      case 0: return profile.firstName.trim() && profile.lastName.trim()
      case 1: return store.name.trim() && store.slug.trim()
      default: return true
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-lg font-bold text-gray-900">Set Up Your Store</h1>
            <span className="text-sm text-gray-400">Step {step + 1} of {STEPS.length}</span>
          </div>
          <div className="flex gap-1">
            {STEPS.map((s, i) => {
              const Icon = s.icon
              return (
                <div key={s.key} className="flex-1">
                  <div className={`flex items-center gap-2 py-2 px-3 rounded-lg text-xs font-medium transition-colors ${
                    i < step ? 'bg-green-50 text-green-700' :
                    i === step ? 'bg-blue-50 text-blue-700' :
                    'bg-gray-100 text-gray-400'
                  }`}>
                    {i < step ? <Check className="w-3.5 h-3.5" /> : <Icon className="w-3.5 h-3.5" />}
                    <span className="hidden sm:inline">{s.label}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="flex-1 flex items-start justify-center pt-12 px-6">
        <div className="w-full max-w-xl">
          {step === 0 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">Tell us about yourself</h2>
                <p className="text-sm text-gray-500">We'll use this info for your store profile.</p>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="ob-first-name" className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                    <input
                      id="ob-first-name"
                      value={profile.firstName}
                      onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label htmlFor="ob-last-name" className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                    <input
                      id="ob-last-name"
                      value={profile.lastName}
                      onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Doe"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="ob-phone" className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    id="ob-phone"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">Name your store</h2>
                <p className="text-sm text-gray-500">Choose a name and URL for your storefront.</p>
              </div>
              <div className="space-y-4">
                <div>
                  <label htmlFor="ob-store-name" className="block text-sm font-medium text-gray-700 mb-1">Store Name *</label>
                  <input
                    id="ob-store-name"
                    value={store.name}
                    onChange={(e) => {
                      const name = e.target.value
                      setStore({ ...store, name, slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') })
                    }}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="My Jewelry Store"
                  />
                </div>
                <div>
                  <label htmlFor="ob-store-slug" className="block text-sm font-medium text-gray-700 mb-1">Store URL *</label>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-400 mr-2">shop.zewbie.com/</span>
                    <input
                      id="ob-store-slug"
                      value={store.slug}
                      onChange={(e) => setStore({ ...store, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                      className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="my-store"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="ob-description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    id="ob-description"
                    value={store.description}
                    onChange={(e) => setStore({ ...store, description: e.target.value })}
                    rows={3}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="What makes your store special?"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">Choose a template</h2>
                <p className="text-sm text-gray-500">Pick a starting design. You can customize everything later.</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {STORE_TEMPLATES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTemplate(t.id)}
                    className={`rounded-xl border-2 overflow-hidden text-left transition-all ${
                      selectedTemplate === t.id
                        ? 'border-blue-500 ring-2 ring-blue-200'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img src={t.thumbnail} alt={t.name} className="w-full aspect-[4/3] object-cover" />
                    <div className="p-3">
                      <p className="text-sm font-medium text-gray-900">{t.name}</p>
                      <p className="text-xs text-gray-400">{t.category}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">Add products</h2>
                <p className="text-sm text-gray-500">Browse our catalog and add products to your store.</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                <Package className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                <p className="text-gray-600 mb-4">You can add products from the catalog after setup.</p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={next}
                    className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
                  >
                    Browse Catalog Now
                  </button>
                  <button
                    onClick={next}
                    className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium hover:bg-gray-50"
                  >
                    Skip for Now
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">Set up payments</h2>
                <p className="text-sm text-gray-500">Connect Stripe to receive payouts from sales.</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                <CreditCard className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                <p className="text-gray-600 mb-2">You'll earn commissions on every sale.</p>
                <p className="text-xs text-gray-400 mb-6">You can set this up later in Finances &rarr; Payout Setup</p>
                {error && (
                  <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-2 mb-4">{error}</p>
                )}
                <button
                  onClick={finish}
                  disabled={saving}
                  className="px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-60"
                >
                  {saving ? 'Setting up...' : 'Launch My Store!'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="bg-white border-t border-gray-200 px-6 py-4">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <button
            onClick={prev}
            disabled={step === 0}
            className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-30"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>
          {step < STEPS.length - 1 && (
            <button
              onClick={next}
              disabled={!canProceed()}
              className="flex items-center gap-1 px-6 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              Continue
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
