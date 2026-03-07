"use client";

import { useEffect, useRef, useState } from "react";

interface Step {
    id: string;
    number: number;
    title: string;
    subtitle: string;
    from: string;
    to: string;
    fromFull: string;
    toFull: string;
    type: "request" | "callback" | "internal" | "notify";
}

const STEPS: Step[] = [
    {
        id: "provider-callback",
        number: 1,
        title: "Payment Callback",
        subtitle: "Status notification received",
        from: "Provider",
        fromFull: "Payment Provider",
        to: "Gateway",
        toFull: "FusionXPay Gateway",
        type: "callback",
    },
    {
        id: "verify-signature",
        number: 2,
        title: "Verify Signature",
        subtitle: "HMAC-SHA256 validation",
        from: "Gateway",
        fromFull: "FusionXPay Gateway",
        to: "Gateway",
        toFull: "FusionXPay Gateway",
        type: "internal",
    },
    {
        id: "update-status",
        number: 3,
        title: "Update Order",
        subtitle: "Status → SUCCESS / FAILED",
        from: "Gateway",
        fromFull: "FusionXPay Gateway",
        to: "Database",
        toFull: "Database",
        type: "internal",
    },
    {
        id: "publish-event",
        number: 4,
        title: "Publish Event",
        subtitle: "Enqueue notification",
        from: "Gateway",
        fromFull: "FusionXPay Gateway",
        to: "Event Queue",
        toFull: "Event Queue",
        type: "notify",
    },
    {
        id: "sign-payload",
        number: 5,
        title: "Sign Payload",
        subtitle: "HMAC with merchant secret",
        from: "Webhook Svc",
        fromFull: "Webhook Service",
        to: "Webhook Svc",
        toFull: "Webhook Service",
        type: "internal",
    },
    {
        id: "deliver-webhook",
        number: 6,
        title: "Deliver Webhook",
        subtitle: "POST to merchant URL",
        from: "Webhook Svc",
        fromFull: "Webhook Service",
        to: "Merchant",
        toFull: "Merchant Endpoint",
        type: "request",
    },
    {
        id: "merchant-process",
        number: 7,
        title: "Process & Respond",
        subtitle: "Return 200 OK in 5s",
        from: "Merchant",
        fromFull: "Merchant Endpoint",
        to: "Merchant",
        toFull: "Merchant Endpoint",
        type: "internal",
    },
    {
        id: "retry-logic",
        number: 8,
        title: "Retry on Failure",
        subtitle: "Up to 5 retries with backoff",
        from: "Webhook Svc",
        fromFull: "Webhook Service",
        to: "Merchant",
        toFull: "Merchant Endpoint",
        type: "callback",
    },
];

const TYPE_META: Record<Step["type"], { label: string; dot: string }> = {
    request: { label: "Request", dot: "bg-[#2563eb]" },
    callback: { label: "Callback", dot: "bg-amber-500" },
    internal: { label: "Internal", dot: "bg-emerald-500" },
    notify: { label: "Event", dot: "bg-purple-500" },
};

export default function WebhookFlow() {
    const [isVisible, setIsVisible] = useState(false);
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

    return (
        <section ref={sectionRef} className="my-2 relative w-full">
            <div
                className={`relative w-full transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                    }`}
            >
                {/* Grid: 4 columns × 2 rows on lg, 2 columns on md, 1 column on sm */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 xl:gap-y-10 p-4 sm:p-6 xl:pb-10">
                    {STEPS.map((step, i) => {
                        const meta = TYPE_META[step.type];

                        return (
                            <div
                                key={step.id}
                                className="relative group h-full"
                                style={{
                                    opacity: isVisible ? 1 : 0,
                                    transition: "opacity 0.5s ease, transform 0.5s ease",
                                    transform: isVisible ? "translateY(0)" : "translateY(16px)",
                                    transitionDelay: isVisible ? `${i * 80}ms` : "0ms",
                                }}
                            >
                                {/* Connection arrow (hidden on last of each row) */}
                                {i < STEPS.length - 1 && (
                                    <div
                                        className={`
                                            hidden xl:block absolute -right-4 top-1/2 -translate-y-1/2 w-4 h-px z-10
                                            ${(i + 1) % 4 === 0 ? "xl:hidden" : ""}
                                        `}
                                        style={{ opacity: 0.5 }}
                                    >
                                        <div
                                            className={`absolute inset-y-0 left-0 right-1 ${step.type === "callback" || STEPS[i + 1].type === "callback"
                                                ? "border-t border-dashed border-amber-500/60"
                                                : step.type === "notify" || STEPS[i + 1].type === "notify"
                                                    ? "border-t border-dashed border-purple-500/60"
                                                    : "border-t border-[#2563eb]/50"
                                                }`}
                                        />
                                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-l-[4px] border-l-[#2563eb]/50 border-y-[3px] border-y-transparent" />
                                    </div>
                                )}

                                {/* Row transition arrow (between step 4 and 5) */}
                                {i === 3 && (
                                    <div
                                        className="hidden xl:flex absolute -bottom-5 right-1/2 translate-x-1/2 flex-col items-center z-10"
                                        style={{ opacity: 0.4 }}
                                    >
                                        <div className="w-px h-2 bg-[#2563eb]/40" />
                                        <div className="w-0 h-0 border-t-[4px] border-t-[#2563eb]/40 border-x-[3px] border-x-transparent" />
                                    </div>
                                )}

                                {/* Card */}
                                <div
                                    className="relative overflow-hidden rounded-xl h-full flex flex-col border border-border/60 bg-card/50 hover:border-[#2563eb]/30 backdrop-blur-sm p-4 transition-colors duration-200"
                                >

                                    {/* Header: number badge + type tag */}
                                    <div className="flex items-center justify-between mb-3 relative z-10">
                                        <div
                                            className={`
                                                flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold
                                                transition-all duration-300
                                                bg-[#2563eb]/15 text-[#2563eb] dark:text-[#60a5fa]
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
                                    <div className="relative z-10 flex-1">
                                        <h4 className="text-sm font-semibold text-foreground mb-1 leading-tight">
                                            {step.title}
                                        </h4>
                                        <p className="text-[11px] text-muted-foreground leading-relaxed">
                                            {step.subtitle}
                                        </p>
                                    </div>

                                    <div className="mt-3 pt-3 border-t border-border/40 relative z-10 xl:hidden">
                                        <div className="flex items-baseline gap-1.5 text-[11px] text-muted-foreground/70" title={`${step.fromFull} → ${step.toFull}`}>
                                            <span className="font-medium text-foreground/60 whitespace-nowrap">{step.from}</span>
                                            <span className="opacity-50 flex-shrink-0">→</span>
                                            <span className="font-medium text-foreground/60 whitespace-nowrap">{step.to}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Hover tooltip for xl - shows From → To */}
                                <div className="hidden xl:group-hover:block absolute left-1/2 -translate-x-1/2 -bottom-8 z-30 w-max">
                                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-popover border border-border/60 shadow-lg text-[10px] text-muted-foreground/80">
                                        <span className="font-medium text-foreground/70 whitespace-nowrap">{step.from}</span>
                                        <span className="opacity-50">→</span>
                                        <span className="font-medium text-foreground/70 whitespace-nowrap">{step.to}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Legend */}
                <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 px-4 pb-4 text-[10px] text-muted-foreground/60">
                    <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#2563eb]" />
                        <span>Request</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        <span>Callback</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>Internal</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                        <span>Event</span>
                    </div>
                    <span className="text-muted-foreground/40">
                        Hover to explore flow
                    </span>
                </div>
            </div>
        </section>
    );
}
