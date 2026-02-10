# 09. Troubleshooting Guide

## 9.1 Frontend Login Redirect Loop

Symptoms:

- Always redirected to `/login` even after login.

Checks:

1. Confirm cookie `fusionxpay_admin_token` exists.
2. Confirm `NEXT_PUBLIC_API_URL` points to admin API base.
3. Confirm backend returns JWT in login response.

## 9.2 Gateway Returns 401

Symptoms:

- API requests fail with Unauthorized.

Checks:

1. Verify `X-API-Key` behavior at gateway if path is protected.
2. Verify admin JWT token validity/expiration.
3. Verify `JWT_SECRET` consistency across admin-service instances.

## 9.3 Cloudflare Tunnel Route Not Reachable

Symptoms:

- `https://api.<domain>` not reachable.

Checks:

1. Domain is active in Cloudflare and nameserver delegation completed.
2. Tunnel route points to `http://localhost:8080`.
3. Local health endpoint works: `curl http://localhost:8080/actuator/health`.
4. `cloudflared` service is running and enabled.

## 9.4 Deployment Fails on Main

Symptoms:

- Deploy workflow fails after push.

Checks:

1. `.env.always-on` exists on self-hosted runner host.
2. `docker compose ... config` passes with current env.
3. `scripts/check-always-on-health.sh` can reach gateway locally.
4. Inspect rollback script output for last successful SHA behavior.

## 9.5 Monitoring Targets Down

Symptoms:

- Prometheus targets show DOWN.

Checks:

1. Ensure both app compose and monitoring compose are up.
2. Verify service names/ports in `monitoring/prometheus/prometheus.yml`.
3. Verify application actuator endpoint exposure includes prometheus.

## 9.6 Backup/Restore Errors

Symptoms:

- Backup or restore script exits early.

Checks:

1. Confirm DB env vars in `.env.always-on` are valid.
2. For restore, set `RESTORE_CONFIRM=YES` explicitly.
3. Confirm backup file path and extension (`.sql` or `.sql.gz`).

## 9.7 High-Level Debug Sequence

1. Verify service health endpoint.
2. Verify gateway route behavior.
3. Verify auth headers/token.
4. Verify logs for failing service.
5. Verify dependency connectivity (DB/Redis/Kafka/Eureka).
