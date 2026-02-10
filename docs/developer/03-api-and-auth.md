# 03. API and Authentication

## 3.1 External API Entry

All public API traffic should enter through API Gateway under one domain:

- `https://api.<your-domain>`

Recommended frontend admin base URL:

- `https://api.<your-domain>/api/v1/admin`

## 3.2 Auth Layers

FusionXPay currently uses two distinct auth methods:

1. **Gateway API key** (`X-API-Key`) at gateway filter level.
2. **Admin JWT** inside `admin-service` for authenticated admin endpoints.

### Important behavior

- Gateway bypass list currently includes `/api/v1/auth/**` and swagger-related endpoints.
- Admin login path is `/api/v1/admin/auth/login`, which is protected at gateway level unless caller includes `X-API-Key`.

## 3.3 Main Endpoint Map

### Gateway auth endpoints

| Method | Path | Purpose |
|---|---|---|
| POST | `/api/v1/auth/register` | Create gateway user and API key |
| POST | `/api/v1/auth/login` | Login and retrieve API key |

### Admin endpoints

| Method | Path | Auth |
|---|---|---|
| POST | `/api/v1/admin/auth/login` | Public in admin-service, still through gateway |
| POST | `/api/v1/admin/auth/register` | Public in admin-service |
| GET | `/api/v1/admin/auth/me` | JWT required |
| GET | `/api/v1/admin/orders` | JWT required |
| GET | `/api/v1/admin/orders/{orderId}` | JWT required |

### Order endpoints

| Method | Path |
|---|---|
| GET | `/api/v1/orders` |
| POST | `/api/v1/orders` |
| GET | `/api/v1/orders/{orderNumber}` |
| GET | `/api/v1/orders/id/{orderId}` |

### Payment endpoints

| Method | Path |
|---|---|
| POST | `/api/v1/payment/request` |
| GET | `/api/v1/payment/transaction/{transactionId}` |
| GET | `/api/v1/payment/order/{orderId}` |
| GET | `/api/v1/payment/providers` |
| POST | `/api/v1/payment/refund` |
| POST | `/api/v1/payment/webhook/stripe` |
| POST | `/api/v1/payment/paypal/webhook` |
| GET | `/api/v1/payment/paypal/return` |
| GET | `/api/v1/payment/paypal/cancel` |

### Notification endpoints

| Method | Path |
|---|---|
| POST | `/api/v1/notifications` |
| GET | `/api/v1/notifications` |
| GET | `/api/v1/notifications/{id}` |
| DELETE | `/api/v1/notifications/{id}` |

## 3.4 Admin JWT Behavior

- JWT is issued by `admin-service` on successful login/registration.
- Token payload includes merchant identity fields used for authorization.
- `JwtAuthenticationFilter` validates token on protected admin requests.
- `JWT_SECRET` mismatch causes 401 for previously issued tokens.

## 3.5 Webhook Verification

- Stripe endpoint requires `Stripe-Signature` request header.
- PayPal webhook endpoint accepts transmission headers and validates callback inside provider flow.

## 3.6 Source References

- Gateway filter: `services/api-gateway/src/main/java/com/fusionxpay/api/gateway/filter/ApiKeyAuthFilter.java`
- Gateway auth controller: `services/api-gateway/src/main/java/com/fusionxpay/api/gateway/controller/AuthController.java`
- Admin auth controller: `services/admin-service/src/main/java/com/fusionxpay/admin/controller/AuthController.java`
- Admin JWT provider/filter: `services/admin-service/src/main/java/com/fusionxpay/admin/security/JwtTokenProvider.java`, `services/admin-service/src/main/java/com/fusionxpay/admin/security/JwtAuthenticationFilter.java`
- Payment webhooks: `services/payment-service/src/main/java/com/fusionxpay/payment/controller/StripeWebhookController.java`, `services/payment-service/src/main/java/com/fusionxpay/payment/controller/PayPalCallbackController.java`
