import { useState } from 'react'
import { Outlet, Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

/** Public marketing layout with responsive top navbar and footer. */
export default function MarketingLayout() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-indigo-600">
            Zewbie
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/features" className="text-sm text-gray-600 hover:text-gray-900">
              Features
            </Link>
            <Link to="/pricing" className="text-sm text-gray-600 hover:text-gray-900">
              Pricing
            </Link>
            <Link to="/auth/login" className="text-sm text-gray-600 hover:text-gray-900">
              Log In
            </Link>
            <Link
              to="/auth/register"
              className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            >
              Get Started
            </Link>
          </nav>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-1 rounded hover:bg-gray-100"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <nav className="md:hidden border-t border-gray-100 px-4 py-3 flex flex-col gap-3">
            <Link to="/features" onClick={() => setMenuOpen(false)} className="text-sm text-gray-600 hover:text-gray-900">
              Features
            </Link>
            <Link to="/pricing" onClick={() => setMenuOpen(false)} className="text-sm text-gray-600 hover:text-gray-900">
              Pricing
            </Link>
            <Link to="/auth/login" onClick={() => setMenuOpen(false)} className="text-sm text-gray-600 hover:text-gray-900">
              Log In
            </Link>
            <Link
              to="/auth/register"
              onClick={() => setMenuOpen(false)}
              className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 text-center"
            >
              Get Started
            </Link>
          </nav>
        )}
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
