# 10. Appendix: File Map and Command Cheatsheet

## 10.1 Backend Key Files (Source of Truth)

### Gateway

- `services/api-gateway/src/main/resources/application.yml`
- `services/api-gateway/src/main/java/com/fusionxpay/api/gateway/filter/ApiKeyAuthFilter.java`
- `services/api-gateway/src/main/java/com/fusionxpay/api/gateway/config/SecurityConfig.java`
- `services/api-gateway/src/main/java/com/fusionxpay/api/gateway/controller/AuthController.java`

### Admin

- `services/admin-service/src/main/resources/application.yml`
- `services/admin-service/src/main/java/com/fusionxpay/admin/config/SecurityConfig.java`
- `services/admin-service/src/main/java/com/fusionxpay/admin/security/JwtTokenProvider.java`
- `services/admin-service/src/main/java/com/fusionxpay/admin/controller/AuthController.java`
- `services/admin-service/src/main/java/com/fusionxpay/admin/controller/OrderController.java`

### Order / Payment / Notification

- `services/order-service/src/main/java/com/fusionxpay/order/controller/OrderController.java`
- `services/payment-service/src/main/java/com/fusionxpay/payment/controller/PaymentController.java`
- `services/payment-service/src/main/java/com/fusionxpay/payment/controller/StripeWebhookController.java`
- `services/payment-service/src/main/java/com/fusionxpay/payment/controller/PayPalCallbackController.java`
- `services/notification-service/src/main/java/com/fusionxpay/notification/controller/NotificationController.java`

### Deployment / Ops

- `docker-compose.always-on.yml`
- `docker-compose.monitoring.yml`
- `.env.always-on.example`
- `scripts/deploy-always-on.sh`
- `scripts/check-always-on-health.sh`
- `scripts/deploy-local-main.sh`
- `scripts/rollback-local-main.sh`
- `scripts/backup-mysql.sh`
- `scripts/restore-mysql.sh`

### Backend Docs

- `docs/deployment/local-always-on.md`
- `docs/deployment/cloudflare-tunnel.md`
- `docs/deployment/auto-deploy-main.md`
- `docs/operations/local-observability-backup.md`
- `docs/operations/phase3-acceptance-checklist.md`

## 10.2 Frontend Key Files

### App Routes

- `src/app/page.tsx` — Landing page (marketing site)
- `src/app/login/page.tsx`
- `src/app/register/page.tsx`
- `src/app/dashboard/page.tsx`
- `src/app/dashboard/merchants/[id]/page.tsx`
- `src/app/orders/page.tsx`
- `src/app/orders/[id]/page.tsx`
- `src/app/settings/page.tsx`
- `src/app/docs/[[...slug]]/page.tsx`

### Landing Page Components

- `src/components/landing/Navigation.tsx`
- `src/components/landing/Hero.tsx`
- `src/components/landing/Features.tsx`
- `src/components/landing/Architecture.tsx`
- `src/components/landing/HowItWorks.tsx`
- `src/components/landing/LogoMarquee.tsx`
- `src/components/landing/ProjectHighlights.tsx`
- `src/components/landing/TechStack.tsx`
- `src/components/landing/Testimonials.tsx`
- `src/components/landing/Pricing.tsx`
- `src/components/landing/CTA.tsx`
- `src/components/landing/Footer.tsx`

### Core Libraries

- `src/lib/api.ts`
- `src/lib/auth.ts`
- `src/lib/admin.ts`
- `src/middleware.ts`
- `src/types/index.ts`

### Theme & Styles

- `src/components/theme/ThemeModeSwitcher.tsx`
- `src/app/globals.css`

### CI / Config

- `.env.example`
- `.github/workflows/frontend-ci.yml`
- `.github/workflows/frontend-ci-full.yml`

## 10.3 Command Cheatsheet

### Backend runtime

```bash
./scripts/deploy-always-on.sh ./.env.always-on
./scripts/check-always-on-health.sh ./.env.always-on
```

### Backend monitoring

```bash
docker compose --env-file .env.always-on \
  -f docker-compose.always-on.yml \
  -f docker-compose.monitoring.yml \
  up -d prometheus grafana
```

### Frontend local

```bash
npm ci
npm run dev
npm run lint
npm run test -- --run
npm run build
```

### Cloudflare tunnel quick verify

```bash
curl http://localhost:8080/actuator/health
curl https://api.<your-domain>/actuator/health
```
