import { highlightCode } from "@/lib/code-highlight";
import HowItWorksClient, { type HighlightedTab } from "./HowItWorksClient";

// Static tab data with raw code strings
const tabsData = [
  {
    id: "integrate",
    iconName: "Code" as const,
    label: "Integrate",
    title: "Simple API Integration",
    description:
      "Connect to our RESTful API with just a few lines of code. Our SDKs handle authentication, serialization, and error handling out of the box.",
    features: [
      "RESTful API with OpenAPI 3.0 spec",
      "SDKs for Java, Python, Node.js, and more",
      "Sandbox environment for testing",
      "Comprehensive webhook support",
    ],
    lang: "javascript",
    code: `// Create a payment order
const order = await fusionxpay.orders.create({
  amount: 99.99,
  currency: "USD",
  provider: "stripe",
  description: "Premium Plan",
  callbackUrl: "https://your-site.com/webhook"
});

// Redirect to payment
window.location.href = order.paymentUrl;`,
  },
  {
    id: "configure",
    iconName: "Settings" as const,
    label: "Configure",
    title: "Flexible Configuration",
    description:
      "Configure payment providers, routing rules, and notification preferences through our admin dashboard or API.",
    features: [
      "Multi-provider management",
      "Custom routing rules",
      "Real-time notifications via Kafka",
      "Role-based access control",
    ],
    lang: "javascript",
    code: `// Configure payment routing
const rule = await fusionxpay.routing.create({
  conditions: {
    amount: { gte: 100 },
    currency: "USD"
  },
  provider: "stripe",
  fallback: "paypal",
  priority: 1
});`,
  },
  {
    id: "ai",
    iconName: "Bot" as const,
    label: "AI Integrate",
    title: "AI-Native Operations",
    description:
      "Connect an AI agent through MCP or drive the same merchant-scoped workflows from the FusionXPay CLI.",
    features: [
      "8 MCP tools discoverable by Claude Desktop",
      "CLI commands for auth, orders, payments, and confirm flows",
      "Human-in-the-loop confirmation on write actions",
      "Kafka-backed audit records for every AI-facing operation",
    ],
    lang: "json",
    code: `// Claude Desktop config
{
  "mcpServers": {
    "fusionxpay": {
      "command": "java",
      "args": ["-jar", "ai-mcp-server-1.0.0.jar"],
      "env": {
        "FUSIONX_EMAIL": "merchant@example.com",
        "FUSIONX_PASSWORD": "merchant123",
        "FUSIONX_GATEWAY_BASE_URL": "https://api.fusionx.fun"
      }
    }
  }
}`,
  },
  {
    id: "launch",
    iconName: "Rocket" as const,
    label: "Go Live",
    title: "Production Ready",
    description:
      "Deploy with confidence. Our microservices architecture ensures 99.9% uptime with automatic failover and horizontal scaling.",
    features: [
      "99.9% uptime SLA",
      "Auto-scaling microservices",
      "Prometheus + Grafana monitoring",
      "Automated backup & recovery",
    ],
    lang: "json",
    code: `// GET /actuator/health
{
  "status": "UP",
  "components": {
    "gateway":      { "status": "UP" },
    "payment":      { "status": "UP" },
    "order":        { "status": "UP" },
    "notification": { "status": "UP" }
  }
}`,
  },
];

export default async function HowItWorks() {
  // Pre-highlight all code blocks server-side with Shiki
  const tabs: HighlightedTab[] = await Promise.all(
    tabsData.map(async (tab) => ({
      id: tab.id,
      iconName: tab.iconName,
      label: tab.label,
      title: tab.title,
      description: tab.description,
      features: tab.features,
      lang: tab.lang,
      highlightedCode: await highlightCode(tab.code, tab.lang),
    }))
  );

  return <HowItWorksClient tabs={tabs} />;
}
