# 11. Known Gaps and Roadmap

## 11.1 Current-State Gaps

1. **Auth model split**
   - Admin APIs use JWT in `admin-service`.
   - Other services rely primarily on gateway boundary and network isolation.
2. **Gateway security dependency on custom filter**
   - Gateway `SecurityConfig` permits all exchanges; practical control depends on `ApiKeyAuthFilter`.
3. **Operational endpoint exposure risk**
   - Gateway management exposure currently includes diagnostic endpoints useful for internal debugging.
4. **Historical doc drift**
   - Some legacy architecture text references older middleware choices and may not match local-first runtime.

## 11.2 Recommended Priorities

### Priority A (before broad external traffic)

- Harden public actuator exposure policy.
- Enforce host firewall + loopback binding strategy.
- Finalize Cloudflare WAF/rate-limit policy for login and webhooks.

### Priority B (medium-term)

- Add service-to-service trust model (internal token or mTLS).
- Add explicit authorization strategy for non-admin services if required by product scope.
- Add security regression tests for auth boundary assumptions.

### Priority C (long-term)

- Structured threat model and periodic security reviews.
- Automated secret rotation and break-glass runbook.
- Build an external API consumer guide with versioned contract policy.

## 11.3 Documentation Maintenance Policy

Recommended maintenance cadence:

1. Update docs in same PR when changing routes/security/deployment scripts.
2. Treat `docs/10-appendix-file-map.md` as quick drift detector.
3. Run quarterly doc audit against backend source files.

## 11.4 Review Questions for Team

- Do we keep gateway API-key model as-is for all external clients?
- Should order/payment/notification become independently auth-aware?
- Which actuator endpoints are strictly required for production operations?
- What is the formal rollback SLA for `main` deployment failures?
