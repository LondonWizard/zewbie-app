import { useState } from 'react'
import { Shield, Bell, Globe, Trash2 } from 'lucide-react'

/**
 * Account settings page with security, notification preferences, and danger zone.
 *
 * NOTE: Change Password, Delete Account, and 2FA actions are UI placeholders.
 * They toggle local state only — backend endpoints do not exist yet.
 * Buttons without real handlers are disabled to avoid confusing users.
 */
export default function Settings() {
  const [twoFa, setTwoFa] = useState(false)
  const [emailNotifs, setEmailNotifs] = useState(true)
  const [pushNotifs, setPushNotifs] = useState(true)
  const [language, setLanguage] = useState('en')

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your account preferences</p>
      </div>

      {/* Security */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <Shield className="w-4 h-4" /> Security
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium text-gray-900">Two-Factor Authentication</p>
              <p className="text-xs text-gray-400">Add an extra layer of security</p>
            </div>
            <button
              onClick={() => setTwoFa(!twoFa)}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium ${
                twoFa ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'
              }`}
            >
              {twoFa ? 'Enabled' : 'Enable'}
            </button>
          </div>
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium text-gray-900">Change Password</p>
              <p className="text-xs text-gray-400">Update your account password</p>
            </div>
            {/* Disabled until backend password-change endpoint is implemented */}
            <button
              disabled
              className="px-4 py-1.5 rounded-lg text-xs font-medium bg-gray-100 text-gray-400 cursor-not-allowed"
              title="Coming soon"
            >
              Update
            </button>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <Bell className="w-4 h-4" /> Notifications
        </h2>
        <div className="space-y-3">
          {[
            { label: 'Email Notifications', desc: 'Order updates, payouts, announcements', value: emailNotifs, toggle: setEmailNotifs },
            { label: 'Push Notifications', desc: 'Real-time alerts in your browser', value: pushNotifs, toggle: setPushNotifs },
          ].map(({ label, desc, value, toggle }) => (
            <div key={label} className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium text-gray-900">{label}</p>
                <p className="text-xs text-gray-400">{desc}</p>
              </div>
              <button
                onClick={() => toggle(!value)}
                className={`w-10 h-6 rounded-full transition-colors ${value ? 'bg-blue-600' : 'bg-gray-200'}`}
                aria-label={`Toggle ${label}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transform transition-transform mx-0.5 ${value ? 'translate-x-4' : 'translate-x-0.5'}`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Preferences */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <Globe className="w-4 h-4" /> Preferences
        </h2>
        <div>
          <label htmlFor="settings-language" className="block text-xs font-medium text-gray-600 mb-1">Language</label>
          <select
            id="settings-language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full max-w-xs rounded-md border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
          </select>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-xl border border-red-200 p-6">
        <h2 className="text-sm font-semibold text-red-700 mb-4 flex items-center gap-2">
          <Trash2 className="w-4 h-4" /> Danger Zone
        </h2>
        <p className="text-xs text-gray-500 mb-3">Permanently delete your account and all associated data.</p>
        {/* Disabled until backend account-deletion endpoint is implemented */}
        <button
          disabled
          className="px-4 py-2 rounded-lg bg-red-50 text-red-400 text-sm font-medium cursor-not-allowed"
          title="Coming soon"
        >
          Delete Account
        </button>
      </div>
    </div>
  )
}
