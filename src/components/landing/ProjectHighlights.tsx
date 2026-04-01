"use client";

import { useEffect, useRef, useState } from "react";
import {
    Bot,
    Server,
    Shield,
    ShieldCheck,
    Terminal,
    ScrollText,
} from "lucide-react";

const highlights = [
    {
        icon: Server,
        stat: "5",
        label: "Core Services",
        description:
            "API Gateway, admin-service, order-service, payment-service, and notification-service remain the backend core behind the AI layer.",
        color: "#2563eb",
        tags: ["Spring Boot 3.5", "Spring Cloud", "JWT"],
    },
    {
        icon: Bot,
        stat: "8",
        label: "MCP Tools",
        description:
            "Merchant-scoped MCP tools cover payments, orders, confirmation flows, and safe read/write operations over stdio.",
        color: "#2563eb",
        tags: ["Spring AI", "Claude Desktop", "stdio"],
    },
    {
        icon: Terminal,
        stat: "11",
        label: "CLI Commands",
        description:
            "The AI CLI mirrors the MCP surface with auth, order, payment, refund, and confirm flows backed by the same gateway contracts.",
        color: "#2563eb",
        tags: ["Picocli", "Merchant Scope", "Shared DTOs"],
    },
    {
        icon: ShieldCheck,
        stat: "4",
        label: "Safety Layers",
        description:
            "Input validation, structural tool constraints, gateway isolation, and output redaction keep AI-facing actions within safe boundaries.",
        color: "#2563eb",
        tags: ["AOP", "Confirmation Gate", "Redaction"],
    },
    {
        icon: Shield,
        stat: "2",
        label: "Payment Providers",
        description:
            "Stripe and PayPal flows cover initiation, webhook-driven lifecycle updates, and guarded refund operations.",
        color: "#2563eb",
        tags: ["Stripe", "PayPal", "Refunds"],
    },
    {
        icon: ScrollText,
        stat: "1",
        label: "Audit Pipeline",
        description:
            "CLI and MCP operations publish a shared audit schema to Kafka, then Admin Service persists the records for end-to-end traceability.",
        color: "#2563eb",
        tags: ["Kafka", "Admin Service", "ai-audit-log"],
    },
];

export default function ProjectHighlights() {
    const [visibleItems, setVisibleItems] = useState<number[]>([]);
    const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const index = Number(entry.target.getAttribute("data-index"));
                    if (entry.isIntersecting && !visibleItems.includes(index)) {
                        setVisibleItems((prev) => [...prev, index]);
                    }
                });
            },
            { threshold: 0.2 }
        );

        itemRefs.current.forEach((ref) => {
            if (ref) observer.observe(ref);
        });

        return () => observer.disconnect();
    }, [visibleItems]);

    return (
        <section id="highlights" className="py-24 relative">
            {/* Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-[#2563eb]/5 rounded-full blur-[120px]" />
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header */}
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <span className="text-[#2563eb] text-sm font-medium uppercase tracking-wider">
                        What I Built
                    </span>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-3 mb-4">
                        Project <span className="text-gradient">Highlights</span>
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                        Key engineering decisions behind the payment platform, AI
                        interface layer, and safety model shown on this site.
                    </p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    {highlights.map((item, idx) => {
                        const Icon = item.icon;
                        const isVisible = visibleItems.includes(idx);
                        return (
                            <div
                                key={item.label}
                                ref={(el) => {
                                    itemRefs.current[idx] = el;
                                }}
                                data-index={idx}
                                className={`group glass rounded-2xl p-6 hover-lift transition-all duration-700 ${isVisible
                                    ? "opacity-100 translate-y-0"
                                    : "opacity-0 translate-y-8"
                                    }`}
                                style={{ transitionDelay: `${idx * 100}ms` }}
                            >
                                {/* Stat + Icon row */}
                                <div className="flex items-center gap-3 mb-3">
                                    <div
                                        className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                                        style={{ backgroundColor: `${item.color}20` }}
                                    >
                                        <Icon
                                            className="w-5 h-5"
                                            style={{ color: item.color }}
                                        />
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-foreground leading-none">
                                            {item.stat}
                                        </div>
                                        <div className="text-xs text-muted-foreground/80">
                                            {item.label}
                                        </div>
                                    </div>
                                </div>

                                {/* Description */}
                                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                                    {item.description}
                                </p>

                                {/* Tags */}
                                <div className="flex flex-wrap gap-1.5">
                                    {item.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="text-[10px] px-2 py-0.5 rounded-full bg-accent/50 text-muted-foreground/80"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
