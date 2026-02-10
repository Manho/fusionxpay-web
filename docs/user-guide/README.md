# FusionXPay User Guide

Welcome to FusionXPay! This guide will help you integrate payment processing into your application.

## What is FusionXPay?

FusionXPay is an open-source payment gateway that provides a unified API for processing payments across multiple payment providers. Built with modern microservices architecture, it offers:

- **Unified API** - One integration for multiple payment providers
- **Real-time Webhooks** - Get instant payment status updates
- **Admin Dashboard** - Monitor and manage transactions
- **Developer-Friendly** - RESTful API with comprehensive documentation
- **Open Source** - Self-hosted, no vendor lock-in

---

## Getting Started

### 1. [Quick Start](./quick-start.md)
Get your first payment running in 5 minutes.

### 2. [API Basics](./api-basics.md)
Learn the core concepts and API fundamentals.

### 3. [Webhooks](./webhooks.md)
Handle payment callbacks and status updates.

### 4. [FAQ](./faq.md)
Common questions and troubleshooting.

---

## Quick Example

```javascript
// Create a payment order
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
    notifyUrl: 'https://yoursite.com/webhook'
  })
});

const order = await response.json();
// Redirect user to order.paymentUrl
```

---

## Environments

| Environment | API Base URL | Purpose |
|-------------|--------------|---------|
| **Sandbox** | `https://sandbox-api.fusionxpay.site/api/v1` | Testing & Development |
| **Production** | `https://api.fusionxpay.site/api/v1` | Live payments |

---

## Need Help?

- 📖 [Full API Reference](./api-basics.md)
- 🐛 [Report Issues](https://github.com/Manho/fusionxpay-web/issues)
- 💬 [Community Discussions](https://github.com/Manho/fusionxpay-web/discussions)

---

## Next Steps

👉 **[Quick Start Guide →](./quick-start.md)**
