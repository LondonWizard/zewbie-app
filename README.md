# Zewbie — User / Creator Portal

**Creator and end-user** experience for building a store, managing products sourced from retailers, orders, payouts, integrations, and analytics. Stack: **React 19**, **Vite 8**, **TypeScript**, **TailwindCSS v4**, **React Router v7**, **Axios**, **TanStack Query**, **Zustand**, **Craft.js**. Features **dark mode**, **skeleton loading screens**, **WCAG 2.1 AA accessibility**, and a **5-step onboarding wizard**.

**Live:** [https://app.zewbie.com](https://app.zewbie.com)

## Quick start

```powershell
git clone <repository-url>
cd zewbie-app
npm install
copy .env.example .env
npm run dev
```

Dev server: **`http://localhost:5173`** (`vite.config.ts`).

## Architecture

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **UI Framework** | React 19 | Component rendering |
| **Build** | Vite 8 | Dev server + production bundling |
| **Styling** | Tailwind CSS v4 | Utility-first CSS |
| **Routing** | react-router-dom v7 | Client-side routing with 37+ pages |
| **State** | Zustand | Global state management |
| **Data Fetching** | TanStack Query + Axios | Server state with caching |
| **Store Builder** | Craft.js | Drag-and-drop page editor |
| **Icons** | Lucide React | Consistent icon set |

### Layouts

| Layout | Use |
|--------|-----|
| **`MarketingLayout`** | Public marketing: landing, pricing, features. |
| **`AuthLayout`** | Login, register, password reset, email verification (`/auth/*`). |
| **`OnboardingLayout`** | Post-signup onboarding wizard. |
| **`AppLayout`** | Authenticated creator dashboard (sidebar). |
| **`lib/api.ts`** | API client with `VITE_API_URL` and auth token handling. |

## Key Features

### Store Builder (Craft.js)
- **Drag-and-drop blocks**: Text, Image, Button, Container, Columns, Hero, Product Grid, Divider, Video
- **Settings panels**: Each block has a property editor (color, font size, alignment, etc.)
- **Undo/redo**: Full history via Craft.js history API
- **Auto-save**: Debounced 3-second auto-save to API
- **Version history**: Sidebar showing saved versions with restore capability
- **5 templates**: Minimal Elegance, Luxury Gold, Bold Statement, Classic Tradition, Modern Edge
- **Viewport switching**: Desktop, tablet, mobile preview modes
- **Color/font presets**: 6 color presets + 10 font families in Store Settings

### Product Catalog
- Browse master catalog with search, category filtering, and sorting
- Product detail with image gallery, description, variants
- **Pricing calculator**: Shows markup %, customer price, your commission, platform fee
- Add products to store with custom markup (10-45%)
- Manage store products: visibility toggle, custom descriptions, markup editing

### Order Management
- Order list with status filtering and search
- Order detail with status timeline, shipping info, payment breakdown
- Price breakdown showing subtotal, tax, shipping, commission

### Finances
- Revenue dashboard with period comparison (7d/30d/90d)
- Top products by revenue
- Payout history with status tracking
- Stripe Connect Express onboarding flow

### Integrations
- Instagram, TikTok, Facebook, Pinterest, YouTube
- Connect/disconnect with OAuth flow
- Catalog sync toggle per platform

### Analytics
- Overview with visitors, page views, orders, revenue
- Sales, traffic, and customer detail views

### Account
- Profile management with avatar
- Security settings (2FA, password)
- Notification center with read/unread state
- Language preferences

### UX Polish
- **Dark mode**: System preference detection + manual toggle, persisted in localStorage
- **Skeleton screens**: Shimmer loading placeholders for dashboard, product catalog, orders, and all data-heavy pages
- **Onboarding wizard**: 5-step guided setup (Profile → Store → Template → Products → Payment)
- **Accessibility**: Focus rings, ARIA labels, keyboard navigation, color contrast (WCAG 2.1 AA)
- **Responsive**: Mobile-first layouts, collapsible sidebar, touch-friendly targets

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
| `/store/editor` | Store editor (Craft.js) | App |
| `/store/pages` | Store pages | App |
| `/store/pages/:id/edit` | Edit store page | App |
| `/store/templates` | Template gallery (5 templates) | App |
| `/store/domain` | Custom domain + DNS | App |
| `/store/settings` | Branding, SEO, analytics | App |
| `/products/catalog` | Product catalog | App |
| `/products/catalog/:id` | Catalog product detail | App |
| `/products/mine` | My products | App |
| `/products/mine/:id` | Edit my product | App |
| `/orders` | Orders | App |
| `/orders/stats` | Order stats | App |
| `/orders/:id` | Order detail | App |
| `/finances/payouts` | Payouts | App |
| `/finances/payouts/setup` | Stripe Connect setup | App |
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
| `VITE_API_URL` | Zewbie Universal API base URL (with `/v1` suffix) | `http://localhost:3000/v1` |

## Security & Architecture

### Authentication
- **`src/lib/auth.tsx`** — `AuthProvider` / `useAuth()` context storing token + user info; `login()`, `logout()` helpers; syncs across tabs via `storage` event.
- **`ProtectedRoute`** (in `App.tsx`) — redirects unauthenticated users to `/auth/login` for all `/dashboard`, `/store/*`, `/orders/*`, etc. routes.
- **`src/lib/api.ts`** — Axios interceptor clears token and redirects to `/auth/login` on any 401 response.

### XSS Mitigations
- **`VideoBlock`** — allowlist-only URL validation (YouTube/Vimeo hostnames) + `sandbox` attribute on iframe; shows placeholder for blocked URLs.
- **`ButtonBlock`** — `sanitizeHref()` rejects `javascript:`, `data:`, `vbscript:` schemes.

### Error Handling
- **`ErrorBoundary`** (`src/components/ErrorBoundary.tsx`) — class component wrapping each layout; shows friendly fallback + "Try Again" + error details in DEV.
- **`Toast`** (`src/components/Toast.tsx`) — `ToastProvider` / `useToast()` for auto-dismissing success/error notifications.

### Code Splitting
All page components are loaded via `React.lazy()` with a shared `<Suspense>` loading fallback.

### Reusable Components
- **`StatCardGrid`** (`src/components/StatCardGrid.tsx`) — shared stat card grid used across Dashboard, OrderStats, Revenue, AnalyticsOverview.
- All store builder blocks are wrapped in `React.memo` for render performance.

### Accessibility
- Template preview modal has `role="dialog"`, `aria-modal`, `aria-labelledby`, focus trap, and escape-to-close.
- Form inputs on Onboarding and Profile use `htmlFor`/`id` pairings.
- Icon-only buttons on StorePages, MyProducts, and Profile have `aria-label` attributes.

### Responsive Design
- `AppLayout` — hidden sidebar on mobile with hamburger toggle + overlay.
- `MarketingLayout` — collapsible mobile nav with hamburger menu.

## Project structure

```text
src/
├── App.tsx                      # Root component with all routes, ProtectedRoute, Suspense
├── main.tsx                     # React entry point
├── lib/
│   ├── api.ts                   # Axios instance with auth + 401 redirect interceptors
│   └── auth.tsx                 # AuthProvider context, useAuth hook
├── components/
│   ├── ErrorBoundary.tsx        # React error boundary with fallback UI
│   ├── Toast.tsx                # Toast notification provider + useToast hook
│   └── StatCardGrid.tsx         # Reusable stat card grid component
├── layouts/                     # Layout shells (Marketing, Auth, App, etc.)
├── store-builder/               # Craft.js store editor
│   ├── StoreBuilder.tsx         # Main editor component
│   ├── components/              # Draggable block components
│   │   ├── Container.tsx
│   │   ├── TextBlock.tsx
│   │   ├── ImageBlock.tsx
│   │   ├── ButtonBlock.tsx
│   │   ├── HeroBlock.tsx
│   │   ├── ProductGridBlock.tsx
│   │   ├── DividerBlock.tsx
│   │   ├── VideoBlock.tsx
│   │   └── ColumnsBlock.tsx
│   ├── settings/                # Property editor panels per block
│   ├── panels/                  # Toolbox, SettingsPanel, TopBar
│   ├── hooks/                   # useAutoSave, useVersionHistory
│   └── templates/               # 5 pre-built store templates
└── pages/                       # All page components
    ├── Dashboard.tsx
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

- **zewbie-api** — NestJS backend with Prisma, Clerk auth, Sentry.
- **zewbie-admin**, **zewbie-retailer** — Admin and retailer UIs.
- **zewbie-infra** — Docker + Terraform.

## License

Private (see repository settings).
