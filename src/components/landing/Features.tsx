"use client";

import {
  Shield,
  Zap,
  Globe,
  BarChart3,
  Lock,
  RefreshCw,
} from "lucide-react";

const features = [
  {
    icon: Globe,
    title: "Multi-Channel Aggregation",
    description:
      "Integrate PayPal, Stripe, and 50+ payment providers through a single unified API endpoint.",
  },
  {
    icon: Zap,
    title: "Sub-300ms Latency",
    description:
      "Lightning-fast payment processing powered by our distributed microservices architecture.",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description:
      "PCI DSS Level 1 compliant with end-to-end encryption, tokenization, and fraud detection.",
  },
  {
    icon: BarChart3,
    title: "Real-Time Analytics",
    description:
      "Monitor transactions, revenue, and success rates with our comprehensive admin dashboard.",
  },
  {
    icon: Lock,
    title: "Smart Routing",
    description:
      "Automatically route payments through the optimal provider based on cost, speed, and reliability.",
  },
  {
    icon: RefreshCw,
    title: "Webhook Notifications",
    description:
      "Real-time event-driven notifications via Kafka for payment status updates and order lifecycle.",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-primary text-sm font-medium uppercase tracking-wider">
            Features
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-3 mb-4">
            Everything You Need to{" "}
            <span className="text-gradient">Accept Payments</span>
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            A complete payment infrastructure built with Spring Boot microservices,
            designed for reliability at any scale.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group glass rounded-2xl p-6 hover-lift cursor-default"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
