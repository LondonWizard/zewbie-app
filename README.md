# Zewbie — User / Creator Portal

**Creator and end-user** experience for building a store, managing products sourced from retailers, orders, payouts, integrations, and analytics. Stack: **React**, **Vite**, **TypeScript**, **TailwindCSS**, **React Router**, **Axios**, **TanStack Query**, **Zustand**.

**Live:** [https://app.zewbie.com](https://app.zewbie.com)

## Quick start

```powershell
git clone https://github.com/zewbie/zewbie-app.git
cd zewbie-app
npm install
copy .env.example .env
npm run dev
```

Dev server: **`http://localhost:5173`** (`vite.config.ts`).

## Architecture

| Layout | Use |
|--------|-----|
| **`MarketingLayout`** | Public marketing: landing, pricing, features. |
| **`AuthLayout`** | Login, register, password reset, email verification (`/auth/*`). |
| **`OnboardingLayout`** | Post-signup onboarding wizard. |
| **`AppLayout`** | Authenticated creator dashboard (sidebar). |
| **`lib/api.ts`** | API client with `VITE_API_URL` and auth token handling. |

## Route list (37 pages)

| Route | Page | Layout |
|-------|------|--------|
| `/` | Landing | Marketing |
| `/pricing` | Pricing | Marketing |
| `/features` | Features | Marketing |
| `/auth/login` | Login | Auth |
| `/auth/register` | Register | Auth |
| `/auth/forgot-password` | Forgot password | Auth |
| `/auth/reset-password/:token` | Reset password | Auth |
| `/auth/verify-email/:token` | Verify email | Auth |
| `/onboarding` | Onboarding | Onboarding |
| `/dashboard` | Dashboard | App |
| `/store/editor` | Store editor | App |
| `/store/pages` | Store pages | App |
| `/store/pages/:id/edit` | Edit store page | App |
| `/store/templates` | Templates | App |
| `/store/domain` | Custom domain | App |
| `/store/settings` | Store settings | App |
| `/products/catalog` | Product catalog | App |
| `/products/catalog/:id` | Catalog product detail | App |
| `/products/mine` | My products | App |
| `/products/mine/:id` | Edit my product | App |
| `/orders` | Orders | App |
| `/orders/stats` | Order stats | App |
| `/orders/:id` | Order detail | App |
| `/finances/payouts` | Payouts | App |
| `/finances/payouts/setup` | Payout setup | App |
| `/finances/revenue` | Revenue | App |
| `/integrations` | Integrations list | App |
| `/integrations/:provider` | Connect integration | App |
| `/analytics` | Analytics overview | App |
| `/analytics/sales` | Sales analytics | App |
| `/analytics/traffic` | Traffic analytics | App |
| `/analytics/customers` | Customer analytics | App |
| `/account/profile` | Profile | App |
| `/account/settings` | Settings | App |
| `/account/notifications` | Notifications | App |
| `/api-test` | API test panel | App |
| `*` | Unknown paths → `/` | — |

## Environment variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Zewbie Universal API base URL | `http://localhost:3000` |

## Project structure

```text
src/
├── App.tsx
├── main.tsx
├── lib/api.ts
├── layouts/
│   ├── MarketingLayout.tsx
│   ├── AuthLayout.tsx
│   ├── OnboardingLayout.tsx
│   └── AppLayout.tsx
└── pages/
    ├── marketing/
    ├── auth/
    ├── onboarding/
    ├── store/
    ├── products/
    ├── orders/
    ├── finances/
    ├── integrations/
    ├── analytics/
    └── account/
```

## Related repositories

- **zewbie-api** — Backend.
- **zewbie-admin**, **zewbie-retailer** — Admin and retailer UIs.
- **zewbie-infra** — Docker + Terraform.

## License

Private (see repository settings).
