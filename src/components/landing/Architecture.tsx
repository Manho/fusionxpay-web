"use client";

import { useEffect, useRef, useState } from "react";

export default function Architecture() {
    const [isVisible, setIsVisible] = useState(false);
    const [hoveredNode, setHoveredNode] = useState<string | null>(null);
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setIsVisible(true);
            },
            { threshold: 0.1 }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    // Relations map for hover highlighting
    const relations: Record<string, string[]> = {
        gateway: ["order", "payment", "admin", "notification", "redis"],
        order: ["gateway", "payment", "admin", "kafka", "mysql"],
        payment: ["gateway", "order", "kafka", "mysql", "redis"],
        admin: ["gateway", "order", "mysql"],
        notification: ["gateway", "kafka", "mysql"],
        kafka: ["payment", "order", "notification"],
        mysql: ["order", "payment", "admin", "notification", "monitoring"],
        redis: ["gateway", "payment", "monitoring"],
        monitoring: ["mysql", "redis"],
    };

    const isRelated = (nodeId: string) => {
        if (!hoveredNode) return true;
        return nodeId === hoveredNode || (relations[hoveredNode]?.includes(nodeId) ?? false);
    };

    const lineOpacity = (from: string, to: string) => {
        if (!hoveredNode) return 0.7;
        if (hoveredNode === from || hoveredNode === to) return 1;
        return 0.08;
    };

    const nodeStyle = (nodeId: string): React.CSSProperties => ({
        opacity: isRelated(nodeId) ? 1 : 0.15,
        transition: "opacity 0.3s, transform 0.3s",
        cursor: "default",
    });

    return (
        <section id="architecture" className="py-24 relative" ref={sectionRef}>
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#2d1ef5]/5 rounded-full blur-[150px]" />
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center max-w-2xl mx-auto mb-12">
                    <span className="text-[#2d1ef5] text-sm font-medium uppercase tracking-wider">
                        Architecture
                    </span>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-3 mb-4">
                        Microservices <span className="text-gradient">Design</span>
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                        6 independently deployable services communicating through Kafka event
                        streams, with service discovery via Eureka and Redis rate limiting.
                    </p>
                </div>

                {/* SVG Architecture Diagram */}
                <div
                    className={`relative max-w-4xl mx-auto glass rounded-3xl p-4 sm:p-8 overflow-hidden transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                        }`}
                >
                    <svg
                        viewBox="0 0 880 620"
                        className="w-full h-auto"
                        style={{ fontFamily: "'Inter', 'Arial', sans-serif" }}
                    >
                        {/* Title */}
                        <text x="440" y="32" textAnchor="middle" fontWeight="bold" fontSize="18" className="fill-foreground">
                            FusionXPay Architecture
                        </text>

                        {/* ==================== Layer 1: Gateway ==================== */}
                        <g
                            style={nodeStyle("gateway")}
                            onMouseEnter={() => setHoveredNode("gateway")}
                            onMouseLeave={() => setHoveredNode(null)}
                        >
                            <rect x="240" y="56" width="400" height="56" rx="8"
                                fill="rgba(45,30,245,0.08)" stroke="#7c4dff" strokeWidth="2" />
                            <text x="440" y="82" textAnchor="middle" fontWeight="bold" fontSize="14" fill="#7c4dff">
                                API Gateway
                            </text>
                            <text x="440" y="100" textAnchor="middle" fontSize="11" fill="#9575cd">
                                Rate Limiting · API Key Auth · RBAC
                            </text>
                            <text x="648" y="90" fontFamily="monospace" fontSize="10" className="fill-muted-foreground">
                                :8080
                            </text>
                        </g>

                        {/* ==================== Gateway → Services arrows ==================== */}
                        {/* GW → Order */}
                        <line x1="320" y1="112" x2="120" y2="175"
                            stroke="#5c6bc0" strokeWidth="1.5"
                            style={{ opacity: lineOpacity("gateway", "order"), transition: "opacity 0.3s" }} />
                        <polygon points="124,170 116,170 120,179" fill="#5c6bc0"
                            style={{ opacity: lineOpacity("gateway", "order"), transition: "opacity 0.3s" }} />

                        {/* GW → Payment */}
                        <line x1="390" y1="112" x2="330" y2="175"
                            stroke="#5c6bc0" strokeWidth="1.5"
                            style={{ opacity: lineOpacity("gateway", "payment"), transition: "opacity 0.3s" }} />
                        <polygon points="334,170 326,170 330,179" fill="#5c6bc0"
                            style={{ opacity: lineOpacity("gateway", "payment"), transition: "opacity 0.3s" }} />

                        {/* GW → Admin */}
                        <line x1="490" y1="112" x2="540" y2="175"
                            stroke="#5c6bc0" strokeWidth="1.5"
                            style={{ opacity: lineOpacity("gateway", "admin"), transition: "opacity 0.3s" }} />
                        <polygon points="544,170 536,170 540,179" fill="#5c6bc0"
                            style={{ opacity: lineOpacity("gateway", "admin"), transition: "opacity 0.3s" }} />

                        {/* GW → Notification */}
                        <line x1="560" y1="112" x2="755" y2="175"
                            stroke="#5c6bc0" strokeWidth="1.5"
                            style={{ opacity: lineOpacity("gateway", "notification"), transition: "opacity 0.3s" }} />
                        <polygon points="759,170 751,170 755,179" fill="#5c6bc0"
                            style={{ opacity: lineOpacity("gateway", "notification"), transition: "opacity 0.3s" }} />

                        {/* ==================== Layer 2: Services ==================== */}
                        {/* Order Service */}
                        <g
                            style={nodeStyle("order")}
                            onMouseEnter={() => setHoveredNode("order")}
                            onMouseLeave={() => setHoveredNode(null)}
                        >
                            <rect x="40" y="175" width="160" height="56" rx="8"
                                fill="rgba(25,118,210,0.08)" stroke="#1976d2" strokeWidth="2" />
                            <text x="120" y="200" textAnchor="middle" fontWeight="bold" fontSize="13" fill="#1976d2">
                                Order Service
                            </text>
                            <text x="120" y="218" textAnchor="middle" fontSize="10" fill="#42a5f5">
                                Merchant Isolation
                            </text>
                            <text x="208" y="206" fontFamily="monospace" fontSize="10" className="fill-muted-foreground">
                                :8082
                            </text>
                        </g>

                        {/* Payment Service */}
                        <g
                            style={nodeStyle("payment")}
                            onMouseEnter={() => setHoveredNode("payment")}
                            onMouseLeave={() => setHoveredNode(null)}
                        >
                            <rect x="250" y="175" width="160" height="56" rx="8"
                                fill="rgba(25,118,210,0.08)" stroke="#1976d2" strokeWidth="2" />
                            <text x="330" y="200" textAnchor="middle" fontWeight="bold" fontSize="13" fill="#1976d2">
                                Payment Service
                            </text>
                            <text x="330" y="218" textAnchor="middle" fontSize="10" fill="#42a5f5">
                                Stripe · PayPal
                            </text>
                            <text x="418" y="206" fontFamily="monospace" fontSize="10" className="fill-muted-foreground">
                                :8081
                            </text>
                        </g>

                        {/* Admin Service */}
                        <g
                            style={nodeStyle("admin")}
                            onMouseEnter={() => setHoveredNode("admin")}
                            onMouseLeave={() => setHoveredNode(null)}
                        >
                            <rect x="460" y="175" width="160" height="56" rx="8"
                                fill="rgba(25,118,210,0.08)" stroke="#1976d2" strokeWidth="2" />
                            <text x="540" y="200" textAnchor="middle" fontWeight="bold" fontSize="13" fill="#1976d2">
                                Admin Service
                            </text>
                            <text x="540" y="218" textAnchor="middle" fontSize="10" fill="#42a5f5">
                                JWT Auth
                            </text>
                            <text x="628" y="206" fontFamily="monospace" fontSize="10" className="fill-muted-foreground">
                                :8084
                            </text>
                        </g>

                        {/* Notification Service */}
                        <g
                            style={nodeStyle("notification")}
                            onMouseEnter={() => setHoveredNode("notification")}
                            onMouseLeave={() => setHoveredNode(null)}
                        >
                            <rect x="670" y="175" width="170" height="56" rx="8"
                                fill="rgba(25,118,210,0.08)" stroke="#1976d2" strokeWidth="2" />
                            <text x="755" y="200" textAnchor="middle" fontWeight="bold" fontSize="13" fill="#1976d2">
                                Notification Service
                            </text>
                            <text x="755" y="218" textAnchor="middle" fontSize="10" fill="#42a5f5">
                                Async Events
                            </text>
                            <text x="848" y="206" fontFamily="monospace" fontSize="10" className="fill-muted-foreground">
                                :8083
                            </text>
                        </g>

                        {/* ==================== Inter-service calls ==================== */}
                        {/* Payment → Order (Feign) */}
                        <g style={{ opacity: lineOpacity("payment", "order"), transition: "opacity 0.3s" }}>
                            <line x1="250" y1="195" x2="200" y2="195"
                                stroke="#1976d2" strokeWidth="1.5" strokeDasharray="6,3" />
                            <polygon points="205,191 197,195 205,199" fill="#1976d2" />
                            <text x="225" y="189" textAnchor="middle" fontSize="9" fill="#1976d2">
                                Feign
                            </text>
                        </g>

                        {/* Admin → Order (REST: query orders) */}
                        <g style={{ opacity: lineOpacity("admin", "order"), transition: "opacity 0.3s" }}>
                            <path d="M 460,215 Q 350,260 200,215"
                                stroke="#1976d2" strokeWidth="1.5" strokeDasharray="6,3" fill="none" />
                            <polygon points="205,211 197,215 205,219" fill="#1976d2" />
                            <text x="340" y="253" textAnchor="middle" fontSize="9" fill="#1976d2">
                                REST (query orders)
                            </text>
                        </g>

                        {/* ==================== Layer 3: Data Stores + Kafka (same row) ==================== */}

                        {/* MySQL (far left) */}
                        <g
                            style={nodeStyle("mysql")}
                            onMouseEnter={() => setHoveredNode("mysql")}
                            onMouseLeave={() => setHoveredNode(null)}
                        >
                            <rect x="10" y="320" width="160" height="54" rx="8"
                                fill="rgba(0,137,123,0.08)" stroke="#00897b" strokeWidth="2" />
                            <text x="90" y="345" textAnchor="middle" fontWeight="bold" fontSize="13" fill="#00897b">
                                MySQL
                            </text>
                            <text x="90" y="362" textAnchor="middle" fontSize="10" fill="#4db6ac">
                                Shared Database
                            </text>
                            <text x="90" y="385" fontFamily="monospace" fontSize="10" textAnchor="middle" className="fill-muted-foreground">
                                :3306
                            </text>
                        </g>

                        {/* Apache Kafka (center) */}
                        <g
                            style={nodeStyle("kafka")}
                            onMouseEnter={() => setHoveredNode("kafka")}
                            onMouseLeave={() => setHoveredNode(null)}
                        >
                            <rect x="210" y="320" width="460" height="50" rx="8"
                                fill="rgba(255,143,0,0.08)" stroke="#ff8f00" strokeWidth="2" />
                            <text x="440" y="342" textAnchor="middle" fontWeight="bold" fontSize="13" fill="#ff8f00">
                                Apache Kafka
                            </text>
                            <text x="440" y="360" textAnchor="middle" fontFamily="monospace" fontSize="10" fill="#ffb300">
                                topic: payment-events
                            </text>
                        </g>

                        {/* Redis (far right) */}
                        <g
                            style={nodeStyle("redis")}
                            onMouseEnter={() => setHoveredNode("redis")}
                            onMouseLeave={() => setHoveredNode(null)}
                        >
                            <rect x="700" y="320" width="160" height="54" rx="8"
                                fill="rgba(0,137,123,0.08)" stroke="#00897b" strokeWidth="2" />
                            <text x="780" y="345" textAnchor="middle" fontWeight="bold" fontSize="13" fill="#00897b">
                                Redis
                            </text>
                            <text x="780" y="362" textAnchor="middle" fontSize="10" fill="#4db6ac">
                                Rate Limit · Idempotency
                            </text>
                            <text x="780" y="385" fontFamily="monospace" fontSize="10" textAnchor="middle" className="fill-muted-foreground">
                                :6379
                            </text>
                        </g>

                        {/* Payment → Kafka (produce) */}
                        <g style={{ opacity: lineOpacity("payment", "kafka"), transition: "opacity 0.3s" }}>
                            <line x1="330" y1="231" x2="330" y2="320"
                                stroke="#ff8f00" strokeWidth="1.5" />
                            <polygon points="326,315 334,315 330,324" fill="#ff8f00" />
                            <text x="345" y="280" fontSize="9" fill="#ff8f00" fontStyle="italic">
                                produce
                            </text>
                        </g>

                        {/* Kafka → Order (consume) */}
                        <g style={{ opacity: lineOpacity("kafka", "order"), transition: "opacity 0.3s" }}>
                            <line x1="300" y1="320" x2="140" y2="231"
                                stroke="#1976d2" strokeWidth="1.5" />
                            <polygon points="144,236 136,236 140,227" fill="#1976d2" />
                            <text x="200" y="282" fontSize="9" fill="#1976d2" fontStyle="italic">
                                consume
                            </text>
                        </g>

                        {/* Kafka → Notification (consume) */}
                        <g style={{ opacity: lineOpacity("kafka", "notification"), transition: "opacity 0.3s" }}>
                            <line x1="580" y1="320" x2="740" y2="231"
                                stroke="#1976d2" strokeWidth="1.5" />
                            <polygon points="744,236 736,236 740,227" fill="#1976d2" />
                            <text x="680" y="282" fontSize="9" fill="#1976d2" fontStyle="italic">
                                consume
                            </text>
                        </g>

                        {/* Services → MySQL (dashed, all route LEFT of Kafka) */}
                        <line x1="120" y1="231" x2="50" y2="320"
                            stroke="#00897b" strokeWidth="1" strokeDasharray="4,3"
                            style={{ opacity: lineOpacity("order", "mysql"), transition: "opacity 0.3s" }} />
                        <line x1="330" y1="231" x2="90" y2="320"
                            stroke="#00897b" strokeWidth="1" strokeDasharray="4,3"
                            style={{ opacity: lineOpacity("payment", "mysql"), transition: "opacity 0.3s" }} />
                        <line x1="540" y1="231" x2="130" y2="320"
                            stroke="#00897b" strokeWidth="1" strokeDasharray="4,3"
                            style={{ opacity: lineOpacity("admin", "mysql"), transition: "opacity 0.3s" }} />
                        <line x1="755" y1="231" x2="160" y2="320"
                            stroke="#00897b" strokeWidth="1" strokeDasharray="4,3"
                            style={{ opacity: lineOpacity("notification", "mysql"), transition: "opacity 0.3s" }} />

                        {/* GW → Redis (routes RIGHT of Kafka) */}
                        <line x1="600" y1="112" x2="740" y2="320"
                            stroke="#00897b" strokeWidth="1" strokeDasharray="4,3"
                            style={{ opacity: lineOpacity("gateway", "redis"), transition: "opacity 0.3s" }} />

                        {/* Payment → Redis */}
                        <line x1="380" y1="231" x2="720" y2="320"
                            stroke="#00897b" strokeWidth="1" strokeDasharray="4,3"
                            style={{ opacity: lineOpacity("payment", "redis"), transition: "opacity 0.3s" }} />

                        {/* ==================== Layer 4: Monitoring ==================== */}
                        <g
                            style={nodeStyle("monitoring")}
                            onMouseEnter={() => setHoveredNode("monitoring")}
                            onMouseLeave={() => setHoveredNode(null)}
                        >
                            <rect x="200" y="450" width="480" height="44" rx="8"
                                fill="rgba(63,81,181,0.08)" stroke="#3f51b5" strokeWidth="1.5" />
                            <text x="440" y="476" textAnchor="middle" fontWeight="bold" fontSize="12" fill="#5c6bc0">
                                Prometheus · Grafana · Loki · Promtail
                            </text>
                        </g>

                        {/* Monitoring dashed connections */}
                        <line x1="90" y1="374" x2="350" y2="450"
                            stroke="#7986cb" strokeWidth="1" strokeDasharray="3,3"
                            style={{ opacity: lineOpacity("mysql", "monitoring"), transition: "opacity 0.3s" }} />
                        <line x1="780" y1="374" x2="530" y2="450"
                            stroke="#7986cb" strokeWidth="1" strokeDasharray="3,3"
                            style={{ opacity: lineOpacity("redis", "monitoring"), transition: "opacity 0.3s" }} />
                    </svg>

                    {/* Legend */}
                    <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-4 text-[10px] text-muted-foreground/60">
                        <div className="flex items-center gap-1.5">
                            <div className="w-2.5 h-2.5 rounded border-2 border-[#7c4dff]" />
                            <span>Gateway</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-2.5 h-2.5 rounded border-2 border-[#1976d2]" />
                            <span>Core Service</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-2.5 h-2.5 rounded border-2 border-[#ff8f00]" />
                            <span>Event Bus</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-2.5 h-2.5 rounded border-2 border-[#00897b]" />
                            <span>Data Store</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-6 h-0 border-t border-dashed border-muted-foreground/50" />
                            <span>Async / Query</span>
                        </div>
                        <span className="text-muted-foreground/40">
                            Hover to explore connections
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}
