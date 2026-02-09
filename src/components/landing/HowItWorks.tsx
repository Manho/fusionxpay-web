"use client";

import { useState } from "react";
import { Code, Settings, Rocket } from "lucide-react";

const tabs = [
  {
    id: "integrate",
    icon: Code,
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
    icon: Settings,
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
    id: "launch",
    icon: Rocket,
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
    code: `// Health check endpoint
GET /actuator/health
{
  "status": "UP",
  "components": {
    "gateway": { "status": "UP" },
    "payment": { "status": "UP" },
    "order":   { "status": "UP" },
    "notification": { "status": "UP" }
  }
}`,
  },
];

export default function HowItWorks() {
  const [active, setActive] = useState(0);
  const current = tabs[active];

  return (
    <section id="how-it-works" className="py-24 relative">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#ffe9a9]/5 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[#ffe9a9] text-sm font-medium uppercase tracking-wider">
            How It Works
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-3 mb-4">
            Get Started in <span className="text-gradient">Three Steps</span>
          </h2>
          <p className="text-gray-400 leading-relaxed">
            From integration to production in minutes, not months.
          </p>
        </div>

        {/* Tabs */}
        <div className="grid lg:grid-cols-[280px_1fr] gap-8 max-w-5xl mx-auto">
          {/* Tab Nav */}
          <div className="flex lg:flex-col gap-2">
            {tabs.map((tab, idx) => {
              const Icon = tab.icon;
              const isActive = active === idx;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActive(idx)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all w-full ${
                    isActive
                      ? "bg-[#2d1ef5]/10 border border-[#2d1ef5]/30 glow-blue"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon
                    className="w-5 h-5 flex-shrink-0"
                    style={{ color: isActive ? "#2d1ef5" : undefined }}
                  />
                  <div>
                    <div
                      className="font-medium text-sm"
                      style={{ color: isActive ? "#fff" : undefined }}
                    >
                      {tab.label}
                    </div>
                    <div className="text-xs opacity-70 hidden lg:block">
                      Step {idx + 1}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="glass rounded-2xl p-6 sm:p-8 hover-glow">
            <h3 className="text-xl font-semibold mb-2 text-white">
              {current.title}
            </h3>
            <p className="text-gray-400 text-sm mb-6">{current.description}</p>
            <ul className="space-y-2 mb-6">
              {current.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-gray-400">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#2d1ef5] flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            {/* Code Block */}
            <div className="rounded-xl bg-[#0a0a0a] border border-white/10 overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-2 border-b border-white/10 bg-white/5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
              </div>
              <pre className="p-4 text-xs sm:text-sm overflow-x-auto">
                <code className="text-gray-400">{current.code}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
