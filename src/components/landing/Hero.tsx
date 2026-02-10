"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, Shield, Globe, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const stats = [
  { value: "99.9%", label: "Uptime SLA" },
  { value: "<300ms", label: "Avg Latency" },
  { value: "50+", label: "Payment Methods" },
];

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = requestAnimationFrame(() => {
      setIsLoaded(true);
    });
    return () => cancelAnimationFrame(timer);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
      const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
      setMousePosition({ x, y });
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
      return () => container.removeEventListener("mousemove", handleMouseMove);
    }
  }, []);

  useEffect(() => {
    if (imageRef.current) {
      const rotateX = mousePosition.y * -8;
      const rotateY = mousePosition.x * 8;
      imageRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
    }
  }, [mousePosition]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen w-full overflow-hidden"
    >
      {/* Animated Background */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#2d1ef5]/20 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#ffe9a9]/10 rounded-full blur-[100px] animate-float-slow" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#2d1ef5]/10 rounded-full blur-[150px]" />

        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(var(--grid-line) 1px, transparent 1px),
                              linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 min-h-screen flex items-center pt-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center w-full py-12">
          {/* Left Column - Text */}
          <div className="space-y-8">
            {/* Badge */}
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-[#2d1ef5]/30 transition-all duration-1000 ${
                isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <Sparkles className="w-4 h-4 text-[#ffe9a9]" />
              <span className="text-sm text-muted-foreground">
                Next-Gen Payment Infrastructure
              </span>
            </div>

            {/* Title */}
            <h1
              className={`text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight transition-all duration-1000 delay-200 ${
                isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <span className="text-foreground">Unified Payments,</span>
              <br />
              <span className="text-gradient">Infinite Possibilities</span>
            </h1>

            {/* Description */}
            <p
              className={`text-lg sm:text-xl text-muted-foreground max-w-lg leading-relaxed transition-all duration-1000 delay-300 ${
                isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              Aggregate PayPal, Stripe, and 50+ payment channels through a single
              API. Built for developers, designed for scale.
            </p>

            {/* CTA Buttons */}
            <div
              className={`flex flex-wrap gap-4 transition-all duration-1000 delay-500 ${
                isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <Button
                size="lg"
                className="bg-[#2d1ef5] hover:bg-[#4a3fff] text-white px-8 py-6 text-lg rounded-xl group relative overflow-hidden"
                asChild
              >
                <Link href="/login">
                  <span className="relative z-10 flex items-center gap-2">
                    Start Integrating
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#4a3fff] to-[#2d1ef5] opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-border/70 text-foreground hover:bg-accent/70 px-8 py-6 text-lg rounded-xl"
                asChild
              >
                <a href="#features">View Documentation</a>
              </Button>
            </div>

            {/* Stats */}
            <div
              className={`flex gap-8 pt-4 transition-all duration-1000 delay-700 ${
                isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              {stats.map((stat, idx) => (
                <div key={stat.label} className="flex items-center gap-6">
                  <div>
                    <div className="text-2xl sm:text-3xl font-bold text-foreground">
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground/80">{stat.label}</div>
                  </div>
                  {idx < stats.length - 1 && (
                    <div className="w-px h-12 bg-border/60" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Dashboard Preview */}
          <div
            className={`relative transition-all duration-1000 delay-300 ${
              isLoaded ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"
            }`}
          >
            <div
              ref={imageRef}
              className="relative transition-transform duration-200 ease-out"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Glow Effect */}
              <div className="absolute -inset-4 bg-[#2d1ef5]/30 rounded-3xl blur-2xl" />

              {/* Dashboard Card */}
              <div className="relative glass rounded-2xl overflow-hidden border border-border/60 shadow-2xl">
                {/* Browser Bar */}
                <div className="p-4 border-b border-border/60 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                  <div className="flex-1 mx-4">
                    <div className="h-6 bg-accent/35 rounded-md max-w-md mx-auto flex items-center justify-center text-xs text-muted-foreground/80">
                      dashboard.fusionxpay.com
                    </div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="p-6 grid grid-cols-3 gap-4">
                  {[
                    { icon: Shield, label: "Transactions", val: "12,847", color: "#2d1ef5" },
                    { icon: Globe, label: "Revenue", val: "$2.4M", color: "#ffe9a9" },
                    { icon: Zap, label: "Success Rate", val: "99.2%", color: "#2d1ef5" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="glass rounded-xl p-4 text-center hover-glow cursor-default"
                    >
                      <item.icon
                        className="w-5 h-5 mx-auto mb-2"
                        style={{ color: item.color }}
                      />
                      <div className="text-lg sm:text-xl font-bold text-foreground">
                        {item.val}
                      </div>
                      <div className="text-xs text-muted-foreground/80">{item.label}</div>
                    </div>
                  ))}
                </div>

                {/* Chart */}
                <div className="px-6 pb-6">
                  <div className="h-32 bg-accent/35 rounded-xl flex items-end justify-around px-4 pb-4 gap-2">
                    {[40, 65, 45, 80, 55, 70, 90, 60, 75, 85, 50, 95].map(
                      (h, i) => (
                        <div
                          key={i}
                          className="flex-1 rounded-t-sm transition-all duration-300 hover:opacity-80"
                          style={{
                            height: `${h}%`,
                            background: `linear-gradient(to top, #2d1ef5, #6b5fff)`,
                          }}
                        />
                      )
                    )}
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-6 -right-6 w-20 h-20 bg-[#ffe9a9]/20 rounded-2xl backdrop-blur-xl border border-[#ffe9a9]/30 animate-float" />
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-[#2d1ef5]/30 rounded-full backdrop-blur-xl border border-[#2d1ef5]/40 animate-float-slow animate-pulse-glow" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
