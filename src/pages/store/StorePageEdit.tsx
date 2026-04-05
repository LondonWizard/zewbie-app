import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { StoreBuilder } from '../../store-builder/StoreBuilder'
import api from '../../lib/api'

interface PageData {
  id: string
  title: string
  content: unknown
  storeId: string
  storeName: string
}

/** Opens the Craft.js builder for a specific page by ID. */
export default function StorePageEdit() {
  const { id } = useParams<{ id: string }>()
  const [page, setPage] = useState<PageData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const res = await api.get(`/stores/mine/pages/${id}`)
        const data = res.data?.data ?? res.data
        if (!cancelled) setPage(data)
      } catch {
        if (!cancelled) {
          setPage({
            id: id ?? 'unknown',
            title: 'Page',
            content: null,
            storeId: 'local-store',
            storeName: 'My Store',
          })
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
