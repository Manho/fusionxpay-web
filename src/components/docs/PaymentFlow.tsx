"use client";

import { useEffect, useRef, useState } from "react";

interface Step {
    id: string;
    number: number;
    title: string;
    subtitle: string;
    from: string;
    to: string;
    type: "sync" | "async" | "internal";
}

const STEPS: Step[] = [
    {
        id: "create",
        number: 1,
        title: "Create Order",
        subtitle: "Status → NEW",
        from: "Merchant",
        to: "Order Service",
        type: "sync",
    },
    {
        id: "initiate",
        number: 2,
        title: "Initiate Payment",
        subtitle: "Forward to processor",
        from: "Merchant",
        to: "Payment Service",
        type: "sync",
    },
    {
        id: "publish-processing",
        number: 3,
        title: "Publish Event",
        subtitle: "Status → PROCESSING",
        from: "Payment Service",
        to: "Event Queue",
        type: "async",
    },
    {
        id: "process",
        number: 4,
        title: "Process Payment",
        subtitle: "Charge via provider",
        from: "Payment Service",
        to: "Payment Provider",
        type: "sync",
    },
    {
        id: "callback",
        number: 5,
        title: "Payment Callback",
        subtitle: "Result notification",
        from: "Payment Provider",
        to: "Payment Service",
        type: "async",
    },
    {
        id: "update",
        number: 6,
        title: "Update Status",
        subtitle: "Record transaction",
        from: "Payment Service",
        to: "Payment Service",
        type: "internal",
    },
    {
        id: "publish-final",
        number: 7,
        title: "Publish Result",
        subtitle: "SUCCESS / FAILED",
        from: "Payment Service",
        to: "Event Queue",
        type: "async",
    },
    {
        id: "notify",
        number: 8,
        title: "Deliver Updates",
        subtitle: "Order + Webhook",
        from: "Event Queue",
        to: "Notification",
        type: "async",
    },
];

const TYPE_META: Record<Step["type"], { label: string; dot: string }> = {
    sync: { label: "Sync", dot: "bg-[#2d1ef5]" },
    async: { label: "Async", dot: "bg-amber-500" },
    internal: { label: "Internal", dot: "bg-emerald-500" },
};

export default function PaymentFlow() {
    const [isVisible, setIsVisible] = useState(false);
    const [hoveredStep, setHoveredStep] = useState<string | null>(null);
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setIsVisible(true);
            },
            { threshold: 0.05 }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    // Adjacency map for hover highlighting
    const adjacent: Record<string, string[]> = {
        create: ["initiate"],
        initiate: ["create", "publish-processing"],
        "publish-processing": ["initiate", "process"],
        process: ["publish-processing", "callback"],
        callback: ["process", "update"],
        update: ["callback", "publish-final"],
        "publish-final": ["update", "notify"],
        notify: ["publish-final"],
    };

    const isRelated = (id: string) => {
        if (!hoveredStep) return true;
        return id === hoveredStep || (adjacent[hoveredStep]?.includes(id) ?? false);
    };

    return (
        <section ref={sectionRef} className="my-2 relative w-full">
            <div
                className={`relative w-full transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                    }`}
            >
                {/* Grid: 4 columns × 2 rows on lg, 2 columns on md, 1 column on sm */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 p-4 sm:p-6">
                    {STEPS.map((step, i) => {
                        const related = isRelated(step.id);
                        const isHovered = hoveredStep === step.id;
                        const meta = TYPE_META[step.type];

                        return (
                            <div
                                key={step.id}
                                className="relative group"
                                onMouseEnter={() => setHoveredStep(step.id)}
                                onMouseLeave={() => setHoveredStep(null)}
                                style={{
                                    opacity: related ? 1 : 0.2,
                                    transition: "opacity 0.3s ease, transform 0.3s ease",
                                    transform: isVisible
                                        ? isHovered
                                            ? "translateY(-2px)"
                                            : "translateY(0)"
                                        : "translateY(16px)",
                                    transitionDelay: isVisible ? `${i * 80}ms` : "0ms",
                                }}
                            >
                                {/* Connection arrow (hidden on last of each row) */}
                                {i < STEPS.length - 1 && (
                                    <div
                                        className={`
                                            hidden lg:block absolute -right-4 top-1/2 -translate-y-1/2 w-4 h-px z-10
                                            ${(i + 1) % 4 === 0 ? "lg:hidden" : ""}
                                        `}
                                        style={{
                                            opacity: hoveredStep
                                                ? isRelated(step.id) && isRelated(STEPS[i + 1].id)
                                                    ? 0.8
                                                    : 0.1
                                                : 0.5,
                                            transition: "opacity 0.3s ease",
                                        }}
                                    >
                                        <div
                                            className={`absolute inset-y-0 left-0 right-1 ${step.type === "async" || STEPS[i + 1].type === "async"
                                                ? "border-t border-dashed border-amber-500/60"
                                                : "border-t border-[#2d1ef5]/50"
                                                }`}
                                        />
                                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-l-[4px] border-l-[#2d1ef5]/50 border-y-[3px] border-y-transparent" />
                                    </div>
                                )}

                                {/* Row transition arrow (between step 4 and 5) */}
                                {i === 3 && (
                                    <div
                                        className="hidden lg:flex absolute -bottom-5 right-1/2 translate-x-1/2 flex-col items-center z-10"
                                        style={{
                                            opacity: hoveredStep ? 0.15 : 0.4,
                                            transition: "opacity 0.3s ease",
                                        }}
                                    >
                                        <div className="w-px h-2 bg-[#2d1ef5]/40" />
                                        <div className="w-0 h-0 border-t-[4px] border-t-[#2d1ef5]/40 border-x-[3px] border-x-transparent" />
                                    </div>
                                )}

                                {/* Card */}
                                <div
                                    className={`
                                        relative overflow-hidden rounded-xl
                                        border transition-all duration-300
                                        ${isHovered
                                            ? "border-[#2d1ef5]/50 shadow-[0_0_24px_rgba(45,30,245,0.15)] bg-[#2d1ef5]/[0.06]"
                                            : "border-border/60 bg-card/50 hover:border-[#2d1ef5]/30"
                                        }
                                        backdrop-blur-sm p-4
                                    `}
                                >
                                    {/* Gradient glow on hover */}
                                    {isHovered && (
                                        <div className="absolute inset-0 bg-gradient-to-br from-[#2d1ef5]/10 via-transparent to-[#7b6fff]/5 pointer-events-none" />
                                    )}

                                    {/* Header: number badge + type tag */}
                                    <div className="flex items-center justify-between mb-3 relative z-10">
                                        <div
                                            className={`
                                                flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold
                                                transition-all duration-300
                                                ${isHovered
                                                    ? "bg-[#2d1ef5] text-white shadow-[0_0_12px_rgba(45,30,245,0.4)]"
                                                    : "bg-[#2d1ef5]/15 text-[#2d1ef5] dark:text-[#8f86ff]"
                                                }
                                            `}
                                        >
                                            {step.number}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
                                            <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70">
                                                {meta.label}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Title + subtitle */}
                                    <div className="relative z-10">
                                        <h4 className="text-sm font-semibold text-foreground mb-1 leading-tight">
                                            {step.title}
                                        </h4>
                                        <p className="text-[11px] text-muted-foreground leading-relaxed">
                                            {step.subtitle}
                                        </p>
                                    </div>

                                    {/* From → To */}
                                    <div className="mt-3 pt-3 border-t border-border/40 relative z-10">
                                        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground/70">
                                            <span className="rounded-md bg-foreground/5 px-1.5 py-0.5 font-medium text-foreground/60 truncate max-w-[5.5rem]">
                                                {step.from}
                                            </span>
                                            <svg
                                                width="12"
                                                height="8"
                                                viewBox="0 0 12 8"
                                                className="flex-none opacity-50"
                                            >
                                                {step.type === "async" ? (
                                                    <>
                                                        <line
                                                            x1="0"
                                                            y1="4"
                                                            x2="8"
                                                            y2="4"
                                                            stroke="currentColor"
                                                            strokeWidth="1.2"
                                                            strokeDasharray="2,1.5"
                                                        />
                                                        <polyline
                                                            points="7,1.5 10,4 7,6.5"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="1.2"
                                                        />
                                                    </>
                                                ) : step.type === "internal" ? (
                                                    <>
                                                        <path
                                                            d="M 2,4 Q 6,0 6,4 Q 6,8 10,4"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="1.2"
                                                        />
                                                    </>
                                                ) : (
                                                    <>
                                                        <line
                                                            x1="0"
                                                            y1="4"
                                                            x2="8"
                                                            y2="4"
                                                            stroke="currentColor"
                                                            strokeWidth="1.2"
                                                        />
                                                        <polyline
                                                            points="7,1.5 10,4 7,6.5"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="1.2"
                                                        />
                                                    </>
                                                )}
                                            </svg>
                                            <span className="rounded-md bg-foreground/5 px-1.5 py-0.5 font-medium text-foreground/60 truncate max-w-[5.5rem]">
                                                {step.to}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Legend */}
                <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 px-4 pb-4 text-[10px] text-muted-foreground/60">
                    <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#2d1ef5]" />
                        <span>Sync Call</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        <span>Async Message</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>Internal</span>
                    </div>
                    <span className="text-muted-foreground/40">
                        Hover to explore flow
                    </span>
                </div>
            </div>
        </section>
    );
}
