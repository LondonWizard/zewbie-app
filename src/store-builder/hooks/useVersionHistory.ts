import { useState, useCallback } from 'react'
import api from '../../lib/api'

export interface PageVersion {
  id: string
  version: number
  content: string
  createdAt: string
}

/**
 * Fetches and manages page version history via the API.
 * Falls back to an empty list if the API isn't available.
 */
export function useVersionHistory(storeId: string | undefined, pageId: string | undefined) {
  const [versions, setVersions] = useState<PageVersion[]>([])
  const [loading, setLoading] = useState(false)

  const fetchVersions = useCallback(async () => {
    if (!storeId || !pageId) return
    setLoading(true)
    try {
      const res = await api.get(`/stores/${storeId}/pages/${pageId}/versions`)
      setVersions(res.data?.data ?? res.data ?? [])
    } catch {
      setVersions([])
    } finally {
      setLoading(false)
    }
  }, [storeId, pageId])

  const restoreVersion = useCallback(async (versionId: string) => {
    if (!storeId || !pageId) return null
    try {
      const res = await api.post(`/stores/${storeId}/pages/${pageId}/versions/${versionId}/restore`)
      return res.data?.data?.content ?? res.data?.content ?? null
    } catch {
      return null
    }
  }, [storeId, pageId])

  return { versions, loading, fetchVersions, restoreVersion }
}
