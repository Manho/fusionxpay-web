"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Github, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const stats = [
  { value: "8", label: "MCP Tools" },
  { value: "4", label: "Safety Layers" },
  { value: "11", label: "CLI Commands" },
];

const terminalLines = [
  { tone: "text-zinc-400", text: "> search_payments(status: \"SUCCESS\", from: \"2026-03-01\")" },
  { tone: "text-emerald-400", text: "✓ Found 3 payments for merchant M-123" },
  { tone: "text-zinc-400", text: "> refund_payment(transactionId: \"PAY-2026-001\", amount: \"50.00\")" },
  { tone: "text-amber-300", text: "⚠ CONFIRMATION_REQUIRED" },
  { tone: "text-zinc-500", text: "  Token: cfm_xxx  Expires: 5 min" },
  { tone: "text-zinc-400", text: "> confirm_action(token: \"cfm_xxx\")" },
  { tone: "text-emerald-400", text: "✓ Refund processed -> USD 50.00" },
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
                AI-Native Payment Infrastructure
              </span>
            </div>

            {/* Title */}
            <h1
              className={`text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight transition-all duration-1000 delay-200 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
            >
              <span className="text-foreground">AI-Powered Payments,</span>
              <br />
              <span className="text-gradient">Infinite Possibilities</span>
            </h1>

            {/* Description */}
            <p
              className={`text-lg sm:text-xl text-zinc-400 max-w-lg leading-loose tracking-wide transition-all duration-1000 delay-300 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
            >
              Operate your payment platform through AI agents, CLI, or API. The
              FusionXPay MCP Server connects Claude Desktop directly to merchant
              payment operations with confirmation gates, JWT isolation, and a
              full Kafka-backed audit trail.
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

          {/* Right Column - MCP Preview */}
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

              {/* Terminal Card */}
              <div className="relative glass bg-slate-900/40 rounded-2xl overflow-hidden border border-white/10 shadow-2xl backdrop-blur-md">
                {/* Browser Bar */}
                <div className="p-4 border-b border-border/60 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                  <div className="flex-1 mx-4">
                    <div className="h-6 bg-white/5 border border-white/5 rounded-md max-w-md mx-auto flex items-center justify-center text-[11px] tracking-widest text-zinc-400">
                      mcp.fusionx.fun
                    </div>
                  </div>
                </div>

                <div className="space-y-5 p-6">
                  <div className="rounded-2xl border border-white/10 bg-slate-950/65 p-5 font-mono text-sm leading-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                    {terminalLines.map((line, index) => (
                      <div
                        key={line.text}
                        className={`${line.tone} transition-all duration-700 ${
                          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                        }`}
                        style={{ transitionDelay: `${500 + index * 120}ms` }}
                      >
                        {line.text}
                      </div>
                    ))}
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="glass rounded-xl border border-[#2563eb]/20 p-4">
                      <div className="text-[11px] uppercase tracking-[0.24em] text-[#60a5fa]">
                        Merchant Scope
                      </div>
                      <div className="mt-2 text-lg font-semibold text-white">
                        {"JWT -> X-Merchant-Id"}
                      </div>
                      <p className="mt-1 text-sm text-zinc-400">
                        Gateway-enforced isolation keeps tools tied to the active merchant context.
                      </p>
                    </div>
                    <div className="glass rounded-xl border border-[#2563eb]/20 p-4">
                      <div className="text-[11px] uppercase tracking-[0.24em] text-[#60a5fa]">
                        Audit Trail
                      </div>
                      <div className="mt-2 text-lg font-semibold text-white">
                        {"Kafka -> Admin Service"}
                      </div>
                      <p className="mt-1 text-sm text-zinc-400">
                        MCP and CLI actions share one audit contract and land in the same persistence flow.
                      </p>
                    </div>
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
