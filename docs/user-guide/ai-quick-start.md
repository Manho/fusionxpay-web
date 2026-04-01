# AI Quick Start

Use FusionXPay's AI-native surface in two ways today:

- connect Claude Desktop through MCP
- run the merchant CLI for the same payment and order workflows

## Prerequisites

- a running FusionXPay backend
- a merchant account such as `merchant@example.com`
- valid merchant credentials or a JWT token

## Option 1: Connect Claude Desktop

Add a FusionXPay MCP entry to your Claude Desktop config:

```json
{
  "mcpServers": {
    "fusionxpay": {
      "command": "java",
      "args": ["-jar", "ai-mcp-server-1.0.0.jar"],
      "env": {
        "FUSIONX_EMAIL": "merchant@example.com",
        "FUSIONX_PASSWORD": "merchant123",
        "FUSIONX_GATEWAY_BASE_URL": "http://localhost:8080"
      }
    }
  }
}
```

What you can do after connecting:

- search merchant orders
- search merchant payments
- inspect order status
- prepare payment and refund actions
- confirm write actions with `confirm_action`

## Option 2: Use the FusionXPay CLI

### Authenticate

```bash
fusionx auth login --email merchant@example.com --password merchant123
fusionx auth status
```

### Search merchant data

```bash
fusionx order search --status PENDING
fusionx payment search --status SUCCESS
```

### Run a guarded write flow

```bash
fusionx payment refund --transaction-id PAY-2026-001 --amount 5.00
fusionx payment confirm --token <confirmation-token>
```

The first command prepares the action and returns `CONFIRMATION_REQUIRED`.  
The second command executes the write using that confirmation token.

## Safety Expectations

Both MCP and CLI flows share the same backend guarantees:

- merchant-scoped JWT enforcement at the gateway
- confirmation-gated write operations
- Kafka-backed audit records
- output scrubbing for sensitive values

## Recommended Demo Flow

1. authenticate as a merchant
2. search payments or orders
3. prepare a payment or refund action
4. confirm the action
5. verify the audit trail in admin tooling or logs

## Next Steps

- [Developer AI Integration](../developer/11-ai-integration.md)
- [API Basics](./api-basics.md)
- [Webhooks](./webhooks.md)
