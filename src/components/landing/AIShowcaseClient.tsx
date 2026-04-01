"use client";

import { useEffect, useRef, useState } from "react";
import { Bot, ShieldCheck, Terminal } from "lucide-react";

const featureCards = [
  {
    icon: Bot,
    title: "MCP Server",
    description:
      "8 discoverable tools exposed over stdio so Claude Desktop can call payment operations natively.",
  },
  {
    icon: Terminal,
    title: "Developer CLI",
    description:
      "11 merchant-scoped commands covering auth, orders, payments, confirmation flows, and audit-aware terminal output.",
  },
  {
    icon: ShieldCheck,
    title: "4-Layer Safety",
    description:
      "Input validation, AOP audit, output scrubbing, and JWT merchant isolation protect every AI-facing action.",
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
      { threshold: 0.2 }
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
        <div className="grid items-start gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-12">
          <div
            className={`transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <span className="text-[#2563eb] text-sm font-medium uppercase tracking-[0.28em]">
              AI Integration
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
              Your Payment Platform,
              <br />
              <span className="text-gradient">Now AI-Native</span>
            </h2>
            <p className="mt-5 max-w-xl text-base sm:text-lg text-muted-foreground leading-relaxed">
              Connect Claude Desktop, automate merchant tasks with the CLI, or
              wire AI agents into the same payment surface. Every operation stays
              merchant-scoped, confirmation-gated, and fully audited.
            </p>

            <div className="mt-8 space-y-4">
              {featureCards.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.title}
                    className={`glass hover-lift rounded-2xl border border-[#2563eb]/10 p-5 transition-all duration-700 ${
                      isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                    }`}
                    style={{ transitionDelay: `${index * 120 + 120}ms` }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#2563eb]/10 text-[#2563eb]">
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

          <div
            className={`transition-all duration-1000 delay-150 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
            }`}
          >
            <div className="glass rounded-[28px] border border-white/10 bg-slate-900/40 p-5 shadow-2xl backdrop-blur-xl">
              <div className="mb-4 flex flex-wrap items-center gap-2">
                {tabs.map((tab, index) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(index)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                      activeTab === index
                        ? "bg-[#2563eb] text-white shadow-[0_0_20px_rgba(37,99,235,0.35)]"
                        : "bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-950/70">
                <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
                  <div className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
                  <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
                  <div className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
                  <div className="ml-auto text-[10px] uppercase tracking-[0.28em] text-[#60a5fa]">
                    {tabs[activeTab].label}
                  </div>
                </div>
                <div
                  className="min-h-[420px] overflow-x-auto text-xs sm:text-sm [&_pre]:m-0 [&_pre]:px-4 [&_pre]:py-5 [&_.shiki]:min-h-[420px] [&_.shiki]:bg-transparent!"
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
