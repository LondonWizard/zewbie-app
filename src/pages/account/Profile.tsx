import { useEffect, useState } from 'react'
import { Save, Camera } from 'lucide-react'
import api from '../../lib/api'

interface ProfileData {
  firstName: string
  lastName: string
  email: string
  phone: string
  avatarUrl: string
  bio: string
}

/** User profile page with editable personal information and avatar. */
export default function Profile() {
  const [profile, setProfile] = useState<ProfileData>({
    firstName: '', lastName: '', email: '', phone: '', avatarUrl: '', bio: '',
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get('/users/me')
        const data = res.data?.data ?? res.data
        setProfile(prev => ({ ...prev, ...data }))
      } catch { /* offline */ }
    }
    load()
  }, [])

  function update(field: string, value: string) {
    setProfile((prev) => ({ ...prev, [field]: value }))
    setSaved(false)
  }

  async function save() {
    setSaving(true)
    try {
      await api.put('/users/me', profile)
      setSaved(true)
    } catch { /* offline */ }
    setSaving(false)
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-500 mt-1">Manage your personal information</p>
        </div>
        <button
          onClick={save}
          disabled={saving}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 disabled:opacity-60"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save'}
        </button>
      </div>

      {/* Avatar */}
      <div className="flex items-center gap-4 mb-8">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-gray-100 overflow-hidden">
            {profile.avatarUrl ? (
              <img src={profile.avatarUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-gray-300">
                {profile.firstName?.[0] ?? '?'}
              </div>
            )}
          </div>
          <button
            className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center border-2 border-white"
            aria-label="Change avatar"
          >
            <Camera className="w-3.5 h-3.5" />
          </button>
        </div>
        <div>
          <p className="font-medium text-gray-900">{profile.firstName} {profile.lastName}</p>
          <p className="text-sm text-gray-400">{profile.email}</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Personal Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="profile-first-name" className="block text-xs font-medium text-gray-600 mb-1">First Name</label>
              <input
                id="profile-first-name"
                value={profile.firstName}
                onChange={(e) => update('firstName', e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label htmlFor="profile-last-name" className="block text-xs font-medium text-gray-600 mb-1">Last Name</label>
              <input
                id="profile-last-name"
                value={profile.lastName}
                onChange={(e) => update('lastName', e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label htmlFor="profile-email" className="block text-xs font-medium text-gray-600 mb-1">Email</label>
              <input
                id="profile-email"
                value={profile.email}
                readOnly
                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm bg-gray-50 text-gray-500"
              />
            </div>
            <div>
              <label htmlFor="profile-phone" className="block text-xs font-medium text-gray-600 mb-1">Phone</label>
              <input
                id="profile-phone"
                value={profile.phone}
                onChange={(e) => update('phone', e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
            <div className="col-span-2">
              <label htmlFor="profile-bio" className="block text-xs font-medium text-gray-600 mb-1">Bio</label>
              <textarea
                id="profile-bio"
                value={profile.bio}
                onChange={(e) => update('bio', e.target.value)}
                rows={3}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
