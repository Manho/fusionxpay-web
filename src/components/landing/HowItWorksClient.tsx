"use client";

import { useState } from "react";
import { Bot, Code, Settings, Rocket } from "lucide-react";

const iconMap = { Code, Settings, Bot, Rocket } as const;
type IconName = keyof typeof iconMap;

export interface HighlightedTab {
    id: string;
    iconName: IconName;
    label: string;
    title: string;
    description: string;
    features: string[];
    highlightedCode: string;
    lang: string;
}

interface Props {
    tabs: HighlightedTab[];
}

export default function HowItWorksClient({ tabs }: Props) {
    const [active, setActive] = useState(0);
    const current = tabs[active];

    return (
        <section id="how-it-works" className="py-24 relative">
            {/* Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#60a5fa]/5 rounded-full blur-[120px]" />
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header */}
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <span className="text-[var(--cream)] text-sm font-medium uppercase tracking-wider">
                        Platform Capabilities
                    </span>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-3 mb-4 text-slate-800 dark:text-slate-200">
                        Unleash Your Payment Infrastructure
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                        Experience seamless API integrations, flexible routing configurations, and native AI operations out of the box.
                    </p>
                </div>

                {/* Tabs */}
                <div className="grid lg:grid-cols-[280px_1fr] gap-8 max-w-5xl mx-auto">
                    {/* Tab Nav */}
                    <div className="flex lg:flex-col gap-2">
                        {tabs.map((tab, idx) => {
                            const Icon = iconMap[tab.iconName];
                            const isActive = active === idx;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActive(idx)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all w-full ${isActive
                                        ? "bg-[#2563eb]/10 border border-[#2563eb]/30 glow-blue"
                                        : "text-muted-foreground hover:text-foreground hover:bg-accent/35"
                                        }`}
                                >
                                    <Icon
                                        className="w-5 h-5 flex-shrink-0"
                                        style={{ color: isActive ? "#2563eb" : undefined }}
                                    />
                                    <div>
                                        <div
                                            className={`font-medium text-sm ${isActive ? "text-foreground" : ""}`}
                                        >
                                            {tab.label}
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Tab Content */}
                    <div className="glass rounded-2xl p-6 sm:p-8 hover-glow">
                        <h3 className="text-xl font-semibold mb-2 text-foreground">
                            {current.title}
                        </h3>
                        <p className="text-muted-foreground text-sm mb-6">{current.description}</p>
                        <ul className="space-y-2 mb-6">
                            {current.features.map((f) => (
                                <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#2563eb] flex-shrink-0" />
                                    {f}
                                </li>
                            ))}
                        </ul>

                        {/* Code Block */}
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-white dark:bg-[#0f0f11] border border-border/50 dark:border-white/10">
                            <div className="px-4 py-3 border-b border-border/50 dark:border-white/5 flex items-center bg-muted/30 dark:bg-[#18181b]">
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                                    <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                                    <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                                </div>
                                <div className="flex-1" />
                                <span className="text-[11px] font-medium text-muted-foreground font-mono tracking-wider uppercase">
                                    {current.lang}
                                </span>
                            </div>
                            <div
                                className="font-mono text-[12px] sm:text-[13px] leading-[1.6] text-left overflow-x-auto [&_pre]:m-0 [&_pre]:px-4 [&_pre]:py-5 sm:[&_pre]:px-6 sm:[&_pre]:py-6 [&_pre]:bg-transparent"
                                dangerouslySetInnerHTML={{ __html: current.highlightedCode }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
