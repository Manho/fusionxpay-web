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
  },
  {
    name: "Sarah Johnson",
    role: "Head of Payments, ShopNow",
    content:
      "The real-time analytics dashboard is a game changer. We can monitor every transaction across all providers from one screen. Smart routing cut our processing costs by 15%.",
    rating: 5,
    avatar: "SJ",
  },
  {
    name: "Michael Park",
    role: "Lead Engineer, PayFlow",
    content:
      "As a developer, the API design is excellent. Clean RESTful endpoints, comprehensive webhooks, and the sandbox environment made integration a breeze.",
    rating: 5,
    avatar: "MP",
  },
  {
    name: "Emma Williams",
    role: "VP Engineering, GlobalMart",
    content:
      "We process thousands of transactions daily through FusionXPay. The 99.9% uptime SLA is not just a promise — they consistently deliver. The Kafka-based notifications are rock solid.",
    rating: 5,
    avatar: "EW",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-24 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-primary text-sm font-medium uppercase tracking-wider">
            Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-3 mb-4">
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
            <div key={t.name} className="glass rounded-2xl p-6 hover-lift">
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-primary text-primary"
                  />
                ))}
              </div>
              {/* Quote */}
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                &ldquo;{t.content}&rdquo;
              </p>
              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-semibold">
                  {t.avatar}
                </div>
                <div>
                  <div className="text-sm font-medium">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
