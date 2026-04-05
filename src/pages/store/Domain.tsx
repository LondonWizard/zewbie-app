import { useEffect, useState } from 'react'
import { Globe, CheckCircle, AlertCircle, Loader2, ExternalLink } from 'lucide-react'
import api from '../../lib/api'

interface DomainInfo {
  subdomain: string
  customDomain: string | null
  dnsVerified: boolean
  sslActive: boolean
}

/** Custom domain configuration page with DNS verification status. */
export default function Domain() {
  const [domain, setDomain] = useState<DomainInfo>({
    subdomain: 'my-store',
    customDomain: null,
    dnsVerified: false,
    sslActive: false,
  })
  const [newDomain, setNewDomain] = useState('')
  const [saving, setSaving] = useState(false)
  const [checking, setChecking] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get('/stores/mine/domain')
        const data = res.data?.data ?? res.data
        setDomain(data)
      } catch { /* use defaults */ }
    }
    load()
  }, [])

  async function saveDomain() {
    if (!newDomain.trim()) return
    setSaving(true)
    try {
      const res = await api.put('/stores/mine/domain', { customDomain: newDomain })
      const data = res.data?.data ?? res.data
      setDomain(data)
      setNewDomain('')
    } catch { /* offline */ }
    setSaving(false)
  }

  async function checkDns() {
    setChecking(true)
    try {
      const res = await api.post('/stores/mine/domain/verify')
      const data = res.data?.data ?? res.data
      setDomain(data)
    } catch { /* offline */ }
    setChecking(false)
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Custom Domain</h1>
      <p className="text-gray-500 mb-8">Connect your own domain to your storefront</p>

      {/* Subdomain */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">Default Subdomain</h2>
        <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-50 border">
          <Globe className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-mono text-gray-700">
            {domain.subdomain}.zewbie.com
          </span>
          <a
            href={`https://${domain.subdomain}.zewbie.com`}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto"
          >
            <ExternalLink className="w-4 h-4 text-gray-400 hover:text-blue-500" />
          </a>
        </div>
      </div>

      {/* Custom Domain */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">Custom Domain</h2>

        {domain.customDomain ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-50 border">
              <Globe className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-mono text-gray-700">{domain.customDomain}</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 p-3 rounded-lg border">
                {domain.dnsVerified ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-500" />
                )}
                <span className="text-sm">
                  DNS {domain.dnsVerified ? 'Verified' : 'Pending'}
                </span>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-lg border">
                {domain.sslActive ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-500" />
                )}
                <span className="text-sm">
                  SSL {domain.sslActive ? 'Active' : 'Pending'}
                </span>
              </div>
            </div>

            {!domain.dnsVerified && (
              <div className="p-4 rounded-lg bg-amber-50 border border-amber-200">
                <p className="text-sm text-amber-800 mb-2 font-medium">DNS Configuration Required</p>
                <p className="text-xs text-amber-700 mb-3">
                  Add a CNAME record pointing <code className="bg-amber-100 px-1 rounded">{domain.customDomain}</code> to{' '}
                  <code className="bg-amber-100 px-1 rounded">stores.zewbie.com</code>
                </p>
                <button
                  onClick={checkDns}
                  disabled={checking}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-amber-600 text-white text-xs font-medium"
                >
                  {checking ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
                  {checking ? 'Checking...' : 'Verify DNS'}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-gray-500">
              Connect a custom domain to replace your default subdomain.
            </p>
            <div className="flex gap-3">
              <input
                type="text"
                value={newDomain}
                onChange={(e) => setNewDomain(e.target.value)}
                placeholder="www.mystore.com"
                className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm"
              />
              <button
                onClick={saveDomain}
                disabled={saving || !newDomain.trim()}
                className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm font-medium disabled:opacity-60"
              >
                {saving ? 'Saving...' : 'Connect Domain'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
