# 05. Environment and Deployment

## 5.1 Deployment Model (Current)

- Backend: local always-on runtime on Ubuntu/NAS host
- Public ingress: Cloudflare Tunnel -> API Gateway
- Frontend: Vercel (Preview + Production)

## 5.2 Backend Runtime Prerequisites

- Docker + Docker Compose on backend host
- `.env.always-on` available on host
- Access to NAS middleware endpoints (DB/Redis/Kafka/Eureka)

## 5.3 Backend Always-On Commands

```bash
./scripts/deploy-always-on.sh ./.env.always-on
./scripts/check-always-on-health.sh ./.env.always-on
```

Compose profile:

- `docker-compose.always-on.yml`

## 5.4 Cloudflare Tunnel

Tunnel target should be single gateway service:

- Hostname: `api.<your-domain>`
- Service: `http://localhost:8080`

Key files:

- `docs/deployment/cloudflare-tunnel.md`
- `ops/cloudflared/config.example.yml`

## 5.5 Main Auto-Deploy (Backend)

Workflow file:

- `.github/workflows/deploy-local-main.yml`

Behavior:

- PR to `main`: validate scripts + compose
- Push to `main`: deploy on self-hosted runner
- On failure: rollback to last successful SHA

Runbook:

- `docs/deployment/auto-deploy-main.md`

## 5.6 Frontend Deployment (Vercel)

Required env var for Preview/Production:

- `NEXT_PUBLIC_API_URL=https://api.<your-domain>/api/v1/admin`

Suggested process:

1. Set env vars in Vercel dashboard.
2. Trigger redeploy.
3. Verify login + order list + order detail.

## 5.7 Domain-During-Pending Handling

If domain approval/DNS delegation is pending:

1. Keep backend locally healthy first (`localhost:8080`).
2. Keep Stripe/PayPal webhook secrets empty until domain is live.
3. Finalize tunnel route and webhook endpoints only after domain is active.

## 5.8 Source References

- Backend env template: `.env.always-on.example`
- Backend deploy scripts: `scripts/deploy-always-on.sh`, `scripts/check-always-on-health.sh`
- Frontend env template: `.env.example`
