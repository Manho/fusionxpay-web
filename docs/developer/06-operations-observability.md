# 06. Operations, Observability, Backup

## 6.1 Monitoring Stack

FusionXPay includes a local monitoring profile:

- Prometheus
- Grafana

Compose file:

- `docker-compose.monitoring.yml`

## 6.2 Start Monitoring

```bash
docker compose \
  --env-file .env.always-on \
  -f docker-compose.always-on.yml \
  -f docker-compose.monitoring.yml \
  up -d prometheus grafana
```

## 6.3 Verify Monitoring

```bash
curl -fsS http://localhost:${PROMETHEUS_PORT:-9090}/-/healthy
curl -fsS http://localhost:${PROMETHEUS_PORT:-9090}/api/v1/targets
curl -fsS http://localhost:${GRAFANA_PORT:-3001}/api/health
```

Expected:

- Prometheus healthy
- All configured targets are `UP`
- Grafana database status is OK

## 6.4 Logs and Incident Triage

Quick checks:

```bash
docker logs --tail 200 fusionxpay-api-gateway
docker logs --tail 200 fusionxpay-payment-service
docker logs --tail 200 fusionxpay-order-service
docker logs --tail 200 fusionxpay-notification-service
docker logs --tail 200 fusionxpay-admin-service
```

Live logs:

```bash
docker compose --env-file .env.always-on -f docker-compose.always-on.yml logs -f
```

## 6.5 Backup and Restore (MySQL)

Backup:

```bash
./scripts/backup-mysql.sh ./.env.always-on
```

Restore:

```bash
RESTORE_CONFIRM=YES ./scripts/restore-mysql.sh ./backups/mysql/<backup-file>.sql.gz ./.env.always-on
```

Notes:

- Backup retention is controlled by `BACKUP_RETENTION_COUNT`.
- Restore requires explicit confirmation variable.

## 6.6 Acceptance Checklist

Use:

- `docs/operations/phase3-acceptance-checklist.md`

It covers:

- Gateway health
- Frontend flow
- Webhook reachability
- Deploy + rollback
- Monitoring + logs
- Backup + restore
- Long-running stability target

## 6.7 Source References

- Runbook: `docs/operations/local-observability-backup.md`
- Prometheus config: `monitoring/prometheus/prometheus.yml`
- Grafana provisioning: `monitoring/grafana/provisioning/**`
- Dashboard: `monitoring/grafana/dashboards/fusionxpay-overview.json`
