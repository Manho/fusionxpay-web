# 01. Project Overview

## 1.1 What FusionXPay Is

FusionXPay is a microservices payment platform with a dedicated admin dashboard.

- Backend: Java/Spring Boot microservices
- Frontend: Next.js admin dashboard with marketing landing page (`fusionxpay-web`)
- Runtime direction: local-first always-on backend + Cloudflare Tunnel ingress + Vercel frontend

## 1.2 Business Capabilities

- Merchant authentication and registration with role-aware admin access
- Admin dashboard with global stats and merchant management
- Order query and order detail view with filtering and pagination
- Payment orchestration with provider integrations (Stripe, PayPal)
- Asynchronous notification flow
- AI agent operations through the FusionXPay MCP Server
- Merchant CLI flows for auth, orders, payments, refunds, and confirmations
- 4-layer AI safety chain: input validation, tool constraints, gateway isolation, and output scrubbing
- Kafka-backed audit persistence for both MCP and CLI actions
- Marketing landing page with interactive architecture diagram
- Light/dark theme support across all pages
- Operational visibility with Prometheus/Grafana
- Backup and rollback runbooks for demo/always-on stability

## 1.3 Repositories

- Backend monorepo: [FusionXPay](https://github.com/Manho/FusionXPay)
- Frontend repo: `fusionxpay-web` (this repo)

## 1.4 Runtime Topology (Current Plan)

1. Public user opens frontend on Vercel (`fusionx.fun`).
2. Frontend calls unified API base URL (`https://api.fusionx.fun/api/v1/admin`).
3. Cloudflare Tunnel routes public traffic to local gateway (`localhost:8080`).
4. API Gateway routes requests to internal services.
5. Services use NAS/local middleware endpoints (DB/Redis/Kafka/Eureka).

## 1.5 Environment Strategy

- Primary branch: `main`
- Backend deployment model: always-on compose profile
- Frontend deployment model: Vercel (Preview + Production)
- API ingress model: single gateway domain

## 1.6 Current Constraints

- Domain can be temporarily pending during registration/review.
- Stripe/PayPal secrets may be blank before provider onboarding.
- Fraud-analysis LLM features are still a later-stage enhancement, not part of the current MCP tool set.
- Security model is partially centralized in gateway + admin-service JWT; see `docs/07-security-model.md`.

## 1.7 Success Criteria

- Unified external API domain resolves and serves gateway health endpoint
- Frontend login and order flow available through unified domain
- Auto-deploy + rollback workflow usable from `main`
- Monitoring and backup runbook executable by operator
