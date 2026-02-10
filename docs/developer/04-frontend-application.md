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
| `/` | Redirects to `/orders` |
| `/login` | Login page |
| `/orders` | Order list with pagination/filter |
| `/orders/[id]` | Order detail |
| `/error` | Global error page |
| `/orders/error` | Orders scoped error page |

## 4.3 API Integration Entry

- API client: `src/lib/api.ts`
- Base URL source: `NEXT_PUBLIC_API_URL`
- Local fallback: `http://localhost:8080/api/v1/admin`
- Auth header injection: `Authorization: Bearer <token>`

## 4.4 Authentication in Frontend

- Token cookie key: `fusionxpay_admin_token`
- User cookie key: `fusionxpay_admin_user`
- Cookie helper: `src/lib/auth.ts`
- Route guard middleware: `src/middleware.ts`
  - No token -> redirect to `/login`
  - Has token and visit `/login` -> redirect to `/orders`

## 4.5 Data Contracts

Main types are defined in:

- `src/types/index.ts`

Includes:

- `LoginRequest`, `LoginResponse`, `MerchantInfo`
- `Order`, `OrderDetail`, `PageResponse<T>`

## 4.6 UI Components

- Order table and status badge components under `src/components/orders/`
- Layout shell components under `src/components/layout/`
- Shared UI primitives under `src/components/ui/`

## 4.7 Environment Variables

File template:

- `.env.example`

Required variable:

- `NEXT_PUBLIC_API_URL`

Recommended production value:

- `https://api.<your-domain>/api/v1/admin`

## 4.8 Source References

- Routes: `src/app/**`
- API client: `src/lib/api.ts`
- Auth storage: `src/lib/auth.ts`
- Middleware: `src/middleware.ts`
- Types: `src/types/index.ts`
