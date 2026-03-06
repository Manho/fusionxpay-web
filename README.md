<p align="center">
  <img src="public/logo.svg" alt="FusionXPay" width="96" height="96">
</p>

<h1 align="center"><a href="https://fusionx.fun/">FusionXPay Frontend</a></h1>

<p align="center">
  <strong>Next.js application powering the FusionXPay platform — landing page, admin dashboard, order management, and embedded documentation in one codebase.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js" alt="Next.js 16">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react" alt="React 19">
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript" alt="TypeScript 5">
  <img src="https://img.shields.io/badge/Tailwind-4-06B6D4?style=flat-square&logo=tailwindcss" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/Tests-Vitest%20%2B%20Playwright-6E56CF?style=flat-square" alt="Vitest and Playwright">
</p>

---

## Overview

This single Next.js codebase ships everything users and operators see: the public landing page, authentication, merchant dashboard, order management, and a built-in docs viewer.

Having everything in one place means shared design tokens, a single deployment pipeline, and consistent branding — while public pages and protected admin routes remain cleanly separated.

## What's Inside

| Surface | Routes | What it does |
|---------|--------|--------------|
| Landing page | `/` | Product overview, animated architecture diagrams, feature highlights |
| Authentication | `/login`, `/register` | JWT-based login with protected route middleware |
| Dashboard | `/dashboard` | Merchant and transaction overview with real-time stats |
| Orders | `/orders`, `/orders/[id]` | Filterable table, status badges, detail drill-down with JSON viewer |
| Docs | `/docs` | Embedded documentation reader (mirrors backend architecture docs) |

## Quick Start

### Prerequisites

| Requirement | Version |
|-------------|---------|
| Node.js | 18.17+ |
| npm | 9+ |
| Backend API | [FusionXPay](https://github.com/Manho/FusionXPay) or compatible admin endpoint |

### Setup

```bash
git clone https://github.com/Manho/fusionxpay-web.git
cd fusionxpay-web
npm install
cp .env.example .env.local
```

Set `NEXT_PUBLIC_API_URL` in `.env.local` to point at the admin API. The checked-in example targets a deployed endpoint; for local development:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1/admin
```

### Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Quality Checks

```bash
npm run lint        # ESLint
npm run test        # Vitest component tests
npm run test:e2e    # Playwright end-to-end
```

## How It Connects to the Backend

| Frontend area | Backend relationship |
|---------------|----------------------|
| Landing page | Visualizes the platform architecture and microservices topology |
| Login / Register | Authenticates against admin JWT endpoints |
| Dashboard & Orders | Consumes admin-facing REST APIs for merchant and transaction data |
| Docs viewer | Renders the same architecture, security, and operations docs from the backend |

The stack is straightforward: **React 19** handles rendering and client interaction, **Next.js 16** provides the application framework (App Router, server rendering, bundling).

## Project Structure

```text
fusionxpay-web/
├── src/app/                  # App Router — landing, auth, dashboard, orders, docs
├── src/components/landing/   # Landing page sections and animations
├── src/components/layout/    # Dashboard shell, sidebar, navbar
├── src/components/orders/    # Order table, status badges, detail views
├── src/components/theme/     # Theme controller (light/dark)
├── src/components/ui/        # Shared primitives (buttons, cards, modals)
├── src/lib/                  # API client, auth helpers, utilities
├── docs/                     # Documentation content (user guide + developer)
├── tests/e2e/                # Playwright test specs
└── .github/workflows/        # CI pipelines
```

## Documentation

| Document | Purpose |
|----------|---------|
| [Docs Hub](./docs/README.md) | Entry point for all documentation |
| [User Guide](./docs/user-guide/README.md) | Merchant and integrator guidance |
| [Developer Docs](./docs/developer/README.md) | Architecture, environment, testing, operations |
| [Architecture & Services](./docs/developer/02-architecture-and-services.md) | How the backend system is structured |
| [Testing & CI/CD](./docs/developer/08-testing-and-ci.md) | Quality automation overview |

## Related

| Project | Description |
|---------|-------------|
| [FusionXPay Backend](https://github.com/Manho/FusionXPay) | Java/Spring microservices payment platform |
