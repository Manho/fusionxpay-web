# 04. Frontend Application Guide

## 4.1 Stack

- Next.js `16.1.4`
- React `19`
- TypeScript `5`
- Tailwind CSS `4`
- Axios + cookie-based token handling

## 4.2 Route Map

| Route | Description |
|---|---|
| `/` | Landing page (marketing site) |
| `/login` | Login page |
| `/register` | Merchant registration page |
| `/dashboard` | Admin dashboard with global stats and order summary |
| `/dashboard/merchants/[id]` | Merchant detail page |
| `/orders` | Order list with pagination/filter |
| `/orders/[id]` | Order detail |
| `/settings` | Account and system settings |
| `/docs/[[...slug]]` | Documentation viewer (embedded docs) |
| `/error` | Global error page |
| `/orders/error` | Orders scoped error page |

## 4.3 Landing Page

The landing page (`/`) is a fully-featured marketing site built with 15 components:

| Component | Purpose |
|---|---|
| `Navigation` | Fixed nav with glass morphism, theme switcher, and mobile menu |
| `Hero` | Animated hero with stats counters and dashboard preview |
| `LogoMarquee` | Scrolling partner/tech logo strip |
| `Features` | Feature cards with icons and hover effects |
| `Architecture` | Interactive microservices architecture diagram |
| `HowItWorks` | Step-by-step integration flow |
| `ProjectHighlights` | Key project statistics and highlights |
| `TechStack` | Technology stack showcase |
| `Testimonials` | User testimonials section |
| `Pricing` | Pricing tiers (placeholder) |
| `CTA` | Call-to-action section |
| `Footer` | Site footer with links |

**Design system:**
- Brand color: `#2d1ef5` (electric blue) with `#7b6fff` accent
- Glassmorphism effects (`glass`, `glass-dark` CSS classes)
- Smooth animations (`float`, `marquee`, `reveal-up`, `scale-in`)
- Light/dark theme support via `ThemeModeSwitcher`

## 4.4 API Integration Entry

- API client: `src/lib/api.ts`
- Admin utilities: `src/lib/admin.ts`
- Base URL source: `NEXT_PUBLIC_API_URL`
- Local fallback: `http://localhost:8080/api/v1/admin`
- Auth header injection: `Authorization: Bearer <token>`

## 4.5 Authentication in Frontend

- Token cookie key: `fusionxpay_admin_token`
- User cookie key: `fusionxpay_admin_user`
- Cookie helper: `src/lib/auth.ts`
- Route guard middleware: `src/middleware.ts`
  - No token -> redirect to `/login`
  - Has token and visit `/login` -> redirect to `/orders`

## 4.6 Data Contracts

Main types are defined in:

- `src/types/index.ts`

Includes:

- `LoginRequest`, `LoginResponse`, `MerchantInfo`
- `Order`, `OrderDetail`, `PageResponse<T>`

## 4.7 UI Components

- Landing page components under `src/components/landing/`
- Theme switcher under `src/components/theme/`
- Order table and status badge components under `src/components/orders/`
- Layout shell components under `src/components/layout/`
- Shared UI primitives under `src/components/ui/`

## 4.8 Environment Variables

File template:

- `.env.example`

Required variable:

- `NEXT_PUBLIC_API_URL`

Recommended production value:

- `https://api.<your-domain>/api/v1/admin`

## 4.9 Source References

- Routes: `src/app/**`
- Landing page: `src/components/landing/**`
- API client: `src/lib/api.ts`
- Admin utilities: `src/lib/admin.ts`
- Auth storage: `src/lib/auth.ts`
- Middleware: `src/middleware.ts`
- Types: `src/types/index.ts`
- Theme: `src/components/theme/**`
- Global styles: `src/app/globals.css`
