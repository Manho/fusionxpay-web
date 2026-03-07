"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, Shield, Globe, Zap, Github } from "lucide-react";
import { Button } from "@/components/ui/button";

function useCountUp(target: string, duration: number = 1500, start: boolean = false) {
  const [value, setValue] = useState("0");
  const hasNumber = /\d/.test(target);

  const animate = useCallback(() => {
    if (!hasNumber || !start) {
      if (start) setValue(target);
      return;
    }
    const numMatch = target.match(/([\d,.]+)/);
    if (!numMatch) { setValue(target); return; }
    const numStr = numMatch[1].replace(/,/g, "");
    const endVal = parseFloat(numStr);
    const prefix = target.slice(0, target.indexOf(numMatch[1]));
    const suffix = target.slice(target.indexOf(numMatch[1]) + numMatch[1].length);
    const hasComma = numMatch[1].includes(",");
    const hasDecimal = numMatch[1].includes(".");
    const decimalPlaces = hasDecimal ? numMatch[1].split(".")[1].length : 0;
    const startTime = performance.now();

    const step = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = eased * endVal;
      let formatted: string;
      if (hasDecimal) {
        formatted = current.toFixed(decimalPlaces);
      } else {
        formatted = Math.round(current).toString();
      }
      if (hasComma) {
        formatted = Number(formatted).toLocaleString();
      }
      setValue(prefix + formatted + suffix);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, hasNumber, start]);

  useEffect(() => {
    const id = requestAnimationFrame(() => { animate(); });
    return () => cancelAnimationFrame(id);
  }, [animate]);
  return value;
}

const stats = [
  { value: "99.9%", label: "Uptime SLA" },
  { value: "<300ms", label: "Avg Latency" },
  { value: "6", label: "Microservices" },
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
        {/* Gradient Orbs - Subdued for enterprise feel */}
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#2563eb]/5 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#60a5fa]/2 rounded-full blur-[100px] animate-float-slow" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#2563eb]/2 rounded-full blur-[150px]" />

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
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-[#2563eb]/30 transition-all duration-1000 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
            >
              <Sparkles className="w-4 h-4 text-[var(--cream)]" />
              <span className="text-sm text-muted-foreground">
                Next-Gen Payment Infrastructure
              </span>
            </div>

            {/* Title */}
            <h1
              className={`text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight transition-all duration-1000 delay-200 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
            >
              <span className="text-foreground">Unified Payments,</span>
              <br />
              <span className="text-gradient">Infinite Possibilities</span>
            </h1>

            {/* Description */}
            <p
              className={`text-lg sm:text-xl text-zinc-400 max-w-lg leading-loose tracking-wide transition-all duration-1000 delay-300 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
            >
              Aggregate PayPal, Stripe, and more payment channels through a single
              API. Built with Spring Boot microservices, designed for scale.
            </p>

            {/* CTA Buttons */}
            <div
              className={`flex flex-wrap gap-4 items-center transition-all duration-1000 delay-500 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
            >
              <Button
                size="lg"
                className="bg-gradient-to-r from-[#2563eb] to-[#3b82f6] hover:from-[#1d4ed8] hover:to-[#60a5fa] text-white px-8 py-6 text-lg rounded-xl group relative overflow-hidden shadow-[0_0_30px_rgba(37,99,235,0.3)] border border-[#3b82f6]/50 transition-all duration-300"
                asChild
              >
                <Link href="/login">
                  <span className="relative z-10 flex items-center gap-2">
                    Live Demo
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#3b82f6] to-[#2563eb] opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-border/70 text-foreground hover:bg-accent/70 px-8 py-6 text-lg rounded-xl"
                asChild
              >
                <Link href="/docs">Documentation</Link>
              </Button>
              <a
                href="https://github.com/Manho/FusionXPay"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
              >
                <Github className="w-5 h-5" />
                View on GitHub
              </a>
            </div>

            {/* Stats */}
            <div
              className={`flex gap-8 pt-4 transition-all duration-1000 delay-700 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
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
            className={`relative transition-all duration-1000 delay-300 ${isLoaded ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"
              }`}
          >
            <div
              ref={imageRef}
              className="relative transition-transform duration-200 ease-out"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Glow Effect */}
              <div className="absolute -inset-4 bg-[#2563eb]/30 rounded-3xl blur-2xl" />

              {/* Dashboard Card */}
              <div className="relative glass bg-slate-900/40 rounded-2xl overflow-hidden border border-white/10 shadow-2xl backdrop-blur-md">
                {/* Browser Bar */}
                <div className="p-4 border-b border-border/60 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                  <div className="flex-1 mx-4">
                    <div className="h-6 bg-white/5 border border-white/5 rounded-md max-w-md mx-auto flex items-center justify-center text-[11px] tracking-widest text-zinc-400">
                      dashboard.fusionx.fun
                    </div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="p-6 grid grid-cols-3 gap-4">
                  {[
                    { icon: Shield, label: "Transactions", val: "12,847", color: "#2563eb" },
                    { icon: Globe, label: "Revenue", val: "$2.4M", color: "#60a5fa" },
                    { icon: Zap, label: "Success Rate", val: "99.2%", color: "#2563eb" },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <DashboardStatCard key={item.label} icon={Icon} label={item.label} val={item.val} color={item.color} isLoaded={isLoaded} />
                    );
                  })}
                </div>

                {/* Chart */}
                <div className="px-6 pb-6">
                  <div className="h-32 bg-white/5 border border-white/5 rounded-xl flex items-end justify-around px-4 pb-4 gap-2">
                    {[40, 65, 45, 80, 55, 70, 90, 60, 75, 85, 50, 95].map(
                      (h, i) => (
                        <div
                          key={i}
                          className="flex-1 rounded-t-sm transition-all duration-300 hover:opacity-80"
                          style={{
                            height: `${h}%`,
                            background: `linear-gradient(to top, #2563eb, #3b82f6)`,
                          }}
                        />
                      )
                    )}
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-6 -right-6 w-20 h-20 bg-[#60a5fa]/20 rounded-2xl backdrop-blur-xl border border-[#60a5fa]/30 animate-float" />
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-[#2563eb]/30 rounded-full backdrop-blur-xl border border-[#2563eb]/40 animate-float-slow animate-pulse-glow" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}

function DashboardStatCard({ icon: Icon, label, val, color, isLoaded }: {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  label: string;
  val: string;
  color: string;
  isLoaded: boolean;
}) {
  const animatedVal = useCountUp(val, 1800, isLoaded);
  return (
    <div className="glass rounded-xl p-4 text-center hover-glow cursor-default">
      <Icon className="w-5 h-5 mx-auto mb-2" style={{ color }} />
      <div className="text-lg sm:text-xl font-bold text-foreground">
        {animatedVal}
      </div>
      <div className="text-xs text-muted-foreground/80">{label}</div>
    </div>
  );
}
