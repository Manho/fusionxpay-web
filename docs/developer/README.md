# FusionXPay Developer Documentation

This documentation is for developers who want to contribute to FusionXPay or run it locally.

## Scope

- Frontend admin dashboard (Next.js)
- Backend microservices architecture and API entry model
- Local-first runtime and deployment operations
- Security model (current state + hardening roadmap)
- Monitoring, backup, restore, and acceptance checklist

## Recommended Reading Order

1. [Project Overview](./01-project-overview.md)
2. [Architecture and Services](./02-architecture-and-services.md)
3. [API and Auth](./03-api-and-auth.md)
4. [Frontend Application](./04-frontend-application.md)
5. [Environment and Deployment](./05-environment-and-deployment.md)
6. [Operations & Observability](./06-operations-observability.md)
7. [Security Model](./07-security-model.md)
8. [Testing and CI](./08-testing-and-ci.md)
9. [Troubleshooting](./09-troubleshooting.md)
10. [Appendix: File Map](./10-appendix-file-map.md)
11. [Known Gaps and Roadmap](./11-known-gaps-and-roadmap.md)

## Fast Paths by Role

- **Product / Demo owner**: `01` → `05` → `06` → `09`
- **Frontend engineer**: `04` → `03` → `08`
- **Backend engineer**: `02` → `03` → `07` → `08`
- **DevOps / Operator**: `05` → `06` → `07` → `09`

## Sources of Truth

- Backend implementation: `/Users/manho/conductor/workspaces/FusionXPay/farmerville`
- Frontend implementation: `/Users/manho/conductor/workspaces/fusionxpay-web/new-york`

## Notes

- Secrets are intentionally not stored in docs.
- Domain `fusionxpay.site` + `api.fusionxpay.site` may be pending DNS/approval during setup.
- Any mismatch between historical docs and code should defer to current source files listed in [Appendix: File Map](./10-appendix-file-map.md).
