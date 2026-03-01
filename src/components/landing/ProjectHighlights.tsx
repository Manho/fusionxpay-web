"use client";

import { useEffect, useRef, useState } from "react";
import {
    GitBranch,
    TestTubeDiagonal,
    Server,
    Activity,
    Shield,
    Layers,
} from "lucide-react";

const highlights = [
    {
        icon: Layers,
        stat: "6",
        label: "Microservices",
        description:
            "Independently deployable services with Spring Cloud Gateway, Eureka discovery, and Kafka event-driven communication.",
        color: "#2d1ef5",
        tags: ["Spring Boot 3.2", "Spring Cloud", "REST API"],
    },
    {
        icon: TestTubeDiagonal,
        stat: "150+",
        label: "Tests",
        description:
            "Comprehensive test coverage with JUnit 5 unit tests, Testcontainers integration tests, WireMock provider simulation, Vitest, and Playwright E2E.",
        color: "#2d1ef5",
        tags: ["Testcontainers", "WireMock", "Playwright"],
    },
    {
        icon: GitBranch,
        stat: "40+",
        label: "Pull Requests",
        description:
            "Disciplined Git workflow with conventional commits, CI-gated merges, and code review across both frontend and backend repositories.",
        color: "#2d1ef5",
        tags: ["GitHub Actions", "CI/CD", "Auto-deploy"],
    },
    {
        icon: Server,
        stat: "99.9%",
        label: "Uptime Target",
        description:
            "Production deployment on self-hosted infrastructure with Docker Compose, Cloudflare Tunnel, health checks, and automated rollback.",
        color: "#2d1ef5",
        tags: ["Docker", "Cloudflare", "Rollback"],
    },
    {
        icon: Shield,
        stat: "2",
        label: "Payment Providers",
        description:
            "Full payment lifecycle with Stripe and PayPal: checkout, webhook-driven status updates, signature verification, and refunds.",
        color: "#2d1ef5",
        tags: ["Stripe", "PayPal", "Webhooks"],
    },
    {
        icon: Activity,
        stat: "5",
        label: "Grafana Dashboards",
        description:
            "Built-in observability stack with Prometheus metrics, Grafana dashboards, Loki log aggregation, and Prometheus alerts.",
        color: "#2d1ef5",
        tags: ["Prometheus", "Grafana", "Loki"],
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
                <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-[#2d1ef5]/5 rounded-full blur-[120px]" />
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header */}
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <span className="text-[#2d1ef5] text-sm font-medium uppercase tracking-wider">
                        What I Built
                    </span>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-3 mb-4">
                        Project <span className="text-gradient">Highlights</span>
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                        Key engineering achievements and design decisions that make
                        FusionXPay production-ready.
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
