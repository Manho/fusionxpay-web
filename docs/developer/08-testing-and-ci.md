# 08. Testing and CI

## 8.1 Frontend Local Test Commands

```bash
npm ci
npm run lint
npx tsc --noEmit
npm run test -- --run
npm run build
npm run test:e2e
```

## 8.2 Frontend CI Workflows

### PR workflow

- File: `.github/workflows/frontend-ci.yml`
- Trigger: pull requests to `main` / `feature/*` on frontend paths
- Steps:
  - install dependencies
  - lint
  - type check
  - unit tests
  - Playwright smoke test

### Full workflow

- File: `.github/workflows/frontend-ci-full.yml`
- Trigger: `main` push, nightly schedule, manual dispatch
- Steps:
  - lint + type check
  - full unit tests with coverage
  - full E2E suite

## 8.3 Backend Local Verification (Common)

```bash
# Script checks
bash -n scripts/deploy-always-on.sh scripts/check-always-on-health.sh

# Compose render checks
docker compose --env-file .env.always-on.example -f docker-compose.always-on.yml config >/dev/null

# Build impacted services
mvn -pl services/admin-service,services/payment-service,services/notification-service -am -DskipTests package
```

## 8.4 Backend CI Highlights

### Backend PR CI

- File: `.github/workflows/backend-ci.yml`
- Includes:
  - MySQL + Redis service containers
  - unit tests
  - payment-service smoke integration test

### Main deploy CI/CD

- File: `.github/workflows/deploy-local-main.yml`
- Includes:
  - PR validation of scripts + compose
  - push-to-main deploy on self-hosted runner
  - smoke check + successful SHA mark
  - rollback on failure

## 8.5 Recommended Release Gate

Before release/demo cut:

1. Frontend PR CI green
2. Backend PR CI green
3. Deploy validation green
4. Manual smoke: login, list orders, order detail
5. Gateway health + monitoring target checks
