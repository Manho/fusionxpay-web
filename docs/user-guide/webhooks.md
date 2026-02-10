# Webhooks Guide

Learn how to handle payment status callbacks securely.

## Overview

Webhooks allow FusionXPay to notify your application when payment status changes. This is the recommended way to track order completion.

---

## Webhook Flow

```
Payment Provider → FusionXPay → Your Webhook Endpoint
                                     ↓
                               Update Database
                               Fulfill Order
```

---

## Setting Up Webhooks

### 1. Create an Endpoint

Your webhook endpoint should:
- Accept POST requests
- Return `200 OK` within 5 seconds
- Verify the signature
- Be idempotent (handle duplicate notifications)

**Example (Express.js):**

```javascript
app.post('/webhook', express.json(), async (req, res) => {
  // 1. Verify signature
  const signature = req.headers['x-fusionxpay-signature'];
  if (!verifySignature(req.body, signature)) {
    return res.status(401).send('Invalid signature');
  }

  // 2. Process the webhook
  const { orderId, status, amount, merchantOrderId } = req.body;

  console.log(`Order ${orderId} is now ${status}`);

  // 3. Update your database
  await db.orders.update({
    where: { id: merchantOrderId },
    data: { status }
  });

  // 4. Fulfill order if successful
  if (status === 'SUCCESS') {
    await fulfillOrder(merchantOrderId);
  }

  // 5. Respond quickly
  res.status(200).send('OK');
});
```

---

## Webhook Payload

### Payment Success

```json
{
  "event": "payment.success",
  "orderId": "FXP-20260210-123456",
  "merchantOrderId": "ORDER-12345",
  "amount": 99.99,
  "currency": "USD",
  "status": "SUCCESS",
  "paymentMethod": "CREDIT_CARD",
  "timestamp": "2026-02-10T12:05:00Z",
  "signature": "sha256=a1b2c3..."
}
```

### Payment Failed

```json
{
  "event": "payment.failed",
  "orderId": "FXP-20260210-123456",
  "merchantOrderId": "ORDER-12345",
  "status": "FAILED",
  "failureReason": "INSUFFICIENT_FUNDS",
  "timestamp": "2026-02-10T12:05:00Z",
  "signature": "sha256=a1b2c3..."
}
```

---

## Signature Verification

**Always verify webhooks** to prevent fraud.

### How Signatures Work

FusionXPay signs each webhook with your merchant secret:

```
signature = HMAC-SHA256(payload, merchant_secret)
```

### Verification Example (Node.js)

```javascript
const crypto = require('crypto');

function verifySignature(payload, signature, secret) {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex');

  return `sha256=${expectedSignature}` === signature;
}

// Usage
const isValid = verifySignature(
  req.body,
  req.headers['x-fusionxpay-signature'],
  process.env.FUSIONXPAY_SECRET
);
```

### Verification Example (Python)

```python
import hmac
import hashlib
import json

def verify_signature(payload, signature, secret):
    expected = hmac.new(
        secret.encode(),
        json.dumps(payload).encode(),
        hashlib.sha256
    ).hexdigest()

    return f"sha256={expected}" == signature
```

---

## Event Types

| Event | Description |
|-------|-------------|
| `payment.pending` | Order created, awaiting payment |
| `payment.processing` | Payment in progress |
| `payment.success` | Payment completed |
| `payment.failed` | Payment failed |
| `payment.cancelled` | Order cancelled |

---

## Best Practices

### 1. **Respond Quickly**

```javascript
// ✅ Good: Respond immediately, process async
app.post('/webhook', async (req, res) => {
  res.status(200).send('OK'); // Respond first

  // Process in background
  processWebhook(req.body).catch(console.error);
});

// ❌ Bad: Long processing blocks response
app.post('/webhook', async (req, res) => {
  await longDatabaseOperation();
  await sendEmailNotification();
  res.status(200).send('OK'); // Too slow!
});
```

### 2. **Handle Duplicates**

Use idempotency to prevent double-processing:

```javascript
const processedWebhooks = new Set();

app.post('/webhook', async (req, res) => {
  const { orderId } = req.body;

  if (processedWebhooks.has(orderId)) {
    return res.status(200).send('Already processed');
  }

  processedWebhooks.add(orderId);
  await processOrder(orderId);

  res.status(200).send('OK');
});
```

### 3. **Implement Retries**

FusionXPay will retry failed webhooks:

| Attempt | Delay |
|---------|-------|
| 1st retry | 1 minute |
| 2nd retry | 5 minutes |
| 3rd retry | 30 minutes |
| 4th retry | 2 hours |
| 5th retry | 6 hours |

After 5 failures, webhooks are marked as failed.

### 4. **Log Everything**

```javascript
app.post('/webhook', async (req, res) => {
  const webhook = req.body;

  // Log for debugging
  console.log('Webhook received:', {
    event: webhook.event,
    orderId: webhook.orderId,
    status: webhook.status,
    timestamp: new Date().toISOString()
  });

  // Process...
  res.status(200).send('OK');
});
```

---

## Testing Webhooks

### Local Testing with ngrok

```bash
# 1. Install ngrok
npm install -g ngrok

# 2. Start your server
node server.js

# 3. Expose it publicly
ngrok http 3000

# 4. Use the ngrok URL as your notifyUrl
# https://abc123.ngrok.io/webhook
```

### Manual Testing

Trigger a test webhook from the admin dashboard:

1. Login to [https://fusionxpay.site/admin](https://fusionxpay.site/admin)
2. Go to **Settings** → **Webhooks**
3. Click **Send Test Webhook**

---

## Webhook Security Checklist

- ✅ Verify signature on every webhook
- ✅ Use HTTPS for webhook URLs
- ✅ Whitelist FusionXPay IPs (optional)
- ✅ Rate limit webhook endpoint
- ✅ Log all webhook attempts
- ✅ Handle duplicates gracefully
- ✅ Respond within 5 seconds

---

## Troubleshooting

### Webhook Not Received

1. Check firewall settings
2. Verify URL is publicly accessible
3. Check server logs for errors
4. Test with ngrok locally

### Signature Verification Fails

1. Check your merchant secret
2. Ensure payload is not modified
3. Use raw body (not parsed JSON) for signature
4. Check for extra whitespace

### Response Timeout

1. Move processing to background queue
2. Respond immediately with 200
3. Optimize database queries

---

## Example Implementation

Complete webhook handler with best practices:

```javascript
const express = require('express');
const crypto = require('crypto');
const { Queue } = require('bull');

const app = express();
const webhookQueue = new Queue('webhooks');

// Verify signature middleware
function verifyWebhook(req, res, next) {
  const signature = req.headers['x-fusionxpay-signature'];
  const secret = process.env.FUSIONXPAY_SECRET;

  const expected = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(req.body))
    .digest('hex');

  if (`sha256=${expected}` !== signature) {
    return res.status(401).send('Invalid signature');
  }

  next();
}

// Webhook endpoint
app.post('/webhook',
  express.json(),
  verifyWebhook,
  async (req, res) => {
    const webhook = req.body;

    // Log
    console.log('Webhook received:', webhook.orderId);

    // Queue for processing
    await webhookQueue.add(webhook);

    // Respond immediately
    res.status(200).send('OK');
  }
);

// Background processor
webhookQueue.process(async (job) => {
  const { orderId, status } = job.data;

  if (status === 'SUCCESS') {
    await fulfillOrder(orderId);
    await sendConfirmationEmail(orderId);
  }
});

app.listen(3000);
```

---

## Next Steps

- 📖 [API Reference](./api-basics.md)
- 🔐 [Security Guide](./security.md)
- ❓ [FAQ](./faq.md)
