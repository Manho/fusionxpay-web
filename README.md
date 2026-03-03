<p align="center">
  <img src="public/logo.svg" alt="FusionXPay Admin" width="80" height="80">
</p>

<h1 align="center">FusionXPay Admin Dashboard</h1>

<p align="center">
  <strong>Modern Merchant Management Portal for FusionXPay Payment Gateway</strong>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#quick-start">Quick Start</a> •
  <a href="#architecture">Architecture</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#development">Development</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js" alt="Next.js 16">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react" alt="React 19">
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript" alt="TypeScript 5">
  <img src="https://img.shields.io/badge/Tailwind-4-06B6D4?style=flat-square&logo=tailwindcss" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/License-MIT-blue?style=flat-square" alt="MIT License">
</p>

---

## Overview

**FusionXPay Admin Dashboard** is a sleek, enterprise-grade merchant management portal built with Next.js 16 and React 19. It provides merchants and administrators with a powerful interface to monitor transactions, manage orders, and gain insights into payment operations.

The project includes a **full-featured landing page** with interactive architecture diagrams, animated stats, glassmorphism design, and light/dark theme support.

## 📚 Documentation

**[→ Complete Documentation Hub](./docs/README.md)**

| For Merchants & Integrators | For Developers & Contributors |
|------------------------------|-------------------------------|
| 📘 **[User Guide](./docs/user-guide/README.md)** | 🔧 **[Developer Docs](./docs/developer/README.md)** |
| • [Quick Start (5 min)](./docs/user-guide/quick-start.md) | • [Architecture & Services](./docs/developer/02-architecture-and-services.md) |
| • [API Basics](./docs/user-guide/api-basics.md) | • [Environment Setup](./docs/developer/05-environment-and-deployment.md) |
| • [Webhooks Guide](./docs/user-guide/webhooks.md) | • [Security Model](./docs/developer/07-security-model.md) |
| • [FAQ](./docs/user-guide/faq.md) | • [Testing & CI/CD](./docs/developer/08-testing-and-ci.md) |

---

## Features

<table>
<tr>
<td width="50%">

### 🔐 Authentication
- JWT-based secure login & registration
- Role-based access control (Admin/Merchant)
- Protected routes with middleware
- Persistent sessions via cookies

### 📊 Dashboard & Orders
- Global stats dashboard with merchant overview
- Paginated order listing with filtering & search
- Real-time status updates with badges
- Detailed order view with JSON response viewer

</td>
<td width="50%">

### 🎨 Modern UI/UX
- Light & dark mode with theme switcher
- Glassmorphism cards and navigation
- Responsive design for all screen sizes
- Smooth micro-animations and transitions
- Electric blue/purple brand palette

### ⚡ Landing Page
- Interactive architecture diagram
- Animated stat counters
- Logo marquee, tech stack showcase
- Features, testimonials, pricing sections
- Full SEO-ready marketing site

</td>
</tr>
</table>

---

## Architecture

FusionXPay uses a microservices architecture with 5 backend services:

```
                    ┌──────────────────────┐
                    │   Cloudflare Tunnel   │
                    └──────────┬───────────┘
                               │
                    ┌──────────▼───────────┐
                    │    API Gateway :8080  │
                    └──┬───┬───┬───┬───────┘
                       │   │   │   │
          ┌────────────┘   │   │   └────────────┐
          ▼                ▼   ▼                ▼
   ┌──────────┐   ┌────────┐  ┌─────────┐  ┌──────────────┐
   │  Admin   │   │ Order  │  │ Payment │  │ Notification │
   │ :8084    │   │ :8082  │  │ :8081   │  │   :8083      │
   └──────────┘   └────────┘  └─────────┘  └──────────────┘
          │            │           │              │
          └────────────┴─────┬─────┴──────────────┘
                             │
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
          ┌───────┐    ┌─────────┐    ┌─────────┐
          │ MySQL │    │  Redis  │    │  Kafka  │
          └───────┘    └─────────┘    └─────────┘
```

> See the interactive version on the [landing page](https://fusionx.fun) or in the [Architecture docs](./docs/developer/02-architecture-and-services.md).

---

## Quick Start

### Prerequisites

| Requirement | Version |
|-------------|---------|
| Node.js | 18.17+ |
| npm / pnpm / bun | Latest |
| Backend API | [FusionXPay](https://github.com/Manho/FusionXPay) running |

### 1. Clone & Install

```bash
git clone https://github.com/Manho/fusionxpay-web.git
cd fusionxpay-web

# Install dependencies
npm install
```

### 2. Configure Environment

```bash
# Create environment file
cp .env.example .env.local

# Edit with your API endpoint
# Local:
# NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1/admin
#
# Production:
# NEXT_PUBLIC_API_URL=https://api.<your-domain>/api/v1/admin
```

### 3. Start Development Server

```bash
npm run dev
```

### 4. Open Browser

Visit [http://localhost:3000](http://localhost:3000) — you'll see the landing page.

**Test Accounts:**

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@fusionxpay.com | admin123 |
| Merchant | merchant@example.com | merchant123 |

---

## Screenshots

### Landing Page
Modern marketing site with glassmorphism design, animated statistics, and interactive architecture diagrams. Supports both light and dark themes.

### Dashboard
Admin dashboard with global stats overview, merchant management, and order summary charts.

### Order Management
Paginated table with status badges, advanced filtering, and comprehensive order detail view with JSON response viewer.

---

## Tech Stack

<table>
<tr>
<td align="center" width="96">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" width="48" height="48" alt="Next.js" />
  <br>Next.js 16
</td>
<td align="center" width="96">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="48" height="48" alt="React" />
  <br>React 19
</td>
<td align="center" width="96">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" width="48" height="48" alt="TypeScript" />
  <br>TypeScript
</td>
<td align="center" width="96">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg" width="48" height="48" alt="Tailwind" />
  <br>Tailwind CSS
</td>
</tr>
</table>

**Core Dependencies:**

| Package | Purpose |
|---------|---------|
| `next` | React framework with App Router |
| `react` | UI library |
| `tailwindcss` | Utility-first CSS |
| `shadcn/ui` | Accessible UI components |
| `axios` | HTTP client |
| `zod` | Schema validation |
| `lucide-react` | Icon library |

---

## Project Structure

```
fusionxpay-web/
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── page.tsx             # Landing page (marketing site)
│   │   ├── login/               # Login page
│   │   ├── register/            # Registration page
│   │   ├── dashboard/           # Admin dashboard & merchant detail
│   │   ├── orders/              # Order list & details
│   │   ├── settings/            # Settings page
│   │   ├── docs/                # Embedded documentation viewer
│   │   ├── layout.tsx           # Root layout with theme provider
│   │   └── globals.css          # Global styles & design tokens
│   ├── components/
│   │   ├── landing/             # Landing page components (15 files)
│   │   ├── layout/              # Sidebar, Navbar
│   │   ├── orders/              # Order table, status badges
│   │   ├── theme/               # Theme mode switcher
│   │   └── ui/                  # shadcn/ui components
│   ├── lib/                     # API client, auth, admin utilities
│   └── types/                   # TypeScript definitions
├── public/                      # Static assets (logo, icons)
├── docs/                        # Documentation (developer + user guide)
├── tests/                       # E2E tests (Playwright)
├── .github/                     # CI/CD workflows
├── .env.example                 # Environment template
└── package.json
```

---

## Development

### Available Scripts

```bash
# Development with Turbopack
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Type check
npx tsc --noEmit

# Unit tests
npm run test

# E2E tests
npm run test:e2e
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL for admin endpoints | `http://localhost:8080/api/v1/admin` |

### Vercel Environment Setup

Set the same variable name in Vercel for both environments:

1. Preview: `NEXT_PUBLIC_API_URL=https://api.<your-domain>/api/v1/admin`
2. Production: `NEXT_PUBLIC_API_URL=https://api.<your-domain>/api/v1/admin`

---

## Related Projects

| Project | Description |
|---------|-------------|
| [FusionXPay](https://github.com/Manho/FusionXPay) | Backend microservices (Java/Spring Boot) |

---

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

---

<p align="center">
  <a href="https://github.com/Manho/fusionxpay-web/issues">Report Bug</a> •
  <a href="https://github.com/Manho/fusionxpay-web/issues">Request Feature</a>
</p>
