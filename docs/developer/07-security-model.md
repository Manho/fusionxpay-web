# 07. Security Model

## 7.1 Current Security Controls

### Edge / Ingress

- Cloudflare Tunnel terminates public traffic and forwards to local gateway.
- No router port-forwarding required for inbound public traffic.

### Gateway Layer

- Global JWT filter validates bearer tokens for merchant and admin flows.
- Gateway injects `X-Merchant-Id` and related merchant context downstream.
- Gateway also carries route-level service segmentation and rate limiting.

### Admin Auth Layer

- `admin-service` issues and validates JWT.
- Stateless security session.
- Role-aware order query behavior in admin endpoints.

### Provider Callback Layer

- Stripe callback expects `Stripe-Signature`.
- PayPal callback flow validates transmission data in provider integration path.

### Secrets and Runtime

- Secrets are supplied via environment files on runtime host.
- `.env.always-on` should never be committed.

## 7.2 AI Safety Chain

FusionXPay's AI-facing surface uses four coordinated safety layers:

1. **InputSafetyAspect**
   - blocks prompt-injection patterns
   - enforces max input length and suspicious-character thresholds
2. **ToolAuditAspect**
   - records action name, merchant ID, duration, and summaries
   - publishes events to Kafka topic `ai-audit-log`
3. **OutputSafetyAspect**
   - redacts secrets, payment-sensitive values, and PII-like output patterns
4. **Gateway merchant isolation**
   - validates JWT
   - injects `X-Merchant-Id`
   - relies on downstream merchant filters and confirmation-gated writes

## 7.3 Important Current Limitations

1. `order-service`, `payment-service`, and `notification-service` do not implement independent JWT auth filters.
2. Gateway `SecurityConfig` still relies on custom filter behavior rather than full per-route auth policy definitions.
3. Management exposure on gateway includes `env/configprops`; this is useful for diagnostics but risky on public exposure.

## 7.4 Recommended Hardening (Before Broad Public Access)

1. Restrict actuator exposure in public environment.
2. Bind container public ports to loopback where possible.
3. Enforce host firewall default-deny for inbound ports except SSH.
4. Add rate limiting and WAF rules for login and webhook endpoints.
5. Rotate JWT secret and provider secrets on schedule.
6. Document and test incident rollback process monthly.

## 7.5 Minimal Security Checklist

- [ ] `cloudflared` credentials file has strict permissions
- [ ] `.env.always-on` permissions are restricted
- [ ] Public domain only maps to gateway
- [ ] Stripe/PayPal webhook secrets configured and validated
- [ ] Gateway management endpoints hardened for internet exposure
- [ ] Backup files are retained and protected

## 7.6 Incident Response (Quick Actions)

If suspicious traffic or secret leak is suspected:

1. Rotate `JWT_SECRET`.
2. Rotate Stripe/PayPal credentials and webhook secrets.
3. Revoke active merchant sessions and rotate downstream service credentials where needed.
4. Review Cloudflare logs + application logs.
5. Trigger rollback to last known good revision if needed.

## 7.7 Source References

- Gateway filter: `services/api-gateway/src/main/java/com/fusionxpay/api/gateway/filter/JwtAuthFilter.java`
- Gateway security config: `services/api-gateway/src/main/java/com/fusionxpay/api/gateway/config/SecurityConfig.java`
- Admin JWT config: `services/admin-service/src/main/resources/application.yml`
- Admin auth chain: `services/admin-service/src/main/java/com/fusionxpay/admin/config/SecurityConfig.java`
- MCP input safety: `ai/ai-mcp-server/src/main/java/com/fusionxpay/ai/mcpserver/aspect/InputSafetyAspect.java`
- MCP audit aspect: `ai/ai-mcp-server/src/main/java/com/fusionxpay/ai/mcpserver/aspect/ToolAuditAspect.java`
- MCP output safety: `ai/ai-mcp-server/src/main/java/com/fusionxpay/ai/mcpserver/aspect/OutputSafetyAspect.java`
