"use client";

import { useState } from "react";
import { Bot, Code, Settings, Rocket } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { TerminalWindow } from "@/components/ui/TerminalWindow";

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
        <section id="how-it-works" className="py-24 relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#60a5fa]/5 rounded-full blur-[120px]" />
                <div className="absolute top-1/4 left-0 w-[400px] h-[400px] bg-[#8b5cf6]/5 rounded-full blur-[100px]" />
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header */}
                <motion.div 
                    className="text-center max-w-2xl mx-auto mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.7 }}
                >
                    <span className="text-[var(--cream)] text-sm font-medium uppercase tracking-wider">
                        How It Works
                    </span>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-3 mb-4">
                        Get Started in <span className="text-gradient">Simple Steps</span>
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                        From REST integration to AI-assisted operations in minutes, not months.
                    </p>
                </motion.div>

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
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all w-full relative overflow-hidden ${isActive
                                        ? "text-foreground"
                                        : "text-muted-foreground hover:text-foreground hover:bg-accent/35"
                                        }`}
                                >
                                    {isActive && (
                                        <motion.div 
                                            layoutId="activeTabIndicator"
                                            className="absolute inset-0 bg-[#2563eb]/10 border border-[#2563eb]/30 rounded-xl glow-blue pointer-events-none"
                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        />
                                    )}
                                    <Icon
                                        className="w-5 h-5 flex-shrink-0 relative z-10"
                                        style={{ color: isActive ? "#2563eb" : undefined }}
                                    />
                                    <div className="relative z-10">
                                        <div className="font-medium text-sm">
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
                    <div className="relative min-h-[400px]">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={current.id}
                                initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                                transition={{ duration: 0.3 }}
                                className="glass rounded-2xl p-6 sm:p-8 hover-glow h-full flex flex-col"
                            >
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

                                {/* Code Block via Standardized TerminalWindow */}
                                <div className="mt-auto pt-4">
                                    <TerminalWindow title={current.lang}>
                                        <div
                                            dangerouslySetInnerHTML={{ __html: current.highlightedCode }}
                                        />
                                    </TerminalWindow>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </section>
    );
}
