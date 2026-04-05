import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Plus, ShoppingBag, Star, Truck, Shield, ChevronLeft, ChevronRight } from 'lucide-react'
import api from '../../lib/api'

interface Product {
  id: string
  name: string
  sku: string
  description: string
  basePrice: number
  images: string[]
  category: { name: string } | null
  retailer: { businessName: string } | null
  variants: Array<{ id: string; name: string; sku: string; price: number; attributes: Record<string, string> }>
  attributes: Record<string, unknown>
  weight: number | null
  dimensions: Record<string, unknown> | null
}

/** Full product detail page with image gallery, description, variants, and add-to-store action. */
export default function ProductDetail() {
  const { id } = useParams<{ id: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [imageIndex, setImageIndex] = useState(0)
  const [markupPercent, setMarkupPercent] = useState(15)
  const [adding, setAdding] = useState(false)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get(`/catalog/products/${id}`)
        setProduct(res.data?.data ?? res.data)
      } catch {
        setProduct(null)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  async function addToStore() {
    if (!product) return
    setAdding(true)
    try {
      await api.post('/retailers/products', { productId: product.id, markup: markupPercent })
      setAdded(true)
    } catch { /* offline */ }
    setAdding(false)
  }

  if (loading) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="aspect-square bg-gray-100 rounded-xl" />
          <div className="space-y-4">
            <div className="h-8 bg-gray-100 rounded w-3/4" />
            <div className="h-4 bg-gray-100 rounded w-1/4" />
            <div className="h-20 bg-gray-100 rounded" />
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">Product not found.</p>
        <Link to="/products/catalog" className="text-blue-600 hover:underline text-sm mt-2 inline-block">
          Back to catalog
        </Link>
      </div>
    )
  }

  const basePrice = product.basePrice / 100
  const yourPrice = basePrice * (1 + markupPercent / 100)
  const yourProfit = (yourPrice - basePrice) * 0.5
  const images = product.images?.length ? product.images : ['https://placehold.co/600x600/f1f5f9/94a3b8?text=No+Image']

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Link to="/products/catalog" className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6">
        <ArrowLeft className="w-4 h-4" />
        Back to Catalog
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div>
          <div className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden mb-3">
            <img src={images[imageIndex]} alt={product.name} className="w-full h-full object-cover" />
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setImageIndex((i) => (i > 0 ? i - 1 : images.length - 1))}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setImageIndex((i) => (i < images.length - 1 ? i + 1 : 0))}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setImageIndex(i)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 flex-shrink-0 ${
                    i === imageIndex ? 'border-blue-500' : 'border-transparent'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <div className="flex items-start justify-between mb-2">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
              <p className="text-sm text-gray-400">SKU: {product.sku}</p>
            </div>
            <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
              {product.category?.name ?? 'Uncategorized'}
            </span>
          </div>

          <div className="text-3xl font-bold text-gray-900 mb-4">
            ${basePrice.toFixed(2)}
            <span className="text-sm font-normal text-gray-400 ml-2">base price</span>
          </div>

          <p className="text-gray-600 mb-6 leading-relaxed">{product.description}</p>

          {/* Pricing Calculator */}
          <div className="bg-blue-50 rounded-xl p-4 mb-6 space-y-3">
            <h3 className="text-sm font-semibold text-blue-900">Pricing Calculator</h3>
            <div>
              <label className="block text-xs text-blue-700 mb-1">
                Your Markup: {markupPercent}%
              </label>
              <input
                type="range"
                min={10}
                max={45}
                value={markupPercent}
                onChange={(e) => setMarkupPercent(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-blue-500">
                <span>10%</span>
                <span>45%</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-white rounded-lg p-2">
                <p className="text-xs text-gray-500">Customer Pays</p>
                <p className="font-bold text-gray-900">${yourPrice.toFixed(2)}</p>
              </div>
              <div className="bg-white rounded-lg p-2">
                <p className="text-xs text-gray-500">Your Commission</p>
                <p className="font-bold text-green-600">${yourProfit.toFixed(2)}</p>
              </div>
              <div className="bg-white rounded-lg p-2">
                <p className="text-xs text-gray-500">Platform Fee</p>
                <p className="font-bold text-gray-500">${(basePrice * 0.1).toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Variants */}
          {product.variants?.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Variants</h3>
              <div className="space-y-2">
                {product.variants.map((v) => (
                  <div key={v.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <span className="font-medium text-sm">{v.name}</span>
                      <span className="text-xs text-gray-400 ml-2">{v.sku}</span>
                    </div>
                    <span className="text-sm font-medium">${(v.price / 100).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add to Store */}
          <button
            onClick={addToStore}
            disabled={adding || added}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-60"
          >
            {added ? (
              <><ShoppingBag className="w-5 h-5" /> Added to Store</>
            ) : adding ? (
              'Adding...'
            ) : (
              <><Plus className="w-5 h-5" /> Add to My Store</>
            )}
          </button>

          {/* Trust badges */}
          <div className="flex gap-4 mt-4 text-xs text-gray-400">
            <div className="flex items-center gap-1"><Shield className="w-3.5 h-3.5" /> Verified Supplier</div>
            <div className="flex items-center gap-1"><Truck className="w-3.5 h-3.5" /> Ships in 2-5 days</div>
            <div className="flex items-center gap-1"><Star className="w-3.5 h-3.5" /> Quality Guaranteed</div>
          </div>
        </div>
      </div>
    </div>
  )
}
