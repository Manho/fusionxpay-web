# Quick Start Guide

Get your first payment running in 5 minutes.

## Prerequisites

- A FusionXPay account (or run locally for testing)
- Your API credentials (merchant ID + API key)
- A web server that can receive webhooks

---

## Step 1: Get Your Credentials

### Option A: Use Test Credentials (Sandbox)

For testing, you can use these credentials:

```
Merchant ID: merchant@example.com
Password: merchant123
API Endpoint: http://localhost:8080/api/v1
```

### Option B: Create an Account

1. Sign up at [https://fusionxpay.site](https://fusionxpay.site)
2. Verify your email
3. Get your API key from the dashboard

---

## Step 2: Create Your First Payment

### Using cURL

```bash
curl -X POST https://api.fusionxpay.site/api/v1/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "merchantOrderId": "ORDER-001",
    "amount": 99.99,
    "currency": "USD",
    "notifyUrl": "https://yoursite.com/webhook",
    "returnUrl": "https://yoursite.com/success",
    "description": "Test Order"
  }'
```

### Using JavaScript

```javascript
const createPayment = async () => {
  const response = await fetch('https://api.fusionxpay.site/api/v1/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer YOUR_API_KEY'
    },
    body: JSON.stringify({
      merchantOrderId: 'ORDER-001',
      amount: 99.99,
      currency: 'USD',
      notifyUrl: 'https://yoursite.com/webhook',
      returnUrl: 'https://yoursite.com/success',
      description: 'Test Order'
    })
  });

  const data = await response.json();
  console.log('Payment URL:', data.paymentUrl);
  return data;
};
```

### Response

```json
{
  "orderId": "FXP-20260210-123456",
  "merchantOrderId": "ORDER-001",
  "amount": 99.99,
  "currency": "USD",
  "status": "PENDING",
  "paymentUrl": "https://pay.fusionxpay.site/order/FXP-20260210-123456",
  "createdAt": "2026-02-10T12:00:00Z"
}
```

---

## Step 3: Redirect User to Payment Page

Redirect your customer to the `paymentUrl` returned in the response:

```javascript
// Redirect user to payment page
window.location.href = data.paymentUrl;
```

---

## Step 4: Handle Webhook Callbacks

FusionXPay will send payment status updates to your `notifyUrl`:

```javascript
// Express.js example
app.post('/webhook', express.json(), (req, res) => {
  const { orderId, status, amount } = req.body;

  // Verify signature (see Webhooks guide)
  if (!verifySignature(req)) {
    return res.status(401).send('Invalid signature');
  }

  // Update your database
  if (status === 'SUCCESS') {
    console.log(`Payment ${orderId} succeeded: $${amount}`);
    // Fulfill the order
  }

  res.status(200).send('OK');
});
```

---

## Step 5: Query Order Status (Optional)

Check payment status anytime:

```bash
curl -X GET https://api.fusionxpay.site/api/v1/orders/FXP-20260210-123456 \
  -H "Authorization: Bearer YOUR_API_KEY"
```

---

## Payment Flow Diagram

```
1. Your App        →  FusionXPay API (Create Order)
2. FusionXPay API  →  Your App (Payment URL)
3. Your App        →  Customer (Redirect to Payment URL)
4. Customer        →  Payment Provider (Complete Payment)
5. Payment Provider→  FusionXPay (Payment Result)
6. FusionXPay      →  Your App (Webhook Notification)
7. Your App        →  Customer (Show Success Page)
```

---

## What's Next?

- 📖 [API Basics](./api-basics.md) - Learn more about the API
- 🔔 [Webhooks Guide](./webhooks.md) - Secure webhook handling
- 🎨 [Customize Payment Page](./customization.md) - Brand your checkout
- ❓ [FAQ](./faq.md) - Common questions

---

## Test Cards (Sandbox)

Use these test cards in sandbox environment:

| Card Number | Result |
|-------------|--------|
| `4111111111111111` | Success |
| `4000000000000002` | Declined |
| `4000000000000119` | Timeout |

**CVV**: Any 3 digits
**Expiry**: Any future date

---

## Need Help?

- 🐛 [Report Issues](https://github.com/Manho/fusionxpay-web/issues)
- 💬 [Community Support](https://github.com/Manho/fusionxpay-web/discussions)
