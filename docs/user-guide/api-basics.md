# API Basics

Complete reference for FusionXPay API.

## Base URL

| Environment | Base URL |
|-------------|----------|
| **Sandbox** | `http://localhost:8080/api/v1` (Local) |
| **Production** | `https://api.fusionxpay.site/api/v1` |

---

## Authentication

All API requests require a JWT token obtained through merchant login.

### Login

```bash
POST /api/v1/admin/auth/login
Content-Type: application/json

{
  "email": "merchant@example.com",
  "password": "merchant123"
}
```

**Response:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "merchant@example.com",
    "role": "MERCHANT"
  }
}
```

### Using the Token

Include the token in the `Authorization` header:

```bash
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## Core Concepts

### Order Lifecycle

```
PENDING → PROCESSING → SUCCESS
                    → FAILED
                    → CANCELLED
```

| Status | Description |
|--------|-------------|
| `PENDING` | Order created, awaiting payment |
| `PROCESSING` | Payment in progress |
| `SUCCESS` | Payment completed successfully |
| `FAILED` | Payment failed |
| `CANCELLED` | Order cancelled |

---

## API Endpoints

### 1. Create Order

Create a new payment order.

```bash
POST /api/v1/orders
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN

{
  "merchantOrderId": "ORDER-12345",
  "amount": 99.99,
  "currency": "USD",
  "notifyUrl": "https://yoursite.com/webhook",
  "returnUrl": "https://yoursite.com/success",
  "description": "Product purchase"
}
```

**Request Fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `merchantOrderId` | string | Yes | Your unique order ID |
| `amount` | number | Yes | Payment amount (decimal) |
| `currency` | string | Yes | Currency code (USD, EUR, etc.) |
| `notifyUrl` | string | Yes | Webhook callback URL |
| `returnUrl` | string | No | Redirect URL after payment |
| `description` | string | No | Order description |

**Response:**

```json
{
  "orderId": "FXP-20260210-123456",
  "merchantOrderId": "ORDER-12345",
  "amount": 99.99,
  "currency": "USD",
  "status": "PENDING",
  "paymentUrl": "https://pay.fusionxpay.site/order/FXP-20260210-123456",
  "createdAt": "2026-02-10T12:00:00Z"
}
```

---

### 2. Query Order Status

Get the current status of an order.

```bash
GET /api/v1/orders/{orderId}
Authorization: Bearer YOUR_TOKEN
```

**Response:**

```json
{
  "orderId": "FXP-20260210-123456",
  "merchantOrderId": "ORDER-12345",
  "amount": 99.99,
  "currency": "USD",
  "status": "SUCCESS",
  "paymentMethod": "CREDIT_CARD",
  "createdAt": "2026-02-10T12:00:00Z",
  "updatedAt": "2026-02-10T12:05:00Z"
}
```

---

### 3. List Orders (Admin)

Get paginated list of orders.

```bash
GET /api/v1/admin/orders?page=1&size=20&status=SUCCESS
Authorization: Bearer YOUR_TOKEN
```

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | 1 | Page number |
| `size` | integer | 20 | Items per page |
| `status` | string | - | Filter by status |

**Response:**

```json
{
  "content": [
    {
      "orderId": "FXP-20260210-123456",
      "merchantOrderId": "ORDER-12345",
      "amount": 99.99,
      "status": "SUCCESS",
      "createdAt": "2026-02-10T12:00:00Z"
    }
  ],
  "totalElements": 100,
  "totalPages": 5,
  "currentPage": 1
}
```

---

## Error Handling

### Error Response Format

```json
{
  "error": "INVALID_REQUEST",
  "message": "Amount must be greater than 0",
  "timestamp": "2026-02-10T12:00:00Z"
}
```

### Common Error Codes

| Status Code | Error Code | Description |
|-------------|------------|-------------|
| 400 | `INVALID_REQUEST` | Invalid request parameters |
| 401 | `UNAUTHORIZED` | Missing or invalid token |
| 404 | `ORDER_NOT_FOUND` | Order does not exist |
| 409 | `DUPLICATE_ORDER` | Order ID already exists |
| 500 | `INTERNAL_ERROR` | Server error |

---

## Rate Limiting

| Environment | Limit |
|-------------|-------|
| Sandbox | 100 requests/minute |
| Production | 1000 requests/minute |

**Rate limit headers:**

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 995
X-RateLimit-Reset: 1644501600
```

---

## Best Practices

### 1. **Use Idempotency Keys**

Use unique `merchantOrderId` to prevent duplicate charges:

```javascript
const orderId = `ORDER-${Date.now()}-${Math.random()}`;
```

### 2. **Handle Webhooks Properly**

Always verify webhook signatures (see [Webhooks Guide](./webhooks.md)).

### 3. **Implement Retry Logic**

```javascript
async function createOrderWithRetry(orderData, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await createOrder(orderData);
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(r => setTimeout(r, 1000 * (i + 1)));
    }
  }
}
```

### 4. **Store Order IDs**

Always save the returned `orderId` for future queries.

---

## SDK Examples

### Node.js

```javascript
const FusionXPay = require('fusionxpay-sdk');

const client = new FusionXPay({
  apiKey: 'YOUR_API_KEY',
  environment: 'sandbox'
});

const order = await client.orders.create({
  merchantOrderId: 'ORDER-001',
  amount: 99.99,
  currency: 'USD',
  notifyUrl: 'https://yoursite.com/webhook'
});
```

### Python

```python
from fusionxpay import Client

client = Client(api_key='YOUR_API_KEY', environment='sandbox')

order = client.orders.create(
    merchant_order_id='ORDER-001',
    amount=99.99,
    currency='USD',
    notify_url='https://yoursite.com/webhook'
)
```

---

## Next Steps

- 🔔 [Webhooks Guide](./webhooks.md)
- 🔐 [Security Best Practices](./security.md)
- ❓ [FAQ](./faq.md)
