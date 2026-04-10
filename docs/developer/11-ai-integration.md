# 11. AI Integration

## 11.1 Current Scope

FusionXPay's current AI-facing implementation is an **agent interface layer**, not an autonomous payment engine.

What exists today:

- `ai-mcp-server` for Claude Desktop and other MCP-compatible clients
- `ai-cli` for terminal-driven merchant workflows
- shared DTOs, confirmation objects, and audit schema in `ai-common`
- Kafka-backed audit persistence through `admin-service`
- OAuth-inspired local callback (PKCE) and device code flows for MCP and CLI auth

What does **not** exist yet:

- LLM-driven fraud scoring in production flows
- autonomous write execution without human confirmation

## 11.2 MCP Server

The MCP runtime is merchant-scoped and uses stdio transport.

Current tool set:

- `query_payment`
- `search_payments`
- `get_order`
- `search_orders`
- `get_order_status`
- `initiate_payment`
- `refund_payment`
- `confirm_action`

Key properties:

- 1 merchant context per MCP process
- read tools execute directly
- write tools return `CONFIRMATION_REQUIRED` first
- gateway-enforced JWT merchant identity remains the security boundary

## 11.3 CLI Surface

The FusionXPay CLI mirrors the same business surface with 11 commands:

- auth: `login`, `status`, `logout`
- order: `get`, `search`, `status`
- payment: `query`, `search`, `pay`, `refund`, `confirm`

CLI characteristics:

- uses the same backend contracts as MCP
- persists merchant session state locally
- emits audit events for success, failure, and confirmation-required flows

## 11.4 Safety Model

The current AI safety model has four layers:

1. input validation
2. structural tool constraints
3. gateway merchant isolation and confirmation gating
4. output scrubbing

Concrete implementation points:

- `InputSafetyAspect`
- `ToolAuditAspect`
- `OutputSafetyAspect`
- gateway JWT validation with `X-Merchant-Id`

## 11.5 Audit Pipeline

Both MCP and CLI publish a shared audit schema.

Flow:

1. user or agent invokes a tool or command
2. safety and audit layers wrap the action
3. event is published to Kafka topic `ai-audit-log`
4. `admin-service` consumes and persists the audit record

Representative statuses:

- `SUCCESS`
- `FAILURE`
- `CONFIRMATION_REQUIRED`

## 11.6 Demo Narrative

The current demoable path is:

1. authenticate as a merchant
2. search orders or payments
3. prepare a payment or refund action
4. receive a confirmation token
5. call the confirm step
6. inspect the resulting audit trail

This is the flow reflected on the landing page and in the AI quick start docs.

## 11.7 Source References

- MCP tools: `ai/ai-mcp-server/src/main/java/com/fusionxpay/ai/mcpserver/tool/FusionXMcpTools.java`
- CLI commands: `ai/ai-cli/src/main/java/com/fusionxpay/ai/cli/command/`
- MCP safety aspects: `ai/ai-mcp-server/src/main/java/com/fusionxpay/ai/mcpserver/aspect/`
- audit publisher contracts: `ai/ai-common/src/main/java/com/fusionxpay/ai/common/audit/`
