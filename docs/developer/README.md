# FusionXPay Developer Documentation

This documentation is for developers who want to contribute to FusionXPay or run it locally.

## Scope

- Frontend admin dashboard (Next.js)
- Backend microservices architecture and API entry model
- AI interface layer, MCP tooling, CLI workflows, and audit pipeline
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
11. [AI Integration](./11-ai-integration.md)

## Fast Paths by Role

- **Product / Demo owner**: [`01`](./01-project-overview.md) → [`05`](./05-environment-and-deployment.md) → [`06`](./06-operations-observability.md) → [`09`](./09-troubleshooting.md)
- **Frontend engineer**: [`04`](./04-frontend-application.md) → [`03`](./03-api-and-auth.md) → [`08`](./08-testing-and-ci.md)
- **Backend engineer**: [`02`](./02-architecture-and-services.md) → [`03`](./03-api-and-auth.md) → [`07`](./07-security-model.md) → [`08`](./08-testing-and-ci.md)
- **AI / Demo engineer**: [`11`](./11-ai-integration.md) → [`02`](./02-architecture-and-services.md) → [`07`](./07-security-model.md) → [`08`](./08-testing-and-ci.md)
- **DevOps / Operator**: [`05`](./05-environment-and-deployment.md) → [`06`](./06-operations-observability.md) → [`07`](./07-security-model.md) → [`09`](./09-troubleshooting.md)

## Sources of Truth

- Backend implementation: [FusionXPay](https://github.com/Manho/FusionXPay) (separate repository)
- Frontend implementation: this repository (`fusionxpay-web`)

## Notes

- Secrets are intentionally not stored in docs.
- Domain `fusionx.fun` + `api.fusionx.fun` may be pending DNS/approval during setup.
- Any mismatch between historical docs and code should defer to current source files listed in [Appendix: File Map](./10-appendix-file-map.md).
