import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { StoreBuilder } from '../../store-builder/StoreBuilder'
import api from '../../lib/api'

interface StoreData {
  id: string
  name: string
  pages: Array<{ id: string; title: string; content: unknown }>
}

/**
 * Store Editor page — loads the user's current store and opens
 * the Craft.js builder for the selected page (defaults to "Home").
 * If the API returns an array (from /stores/mine), picks the first store.
 */
export default function StoreEditor() {
  const location = useLocation()
  const navigate = useNavigate()
  const [store, setStore] = useState<StoreData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  const templateContent = (location.state as { template?: Record<string, unknown> } | null)?.template

  useEffect(() => {
    let cancelled = false

    async function loadStore() {
      setLoading(true)
      setError(null)
      try {
        const res = await api.get('/stores/mine')
        const raw = res.data?.data ?? res.data
        const storeObj = Array.isArray(raw) ? raw[0] ?? null : raw
        if (!cancelled) setStore(storeObj)
      } catch (err) {
        if (!cancelled) {
          const message =
            (err && typeof err === 'object' && 'message' in err) ? String((err as { message: string }).message) : 'Failed to load store'
          setError(message)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadStore()
    return () => { cancelled = true }
  }, [retryCount])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-pulse text-gray-400">Loading store editor...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-red-500 mb-2">{error}</p>
          <button
            onClick={() => setRetryCount((c) => c + 1)}
            className="text-sm text-blue-600 hover:underline"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (!store) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center max-w-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No store yet</h2>
          <p className="text-gray-500 mb-4">
            Create a store first from the templates page, then come back here to edit it.
          </p>
          <button
            onClick={() => navigate('/store/templates')}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
          >
            Browse Templates
          </button>
        </div>
      </div>
    )
  }

  const page = store.pages?.[0] ?? { id: 'home', title: 'Home', content: null }
  const initialContent = templateContent
    ? JSON.stringify(templateContent)
    : page.content
      ? JSON.stringify(page.content)
      : undefined

  return (
    <StoreBuilder
      storeId={store.id}
      pageId={page.id}
      storeName={store.name}
      pageName={page.title}
      initialContent={initialContent}
    />
  )
}
