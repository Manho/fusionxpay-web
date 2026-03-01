"use client";

import { useEffect, useRef, useState } from "react";

interface TechItem {
    name: string;
    icon: string;
    description: string;
}

interface TechGroup {
    title: string;
    color: string;
    items: TechItem[];
}

const techGroups: TechGroup[] = [
    {
        title: "Backend",
        color: "#2d1ef5",
        items: [
            {
                name: "Java 21",
                icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
                description: "Modern LTS runtime with virtual threads",
            },
            {
                name: "Spring Boot 3.2",
                icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg",
                description: "Microservices framework with Cloud support",
            },
            {
                name: "Spring Cloud Gateway",
                icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg",
                description: "API routing, rate limiting, authentication",
            },
        ],
    },
    {
        title: "Infrastructure",
        color: "var(--cream)",
        items: [
            {
                name: "Apache Kafka",
                icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apachekafka/apachekafka-original.svg",
                description: "Event-driven messaging between services",
            },
            {
                name: "Redis",
                icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg",
                description: "Token bucket rate limiting & caching",
            },
            {
                name: "MySQL 8",
                icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
                description: "Persistent storage with merchant isolation",
            },
        ],
    },
    {
        title: "Frontend",
        color: "#2d1ef5",
        items: [
            {
                name: "Next.js 16",
                icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
                description: "App Router with server-side rendering",
            },
            {
                name: "React 19",
                icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
                description: "Latest React with Turbopack",
            },
            {
                name: "TypeScript 5",
                icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
                description: "End-to-end type safety",
            },
        ],
    },
    {
        title: "DevOps & Testing",
        color: "var(--cream)",
        items: [
            {
                name: "Docker",
                icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
                description: "Containerized deployment with health checks",
            },
            {
                name: "GitHub Actions",
                icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg",
                description: "CI/CD with auto-deploy and rollback",
            },
            {
                name: "Prometheus + Grafana",
                icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/prometheus/prometheus-original.svg",
                description: "Metrics, dashboards, and alerting",
            },
        ],
    },
];

export default function TechStack() {
    const [visibleGroups, setVisibleGroups] = useState<number[]>([]);
    const groupRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const index = Number(entry.target.getAttribute("data-group-index"));
                    if (entry.isIntersecting && !visibleGroups.includes(index)) {
                        setVisibleGroups((prev) => [...prev, index]);
                    }
                });
            },
            { threshold: 0.15 }
        );

        groupRefs.current.forEach((ref) => {
            if (ref) observer.observe(ref);
        });

        return () => observer.disconnect();
    }, [visibleGroups]);

    return (
        <section id="tech-stack" className="py-24 relative">
            {/* Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#7b6fff]/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#2d1ef5]/5 rounded-full blur-[120px]" />
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header */}
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <span className="text-[var(--cream)] text-sm font-medium uppercase tracking-wider">
                        Tech Stack
                    </span>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-3 mb-4">
                        Built With <span className="text-gradient">Modern Tools</span>
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                        Enterprise-grade technologies chosen for reliability, scalability,
                        and developer experience.
                    </p>
                </div>

                {/* Groups */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {techGroups.map((group, groupIdx) => {
                        const isVisible = visibleGroups.includes(groupIdx);
                        return (
                            <div
                                key={group.title}
                                ref={(el) => {
                                    groupRefs.current[groupIdx] = el;
                                }}
                                data-group-index={groupIdx}
                                className={`glass rounded-2xl p-6 hover-glow transition-all duration-700 ${isVisible
                                    ? "opacity-100 translate-y-0"
                                    : "opacity-0 translate-y-8"
                                    }`}
                                style={{ transitionDelay: `${groupIdx * 150}ms` }}
                            >
                                <h3
                                    className="text-sm font-semibold uppercase tracking-wider mb-5"
                                    style={{ color: group.color }}
                                >
                                    {group.title}
                                </h3>
                                <div className="space-y-4">
                                    {group.items.map((item) => (
                                        <div
                                            key={item.name}
                                            className="flex items-center gap-4 group/item"
                                        >
                                            <div className="w-10 h-10 rounded-lg bg-accent/50 flex items-center justify-center flex-shrink-0 group-hover/item:scale-110 transition-transform duration-300">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img
                                                    src={item.icon}
                                                    alt={item.name}
                                                    width={24}
                                                    height={24}
                                                    className="w-6 h-6"
                                                    loading="lazy"
                                                />
                                            </div>
                                            <div className="min-w-0">
                                                <div className="text-sm font-semibold text-foreground">
                                                    {item.name}
                                                </div>
                                                <div className="text-xs text-muted-foreground/80 truncate">
                                                    {item.description}
                                                </div>
                                            </div>
                                        </div>
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
