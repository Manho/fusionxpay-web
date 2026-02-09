"use client";

import Link from "next/link";
import { ArrowRight, Shield, Zap, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

const stats = [
  { value: "99.9%", label: "Uptime SLA" },
  { value: "<300ms", label: "Avg Latency" },
  { value: "50+", label: "Payment Methods" },
];

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(245,158,11,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(245,158,11,0.3) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        {/* Gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-primary/10 blur-[120px] animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-primary/5 blur-[100px] animate-pulse-glow [animation-delay:1.5s]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-sm text-muted-foreground mb-8">
            <Zap className="w-4 h-4 text-primary" />
            <span>Enterprise-Grade Payment Infrastructure</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
            Unified Payments,{" "}
            <span className="text-gradient">Infinite Possibilities</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Aggregate PayPal, Stripe, and 50+ payment channels through a single
            API. Built for developers, designed for scale.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button size="lg" className="text-base px-8" asChild>
              <Link href="/login">
                Start Integrating <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-base px-8" asChild>
              <a href="#features">View Documentation</a>
            </Button>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-16">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-gradient mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Dashboard Preview */}
        <div className="mt-20 max-w-5xl mx-auto">
          <div className="relative">
            <div className="absolute -inset-4 bg-primary/5 rounded-2xl blur-2xl" />
            <div className="relative glass rounded-2xl p-1 glow-amber">
              <div className="rounded-xl bg-card overflow-hidden">
                {/* Mock Dashboard UI */}
                <div className="p-4 border-b border-border flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-destructive/60" />
                  <div className="w-3 h-3 rounded-full bg-primary/40" />
                  <div className="w-3 h-3 rounded-full bg-green-500/40" />
                  <div className="flex-1 mx-4">
                    <div className="h-6 bg-muted rounded-md max-w-md mx-auto flex items-center justify-center text-xs text-muted-foreground">
                      dashboard.fusionxpay.com
                    </div>
                  </div>
                </div>
                <div className="p-6 sm:p-8 grid grid-cols-3 gap-4">
                  {[
                    { icon: Shield, label: "Transactions", val: "12,847" },
                    { icon: Globe, label: "Revenue", val: "$2.4M" },
                    { icon: Zap, label: "Success Rate", val: "99.2%" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="glass rounded-xl p-4 text-center"
                    >
                      <item.icon className="w-5 h-5 text-primary mx-auto mb-2" />
                      <div className="text-lg sm:text-xl font-bold">{item.val}</div>
                      <div className="text-xs text-muted-foreground">{item.label}</div>
                    </div>
                  ))}
                </div>
                {/* Chart placeholder */}
                <div className="px-6 sm:px-8 pb-6 sm:pb-8">
                  <div className="h-32 bg-muted/30 rounded-xl flex items-end justify-around px-4 pb-4 gap-2">
                    {[40, 65, 45, 80, 55, 70, 90, 60, 75, 85, 50, 95].map(
                      (h, i) => (
                        <div
                          key={i}
                          className="flex-1 bg-primary/30 rounded-t-sm"
                          style={{ height: `${h}%` }}
                        />
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
