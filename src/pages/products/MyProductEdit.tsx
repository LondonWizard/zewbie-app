import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Save, Eye, EyeOff, DollarSign } from 'lucide-react'
import api from '../../lib/api'

interface StoreProductDetail {
  id: string
  markup: number
  isVisible: boolean
  customDescription: string | null
  product: {
    id: string
    name: string
    sku: string
    basePrice: number
    description: string
    images: string[]
    category: { name: string } | null
  }
}

/** Edit a store product listing -- set custom markup, description overrides, and visibility. */
export default function MyProductEdit() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [item, setItem] = useState<StoreProductDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [markup, setMarkup] = useState(15)
  const [isVisible, setIsVisible] = useState(true)
  const [customDescription, setCustomDescription] = useState('')

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get(`/stores/mine/products/${id}`)
        const data: StoreProductDetail = res.data?.data ?? res.data
        setItem(data)
        setMarkup(data.markup)
        setIsVisible(data.isVisible)
        setCustomDescription(data.customDescription ?? '')
      } catch {
        setItem(null)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  async function save() {
    setSaving(true)
    try {
      await api.patch(`/stores/mine/products/${id}`, {
        markup,
        isVisible,
        customDescription: customDescription || null,
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch { /* offline */ }
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="p-6 max-w-3xl mx-auto animate-pulse space-y-4">
        <div className="h-8 bg-gray-100 rounded w-1/2" />
        <div className="h-64 bg-gray-100 rounded-xl" />
      </div>
    )
  }

  if (!item) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">Product not found.</p>
        <Link to="/products/mine" className="text-blue-600 hover:underline text-sm mt-2 inline-block">
          Back to My Products
        </Link>
      </div>
    )
  }

  const base = item.product.basePrice / 100
  const listPrice = base * (1 + markup / 100)
  const yourCommission = (listPrice - base) * 0.5
  const platformFee = base * 0.1

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Link to="/products/mine" className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6">
        <ArrowLeft className="w-4 h-4" />
        Back to My Products
      </Link>

      <div className="flex items-start gap-4 mb-8">
        <div className="w-24 h-24 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
          {item.product.images?.[0] && (
            <img src={item.product.images[0]} alt="" className="w-full h-full object-cover" />
          )}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{item.product.name}</h1>
          <p className="text-sm text-gray-400">{item.product.sku} &middot; {item.product.category?.name}</p>
          <p className="text-sm text-gray-500 mt-1">Base Price: ${base.toFixed(2)}</p>
        </div>
      </div>

      {/* Pricing */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <DollarSign className="w-4 h-4" />
          Pricing
        </h2>
        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Markup Percentage: {markup}%
          </label>
          <input
            type="range"
            min={10}
            max={45}
            value={markup}
            onChange={(e) => { setMarkup(parseInt(e.target.value)); setSaved(false) }}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-400">
            <span>10% min</span>
            <span>45% max</span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500">List Price</p>
            <p className="text-lg font-bold text-gray-900">${listPrice.toFixed(2)}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-3">
            <p className="text-xs text-gray-500">Your Commission</p>
            <p className="text-lg font-bold text-green-600">${yourCommission.toFixed(2)}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500">Platform Fee (10%)</p>
            <p className="text-lg font-bold text-gray-500">${platformFee.toFixed(2)}</p>
          </div>
        </div>
      </section>

      {/* Visibility */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-gray-700">Visibility</h2>
            <p className="text-xs text-gray-400 mt-1">
              {isVisible ? 'Product is visible to customers' : 'Product is hidden from your store'}
            </p>
          </div>
          <button
            onClick={() => { setIsVisible(!isVisible); setSaved(false) }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${
              isVisible ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-500'
            }`}
          >
            {isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            {isVisible ? 'Visible' : 'Hidden'}
          </button>
        </div>
      </section>

      {/* Custom Description */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">Custom Description</h2>
        <p className="text-xs text-gray-400 mb-3">
          Override the default product description with your own. Leave blank to use the original.
        </p>
        <textarea
          value={customDescription}
          onChange={(e) => { setCustomDescription(e.target.value); setSaved(false) }}
          rows={5}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          placeholder={item.product.description}
        />
      </section>

      {/* Save */}
      <div className="flex justify-end">
        <button
          onClick={save}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gray-900 text-white font-medium hover:bg-gray-800 disabled:opacity-60"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}
