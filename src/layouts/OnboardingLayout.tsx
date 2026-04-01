import { Outlet, Link } from 'react-router-dom'

/** Step-wizard layout for the onboarding flow. */
export default function OnboardingLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-indigo-600">
            Zewbie
          </Link>
          <span className="text-sm text-gray-400">Setup Wizard</span>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-4 py-10">
        <Outlet />
      </main>
    </div>
  )
}
