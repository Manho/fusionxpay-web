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
                        How It Works
                    </span>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-3 mb-4">
                        Get Started in <span className="text-gradient">Simple Steps</span>
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                        From REST integration to AI-assisted operations in minutes, not months.
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
                                        <div className="text-xs opacity-70 hidden lg:block">
                                            Step {idx + 1}
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
                        <div className="rounded-xl overflow-hidden border border-border/60 shadow-xl">
                            <div className="flex items-center gap-2 px-4 py-2 border-b border-border/60 bg-muted/50">
                                <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                                <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                                <div className="flex-1" />
                                <span className="text-[10px] uppercase tracking-wider font-medium text-[#2563eb] dark:text-[#60a5fa]">
                                    {current.lang}
                                </span>
                            </div>
                            <div
                                className="text-xs sm:text-sm overflow-x-auto [&_pre]:m-0 [&_pre]:px-4 [&_pre]:py-4"
                                dangerouslySetInnerHTML={{ __html: current.highlightedCode }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
