import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './lib/auth'
import { ToastProvider } from './components/Toast'
import { ErrorBoundary } from './components/ErrorBoundary'

import MarketingLayout from './layouts/MarketingLayout'
import AuthLayout from './layouts/AuthLayout'
import OnboardingLayout from './layouts/OnboardingLayout'
import AppLayout from './layouts/AppLayout'

const Landing = lazy(() => import('./pages/marketing/Landing'))
const Pricing = lazy(() => import('./pages/marketing/Pricing'))
const Features = lazy(() => import('./pages/marketing/Features'))

const Login = lazy(() => import('./pages/auth/Login'))
const Register = lazy(() => import('./pages/auth/Register'))
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'))
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword'))
const VerifyEmail = lazy(() => import('./pages/auth/VerifyEmail'))

const Onboarding = lazy(() => import('./pages/onboarding/Onboarding'))

const Dashboard = lazy(() => import('./pages/Dashboard'))

const StoreEditor = lazy(() => import('./pages/store/StoreEditor'))
const StorePages = lazy(() => import('./pages/store/StorePages'))
const StorePageEdit = lazy(() => import('./pages/store/StorePageEdit'))
const Templates = lazy(() => import('./pages/store/Templates'))
const Domain = lazy(() => import('./pages/store/Domain'))
const StoreSettings = lazy(() => import('./pages/store/StoreSettings'))

const ProductCatalog = lazy(() => import('./pages/products/ProductCatalog'))
const ProductDetail = lazy(() => import('./pages/products/ProductDetail'))
const MyProducts = lazy(() => import('./pages/products/MyProducts'))
const MyProductEdit = lazy(() => import('./pages/products/MyProductEdit'))

const OrderList = lazy(() => import('./pages/orders/OrderList'))
const OrderDetail = lazy(() => import('./pages/orders/OrderDetail'))
const OrderStats = lazy(() => import('./pages/orders/OrderStats'))

const Payouts = lazy(() => import('./pages/finances/Payouts'))
const PayoutSetup = lazy(() => import('./pages/finances/PayoutSetup'))
const Revenue = lazy(() => import('./pages/finances/Revenue'))

const IntegrationList = lazy(() => import('./pages/integrations/IntegrationList'))
const IntegrationConnect = lazy(() => import('./pages/integrations/IntegrationConnect'))

const AnalyticsOverview = lazy(() => import('./pages/analytics/AnalyticsOverview'))
const SalesAnalytics = lazy(() => import('./pages/analytics/SalesAnalytics'))
const TrafficAnalytics = lazy(() => import('./pages/analytics/TrafficAnalytics'))
const CustomerAnalytics = lazy(() => import('./pages/analytics/CustomerAnalytics'))

const Profile = lazy(() => import('./pages/account/Profile'))
const Settings = lazy(() => import('./pages/account/Settings'))
const Notifications = lazy(() => import('./pages/account/Notifications'))

const ApiTestPanel = lazy(() => import('./pages/ApiTestPanel'))

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-pulse text-gray-400">Loading...</div>
    </div>
  )
}

/** Redirects unauthenticated users to the login page. */
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('access_token')
  if (!token) return <Navigate to="/auth/login" replace />
  return <>{children}</>
}

/** Root application component — defines all routes grouped by layout. */
export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              {/* Marketing / Public */}
              <Route element={<ErrorBoundary><MarketingLayout /></ErrorBoundary>}>
                <Route path="/" element={<Landing />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/features" element={<Features />} />
              </Route>

              {/* Auth */}
              <Route path="/auth" element={<ErrorBoundary><AuthLayout /></ErrorBoundary>}>
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="forgot-password" element={<ForgotPassword />} />
                <Route path="reset-password/:token" element={<ResetPassword />} />
                <Route path="verify-email/:token" element={<VerifyEmail />} />
              </Route>

              {/* Onboarding */}
              <Route element={<ErrorBoundary><OnboardingLayout /></ErrorBoundary>}>
                <Route path="/onboarding" element={<Onboarding />} />
              </Route>

              {/* App (authenticated) */}
              <Route element={<ProtectedRoute><ErrorBoundary><AppLayout /></ErrorBoundary></ProtectedRoute>}>
                <Route path="/dashboard" element={<Dashboard />} />

                {/* Store Builder */}
                <Route path="/store/editor" element={<StoreEditor />} />
                <Route path="/store/pages" element={<StorePages />} />
                <Route path="/store/pages/:id/edit" element={<StorePageEdit />} />
                <Route path="/store/templates" element={<Templates />} />
                <Route path="/store/domain" element={<Domain />} />
                <Route path="/store/settings" element={<StoreSettings />} />

                {/* Products */}
                <Route path="/products/catalog" element={<ProductCatalog />} />
                <Route path="/products/catalog/:id" element={<ProductDetail />} />
                <Route path="/products/mine" element={<MyProducts />} />
                <Route path="/products/mine/:id" element={<MyProductEdit />} />

                {/* Orders */}
                <Route path="/orders" element={<OrderList />} />
                <Route path="/orders/stats" element={<OrderStats />} />
                <Route path="/orders/:id" element={<OrderDetail />} />

                {/* Finances */}
                <Route path="/finances/payouts" element={<Payouts />} />
                <Route path="/finances/payouts/setup" element={<PayoutSetup />} />
                <Route path="/finances/revenue" element={<Revenue />} />

                {/* Integrations */}
                <Route path="/integrations" element={<IntegrationList />} />
                <Route path="/integrations/:provider" element={<IntegrationConnect />} />

                {/* Analytics */}
                <Route path="/analytics" element={<AnalyticsOverview />} />
                <Route path="/analytics/sales" element={<SalesAnalytics />} />
                <Route path="/analytics/traffic" element={<TrafficAnalytics />} />
                <Route path="/analytics/customers" element={<CustomerAnalytics />} />

                {/* Account */}
                <Route path="/account/profile" element={<Profile />} />
                <Route path="/account/settings" element={<Settings />} />
                <Route path="/account/notifications" element={<Notifications />} />

                {/* Developer — only available in dev builds */}
                {import.meta.env.DEV && (
                  <Route path="/api-test" element={<ApiTestPanel />} />
                )}
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  )
}
