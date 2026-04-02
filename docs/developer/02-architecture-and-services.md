# 02. Architecture and Services

## 2.1 System Layout

FusionXPay currently combines **5 core application services** with an **AI interface layer**:

- `api-gateway`
- `admin-service`
- `order-service`
- `payment-service`
- `notification-service`
- `ai-mcp-server`
- `ai-cli`

Supporting infrastructure remains externalized:

- MySQL
- Redis
- Kafka
- Eureka

### Architecture Diagram

```architecture
graph TB
    Client["Client / Browser"]
    CF["Cloudflare Tunnel"]
    GW["API Gateway :8080"]
    Admin["Admin Service :8084"]
    Order["Order Service :8082"]
    Payment["Payment Service :8081"]
    Notify["Notification Service :8083"]
    MySQL[("MySQL")]
    Redis[("Redis")]
    Kafka["Kafka"]
    Eureka["Eureka"]
    Stripe["Stripe"]
    PayPal["PayPal"]

    Client --> CF --> GW
    GW --> Admin
    GW --> Order
    GW --> Payment
    GW --> Notify
    Admin --> MySQL
    Admin --> Redis
    Order --> MySQL
    Order --> Kafka
    Payment --> MySQL
    Payment --> Stripe
    Payment --> PayPal
    Notify --> MySQL
    Notify --> Kafka
    Admin --> Eureka
    Order --> Eureka
    Payment --> Eureka
    Notify --> Eureka
```

## 2.2 Service Responsibilities

| Service | Default Port | Responsibility |
|---|---:|---|
| API Gateway | 8080 | External entrypoint, JWT validation, rate limiting, merchant header injection |
| Admin Service | 8084 | Merchant auth, JWT issuance/validation, admin order query APIs |
| Order Service | 8082 | Order lifecycle and order retrieval |
| Payment Service | 8081 | Payment initiation, refund, provider callbacks/webhooks |
| Notification Service | 8083 | Notification persistence and notification APIs |
| MCP Server | 8085 (logical) | Merchant-scoped AI tool interface over stdio with 8 tools |
| CLI | - | Merchant terminal interface with 11 audited commands |

## 2.3 AI Interface Layer

The AI-facing layer is intentionally thin and reuses the same backend contracts:

- `ai-mcp-server` exposes merchant-scoped order and payment tools over MCP stdio.
- `ai-cli` exposes the same core workflows through Picocli command groups.
- Both paths share DTOs, confirmation flow objects, and audit schema via `ai-common`.
- Both paths publish audit events to Kafka topic `ai-audit-log`.
- Write operations return confirmation tokens before execution.

## 2.4 API Gateway Routing Model

Canonical v1 routes:

- `/api/v1/admin/**` -> `admin-service`
- `/api/v1/orders/**` -> `order-service`
- `/api/v1/payment/**` -> `payment-service`
- `/api/v1/notifications/**` -> `notification-service`

Legacy service-prefixed routes may still exist for compatibility, but current frontend and AI flows should target the canonical v1 paths above.

## 2.5 Core Request Flows

### Admin flow

1. Frontend calls `/api/v1/admin/auth/login`.
2. `admin-service` authenticates merchant and returns JWT.
3. Frontend stores token cookie and calls `/api/v1/admin/orders`.
4. `admin-service` validates JWT and retrieves orders (role aware).

### Payment flow

1. Client creates order via `order-service` path.
2. Client triggers `/api/v1/payment/request`.
3. `payment-service` processes provider request.
4. Stripe/PayPal callbacks hit webhook endpoints.
5. Internal order/payment states are updated; notification flow is triggered.

### AI flow

1. Merchant authenticates through CLI credentials or MCP runtime configuration.
2. MCP or CLI issues a read or write tool invocation.
3. Safety and audit layers wrap the action before backend execution.
4. Gateway enforces JWT merchant identity and forwards `X-Merchant-Id`.
5. Audit events are published to Kafka and persisted by `admin-service`.

## 2.6 Source References

- Gateway routes: `services/api-gateway/src/main/resources/application.yml`
- Gateway JWT filter: `services/api-gateway/src/main/java/com/fusionxpay/api/gateway/filter/JwtAuthFilter.java`
- Admin security: `services/admin-service/src/main/java/com/fusionxpay/admin/config/SecurityConfig.java`
- Order controller: `services/order-service/src/main/java/com/fusionxpay/order/controller/OrderController.java`
- Payment controllers: `services/payment-service/src/main/java/com/fusionxpay/payment/controller/PaymentController.java`
- Notification controller: `services/notification-service/src/main/java/com/fusionxpay/notification/controller/NotificationController.java`
- MCP tools: `ai/ai-mcp-server/src/main/java/com/fusionxpay/ai/mcpserver/tool/FusionXMcpTools.java`
- CLI root command: `ai/ai-cli/src/main/java/com/fusionxpay/ai/cli/command/RootCommand.java`
