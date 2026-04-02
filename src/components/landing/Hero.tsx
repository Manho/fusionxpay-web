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
  {
    tone: "user",
    text: "Check recent payments and prepare a refund for transaction 87a46da7.",
  },
  {
    tone: "agent",
    text: "I'll search payments first, then prepare a refund.",
  },
  { tone: "blank", text: "" },
  { tone: "meta", text: "2 tool calls finished", hint: "(ctrl+o to expand)" },
  { tone: "tree", icon: "├─", text: "fusionx payment search --page 0 --size 20" },
  { tone: "tree", icon: "│  └─", text: "Done" },
  { tone: "tree", icon: "└─", text: "fusionx payment refund --transaction-id 87a46da7" },
  { tone: "tree", icon: "   └─", text: "Done" },
  { tone: "blank", text: "" },
  { tone: "muted", text: "Payments: 2 found" },
  {
    tone: "result",
    text: "- 87a46da7 | order 41205537 | USD 19.25 | SUCCESS",
  },
  {
    tone: "result",
    text: "- 1c4d55c2 | order ca14e290 | USD 18.75 | PROCESSING",
  },
  { tone: "warn", text: "Status: CONFIRMATION_REQUIRED" },
  { tone: "token", text: "Token: cfm_dc400d03" },
  { tone: "blank", text: "" },
  { tone: "agent", text: "Human confirmation required before any refund is executed.\nReply \"confirm\" to continue." },
  { tone: "blank", text: "" },
  { tone: "user", text: "Confirm the refund." },
  { tone: "blank", text: "" },
  { tone: "meta", text: "1 tool call finished", hint: "(ctrl+o to expand)" },
  { tone: "tree", icon: "└─", text: "fusionx payment confirm --token cfm_dc400d03" },
  { tone: "tree", icon: "   └─", text: "Done" },
  { tone: "blank", text: "" },
  { tone: "ok", text: "Status: CONFIRMED" },
  { tone: "ok", text: "Refund Status: SUCCESS" },
  { tone: "muted", text: "Refund ID: rf_9d12 | Amount: USD 19.25" },
  { tone: "agent", text: "Refund completed and recorded in the audit trail." },
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
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-[#2563eb]/30 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              style={{ transitionProperty: "opacity, transform", transitionDuration: "1000ms" }}
            >
              <Sparkles className="w-4 h-4 text-[var(--cream)]" />
              <span className="text-sm text-muted-foreground">
                Next-Gen Payment Gateway
              </span>
            </div>

            {/* Title */}
            <h1
              className={`text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight text-slate-800 dark:text-slate-200 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
              style={{ transitionProperty: "opacity, transform", transitionDuration: "1000ms", transitionDelay: "200ms" }}
            >
              AI-Powered
              <br />
              Payment Aggregation
            </h1>

            {/* Description - fixed for light mode readability */}
            <p
              className={`text-lg sm:text-xl text-muted-foreground max-w-lg leading-loose tracking-wide ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
              style={{ transitionProperty: "opacity, transform", transitionDuration: "1000ms", transitionDelay: "300ms" }}
            >
              A unified payment platform supporting Stripe, PayPal, and more. Securely manage operations through standard APIs, or empower any AI agent to automate your workflows via our developer CLI and built-in MCP server.
            </p>

            {/* CTA Buttons */}
            <div
              className={`flex flex-wrap gap-4 items-center ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
              style={{ transitionProperty: "opacity, transform", transitionDuration: "1000ms", transitionDelay: "500ms" }}
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
              className={`flex gap-8 pt-4 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
              style={{ transitionProperty: "opacity, transform", transitionDuration: "1000ms", transitionDelay: "700ms" }}
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
            className={`relative ${isLoaded ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"
              }`}
            style={{ transitionProperty: "opacity, transform", transitionDuration: "1000ms", transitionDelay: "300ms" }}
          >
            <div
              ref={imageRef}
              className="relative transition-transform duration-200 ease-out"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Glow Effect - adaptive for light/dark */}
              <div className="absolute -inset-4 bg-[#2563eb]/10 dark:bg-[#2563eb]/30 rounded-3xl blur-2xl" />

              {/* Terminal Window - Ghostty/Claude Code style */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-white dark:bg-[#0f0f11] border border-border/50 dark:border-white/10">
                {/* Terminal Header */}
                <div className="px-4 py-3 border-b border-border/50 dark:border-white/5 flex items-center bg-muted/30 dark:bg-[#18181b]">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                    <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                    <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                  </div>
                  <div className="flex-1 text-center mr-12">
                    <span className="text-[12px] font-medium text-muted-foreground font-mono tracking-wide">
                      claude — zsh
                    </span>
                  </div>
                </div>

                {/* Terminal Body */}
                <div className="p-4 sm:p-5 font-mono text-[11px] sm:text-[12px] leading-[1.6] sm:leading-[1.65] text-left">
                  {terminalLines.map((line, index) => (
                    <div
                      key={index}
                      className={`${
                          line.tone === "user" ? "text-slate-800 dark:text-zinc-100 flex items-start gap-3" :
                          line.tone === "agent" ? "text-slate-700 dark:text-zinc-300 flex items-start gap-3" :
                          line.tone === "meta" ? "flex items-start gap-3" :
                          line.tone === "shell" ? "text-[#2563eb] dark:text-blue-400 font-medium ml-[20px]" :
                          line.tone === "ok" ? "text-emerald-600 dark:text-emerald-400 font-medium ml-[20px]" :
                          line.tone === "warn" ? "text-amber-600 dark:text-amber-400 font-semibold ml-[20px]" :
                          line.tone === "token" ? "text-violet-600 dark:text-violet-400 ml-[20px]" :
                          line.tone === "tree" ? "" :
                          line.tone === "blank" ? "h-2" :
                          line.tone === "result" ? "text-slate-700 dark:text-zinc-300 ml-[20px]" :
                          "text-muted-foreground ml-[20px]"
                        } ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
                        }`}
                      style={{ 
                        transitionProperty: "opacity, transform",
                        transitionDuration: "700ms",
                        transitionDelay: `${500 + index * 120}ms` 
                      }}
                    >
                      {line.tone === "meta" ? (
                        <>
                          <div className="h-2 w-2 shrink-0 rounded-full bg-emerald-500 mt-[6px]" />
                          <div className="flex-1">
                            <span className="text-slate-800 dark:text-zinc-200">{line.text}</span>
                            <span className="text-slate-400 dark:text-slate-500 ml-2">{line.hint}</span>
                          </div>
                        </>
                      ) : line.tone === "tree" ? (
                        <div className="flex items-start">
                          <span className="text-slate-400 dark:text-slate-500 whitespace-pre shrink-0 ml-[0.5px]">{line.icon} </span>
                          <span className={`${line.text === "Done" ? "text-slate-500 dark:text-slate-500" : "text-[#2563eb] dark:text-blue-400"} break-words`}>{line.text}</span>
                        </div>
                      ) : line.tone === "user" ? (
                        <>
                          <span className="text-[#2563eb] dark:text-blue-400 font-medium shrink-0 pt-[1px]">{">"}</span>
                          <span className="whitespace-pre-wrap">{line.text}</span>
                        </>
                      ) : line.tone === "agent" ? (
                        <>
                          <div className="h-2 w-2 shrink-0 rounded-full bg-black dark:bg-white mt-[6px]" />
                          <span className="whitespace-pre-wrap flex-1">{line.text}</span>
                        </>
                      ) : (
                        <span className="whitespace-pre-wrap inline-block w-full">{line.text}</span>
                      )}
                    </div>
                  ))}
                  
                  {/* Blinking Cursor */}
                  <div 
                    className={`mt-1 flex items-center ${isLoaded ? "opacity-100" : "opacity-0"}`}
                    style={{ 
                      transitionProperty: "opacity",
                      transitionDuration: "700ms",
                      transitionDelay: `${500 + terminalLines.length * 120}ms` 
                    }}
                  >
                    <span className="text-[#2563eb] dark:text-blue-400 font-medium mr-2">{">"}</span>
                    <span className="w-2.5 h-5 bg-foreground/80 animate-pulse" />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
