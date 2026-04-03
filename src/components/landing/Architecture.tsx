"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

/* ── Relation graph for interactive hover highlighting ── */
const relations: Record<string, string[]> = {
  merchant: ["gateway", "agents"],
  agents: ["mcp", "ai-cli", "merchant"],
  mcp: ["agents", "aop"],
  "ai-cli": ["agents", "aop"],
  aop: ["mcp", "ai-cli", "gateway", "kafka"],
  gateway: ["merchant", "aop", "order", "payment", "admin", "notification", "redis"],
  order: ["gateway", "payment", "mysql", "kafka"],
  payment: ["gateway", "order", "mysql", "kafka", "redis"],
  admin: ["gateway", "mysql", "kafka"],
  notification: ["gateway", "mysql", "kafka"],
  mysql: ["order", "payment", "admin", "notification", "monitoring"],
  kafka: ["payment", "aop", "order", "notification", "admin"],
  redis: ["gateway", "payment", "monitoring"],
  monitoring: ["mysql", "redis"],
};

export default function Architecture({
  variant = "landing",
}: {
  variant?: "landing" | "docs";
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const isRelated = (nodeId: string) => {
    if (!hoveredNode) return true;
    return nodeId === hoveredNode || (relations[hoveredNode]?.includes(nodeId) ?? false);
  };

  const lineOpacity = (from: string, to: string) => {
    if (!hoveredNode) return 0.7;
    if (hoveredNode === from || hoveredNode === to) return 1;
    return 0.08;
  };

  const nodeStyle = (nodeId: string): CSSProperties => ({
    opacity: isRelated(nodeId) ? 1 : 0.15,
    transition: "opacity 0.3s, transform 0.3s",
    cursor: "default",
  });

  return (
    <section
      id="architecture"
      ref={sectionRef}
      className={variant === "landing" ? "py-24 relative" : "my-4 relative w-full"}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#2563eb]/5 rounded-full blur-[150px]" />
      </div>

      <div className={`relative z-10 ${variant === "landing" ? "container mx-auto px-4 sm:px-6 lg:px-8" : "w-full"}`}>
        {variant === "landing" && (
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-[#2563eb] text-sm font-medium uppercase tracking-wider">
              Architecture
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-3 mb-4 text-slate-800 dark:text-slate-200">
              AI-Enhanced Architecture
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Spring AI MCP Server, 3-layer AOP safety chain, and 5 microservices — connected
              through Kafka events, secured by JWT, and audited end-to-end.
            </p>
          </div>
        )}

        {/* SVG Architecture Diagram */}
        <div
          className={`relative max-w-4xl mx-auto glass rounded-3xl p-4 sm:p-8 overflow-hidden transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
            }`}
        >
          <svg
            viewBox="0 0 880 760"
            className="w-full h-auto"
            style={{ fontFamily: "'Inter', 'Arial', sans-serif" }}
          >
            {/* Title */}
            <text x="440" y="32" textAnchor="middle" fontWeight="bold" fontSize="18" className="fill-foreground">
              FusionXPay Architecture
            </text>

            {/* ==================== Layer 1: External Users ==================== */}
            <rect x="30" y="50" width="820" height="64" rx="10"
              fill="none" stroke="#94a3b8" strokeWidth="1" strokeDasharray="6 4" opacity="0.4" />
            <text x="50" y="74" fontSize="10" fill="#94a3b8" fontWeight="600" opacity="0.7">
              EXTERNAL USERS &amp; AI AGENTS
            </text>

            <g style={nodeStyle("merchant")} onMouseEnter={() => setHoveredNode("merchant")} onMouseLeave={() => setHoveredNode(null)}>
              <rect x="140" y="76" width="200" height="30" rx="8"
                fill="rgba(148,163,184,0.06)" stroke="#94a3b8" strokeWidth="1.5" />
              <text x="240" y="95" textAnchor="middle" fontWeight="600" fontSize="12" fill="#94a3b8">👤 Merchant</text>
            </g>

            <g style={nodeStyle("agents")} onMouseEnter={() => setHoveredNode("agents")} onMouseLeave={() => setHoveredNode(null)}>
              <rect x="540" y="76" width="200" height="30" rx="8"
                fill="rgba(148,163,184,0.06)" stroke="#94a3b8" strokeWidth="1.5" />
              <text x="640" y="95" textAnchor="middle" fontWeight="600" fontSize="12" fill="#94a3b8">🤖 AI Agents</text>
            </g>

            {/* ==================== Layer 2: AI Interface ==================== */}
            <rect x="30" y="128" width="820" height="72" rx="10"
              fill="none" stroke="#2563eb" strokeWidth="1" strokeDasharray="6 4" opacity="0.4" />
            <text x="50" y="152" fontSize="10" fill="#2563eb" fontWeight="600" opacity="0.7">
              AI INTERFACE LAYER
            </text>

            <g style={nodeStyle("mcp")} onMouseEnter={() => setHoveredNode("mcp")} onMouseLeave={() => setHoveredNode(null)}>
              <rect x="150" y="155" width="200" height="36" rx="8"
                fill="rgba(37,99,235,0.08)" stroke="#2563eb" strokeWidth="2" />
              <text x="250" y="173" textAnchor="middle" dominantBaseline="middle" alignmentBaseline="middle" fontWeight="bold" fontSize="13" fill="#2563eb">
                MCP Server
              </text>
            </g>

            <g style={nodeStyle("ai-cli")} onMouseEnter={() => setHoveredNode("ai-cli")} onMouseLeave={() => setHoveredNode(null)}>
              <rect x="540" y="155" width="200" height="36" rx="8"
                fill="rgba(37,99,235,0.08)" stroke="#2563eb" strokeWidth="2" />
              <text x="640" y="173" textAnchor="middle" dominantBaseline="middle" alignmentBaseline="middle" fontWeight="bold" fontSize="13" fill="#2563eb">
                AI CLI
              </text>
            </g>

            {/* ==================== Layer 2B: AOP Safety ==================== */}
            <rect x="30" y="214" width="820" height="56" rx="10"
              fill="none" stroke="#f59e0b" strokeWidth="1" strokeDasharray="6 4" opacity="0.4" />
            <text x="50" y="234" fontSize="10" fill="#f59e0b" fontWeight="600" opacity="0.7">
              CROSS-CUTTING SAFETY · 3-Layer Spring AOP
            </text>

            <g style={nodeStyle("aop")} onMouseEnter={() => setHoveredNode("aop")} onMouseLeave={() => setHoveredNode(null)}>
              <rect x="80" y="238" width="770" height="26" rx="8"
                fill="rgba(245,158,11,0.06)" stroke="#f59e0b" strokeWidth="1.5" />
              <text x="440" y="256" textAnchor="middle" fontWeight="bold" fontSize="12" fill="#f59e0b">
                InputSafetyAspect → ToolAuditAspect → OutputSafetyAspect
              </text>
            </g>

            {/* Arrows: Users → AI Layer */}
            {/* Merchant → AI Agents */}
            <g style={{ opacity: lineOpacity("merchant", "agents"), transition: "opacity 0.3s" }}>
              <line x1="340" y1="91" x2="532" y2="91" stroke="#94a3b8" strokeWidth="1.3" strokeDasharray="4,2" />
              <polygon points="532,87 538,91 532,95" fill="#94a3b8" />
            </g>

            <path d="M 600,106 C 500,120 350,120 250,153" fill="none" stroke="#94a3b8" strokeWidth="1.3"
              style={{ opacity: lineOpacity("agents", "mcp"), transition: "opacity 0.3s" }} />
            <polygon points="253,146 247,146 250,153" fill="#94a3b8"
              style={{ opacity: lineOpacity("agents", "mcp"), transition: "opacity 0.3s" }} />
            
            <path d="M 640,106 L 640,153" fill="none" stroke="#94a3b8" strokeWidth="1.3"
              style={{ opacity: lineOpacity("agents", "ai-cli"), transition: "opacity 0.3s" }} />
            <polygon points="643,146 637,146 640,153" fill="#94a3b8"
              style={{ opacity: lineOpacity("agents", "ai-cli"), transition: "opacity 0.3s" }} />

            {/* AI Layer → AOP */}
            <line x1="250" y1="191" x2="250" y2="236" stroke="#2563eb" strokeWidth="1.3"
              style={{ opacity: lineOpacity("mcp", "aop"), transition: "opacity 0.3s" }} />
            <polygon points="247,229 253,229 250,236" fill="#2563eb"
              style={{ opacity: lineOpacity("mcp", "aop"), transition: "opacity 0.3s" }} />

            <line x1="640" y1="191" x2="640" y2="236" stroke="#2563eb" strokeWidth="1.3"
              style={{ opacity: lineOpacity("ai-cli", "aop"), transition: "opacity 0.3s" }} />
            <polygon points="637,229 643,229 640,236" fill="#2563eb"
              style={{ opacity: lineOpacity("ai-cli", "aop"), transition: "opacity 0.3s" }} />

            {/* ==================== Layer 3: Gateway ==================== */}
            <g
              style={nodeStyle("gateway")}
              onMouseEnter={() => setHoveredNode("gateway")}
              onMouseLeave={() => setHoveredNode(null)}
            >
              <rect x="240" y="290" width="400" height="56" rx="8"
                fill="rgba(37,99,235,0.08)" stroke="#2563eb" strokeWidth="2" />
              <text x="440" y="316" textAnchor="middle" fontWeight="bold" fontSize="14" fill="#2563eb">
                API Gateway
              </text>
              <text x="440" y="334" textAnchor="middle" fontSize="11" fill="#60a5fa">
                JWT Auth · Rate Limiting · RBAC
              </text>
            </g>

            {/* AOP → Gateway */}
            <line x1="440" y1="264" x2="440" y2="288" stroke="#f59e0b" strokeWidth="1.3"
              style={{ opacity: lineOpacity("aop", "gateway"), transition: "opacity 0.3s" }} />
            <polygon points="437,281 443,281 440,288" fill="#f59e0b"
              style={{ opacity: lineOpacity("aop", "gateway"), transition: "opacity 0.3s" }} />

            {/* Merchant → Gateway (Routed around the side) */}
            <path d="M 140,91 C 15,91 15,150 15,203 C 15,270 15,316 228,316" fill="none" stroke="#94a3b8" strokeWidth="1.3"
              style={{ opacity: lineOpacity("merchant", "gateway"), transition: "opacity 0.3s" }} />
            <polygon points="228,312 228,320 238,316" fill="#94a3b8"
              style={{ opacity: lineOpacity("merchant", "gateway"), transition: "opacity 0.3s" }} />

            {/* ==================== Layer 3B: Services ==================== */}
            {/* Order Service */}
            <g style={nodeStyle("order")} onMouseEnter={() => setHoveredNode("order")} onMouseLeave={() => setHoveredNode(null)}>
              <rect x="40" y="375" width="160" height="56" rx="8"
                fill="rgba(25,118,210,0.08)" stroke="#1976d2" strokeWidth="2" />
              <text x="120" y="400" textAnchor="middle" fontWeight="bold" fontSize="13" fill="#1976d2">
                Order Service
              </text>
              <text x="120" y="418" textAnchor="middle" fontSize="10" fill="#42a5f5">
                Merchant Isolation
              </text>
            </g>

            {/* Payment Service */}
            <g style={nodeStyle("payment")} onMouseEnter={() => setHoveredNode("payment")} onMouseLeave={() => setHoveredNode(null)}>
              <rect x="250" y="375" width="160" height="56" rx="8"
                fill="rgba(25,118,210,0.08)" stroke="#1976d2" strokeWidth="2" />
              <text x="330" y="400" textAnchor="middle" fontWeight="bold" fontSize="13" fill="#1976d2">
                Payment Service
              </text>
              <text x="330" y="418" textAnchor="middle" fontSize="10" fill="#42a5f5">
                Stripe · PayPal
              </text>
            </g>

            {/* Admin Service */}
            <g style={nodeStyle("admin")} onMouseEnter={() => setHoveredNode("admin")} onMouseLeave={() => setHoveredNode(null)}>
              <rect x="460" y="375" width="160" height="56" rx="8"
                fill="rgba(25,118,210,0.08)" stroke="#1976d2" strokeWidth="2" />
              <text x="540" y="400" textAnchor="middle" fontWeight="bold" fontSize="13" fill="#1976d2">
                Admin Service
              </text>
              <text x="540" y="418" textAnchor="middle" fontSize="10" fill="#42a5f5">
                JWT Auth · Audit Consumer
              </text>
            </g>

            {/* Notification Service */}
            <g style={nodeStyle("notification")} onMouseEnter={() => setHoveredNode("notification")} onMouseLeave={() => setHoveredNode(null)}>
              <rect x="670" y="375" width="170" height="56" rx="8"
                fill="rgba(25,118,210,0.08)" stroke="#1976d2" strokeWidth="2" />
              <text x="755" y="400" textAnchor="middle" fontWeight="bold" fontSize="13" fill="#1976d2">
                Notification Service
              </text>
              <text x="755" y="418" textAnchor="middle" fontSize="10" fill="#42a5f5">
                Async Events
              </text>
            </g>

            {/* ==================== Gateway → Services arrows ==================== */}
            <g style={{ opacity: lineOpacity("gateway", "order"), transition: "opacity 0.3s" }}>
              <path d="M 320,346 C 320,365 120,355 120,375" fill="none" stroke="#3b82f6" strokeWidth="1.5" />
              <polygon points="124,371 116,371 120,378" fill="#3b82f6" />
            </g>
            <g style={{ opacity: lineOpacity("gateway", "payment"), transition: "opacity 0.3s" }}>
              <path d="M 390,346 C 390,365 330,355 330,375" fill="none" stroke="#3b82f6" strokeWidth="1.5" />
              <polygon points="334,371 326,371 330,378" fill="#3b82f6" />
            </g>
            <g style={{ opacity: lineOpacity("gateway", "admin"), transition: "opacity 0.3s" }}>
              <path d="M 490,346 C 490,365 540,355 540,375" fill="none" stroke="#3b82f6" strokeWidth="1.5" />
              <polygon points="544,371 536,371 540,378" fill="#3b82f6" />
            </g>
            <g style={{ opacity: lineOpacity("gateway", "notification"), transition: "opacity 0.3s" }}>
              <path d="M 560,346 C 560,365 755,355 755,375" fill="none" stroke="#3b82f6" strokeWidth="1.5" />
              <polygon points="759,371 751,371 755,378" fill="#3b82f6" />
            </g>

            {/* ==================== Inter-service calls ==================== */}
            {/* Payment → Order (Feign) */}
            <g style={{ opacity: lineOpacity("payment", "order"), transition: "opacity 0.3s" }}>
              <path d="M 250,403 L 209,403" fill="none"
                stroke="#1976d2" strokeWidth="1.5" strokeDasharray="6,3" />
              <polygon points="209,399 202,403 209,407" fill="#1976d2" />
              <text x="227" y="398" textAnchor="middle" fontSize="9" fill="#1976d2">
                Feign
              </text>
            </g>

            {/* Admin → Order (REST, direct service call) */}
            <g style={{ opacity: lineOpacity("admin", "order"), transition: "opacity 0.3s" }}>
              <path d="M 460,431 C 460,480 120,480 120,431"
                stroke="#1976d2" strokeWidth="1.5" strokeDasharray="6,3" fill="none" />
              <polygon points="116,431 124,431 120,424" fill="#1976d2" />
              <text x="300" y="473" textAnchor="middle" fontSize="9" fill="#1976d2">
                REST (query orders)
              </text>
            </g>

            {/* ==================== Layer 4: Data Stores + Kafka ==================== */}
            {/* MySQL */}
            <g style={nodeStyle("mysql")} onMouseEnter={() => setHoveredNode("mysql")} onMouseLeave={() => setHoveredNode(null)}>
              <rect x="10" y="550" width="160" height="54" rx="8"
                fill="rgba(0,137,123,0.08)" stroke="#00897b" strokeWidth="2" />
              <text x="90" y="575" textAnchor="middle" fontWeight="bold" fontSize="13" fill="#00897b">
                MySQL
              </text>
              <text x="90" y="592" textAnchor="middle" fontSize="10" fill="#4db6ac">
                Shared Database
              </text>
            </g>

            {/* Apache Kafka */}
            <g style={nodeStyle("kafka")} onMouseEnter={() => setHoveredNode("kafka")} onMouseLeave={() => setHoveredNode(null)}>
              <rect x="210" y="550" width="460" height="54" rx="8"
                fill="rgba(255,143,0,0.08)" stroke="#ff8f00" strokeWidth="2" />
              <text x="440" y="573" textAnchor="middle" fontWeight="bold" fontSize="13" fill="#ff8f00">
                Apache Kafka
              </text>
              <text x="440" y="591" textAnchor="middle" fontFamily="monospace" fontSize="10" fill="#ffb300">
                payment-events · ai-audit-log
              </text>
            </g>

            {/* Redis */}
            <g style={nodeStyle("redis")} onMouseEnter={() => setHoveredNode("redis")} onMouseLeave={() => setHoveredNode(null)}>
              <rect x="700" y="550" width="160" height="54" rx="8"
                fill="rgba(0,137,123,0.08)" stroke="#00897b" strokeWidth="2" />
              <text x="780" y="575" textAnchor="middle" fontWeight="bold" fontSize="13" fill="#00897b">
                Redis
              </text>
              <text x="780" y="592" textAnchor="middle" fontSize="10" fill="#4db6ac">
                Rate Limit · Idempotency
              </text>
            </g>

            {/* Services → Data stores */}
            {/* Payment → Kafka (produce) */}
            <g style={{ opacity: lineOpacity("payment", "kafka"), transition: "opacity 0.3s" }}>
              <path d="M 330,431 L 330,541" fill="none"
                stroke="#ff8f00" strokeWidth="1.5" />
              <polygon points="326,541 334,541 330,548" fill="#ff8f00" />
              <text x="345" y="495" fontSize="9" fill="#ff8f00" fontStyle="italic">
                produce
              </text>
            </g>

            {/* Kafka → Order (consume) */}
            <g style={{ opacity: lineOpacity("kafka", "order"), transition: "opacity 0.3s" }}>
              <path d="M 260,550 C 260,490 145,490 145,436" fill="none"
                stroke="#1976d2" strokeWidth="1.5" />
              <polygon points="149,441 141,441 145,432" fill="#1976d2" />
              <text x="200" y="485" fontSize="9" fill="#1976d2" fontStyle="italic">
                consume
              </text>
            </g>

            {/* Kafka → Notification (consume) */}
            <g style={{ opacity: lineOpacity("kafka", "notification"), transition: "opacity 0.3s" }}>
              <path d="M 620,550 C 620,490 740,490 740,436" fill="none"
                stroke="#1976d2" strokeWidth="1.5" />
              <polygon points="744,441 736,441 740,432" fill="#1976d2" />
              <text x="680" y="485" fontSize="9" fill="#1976d2" fontStyle="italic">
                consume
              </text>
            </g>

            {/* Kafka → Admin (ai-audit-log consume) */}
            <g style={{ opacity: lineOpacity("kafka", "admin"), transition: "opacity 0.3s" }}>
              <path d="M 540,550 L 540,436" fill="none" stroke="#ff8f00" strokeWidth="1.5" />
              <polygon points="544,441 536,441 540,432" fill="#ff8f00" />
              <text x="555" y="495" fontSize="9" fill="#ff8f00" fontStyle="italic">
                ai-audit-log
              </text>
            </g>

            {/* Spring AOP → Kafka (ai-audit-log routed side) */}
            <g style={{ opacity: lineOpacity("aop", "kafka"), transition: "opacity 0.3s" }}>
              <path d="M 850,251 C 880,251 880,577 679,577" fill="none"
                stroke="#ff8f00" strokeWidth="1.5" strokeDasharray="4,3" />
              <polygon points="679,573 679,581 672,577" fill="#ff8f00" />
              <text x="865" y="420" fontSize="9" fill="#ff8f00" fontStyle="italic" style={{ textAnchor: "middle", transformOrigin: "865px 420px", transform: "rotate(90deg)" }}>
                ai-audit-log
              </text>
            </g>

            {/* Stacked curves for MySQL (dashed) */}
            <path d="M 120,431 C 120,470 70,470 70,550" fill="none"
              stroke="#00897b" strokeWidth="1" strokeDasharray="4,3"
              style={{ opacity: lineOpacity("order", "mysql"), transition: "opacity 0.3s" }} />
            <path d="M 290,431 C 290,485 90,485 90,550" fill="none"
              stroke="#00897b" strokeWidth="1" strokeDasharray="4,3"
              style={{ opacity: lineOpacity("payment", "mysql"), transition: "opacity 0.3s" }} />
            <path d="M 500,431 C 500,500 110,500 110,550" fill="none"
              stroke="#00897b" strokeWidth="1" strokeDasharray="4,3"
              style={{ opacity: lineOpacity("admin", "mysql"), transition: "opacity 0.3s" }} />
            <path d="M 710,431 C 710,515 130,515 130,550" fill="none"
              stroke="#00897b" strokeWidth="1" strokeDasharray="4,3"
              style={{ opacity: lineOpacity("notification", "mysql"), transition: "opacity 0.3s" }} />

            {/* Stacked curves for Redis */}
            <path d="M 620,346 C 620,400 810,400 810,550" fill="none"
              stroke="#00897b" strokeWidth="1" strokeDasharray="4,3"
              style={{ opacity: lineOpacity("gateway", "redis"), transition: "opacity 0.3s" }} />
            <path d="M 370,431 C 370,520 750,520 750,550" fill="none"
              stroke="#00897b" strokeWidth="1" strokeDasharray="4,3"
              style={{ opacity: lineOpacity("payment", "redis"), transition: "opacity 0.3s" }} />

            {/* ==================== Layer 5: Monitoring ==================== */}
            <g style={nodeStyle("monitoring")} onMouseEnter={() => setHoveredNode("monitoring")} onMouseLeave={() => setHoveredNode(null)}>
              <rect x="200" y="650" width="480" height="44" rx="8"
                fill="rgba(63,81,181,0.08)" stroke="#3f51b5" strokeWidth="1.5" />
              <text x="440" y="676" textAnchor="middle" fontWeight="bold" fontSize="12" fill="#3b82f6">
                Prometheus · Grafana · Loki · Promtail
              </text>
            </g>

            {/* Monitoring dashed connections */}
            <path d="M 90,604 C 90,640 350,620 350,650" fill="none"
              stroke="#7986cb" strokeWidth="1" strokeDasharray="3,3"
              style={{ opacity: lineOpacity("mysql", "monitoring"), transition: "opacity 0.3s" }} />
            <path d="M 780,604 C 780,640 530,620 530,650" fill="none"
              stroke="#7986cb" strokeWidth="1" strokeDasharray="3,3"
              style={{ opacity: lineOpacity("redis", "monitoring"), transition: "opacity 0.3s" }} />
          </svg>

          {/* Legend */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-4 text-[10px] text-muted-foreground/60">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded border-2 border-[#94a3b8]" />
              <span>External</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded border-2 border-[#2563eb]" />
              <span>AI Interface</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded border-2 border-[#f59e0b]" />
              <span>AOP Safety</span>
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
