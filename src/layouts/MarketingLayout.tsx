import { Outlet, Link } from 'react-router-dom'

/** Public marketing layout with top navbar and footer. */
export default function MarketingLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-indigo-600">
            Zewbie
          </Link>
          <nav className="flex items-center gap-6">
            <Link to="/features" className="text-sm text-gray-600 hover:text-gray-900">
              Features
            </Link>
            <Link to="/pricing" className="text-sm text-gray-600 hover:text-gray-900">
              Pricing
            </Link>
            <Link
              to="/auth/login"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Log In
            </Link>
            <Link
              to="/auth/register"
              className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-gray-200 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-gray-400">
          &copy; {new Date().getFullYear()} Zewbie. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
