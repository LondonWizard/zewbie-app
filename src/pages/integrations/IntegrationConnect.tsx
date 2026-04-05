import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, CheckCircle, XCircle, ToggleLeft, ToggleRight, ExternalLink } from 'lucide-react'
import api from '../../lib/api'

/** Connection and management page for a specific social platform integration. */
export default function IntegrationConnect() {
  const { provider } = useParams<{ provider: string }>()
  const [connected, setConnected] = useState(false)
  const [accountName, setAccountName] = useState('')
  const [catalogSync, setCatalogSync] = useState(false)
  const [loading, setLoading] = useState(true)
  const [connecting, setConnecting] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get(`/integrations/${provider}`)
        const data = res.data?.data ?? res.data
        if (data) {
          setConnected(true)
          setAccountName(data.accountName ?? '')
          setCatalogSync(data.catalogSyncEnabled ?? false)
        }
      } catch { /* not connected */ }
      setLoading(false)
    }
    load()
  }, [provider])

  async function connect() {
    setConnecting(true)
    try {
      const res = await api.post(`/integrations/${provider}/connect`)
      const url = res.data?.data?.authUrl ?? res.data?.authUrl
      if (url) {
        window.location.href = url
      } else {
        setConnected(true)
      }
    } catch { /* offline */ }
    setConnecting(false)
  }

  async function disconnect() {
    if (!confirm(`Disconnect ${provider}?`)) return
    try {
      await api.delete(`/integrations/${provider}`)
      setConnected(false)
      setAccountName('')
    } catch { /* offline */ }
  }

  async function toggleSync() {
    const newVal = !catalogSync
    setCatalogSync(newVal)
    try {
      await api.patch(`/integrations/${provider}`, { catalogSyncEnabled: newVal })
    } catch {
      setCatalogSync(!newVal)
    }
  }

  if (loading) {
    return <div className="p-6 max-w-3xl mx-auto animate-pulse"><div className="h-48 bg-gray-100 rounded-xl" /></div>
  }

  const title = (provider ?? '').charAt(0).toUpperCase() + (provider ?? '').slice(1)

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Link to="/integrations" className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6">
        <ArrowLeft className="w-4 h-4" />
        Back to Integrations
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mb-8">{title} Integration</h1>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {connected ? (
              <CheckCircle className="w-6 h-6 text-green-500" />
            ) : (
              <XCircle className="w-6 h-6 text-gray-300" />
            )}
            <div>
              <p className="font-medium text-gray-900">{connected ? 'Connected' : 'Not Connected'}</p>
              {accountName && <p className="text-xs text-gray-400">{accountName}</p>}
            </div>
          </div>
          {connected ? (
            <button
              onClick={disconnect}
              className="px-4 py-2 rounded-lg border border-red-200 text-red-600 text-sm hover:bg-red-50"
            >
              Disconnect
            </button>
          ) : (
            <button
              onClick={connect}
              disabled={connecting}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-60"
            >
              <ExternalLink className="w-4 h-4" />
              {connecting ? 'Connecting...' : `Connect ${title}`}
            </button>
          )}
        </div>
      </div>

      {connected && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Settings</h2>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-medium text-gray-900">Catalog Sync</p>
              <p className="text-xs text-gray-400">Automatically sync your products to {title}</p>
            </div>
            <button onClick={toggleSync}>
              {catalogSync ? (
                <ToggleRight className="w-10 h-6 text-blue-600" />
              ) : (
                <ToggleLeft className="w-10 h-6 text-gray-300" />
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
