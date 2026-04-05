import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plug, CheckCircle, ExternalLink } from 'lucide-react'
import api from '../../lib/api'

interface Integration {
  id: string
  platform: string
  connected: boolean
  accountName: string | null
  catalogSyncEnabled: boolean
}

const PLATFORMS = [
  { key: 'instagram', label: 'Instagram', color: 'bg-gradient-to-br from-purple-500 to-pink-500' },
  { key: 'tiktok', label: 'TikTok', color: 'bg-black' },
  { key: 'facebook', label: 'Facebook', color: 'bg-blue-600' },
  { key: 'pinterest', label: 'Pinterest', color: 'bg-red-600' },
  { key: 'youtube', label: 'YouTube', color: 'bg-red-500' },
]

/** Lists all available social integrations with connect/disconnect actions. */
export default function IntegrationList() {
  const [integrations, setIntegrations] = useState<Integration[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get('/integrations')
        setIntegrations(res.data?.data ?? res.data ?? [])
      } catch {
        setIntegrations([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const connectedMap = new Map(integrations.map((i) => [i.platform.toLowerCase(), i]))

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Integrations</h1>
      <p className="text-gray-500 mb-8">Connect your social accounts to sell across platforms</p>

      <div className="space-y-3">
        {PLATFORMS.map(({ key, label, color }) => {
          const integration = connectedMap.get(key)
          return (
            <div
              key={key}
              className="flex items-center justify-between p-4 rounded-xl border border-gray-200 bg-white"
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center text-white text-xs font-bold`}>
                  {label[0]}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{label}</h3>
                  {integration ? (
                    <p className="text-xs text-green-600 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Connected{integration.accountName ? ` as ${integration.accountName}` : ''}
                    </p>
                  ) : (
                    <p className="text-xs text-gray-400">Not connected</p>
                  )}
                </div>
              </div>
              <Link
                to={`/integrations/${key}`}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium ${
                  integration
                    ? 'border border-gray-300 hover:bg-gray-50'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {integration ? 'Manage' : (
                  <><Plug className="w-3.5 h-3.5" /> Connect</>
                )}
              </Link>
            </div>
          )
        })}
      </div>
    </div>
  )
}
