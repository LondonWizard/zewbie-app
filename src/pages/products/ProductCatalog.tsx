import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Search, Filter, Plus, Star } from 'lucide-react'
import api from '../../lib/api'

interface CatalogProduct {
  id: string
  name: string
  sku: string
  basePrice: number
  category: { name: string } | null
  images: string[]
  status: string
}

interface Category {
  id: string
  name: string
  _count?: { products: number }
}

/** Browse the master Zewbie product catalog with search, filtering, and category navigation. */
export default function ProductCatalog() {
  const [products, setProducts] = useState<CatalogProduct[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [sortBy, setSortBy] = useState<'name' | 'price_asc' | 'price_desc'>('name')
  const [addingId, setAddingId] = useState<string | null>(null)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const params: Record<string, string> = {}
      if (search) params.q = search
      if (selectedCategory) params.categoryId = selectedCategory
      if (sortBy === 'price_asc') params.sort = 'basePrice:asc'
      if (sortBy === 'price_desc') params.sort = 'basePrice:desc'
      if (sortBy === 'name') params.sort = 'name:asc'
      const res = await api.get('/catalog/products', { params })
      setProducts(res.data?.data ?? res.data ?? [])
    } catch {
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [search, selectedCategory, sortBy])

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await api.get('/catalog/categories')
        setCategories(res.data?.data ?? res.data ?? [])
      } catch {
        setCategories([])
      }
    }
    loadCategories()
  }, [])

  useEffect(() => {
    const timer = setTimeout(fetchProducts, 300)
    return () => clearTimeout(timer)
  }, [fetchProducts])

  async function addToStore(productId: string) {
    setAddingId(productId)
    try {
      await api.post('/retailers/products', { productId, markup: 15 })
    } catch { /* offline fallback */ }
    setAddingId(null)
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Product Catalog</h1>
        <p className="text-gray-500 mt-1">Browse and add products to your store</p>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 text-sm"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm min-w-[160px]"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
        >
          <option value="name">Name A-Z</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>

      {/* Category pills */}
      {categories.length > 0 && (
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedCategory('')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${
              !selectedCategory ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${
                selectedCategory === c.id ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      )}

      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="animate-pulse rounded-xl bg-gray-100 aspect-square" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20">
          <Filter className="w-12 h-12 mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">No products found. Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="group rounded-xl border border-gray-200 bg-white overflow-hidden hover:shadow-md transition-shadow"
            >
              <Link to={`/products/catalog/${product.id}`}>
                <div className="aspect-square bg-gray-100 relative overflow-hidden">
                  {product.images?.[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <Star className="w-10 h-10" />
                    </div>
                  )}
                </div>
              </Link>
              <div className="p-3">
                <Link to={`/products/catalog/${product.id}`}>
                  <h3 className="font-medium text-gray-900 text-sm truncate hover:text-blue-600">
                    {product.name}
                  </h3>
                </Link>
                <p className="text-xs text-gray-400 mt-0.5">{product.category?.name ?? 'Uncategorized'}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm font-semibold text-gray-900">
                    ${(product.basePrice / 100).toFixed(2)}
                  </span>
                  <button
                    onClick={() => addToStore(product.id)}
                    disabled={addingId === product.id}
                    className="flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-blue-50 text-blue-700 hover:bg-blue-100"
                  >
                    <Plus className="w-3 h-3" />
                    {addingId === product.id ? 'Adding...' : 'Add'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
