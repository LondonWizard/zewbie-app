import { useEffect, useState } from 'react'
import { Save, Palette } from 'lucide-react'
import api from '../../lib/api'

interface StoreConfig {
  name: string
  description: string
  slug: string
  logoUrl: string
  faviconUrl: string
  primaryColor: string
  secondaryColor: string
  fontFamily: string
  gaTrackingId: string
  fbPixelId: string
  metaTitle: string
  metaDescription: string
  socialLinks: { instagram: string; facebook: string; tiktok: string; pinterest: string; youtube: string }
}

const FONT_OPTIONS = [
  'Inter', 'Playfair Display', 'Roboto', 'Lora', 'Montserrat',
  'Open Sans', 'Poppins', 'Raleway', 'Merriweather', 'DM Sans',
]

const COLOR_PRESETS = [
  { name: 'Ocean Blue', primary: '#2563eb', secondary: '#3b82f6' },
  { name: 'Emerald', primary: '#059669', secondary: '#10b981' },
  { name: 'Royal Purple', primary: '#7c3aed', secondary: '#8b5cf6' },
  { name: 'Rose Gold', primary: '#be185d', secondary: '#d4a574' },
  { name: 'Midnight', primary: '#1e293b', secondary: '#475569' },
  { name: 'Coral', primary: '#f43f5e', secondary: '#fb7185' },
]

const DEFAULT_CONFIG: StoreConfig = {
  name: '', description: '', slug: '', logoUrl: '', faviconUrl: '',
  primaryColor: '#2563eb', secondaryColor: '#3b82f6', fontFamily: 'Inter',
  gaTrackingId: '', fbPixelId: '', metaTitle: '', metaDescription: '',
  socialLinks: { instagram: '', facebook: '', tiktok: '', pinterest: '', youtube: '' },
}

/** Comprehensive store settings page covering branding, SEO, analytics, and social links. */
export default function StoreSettings() {
  const [config, setConfig] = useState<StoreConfig>(DEFAULT_CONFIG)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get('/stores/mine/settings')
        const data = res.data?.data ?? res.data
        setConfig({ ...DEFAULT_CONFIG, ...data })
      } catch { /* use defaults */ }
    }
    load()
  }, [])

  function update(field: string, value: unknown) {
    setConfig((prev) => ({ ...prev, [field]: value }))
    setSaved(false)
  }

  function updateSocial(field: string, value: string) {
    setConfig((prev) => ({ ...prev, socialLinks: { ...prev.socialLinks, [field]: value } }))
    setSaved(false)
  }

  async function save() {
    setSaving(true)
    try {
      await api.put('/stores/mine/settings', config)
      setSaved(true)
    } catch { /* offline */ }
    setSaving(false)
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Store Settings</h1>
          <p className="text-gray-500 mt-1">Configure branding, SEO, analytics, and social links</p>
        </div>
        <button
          onClick={save}
          disabled={saving}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 disabled:opacity-60"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      {/* General */}
      <section className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">General</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Store Name</label>
            <input
              value={config.name}
              onChange={(e) => update('name', e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Slug</label>
            <input
              value={config.slug}
              onChange={(e) => update('slug', e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm font-mono"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
            <textarea
              value={config.description}
              onChange={(e) => update('description', e.target.value)}
              rows={3}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
        </div>
      </section>

      {/* Branding */}
      <section className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">Branding</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Logo URL</label>
              <input
                value={config.logoUrl}
                onChange={(e) => update('logoUrl', e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Favicon URL</label>
              <input
                value={config.faviconUrl}
                onChange={(e) => update('faviconUrl', e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-2">Color Presets</label>
            <div className="flex gap-2 flex-wrap">
              {COLOR_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => { update('primaryColor', preset.primary); update('secondaryColor', preset.secondary) }}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs ${
                    config.primaryColor === preset.primary ? 'border-blue-300 bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex">
                    <div className="w-4 h-4 rounded-l" style={{ background: preset.primary }} />
                    <div className="w-4 h-4 rounded-r" style={{ background: preset.secondary }} />
                  </div>
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Primary Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={config.primaryColor}
                  onChange={(e) => update('primaryColor', e.target.value)}
                  className="w-10 h-10 rounded cursor-pointer"
                />
                <input
                  value={config.primaryColor}
                  onChange={(e) => update('primaryColor', e.target.value)}
                  className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm font-mono"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Secondary Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={config.secondaryColor}
                  onChange={(e) => update('secondaryColor', e.target.value)}
                  className="w-10 h-10 rounded cursor-pointer"
                />
                <input
                  value={config.secondaryColor}
                  onChange={(e) => update('secondaryColor', e.target.value)}
                  className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm font-mono"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Font Family</label>
            <select
              value={config.fontFamily}
              onChange={(e) => update('fontFamily', e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            >
              {FONT_OPTIONS.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* SEO */}
      <section className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">SEO</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Meta Title</label>
            <input
              value={config.metaTitle}
              onChange={(e) => update('metaTitle', e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              maxLength={70}
            />
            <p className="text-xs text-gray-400 mt-1">{config.metaTitle.length}/70 characters</p>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Meta Description</label>
            <textarea
              value={config.metaDescription}
              onChange={(e) => update('metaDescription', e.target.value)}
              rows={2}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              maxLength={160}
            />
            <p className="text-xs text-gray-400 mt-1">{config.metaDescription.length}/160 characters</p>
          </div>
        </div>
      </section>

      {/* Analytics */}
      <section className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">Analytics</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Google Analytics ID</label>
            <input
              value={config.gaTrackingId}
              onChange={(e) => update('gaTrackingId', e.target.value)}
              placeholder="G-XXXXXXXXXX"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Facebook Pixel ID</label>
            <input
              value={config.fbPixelId}
              onChange={(e) => update('fbPixelId', e.target.value)}
              placeholder="XXXXXXXXXXXXXXX"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm font-mono"
            />
          </div>
        </div>
      </section>

      {/* Social Links */}
      <section className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">Social Links</h2>
        <div className="space-y-3">
          {(['instagram', 'facebook', 'tiktok', 'pinterest', 'youtube'] as const).map((platform) => (
            <div key={platform}>
              <label className="block text-xs font-medium text-gray-600 mb-1 capitalize">{platform}</label>
              <input
                value={config.socialLinks[platform]}
                onChange={(e) => updateSocial(platform, e.target.value)}
                placeholder={`https://${platform}.com/...`}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
