"use client";

import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Alex Chen",
    role: "CTO, TechScale Inc.",
    content:
      "FusionXPay simplified our payment stack dramatically. We went from managing 5 separate integrations to a single API. The microservices architecture gives us confidence in reliability.",
    rating: 5,
    avatar: "AC",
    highlight: true,
  },
  {
    name: "Sarah Johnson",
    role: "Head of Payments, ShopNow",
    content:
      "The real-time analytics dashboard is a game changer. We can monitor every transaction across all providers from one screen. Smart routing cut our processing costs by 15%.",
    rating: 5,
    avatar: "SJ",
    highlight: false,
  },
  {
    name: "Michael Park",
    role: "Lead Engineer, PayFlow",
    content:
      "As a developer, the API design is excellent. Clean RESTful endpoints, comprehensive webhooks, and the sandbox environment made integration a breeze.",
    rating: 5,
    avatar: "MP",
    highlight: false,
  },
  {
    name: "Emma Williams",
    role: "VP Engineering, GlobalMart",
    content:
      "We process thousands of transactions daily through FusionXPay. The 99.9% uptime SLA is not just a promise — they consistently deliver. The Kafka-based notifications are rock solid.",
    rating: 5,
    avatar: "EW",
    highlight: true,
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-24 relative">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-[#2d1ef5]/5 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[#2d1ef5] text-sm font-medium uppercase tracking-wider">
            Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-3 mb-4">
            Loved by <span className="text-gradient">Engineering Teams</span>
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            See why developers and businesses trust FusionXPay for their payment
            infrastructure.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className={`glass rounded-2xl p-6 hover-lift transition-all duration-300 ${
                t.highlight ? "hover-glow border-[#2d1ef5]/20" : ""
              }`}
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-[#ffe9a9] text-[#ffe9a9]"
                  />
                ))}
              </div>
              {/* Quote */}
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                &ldquo;{t.content}&rdquo;
              </p>
              {/* Author */}
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold"
                  style={{
                    backgroundColor: t.highlight ? "#2d1ef520" : "#ffe9a920",
                    color: t.highlight ? "#2d1ef5" : "#ffe9a9",
                  }}
                >
                  {t.avatar}
                </div>
                <div>
                  <div className="text-sm font-medium text-foreground">{t.name}</div>
                  <div className="text-xs text-muted-foreground/80">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
