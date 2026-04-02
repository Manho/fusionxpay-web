# 03. API and Authentication

## 3.1 External API Entry

All public API traffic should enter through API Gateway under one domain:

- `https://api.<your-domain>`

Recommended frontend admin base URL:

- `https://api.<your-domain>/api/v1/admin`

## 3.2 Auth Layers

FusionXPay currently uses **JWT bearer tokens** as the primary auth mechanism across frontend, gateway, CLI, and MCP-driven merchant flows.

### Important behavior

- Gateway validates the `Authorization: Bearer <token>` header.
- On success, gateway injects `X-Merchant-Id` and related merchant headers downstream.
- Admin login path is `/api/v1/admin/auth/login`; successful login returns the JWT used for subsequent requests.
- Merchant isolation depends on downstream services honoring the forwarded merchant context.

## 3.3 Main Endpoint Map

### Admin endpoints

| Method | Path | Auth |
|---|---|---|
| POST | `/api/v1/admin/auth/login` | Public login endpoint |
| POST | `/api/v1/admin/auth/register` | Public registration endpoint |
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
| GET | `/api/v1/payment/search` |
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

- Gateway filter: `services/api-gateway/src/main/java/com/fusionxpay/api/gateway/filter/JwtAuthFilter.java`
- Admin auth controller: `services/admin-service/src/main/java/com/fusionxpay/admin/controller/AuthController.java`
- Admin JWT provider/filter: `services/admin-service/src/main/java/com/fusionxpay/admin/security/JwtTokenProvider.java`, `services/admin-service/src/main/java/com/fusionxpay/admin/security/JwtAuthenticationFilter.java`
- Payment webhooks: `services/payment-service/src/main/java/com/fusionxpay/payment/controller/StripeWebhookController.java`, `services/payment-service/src/main/java/com/fusionxpay/payment/controller/PayPalCallbackController.java`
