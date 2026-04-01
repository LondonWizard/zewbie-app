# Zewbie — User/Creator Portal

React + Vite + TypeScript frontend for the Zewbie e-commerce creator platform.

## Tech Stack

| Layer       | Choice                                    |
|-------------|-------------------------------------------|
| Framework   | React 18 + TypeScript                     |
| Bundler     | Vite                                      |
| Styling     | TailwindCSS v4 (`@tailwindcss/vite`)      |
| Routing     | React Router v6 (BrowserRouter)           |
| State       | Zustand                                   |
| Data        | TanStack React Query + Axios              |
| Icons       | Lucide React                              |

## Project Structure

```
src/
├── App.tsx                  # Root router — all routes defined here
├── index.css                # Tailwind import
├── main.tsx                 # Entry point
├── lib/
│   └── api.ts               # Axios instance (VITE_API_URL)
├── layouts/
│   ├── AppLayout.tsx         # Sidebar layout (authenticated pages)
│   ├── AuthLayout.tsx        # Centered card layout (login/register)
│   ├── OnboardingLayout.tsx  # Step-wizard layout
│   └── MarketingLayout.tsx   # Public pages with navbar + footer
└── pages/
    ├── Dashboard.tsx
    ├── ApiTestPanel.tsx
    ├── marketing/           # Landing, Pricing, Features
    ├── auth/                # Login, Register, ForgotPassword, ResetPassword, VerifyEmail
    ├── onboarding/          # Onboarding wizard (5 steps)
    ├── store/               # StoreEditor, StorePages, Templates, Domain, StoreSettings
    ├── products/            # ProductCatalog, ProductDetail, MyProducts, MyProductEdit
    ├── orders/              # OrderList, OrderDetail, OrderStats
    ├── finances/            # Payouts, PayoutSetup, Revenue
    ├── integrations/        # IntegrationList, IntegrationConnect
    ├── analytics/           # AnalyticsOverview, Sales, Traffic, Customer
    └── account/             # Profile, Settings, Notifications
```

## Routes

| Route                           | Page               | Layout     |
|---------------------------------|--------------------|------------|
| `/`                             | Landing            | Marketing  |
| `/pricing`                      | Pricing            | Marketing  |
| `/features`                     | Features           | Marketing  |
| `/auth/login`                   | Login              | Auth       |
| `/auth/register`                | Register           | Auth       |
| `/auth/forgot-password`         | ForgotPassword     | Auth       |
| `/auth/reset-password/:token`   | ResetPassword      | Auth       |
| `/auth/verify-email/:token`     | VerifyEmail        | Auth       |
| `/onboarding`                   | Onboarding         | Onboarding |
| `/dashboard`                    | Dashboard          | App        |
| `/store/editor`                 | StoreEditor        | App        |
| `/store/pages`                  | StorePages         | App        |
| `/store/pages/:id/edit`         | StorePageEdit      | App        |
| `/store/templates`              | Templates          | App        |
| `/store/domain`                 | Domain             | App        |
| `/store/settings`               | StoreSettings      | App        |
| `/products/catalog`             | ProductCatalog     | App        |
| `/products/catalog/:id`         | ProductDetail      | App        |
| `/products/mine`                | MyProducts         | App        |
| `/products/mine/:id`            | MyProductEdit      | App        |
| `/orders`                       | OrderList          | App        |
| `/orders/stats`                 | OrderStats         | App        |
| `/orders/:id`                   | OrderDetail        | App        |
| `/finances/payouts`             | Payouts            | App        |
| `/finances/payouts/setup`       | PayoutSetup        | App        |
| `/finances/revenue`             | Revenue            | App        |
| `/integrations`                 | IntegrationList    | App        |
| `/integrations/:provider`       | IntegrationConnect | App        |
| `/analytics`                    | AnalyticsOverview  | App        |
| `/analytics/sales`              | SalesAnalytics     | App        |
| `/analytics/traffic`            | TrafficAnalytics   | App        |
| `/analytics/customers`          | CustomerAnalytics  | App        |
| `/account/profile`              | Profile            | App        |
| `/account/settings`             | Settings           | App        |
| `/account/notifications`        | Notifications      | App        |
| `/api-test`                     | ApiTestPanel       | App        |

## Getting Started

```bash
cp .env.example .env
npm install
npm run dev          # http://localhost:5173
```

## Environment Variables

| Variable       | Description            | Default                  |
|----------------|------------------------|--------------------------|
| `VITE_API_URL` | Backend API base URL   | `http://localhost:3000`  |
