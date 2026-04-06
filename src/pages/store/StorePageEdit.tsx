import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { StoreBuilder } from '../../store-builder/StoreBuilder'
import api from '../../lib/api'

interface PageData {
  id: string
  title: string
  content: unknown
  storeId: string
  storeName: string
}

/**
 * Opens the Craft.js builder for a specific page by ID.
 * First fetches the user's store to get the real storeId,
 * then loads the page within that store.
 */
export default function StorePageEdit() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [page, setPage] = useState<PageData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const storeRes = await api.get('/stores/mine')
        const raw = storeRes.data?.data ?? storeRes.data
        const store = Array.isArray(raw) ? raw[0] : raw
        if (!store) {
          if (!cancelled) setError('No store found. Create a store first.')
          return
        }

        const pageRes = await api.get(`/stores/${store.id}/pages/${id}`)
        const pageData = pageRes.data?.data ?? pageRes.data
        if (!cancelled) {
          setPage({
            ...pageData,
            storeId: store.id,
            storeName: store.name,
          })
        }
      } catch (err) {
        if (!cancelled) {
          const message =
            err instanceof Error ? err.message : 'Failed to load page'
          setError(message)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-pulse text-gray-400">Loading page...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-red-500 mb-2">{error}</p>
          <button
            onClick={() => navigate('/store/pages')}
            className="text-sm text-blue-600 hover:underline"
          >
            Back to Pages
          </button>
        </div>
      </div>
    )
  }

  if (!page) return null

  return (
    <StoreBuilder
      storeId={page.storeId}
      pageId={page.id}
      storeName={page.storeName}
      pageName={page.title}
      initialContent={page.content ? JSON.stringify(page.content) : undefined}
    />
  )
}
