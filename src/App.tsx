import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import MarketingLayout from './layouts/MarketingLayout'
import AuthLayout from './layouts/AuthLayout'
import OnboardingLayout from './layouts/OnboardingLayout'
import AppLayout from './layouts/AppLayout'

import Landing from './pages/marketing/Landing'
import Pricing from './pages/marketing/Pricing'
import Features from './pages/marketing/Features'

import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ForgotPassword from './pages/auth/ForgotPassword'
import ResetPassword from './pages/auth/ResetPassword'
import VerifyEmail from './pages/auth/VerifyEmail'

import Onboarding from './pages/onboarding/Onboarding'

import Dashboard from './pages/Dashboard'

import StoreEditor from './pages/store/StoreEditor'
import StorePages from './pages/store/StorePages'
import StorePageEdit from './pages/store/StorePageEdit'
import Templates from './pages/store/Templates'
import Domain from './pages/store/Domain'
import StoreSettings from './pages/store/StoreSettings'

import ProductCatalog from './pages/products/ProductCatalog'
import ProductDetail from './pages/products/ProductDetail'
import MyProducts from './pages/products/MyProducts'
import MyProductEdit from './pages/products/MyProductEdit'

import OrderList from './pages/orders/OrderList'
import OrderDetail from './pages/orders/OrderDetail'
import OrderStats from './pages/orders/OrderStats'

import Payouts from './pages/finances/Payouts'
import PayoutSetup from './pages/finances/PayoutSetup'
import Revenue from './pages/finances/Revenue'

import IntegrationList from './pages/integrations/IntegrationList'
import IntegrationConnect from './pages/integrations/IntegrationConnect'

import AnalyticsOverview from './pages/analytics/AnalyticsOverview'
import SalesAnalytics from './pages/analytics/SalesAnalytics'
import TrafficAnalytics from './pages/analytics/TrafficAnalytics'
import CustomerAnalytics from './pages/analytics/CustomerAnalytics'

import Profile from './pages/account/Profile'
import Settings from './pages/account/Settings'
import Notifications from './pages/account/Notifications'

import ApiTestPanel from './pages/ApiTestPanel'

/** Root application component — defines all routes grouped by layout. */
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Marketing / Public */}
        <Route element={<MarketingLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/features" element={<Features />} />
        </Route>

        {/* Auth */}
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password/:token" element={<ResetPassword />} />
          <Route path="verify-email/:token" element={<VerifyEmail />} />
        </Route>

        {/* Onboarding */}
        <Route element={<OnboardingLayout />}>
          <Route path="/onboarding" element={<Onboarding />} />
        </Route>

        {/* App (authenticated) */}
        <Route element={<AppLayout />}>
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

          {/* Developer */}
          <Route path="/api-test" element={<ApiTestPanel />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
