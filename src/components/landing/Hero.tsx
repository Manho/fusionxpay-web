"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Github, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform } from "framer-motion";
import { TerminalWindow } from "@/components/ui/TerminalWindow";

const stats = [
  { value: "8", label: "MCP Tools" },
  { value: "4", label: "Safety Layers" },
  { value: "11", label: "CLI Commands" },
];

const terminalLines = [
  { tone: "cmd", text: "> search_payments(status: \"SUCCESS\", from: \"2026-03-01\")" },
  { tone: "ok", text: "✓ Found 3 payments for merchant M-123" },
  { tone: "cmd", text: "> refund_payment(transactionId: \"PAY-2026-001\", amount: \"50.00\")" },
  { tone: "warn", text: "⚠ CONFIRMATION_REQUIRED" },
  { tone: "muted", text: "  Token: cfm_xxx  Expires: 5 min" },
  { tone: "cmd", text: "> confirm_action(token: \"cfm_xxx\")" },
  { tone: "ok", text: "✓ Refund processed -> USD 50.00" },
];

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / 25;
    const y = (e.clientY - rect.top - rect.height / 2) / 25;
    setMousePosition({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 });
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-screen w-full overflow-hidden"
    >
      {/* Animated Background */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Gradient Orbs - Subdued for enterprise feel, enhanced with violet */}
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#2563eb]/5 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#8b5cf6]/5 rounded-full blur-[100px] animate-float-slow" />
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
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", staggerChildren: 0.1 }}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-[#2563eb]/30"
            >
              <Sparkles className="w-4 h-4 text-[#8b5cf6]" />
              <span className="text-sm text-muted-foreground">
                AI-Native Payment Infrastructure
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight"
            >
              <span className="text-foreground">AI-Powered Payments,</span>
              <br />
              <span className="text-gradient">Infinite Possibilities</span>
            </motion.h1>

            {/* Description - fixed for light mode readability */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-lg sm:text-xl text-muted-foreground max-w-lg leading-loose tracking-wide"
            >
              Operate your payment platform through AI agents, CLI, or API. The
              FusionXPay MCP Server connects Claude Desktop directly to merchant
              payment operations with confirmation gates, JWT isolation, and a
              full Kafka-backed audit trail.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap gap-4 items-center"
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
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex gap-8 pt-4"
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
            </motion.div>
          </motion.div>

          {/* Right Column - MCP Preview */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            style={{ y: y1 }}
            className="relative"
          >
            <motion.div
              animate={{
                rotateX: mousePosition.y * -1,
                rotateY: mousePosition.x,
              }}
              transition={{ type: "spring", stiffness: 100, damping: 30, mass: 0.5 }}
              className="relative"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Glow Effect - adaptive for light/dark */}
              <div className="absolute -inset-4 bg-[#8b5cf6]/10 dark:bg-[#8b5cf6]/20 rounded-3xl blur-2xl" />

              {/* Terminal Card — theme-aware */}
              <div className="relative glass rounded-2xl overflow-hidden shadow-2xl">
                {/* Browser Bar */}
                <div className="p-4 border-b border-border/60 flex items-center gap-2 bg-muted/50">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                  <div className="flex-1 mx-4">
                    <div className="h-6 bg-muted/80 border border-border/60 rounded-md max-w-md mx-auto flex items-center justify-center text-[11px] tracking-widest text-muted-foreground">
                      mcp.fusionx.fun
                    </div>
                  </div>
                </div>

                <div className="space-y-5 p-6">
                  {/* Standardized Terminal Block */}
                  <TerminalWindow title="MCP" className="shadow-none">
                    <div className="font-mono text-sm leading-7">
                      {terminalLines.map((line, index) => (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.8 + index * 0.15 }}
                          key={index}
                          className={`
                            ${line.tone === "cmd" ? "text-slate-400" : ""}
                            ${line.tone === "ok" ? "text-emerald-400" : ""}
                            ${line.tone === "warn" ? "text-amber-400 font-semibold" : ""}
                            ${line.tone === "muted" ? "text-slate-500" : ""}
                          `}
                        >
                          {line.text}
                        </motion.div>
                      ))}
                    </div>
                  </TerminalWindow>

                  <div className="grid gap-4 sm:grid-cols-2">
                    {/* Info cards — glass style */}
                    <div className="glass rounded-xl border border-[#8b5cf6]/20 p-4 hover-glow transition-all duration-300">
                      <div className="text-[11px] uppercase tracking-[0.24em] text-[#8b5cf6] dark:text-[#a78bfa]">
                        Merchant Scope
                      </div>
                      <div className="mt-2 text-lg font-semibold text-foreground">
                        {"JWT -> X-Merchant-Id"}
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Gateway-enforced isolation keeps tools tied to the active merchant context.
                      </p>
                    </div>
                    <div className="glass rounded-xl border border-[#2563eb]/20 p-4 hover-glow transition-all duration-300">
                      <div className="text-[11px] uppercase tracking-[0.24em] text-[#2563eb] dark:text-[#60a5fa]">
                        Audit Trail
                      </div>
                      <div className="mt-2 text-lg font-semibold text-foreground">
                        {"Kafka -> Admin Service"}
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        MCP and CLI actions share one audit contract and land in the same persistence flow.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <motion.div 
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-6 -right-6 w-20 h-20 bg-[#60a5fa]/20 rounded-2xl backdrop-blur-xl border border-[#60a5fa]/30" 
              />
              <motion.div 
                animate={{ y: [0, 15, 0], rotate: [0, 10, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-4 -left-4 w-16 h-16 bg-[#8b5cf6]/30 rounded-full backdrop-blur-xl border border-[#8b5cf6]/40 glow-violet" 
              />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
}
