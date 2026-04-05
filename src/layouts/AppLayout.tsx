import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import {
  LayoutDashboard,
  Store,
  FileText,
  LayoutTemplate,
  Globe,
  Settings,
  Package,
  ShoppingBag,
  ShoppingCart,
  BarChart3,
  DollarSign,
  TrendingUp,
  Plug,
  LineChart,
  Users,
  Eye,
  User,
  Bell,
  TestTube,
  Menu,
  X,
} from 'lucide-react'
import clsx from 'clsx'

interface NavItem {
  label: string
  to: string
  icon: React.ReactNode
}

interface NavSection {
  title: string
  items: NavItem[]
}

const NAV_SECTIONS: NavSection[] = [
  {
    title: 'Overview',
    items: [
      { label: 'Dashboard', to: '/dashboard', icon: <LayoutDashboard size={18} /> },
    ],
  },
  {
    title: 'Store Builder',
    items: [
      { label: 'Editor', to: '/store/editor', icon: <Store size={18} /> },
      { label: 'Pages', to: '/store/pages', icon: <FileText size={18} /> },
      { label: 'Templates', to: '/store/templates', icon: <LayoutTemplate size={18} /> },
      { label: 'Domain', to: '/store/domain', icon: <Globe size={18} /> },
      { label: 'Settings', to: '/store/settings', icon: <Settings size={18} /> },
    ],
  },
  {
    title: 'Products',
    items: [
      { label: 'Catalog', to: '/products/catalog', icon: <Package size={18} /> },
      { label: 'My Products', to: '/products/mine', icon: <ShoppingBag size={18} /> },
    ],
  },
  {
    title: 'Orders',
    items: [
      { label: 'Orders', to: '/orders', icon: <ShoppingCart size={18} /> },
      { label: 'Statistics', to: '/orders/stats', icon: <BarChart3 size={18} /> },
    ],
  },
  {
    title: 'Finances',
    items: [
      { label: 'Payouts', to: '/finances/payouts', icon: <DollarSign size={18} /> },
      { label: 'Revenue', to: '/finances/revenue', icon: <TrendingUp size={18} /> },
    ],
  },
  {
    title: 'Integrations',
    items: [
      { label: 'Integrations', to: '/integrations', icon: <Plug size={18} /> },
    ],
  },
  {
    title: 'Analytics',
    items: [
      { label: 'Overview', to: '/analytics', icon: <LineChart size={18} /> },
      { label: 'Sales', to: '/analytics/sales', icon: <DollarSign size={18} /> },
      { label: 'Traffic', to: '/analytics/traffic', icon: <Eye size={18} /> },
      { label: 'Customers', to: '/analytics/customers', icon: <Users size={18} /> },
    ],
  },
  {
    title: 'Account',
    items: [
      { label: 'Profile', to: '/account/profile', icon: <User size={18} /> },
      { label: 'Settings', to: '/account/settings', icon: <Settings size={18} /> },
      { label: 'Notifications', to: '/account/notifications', icon: <Bell size={18} /> },
    ],
  },
  ...(import.meta.env.DEV ? [{
    title: 'Developer',
    items: [
      { label: 'API Tests', to: '/api-test', icon: <TestTube size={18} /> },
    ],
  }] : []),
]

/** Main authenticated layout with collapsible sidebar navigation and mobile hamburger. */
export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed z-40 inset-y-0 left-0 w-64 bg-white border-r border-gray-200 overflow-y-auto flex-shrink-0 transform transition-transform md:relative md:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-indigo-600">Zewbie</h1>
            <p className="text-xs text-gray-400">Creator Portal</p>
          </div>
          <button
            className="md:hidden p-1 rounded hover:bg-gray-100"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>
        <nav className="p-2">
          {NAV_SECTIONS.map((section) => (
            <div key={section.title} className="mb-3">
              <p className="px-3 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                {section.title}
              </p>
              {section.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    clsx(
                      'flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors',
                      isActive
                        ? 'bg-indigo-50 text-indigo-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
                    )
                  }
                >
                  {item.icon}
                  {item.label}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile top bar */}
        <div className="md:hidden flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-200">
          <button
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
            className="p-1 rounded hover:bg-gray-100"
          >
            <Menu size={22} className="text-gray-700" />
          </button>
          <h1 className="text-lg font-bold text-indigo-600">Zewbie</h1>
        </div>

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
