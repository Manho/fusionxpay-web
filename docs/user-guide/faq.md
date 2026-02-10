# Frequently Asked Questions

Common questions about integrating FusionXPay.

## General

### What is FusionXPay?

FusionXPay is an open-source payment gateway that provides a unified API for processing payments across multiple payment providers.

### Is it free?

Yes, FusionXPay is open source (MIT license). You can self-host it for free or use our managed service.

### Which payment providers are supported?

Currently supported:
- Credit/Debit Cards (via Stripe/PayPal)
- Alipay
- WeChat Pay
- Bank Transfer

More providers coming soon!

---

## Integration

### How long does integration take?

Most integrations are completed in **under 1 hour**. The basic flow:
1. Sign up (5 min)
2. Get API credentials (1 min)
3. Implement API calls (30 min)
4. Test with sandbox (20 min)

### Do I need a server?

Yes, you need a server to:
- Receive webhook callbacks
- Store order information
- Handle authentication

For static sites, consider using serverless functions (Vercel, Netlify, AWS Lambda).

### Can I use it with Next.js/React?

Yes! FusionXPay works with any frontend framework. See our [Quick Start](./quick-start.md).

---

## API & Development

### Where do I get API credentials?

1. Login to the admin dashboard
2. Go to **Settings** → **API Keys**
3. Copy your merchant ID and secret

### How do I test without real payments?

Use the sandbox environment:
- API URL: `http://localhost:8080/api/v1` (local)
- Test credentials: `merchant@example.com` / `merchant123`
- Test cards: See [Quick Start](./quick-start.md#test-cards)

### What's the rate limit?

- **Sandbox**: 100 requests/minute
- **Production**: 1000 requests/minute

Need higher limits? Contact support.

### How do I handle refunds?

```javascript
await fetch(`https://api.fusionxpay.site/api/v1/orders/${orderId}/refund`, {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    amount: 99.99,
    reason: 'Customer request'
  })
});
```

---

## Webhooks

### Why aren't my webhooks working?

Common issues:
1. **Firewall blocking**: Ensure your webhook URL is publicly accessible
2. **Invalid signature**: Verify you're using the correct secret
3. **Timeout**: Respond within 5 seconds
4. **Wrong URL**: Check the `notifyUrl` in your order creation

### How do I test webhooks locally?

Use [ngrok](https://ngrok.com):

```bash
ngrok http 3000
# Use the ngrok URL: https://abc123.ngrok.io/webhook
```

### Can I have multiple webhook URLs?

Not currently, but you can set up a webhook router:

```javascript
app.post('/webhook', async (req, res) => {
  // Forward to multiple handlers
  await Promise.all([
    notifyInventorySystem(req.body),
    notifyEmailService(req.body),
    notifyAnalytics(req.body)
  ]);

  res.status(200).send('OK');
});
```

---

## Security

### How secure is FusionXPay?

We implement industry-standard security:
- HTTPS/TLS encryption
- HMAC-SHA256 webhook signatures
- JWT authentication
- PCI DSS compliant payment processing

### Do you store credit card data?

No. Credit card data is handled directly by payment providers (Stripe, PayPal). FusionXPay never sees or stores card details.

### How do I verify webhook authenticity?

Always verify the `X-FusionXPay-Signature` header. See [Webhooks Guide](./webhooks.md#signature-verification).

---

## Payments

### What currencies are supported?

- USD
- EUR
- GBP
- CNY
- JPY

More currencies available on request.

### How long until I receive funds?

Payout timing depends on your payment provider:
- **Stripe**: 2-7 business days
- **PayPal**: 1-3 business days
- **Bank transfer**: 3-5 business days

### What are the fees?

FusionXPay itself is free. Payment provider fees apply:
- **Stripe**: 2.9% + $0.30 per transaction
- **PayPal**: 2.9% + $0.30 per transaction
- **Alipay/WeChat**: 3.4% per transaction

### Can I test payments without being charged?

Yes! Use the sandbox environment and test cards. See [Quick Start](./quick-start.md#test-cards).

---

## Troubleshooting

### Error: "UNAUTHORIZED"

Check:
1. Your token is valid
2. Token is included in `Authorization: Bearer TOKEN`
3. Token hasn't expired (refresh if needed)

### Error: "ORDER_NOT_FOUND"

The order ID doesn't exist. Verify:
1. You're using the `orderId` from FusionXPay (e.g., `FXP-xxx`)
2. Not using your `merchantOrderId`
3. Order was created successfully

### Error: "DUPLICATE_ORDER"

You've already created an order with that `merchantOrderId`. Either:
1. Query the existing order
2. Use a new `merchantOrderId`

### Webhook signature verification fails

1. Use the raw request body (not parsed JSON)
2. Check your merchant secret
3. Ensure no extra whitespace in payload
4. Verify header name: `x-fusionxpay-signature`

---

## Deployment

### Can I self-host FusionXPay?

Yes! See the [Developer Docs](../developer/05-environment-and-deployment.md).

### Which cloud providers are supported?

FusionXPay runs on:
- AWS
- Google Cloud
- Azure
- DigitalOcean
- Vercel (frontend)
- Any Docker-compatible platform

### How do I scale for high traffic?

1. Use a load balancer
2. Scale horizontally (multiple instances)
3. Use Redis for session storage
4. Consider CDN for static assets

---

## Billing & Account

### How do I upgrade my account?

Contact [support@fusionxpay.site](mailto:support@fusionxpay.site)

### Can I change my webhook URL?

Yes, in the admin dashboard:
1. Go to **Settings** → **Webhooks**
2. Update your webhook URL
3. Click **Save**

### How do I delete my account?

Contact support. Note: All transaction data will be permanently deleted.

---

## Still Need Help?

- 📖 [API Documentation](./api-basics.md)
- 🔧 [Developer Docs](../developer/README.md)
- 🐛 [Report a Bug](https://github.com/Manho/fusionxpay-web/issues)
- 💬 [Community Discussions](https://github.com/Manho/fusionxpay-web/discussions)
- 📧 Email: [support@fusionxpay.site](mailto:support@fusionxpay.site)
