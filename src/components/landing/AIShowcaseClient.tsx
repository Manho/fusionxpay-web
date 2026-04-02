"use client";

import { useEffect, useRef, useState } from "react";
import { Bot, ShieldCheck, Terminal } from "lucide-react";

const featureCards = [
  {
    icon: Bot,
    title: "MCP Server",
    description:
      "8 discoverable tools exposed over stdio via MCP. Features browser-based merchant authorization with device-code fallback for headless agents.",
  },
  {
    icon: Terminal,
    title: "Developer CLI",
    description:
      "11 merchant-scoped commands equipped with seamless browser login, confirmation-gated write operations, and an audit-aware terminal UI.",
  },
  {
    icon: ShieldCheck,
    title: "Comprehensive Safety",
    description:
      "Browser authorization, audience-scoped session tokens, AOP guardrails, and JWT merchant isolation strictly secure every AI-facing action.",
  },
];

export interface AIShowcaseTab {
  id: string;
  label: string;
  lang: string;
  highlightedCode: string;
}

interface Props {
  tabs: AIShowcaseTab[];
}

export default function AIShowcaseClient({ tabs }: Props) {
  const [activeTab, setActiveTab] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="ai-showcase" ref={sectionRef} className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-x-0 top-8 h-px bg-gradient-to-r from-transparent via-[#2563eb]/20 to-transparent" />
        <div className="absolute top-10 right-12 h-72 w-72 rounded-full bg-[#2563eb]/8 blur-[120px]" />
        <div className="absolute bottom-12 left-8 h-80 w-80 rounded-full bg-[#60a5fa]/8 blur-[140px]" />
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, rgba(37,99,235,0.9) 1px, transparent 1px), radial-gradient(circle at 80% 35%, rgba(96,165,250,0.9) 1px, transparent 1px), linear-gradient(120deg, transparent 48%, rgba(37,99,235,0.15) 49%, rgba(37,99,235,0.15) 51%, transparent 52%)",
            backgroundSize: "120px 120px, 160px 160px, 220px 220px",
          }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header section — always on top */}
        <div
          className={`mb-10 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
        >
          <span className="text-[#2563eb] text-sm font-medium uppercase tracking-[0.28em]">
            AI Integration
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-slate-800 dark:text-slate-200">
            Your Payment Platform,
            <br />
            Now AI-Native
          </h2>
          <p className="mt-5 max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed">
            Empower any AI agent to automate merchant tasks via the MCP server or the developer CLI.
            Every operation stays merchant-scoped, confirmation-gated, and fully audited.
          </p>
        </div>

        {/* Two-column layout with proper responsive behavior */}
        <div className="grid items-start gap-8 lg:grid-cols-2 xl:gap-12">
          {/* Left: feature cards — horizontal on small, stacked on mobile */}
          <div
            className={`transition-all duration-1000 delay-100 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
          >
            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              {featureCards.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.title}
                    className={`rounded-2xl border p-5 transition-all duration-700 hover:-translate-y-1 hover:shadow-lg
                      bg-white/60 dark:bg-white/5 border-slate-200/80 dark:border-[#2563eb]/10
                      backdrop-blur-sm ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                      }`}
                    style={{ transitionDelay: `${index * 120 + 120}ms` }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#2563eb]/10 text-[#2563eb]">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">
                          {feature.title}
                        </h3>
                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: code/demo panel */}
          <div
            className={`transition-all duration-1000 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              }`}
          >
            <div className="glass rounded-[28px] p-5 shadow-2xl">
              <div className="mb-4 flex flex-wrap items-center gap-2">
                {tabs.map((tab, index) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(index)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${activeTab === index
                        ? "bg-[#2563eb] text-white shadow-[0_0_20px_rgba(37,99,235,0.35)]"
                        : "bg-white/5 text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                      }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Code block — theme-aware, matching HowItWorks style */}
              <div className="relative overflow-hidden rounded-2xl shadow-2xl bg-white dark:bg-[#0f0f11] border border-border/50 dark:border-white/10">
                <div className="flex items-center gap-2 border-b border-border/50 dark:border-white/5 bg-muted/30 dark:bg-[#18181b] px-4 py-3">
                  <div className="flex gap-2">
                    <div className="h-3 w-3 rounded-full bg-[#ff5f56]" />
                    <div className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
                    <div className="h-3 w-3 rounded-full bg-[#27c93f]" />
                  </div>
                  <div className="flex-1" />
                  <span className="text-[11px] font-medium text-muted-foreground font-mono tracking-wider uppercase">
                    {tabs[activeTab].label}
                  </span>
                </div>
                <div
                  className="min-h-[380px] overflow-x-auto text-left font-mono text-[12px] sm:text-[13px] leading-[1.6] [&_pre]:m-0 [&_pre]:px-4 [&_pre]:py-5 sm:[&_pre]:px-6 sm:[&_pre]:py-6 [&_pre]:bg-transparent"
                  dangerouslySetInnerHTML={{ __html: tabs[activeTab].highlightedCode }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
