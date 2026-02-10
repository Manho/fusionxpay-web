# 02. Architecture and Services

## 2.1 System Layout

FusionXPay backend currently consists of 5 core application services:

- `api-gateway`
- `admin-service`
- `order-service`
- `payment-service`
- `notification-service`

Middleware and platform dependencies are externalized (NAS/local infra):

- MySQL
- Redis
- Kafka
- Eureka

## 2.2 Service Responsibilities

| Service | Default Port | Responsibility |
|---|---:|---|
| API Gateway | 8080 | External entrypoint, route dispatch, API-key filter, gateway-level docs |
| Admin Service | 8084 | Merchant auth, JWT issuance/validation, admin order query APIs |
| Order Service | 8082 | Order lifecycle and order retrieval |
| Payment Service | 8081 | Payment initiation, refund, provider callbacks/webhooks |
| Notification Service | 8083 | Notification persistence and notification APIs |

## 2.3 API Gateway Routing Model

Canonical v1 routes:

- `/api/v1/admin/**` -> `admin-service`
- `/api/v1/orders/**` -> `order-service`
- `/api/v1/payment/**` -> `payment-service`
- `/api/v1/notifications/**` -> `notification-service`

Legacy service-prefixed routes are still present via rewrite rules for compatibility.

## 2.4 Core Request Flows

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

## 2.5 Source References

- Gateway routes: `services/api-gateway/src/main/resources/application.yml`
- Gateway API-key filter: `services/api-gateway/src/main/java/com/fusionxpay/api/gateway/filter/ApiKeyAuthFilter.java`
- Admin security: `services/admin-service/src/main/java/com/fusionxpay/admin/config/SecurityConfig.java`
- Order controller: `services/order-service/src/main/java/com/fusionxpay/order/controller/OrderController.java`
- Payment controllers: `services/payment-service/src/main/java/com/fusionxpay/payment/controller/PaymentController.java`
- Notification controller: `services/notification-service/src/main/java/com/fusionxpay/notification/controller/NotificationController.java`
