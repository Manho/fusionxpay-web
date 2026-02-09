"use client";

import { Check } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Starter",
    price: "$0",
    period: "/month",
    description: "For side projects and testing",
    features: [
      "Up to 100 transactions/month",
      "2 payment providers",
      "Basic dashboard",
      "Email notifications",
      "Community support",
    ],
    cta: "Start Free",
    popular: false,
  },
  {
    name: "Pro",
    price: "$49",
    period: "/month",
    description: "For growing businesses",
    features: [
      "Up to 10,000 transactions/month",
      "All payment providers",
      "Advanced analytics",
      "Webhook notifications",
      "Smart routing",
      "Priority support",
    ],
    cta: "Get Started",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For large-scale operations",
    features: [
      "Unlimited transactions",
      "Custom integrations",
      "Dedicated infrastructure",
      "SLA guarantee (99.99%)",
      "24/7 dedicated support",
      "On-premise deployment",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 relative">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#ffe9a9]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#2d1ef5]/5 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[#ffe9a9] text-sm font-medium uppercase tracking-wider">
            Pricing
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-3 mb-4">
            Simple, <span className="text-gradient">Transparent</span> Pricing
          </h2>
          <p className="text-gray-400 leading-relaxed">
            Start free and scale as you grow. No hidden fees, no surprises.
          </p>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative glass rounded-2xl p-6 flex flex-col transition-all duration-300 hover-lift ${
                plan.popular
                  ? "border-[#2d1ef5]/50 glow-blue"
                  : "hover-glow"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[#2d1ef5] to-[#6b5fff] text-white text-xs font-medium">
                  Most Popular
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-1 text-white">{plan.name}</h3>
                <p className="text-xs text-gray-500 mb-4">{plan.description}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-sm text-gray-500">{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-400">
                    <Check
                      className="w-4 h-4 flex-shrink-0"
                      style={{ color: plan.popular ? "#2d1ef5" : "#ffe9a9" }}
                    />
                    {f}
                  </li>
                ))}
              </ul>

              <Button
                className={`w-full ${
                  plan.popular
                    ? "bg-[#2d1ef5] hover:bg-[#4a3fff] text-white"
                    : "bg-transparent border border-white/20 text-white hover:bg-white/10"
                }`}
                asChild
              >
                <Link href="/login">{plan.cta}</Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
