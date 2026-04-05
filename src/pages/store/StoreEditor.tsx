import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
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
 */
export default function StoreEditor() {
  const location = useLocation()
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
        const data = res.data?.data ?? res.data
        if (!cancelled) setStore(data)
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

  const page = store?.pages?.[0] ?? { id: 'home', title: 'Home', content: null }
  const initialContent = templateContent
    ? JSON.stringify(templateContent)
    : page.content
      ? JSON.stringify(page.content)
      : undefined

  return (
    <StoreBuilder
      storeId={store?.id ?? 'local-store'}
      pageId={page.id}
      storeName={store?.name ?? 'My Store'}
      pageName={page.title}
      initialContent={initialContent}
    />
  )
}
