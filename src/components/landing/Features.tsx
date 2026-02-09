"use client";

import { useEffect, useRef, useState } from "react";
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
    color: "#2d1ef5",
  },
  {
    icon: Zap,
    title: "Sub-300ms Latency",
    description:
      "Lightning-fast payment processing powered by our distributed microservices architecture.",
    color: "#ffe9a9",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description:
      "PCI DSS Level 1 compliant with end-to-end encryption, tokenization, and fraud detection.",
    color: "#2d1ef5",
  },
  {
    icon: BarChart3,
    title: "Real-Time Analytics",
    description:
      "Monitor transactions, revenue, and success rates with our comprehensive admin dashboard.",
    color: "#ffe9a9",
  },
  {
    icon: Lock,
    title: "Smart Routing",
    description:
      "Automatically route payments through the optimal provider based on cost, speed, and reliability.",
    color: "#2d1ef5",
  },
  {
    icon: RefreshCw,
    title: "Webhook Notifications",
    description:
      "Real-time event-driven notifications via Kafka for payment status updates and order lifecycle.",
    color: "#ffe9a9",
  },
];

export default function Features() {
  const [visibleItems, setVisibleItems] = useState<number[]>([]);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = Number(entry.target.getAttribute("data-index"));
          if (entry.isIntersecting && !visibleItems.includes(index)) {
            setVisibleItems((prev) => [...prev, index]);
          }
        });
      },
      { threshold: 0.2 }
    );

    itemRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [visibleItems]);

  return (
    <section id="features" className="py-24 relative">
      {/* Background gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#2d1ef5]/5 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[#2d1ef5] text-sm font-medium uppercase tracking-wider">
            Features
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-3 mb-4">
            Everything You Need to{" "}
            <span className="text-gradient">Accept Payments</span>
          </h2>
          <p className="text-gray-400 leading-relaxed">
            A complete payment infrastructure built with Spring Boot microservices,
            designed for reliability at any scale.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            const isVisible = visibleItems.includes(idx);
            return (
              <div
                key={feature.title}
                ref={(el) => { itemRefs.current[idx] = el; }}
                data-index={idx}
                className={`group glass rounded-2xl p-6 hover-lift hover-glow cursor-default transition-all duration-700 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${idx * 100}ms` }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110"
                  style={{ backgroundColor: `${feature.color}20` }}
                >
                  <Icon className="w-6 h-6" style={{ color: feature.color }} />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-white">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
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
