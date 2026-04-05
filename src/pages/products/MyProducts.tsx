import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Edit2, Trash2, Eye, EyeOff, TrendingUp, Package } from 'lucide-react'
import api from '../../lib/api'

interface MyProduct {
  id: string
  markup: number
  isVisible: boolean
  product: {
    id: string
    name: string
    sku: string
    basePrice: number
    images: string[]
    category: { name: string } | null
  }
}

/** Manages the user's store product listings with markup and visibility controls. */
export default function MyProducts() {
  const [products, setProducts] = useState<MyProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get('/stores/mine/products')
        setProducts(res.data?.data ?? res.data ?? [])
      } catch {
        setProducts([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  async function toggleVisibility(id: string, current: boolean) {
    setProducts((prev) => prev.map((p) => p.id === id ? { ...p, isVisible: !current } : p))
    try {
      await api.patch(`/stores/mine/products/${id}`, { isVisible: !current })
    } catch {
      setProducts((prev) => prev.map((p) => p.id === id ? { ...p, isVisible: current } : p))
    }
  }

  async function removeProduct(id: string) {
    if (!confirm('Remove this product from your store?')) return
    try {
      await api.delete(`/stores/mine/products/${id}`)
      setProducts((prev) => prev.filter((p) => p.id !== id))
    } catch { /* offline — keep item in list */ }
  }

  const filtered = products.filter((p) =>
    p.product.name.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Products</h1>
          <p className="text-gray-500 mt-1">{products.length} products in your store</p>
        </div>
        <Link
          to="/products/catalog"
          className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
        >
          Browse Catalog
        </Link>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter my products..."
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 text-sm"
        />
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 rounded-xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <Package className="w-12 h-12 mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 mb-3">
            {search ? 'No products match your search.' : 'No products in your store yet.'}
          </p>
          {!search && (
            <Link
              to="/products/catalog"
              className="text-sm text-blue-600 hover:underline"
            >
              Browse the catalog to add products
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((item) => {
            const base = item.product.basePrice / 100
            const listPrice = base * (1 + item.markup / 100)
            const commission = (listPrice - base) * 0.5

            return (
              <div
                key={item.id}
                className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 bg-white hover:shadow-sm transition-shadow"
              >
                <div className="w-14 h-14 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                  {item.product.images?.[0] ? (
                    <img src={item.product.images[0]} alt="" className="w-full h-full object-cover" loading="lazy" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <Package className="w-6 h-6" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 truncate">{item.product.name}</h3>
                  <div className="flex items-center gap-3 text-xs text-gray-400 mt-0.5">
                    <span>{item.product.sku}</span>
                    <span>{item.product.category?.name}</span>
                  </div>
                </div>

                <div className="text-right mr-4">
                  <p className="text-sm font-semibold text-gray-900">${listPrice.toFixed(2)}</p>
                  <p className="text-xs text-green-600 flex items-center gap-1 justify-end">
                    <TrendingUp className="w-3 h-3" />
                    ${commission.toFixed(2)} profit
                  </p>
                  <p className="text-xs text-gray-400">{item.markup}% markup</p>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => toggleVisibility(item.id, item.isVisible)}
                    className="p-2 rounded-lg hover:bg-gray-100"
                    title={item.isVisible ? 'Hide' : 'Show'}
                    aria-label={item.isVisible ? `Hide ${item.product.name}` : `Show ${item.product.name}`}
                  >
                    {item.isVisible ? (
                      <Eye className="w-4 h-4 text-green-500" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-gray-300" />
                    )}
                  </button>
                  <Link
                    to={`/products/mine/${item.id}`}
                    className="p-2 rounded-lg hover:bg-gray-100"
                    title="Edit"
                    aria-label={`Edit ${item.product.name}`}
                  >
                    <Edit2 className="w-4 h-4 text-gray-400" />
                  </Link>
                  <button
                    onClick={() => removeProduct(item.id)}
                    className="p-2 rounded-lg hover:bg-red-50"
                    title="Remove"
                    aria-label={`Remove ${item.product.name}`}
                  >
                    <Trash2 className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
