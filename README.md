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
  <a href="#screenshots">Screenshots</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#development">Development</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js" alt="Next.js 15">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react" alt="React 19">
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript" alt="TypeScript 5">
  <img src="https://img.shields.io/badge/Tailwind-4-06B6D4?style=flat-square&logo=tailwindcss" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/License-MIT-blue?style=flat-square" alt="MIT License">
</p>

---

## Overview

**FusionXPay Admin Dashboard** is a sleek, enterprise-grade merchant management portal built with Next.js 15 and React 19. It provides merchants and administrators with a powerful interface to monitor transactions, manage orders, and gain insights into payment operations.

```
┌─────────────────────────────────────────────────────────────────┐
│                    FusionXPay Admin Dashboard                    │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────────────────────────────────────────┐ │
│  │          │  │                                              │ │
│  │ Sidebar  │  │              Order List / Details            │ │
│  │          │  │                                              │ │
│  │ • Orders │  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ │ │
│  │ • Stats  │  │  │ Order  │ │ Order  │ │ Order  │ │ Order  │ │ │
│  │ • Users  │  │  │  #001  │ │  #002  │ │  #003  │ │  #004  │ │ │
│  │          │  │  └────────┘ └────────┘ └────────┘ └────────┘ │ │
│  └──────────┘  └──────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

---

## Features

<table>
<tr>
<td width="50%">

### 🔐 Authentication
- JWT-based secure login
- Role-based access control (Admin/Merchant)
- Protected routes with middleware
- Persistent sessions

### 📊 Order Management
- Paginated order listing
- Advanced filtering & search
- Real-time status updates
- Detailed order view with JSON response

</td>
<td width="50%">

### 🎨 Modern UI/UX
- Dark mode enterprise theme
- Responsive design
- shadcn/ui components
- Smooth animations

### ⚡ Performance
- Next.js 15 App Router
- React 19 with Turbopack
- Optimized bundle size
- Edge-ready architecture

</td>
</tr>
</table>

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
# or
pnpm install
# or
bun install
```

### 2. Configure Environment

```bash
# Create environment file
cp .env.example .env.local

# Edit with your API endpoint
# NEXT_PUBLIC_API_URL=http://localhost:8084
```

### 3. Start Development Server

```bash
npm run dev
# or
pnpm dev
# or
bun dev
```

### 4. Open Browser

Visit [http://localhost:3000](http://localhost:3000)

**Test Accounts:**

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@fusionxpay.com | admin123 |
| Merchant | merchant@example.com | merchant123 |

---

## Screenshots

### Login Page
Clean, modern authentication interface with dark theme.

### Order List
Paginated table with status badges, filtering, and search capabilities.

### Order Details
Comprehensive order view with payment information and raw JSON response viewer.

---

## Tech Stack

<table>
<tr>
<td align="center" width="96">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" width="48" height="48" alt="Next.js" />
  <br>Next.js 15
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
│   ├── app/                  # Next.js App Router
│   │   ├── login/           # Login page
│   │   ├── orders/          # Order list & details
│   │   ├── layout.tsx       # Root layout
│   │   └── page.tsx         # Home redirect
│   ├── components/
│   │   ├── layout/          # Sidebar, Navbar
│   │   └── ui/              # shadcn/ui components
│   ├── contexts/            # React contexts (Auth)
│   ├── lib/                 # Utilities & API client
│   └── types/               # TypeScript definitions
├── public/                  # Static assets
├── .env.example            # Environment template
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
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API endpoint | `http://localhost:8084` |

---

## Related Projects

| Project | Description |
|---------|-------------|
| [FusionXPay](https://github.com/Manho/FusionXPay) | Backend microservices |

---

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

---

<p align="center">
  <a href="https://github.com/Manho/fusionxpay-web/issues">Report Bug</a> •
  <a href="https://github.com/Manho/fusionxpay-web/issues">Request Feature</a>
</p>
