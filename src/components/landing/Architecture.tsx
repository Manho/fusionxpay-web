"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

/* ── Relation graph for interactive hover highlighting ── */
const relations: Record<string, string[]> = {
  merchant: ["dashboard", "gateway"],
  agents: ["mcp", "aop"],
  dashboard: ["merchant", "gateway"],
  terminal: ["ai-cli", "gateway"],
  mcp: ["agents", "aop", "gateway", "kafka"],
  "ai-cli": ["terminal", "gateway", "kafka"],
  aop: ["mcp", "kafka", "gateway"],
  gateway: ["merchant", "dashboard", "terminal", "mcp", "ai-cli", "aop", "order", "payment", "admin", "notification", "redis"],
  order: ["gateway", "payment", "admin", "mysql", "kafka"],
  payment: ["gateway", "order", "mysql", "kafka", "redis"],
  admin: ["gateway", "order", "mysql", "kafka"],
  notification: ["gateway", "kafka", "mysql"],
  mysql: ["order", "payment", "admin", "notification", "monitoring"],
  kafka: ["mcp", "ai-cli", "aop", "order", "payment", "admin", "notification"],
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
              Spring AI MCP Server, 4-layer safety chain, and 6 microservices — connected
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
            viewBox="0 0 880 680"
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
            <text x="50" y="66" fontSize="10" fill="#94a3b8" fontWeight="600" opacity="0.7">
              EXTERNAL USERS &amp; AI AGENTS
            </text>

            <g style={nodeStyle("merchant")} onMouseEnter={() => setHoveredNode("merchant")} onMouseLeave={() => setHoveredNode(null)}>
              <rect x="50" y="76" width="150" height="30" rx="8"
                fill="rgba(148,163,184,0.06)" stroke="#94a3b8" strokeWidth="1.5" />
              <text x="125" y="95" textAnchor="middle" fontWeight="600" fontSize="12" fill="#94a3b8">👤 Merchant</text>
            </g>

            <g style={nodeStyle("agents")} onMouseEnter={() => setHoveredNode("agents")} onMouseLeave={() => setHoveredNode(null)}>
              <rect x="230" y="76" width="190" height="30" rx="8"
                fill="rgba(148,163,184,0.06)" stroke="#94a3b8" strokeWidth="1.5" />
              <text x="325" y="95" textAnchor="middle" fontWeight="600" fontSize="12" fill="#94a3b8">🤖 AI Assistants</text>
            </g>

            <g style={nodeStyle("dashboard")} onMouseEnter={() => setHoveredNode("dashboard")} onMouseLeave={() => setHoveredNode(null)}>
              <rect x="450" y="76" width="160" height="30" rx="8"
                fill="rgba(148,163,184,0.06)" stroke="#94a3b8" strokeWidth="1.5" />
              <text x="530" y="95" textAnchor="middle" fontWeight="600" fontSize="12" fill="#94a3b8">🖥️ Dashboard</text>
            </g>

            <g style={nodeStyle("terminal")} onMouseEnter={() => setHoveredNode("terminal")} onMouseLeave={() => setHoveredNode(null)}>
              <rect x="640" y="76" width="180" height="30" rx="8"
                fill="rgba(148,163,184,0.06)" stroke="#94a3b8" strokeWidth="1.5" />
              <text x="730" y="95" textAnchor="middle" fontWeight="600" fontSize="12" fill="#94a3b8">⌨️ CLI Terminal</text>
            </g>

            {/* ==================== Layer 2: AI Interface ==================== */}
            <rect x="30" y="128" width="820" height="72" rx="10"
              fill="none" stroke="#2563eb" strokeWidth="1" strokeDasharray="6 4" opacity="0.4" />
            <text x="50" y="144" fontSize="10" fill="#2563eb" fontWeight="600" opacity="0.7">
              AI INTERFACE LAYER
            </text>

            <g style={nodeStyle("mcp")} onMouseEnter={() => setHoveredNode("mcp")} onMouseLeave={() => setHoveredNode(null)}>
              <rect x="80" y="155" width="340" height="36" rx="8"
                fill="rgba(37,99,235,0.08)" stroke="#2563eb" strokeWidth="2" />
              <text x="250" y="175" textAnchor="middle" fontWeight="bold" fontSize="13" fill="#2563eb">
                MCP Server
              </text>
              <text x="410" y="175" textAnchor="end" fontSize="10" fill="#60a5fa">
                Spring AI · 8 tools · stdio · :8085
              </text>
            </g>

            <g style={nodeStyle("ai-cli")} onMouseEnter={() => setHoveredNode("ai-cli")} onMouseLeave={() => setHoveredNode(null)}>
              <rect x="460" y="155" width="360" height="36" rx="8"
                fill="rgba(37,99,235,0.08)" stroke="#2563eb" strokeWidth="2" />
              <text x="640" y="175" textAnchor="middle" fontWeight="bold" fontSize="13" fill="#2563eb">
                AI CLI
              </text>
              <text x="810" y="175" textAnchor="end" fontSize="10" fill="#60a5fa">
                Picocli · 11 commands · audit-aware
              </text>
            </g>

            {/* ==================== Layer 2B: AOP Safety ==================== */}
            <rect x="30" y="214" width="820" height="56" rx="10"
              fill="none" stroke="#f59e0b" strokeWidth="1" strokeDasharray="6 4" opacity="0.4" />
            <text x="50" y="230" fontSize="10" fill="#f59e0b" fontWeight="600" opacity="0.7">
              CROSS-CUTTING SAFETY · Spring AOP
            </text>

            <g style={nodeStyle("aop")} onMouseEnter={() => setHoveredNode("aop")} onMouseLeave={() => setHoveredNode(null)}>
              <rect x="80" y="238" width="770" height="26" rx="8"
                fill="rgba(245,158,11,0.06)" stroke="#f59e0b" strokeWidth="1.5" />
              <text x="440" y="256" textAnchor="middle" fontWeight="bold" fontSize="12" fill="#f59e0b">
                InputSafetyAspect → ToolAuditAspect → OutputSafetyAspect
              </text>
            </g>

            {/* Arrows: Users → AI Layer */}
            <line x1="325" y1="106" x2="250" y2="155" stroke="#94a3b8" strokeWidth="1.3"
              style={{ opacity: lineOpacity("agents", "mcp"), transition: "opacity 0.3s" }} />
            <polygon points="252,151 248,151 250,158" fill="#94a3b8"
              style={{ opacity: lineOpacity("agents", "mcp"), transition: "opacity 0.3s" }} />

            <line x1="730" y1="106" x2="640" y2="155" stroke="#94a3b8" strokeWidth="1.3"
              style={{ opacity: lineOpacity("terminal", "ai-cli"), transition: "opacity 0.3s" }} />
            <polygon points="642,151 638,151 640,158" fill="#94a3b8"
              style={{ opacity: lineOpacity("terminal", "ai-cli"), transition: "opacity 0.3s" }} />

            {/* AI Layer → AOP */}
            <line x1="250" y1="191" x2="250" y2="238" stroke="#2563eb" strokeWidth="1.3"
              style={{ opacity: lineOpacity("mcp", "aop"), transition: "opacity 0.3s" }} />
            <polygon points="246,234 254,234 250,241" fill="#2563eb"
              style={{ opacity: lineOpacity("mcp", "aop"), transition: "opacity 0.3s" }} />

            <line x1="640" y1="191" x2="640" y2="238" stroke="#2563eb" strokeWidth="1.3"
              style={{ opacity: lineOpacity("ai-cli", "aop"), transition: "opacity 0.3s" }} />
            <polygon points="636,234 644,234 640,241" fill="#2563eb"
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
              <text x="648" y="324" fontFamily="monospace" fontSize="10" className="fill-muted-foreground">
                :8080
              </text>
            </g>

            {/* AOP → Gateway */}
            <line x1="440" y1="264" x2="440" y2="290" stroke="#f59e0b" strokeWidth="1.3"
              style={{ opacity: lineOpacity("aop", "gateway"), transition: "opacity 0.3s" }} />
            <polygon points="436,286 444,286 440,293" fill="#f59e0b"
              style={{ opacity: lineOpacity("aop", "gateway"), transition: "opacity 0.3s" }} />

            {/* Dashboard/Merchant → Gateway */}
            <line x1="125" y1="106" x2="340" y2="290" stroke="#94a3b8" strokeWidth="1"
              style={{ opacity: lineOpacity("merchant", "gateway"), transition: "opacity 0.3s" }} />
            <line x1="530" y1="106" x2="480" y2="290" stroke="#94a3b8" strokeWidth="1"
              style={{ opacity: lineOpacity("dashboard", "gateway"), transition: "opacity 0.3s" }} />

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
              <text x="208" y="406" fontFamily="monospace" fontSize="10" className="fill-muted-foreground">
                :8082
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
              <text x="418" y="406" fontFamily="monospace" fontSize="10" className="fill-muted-foreground">
                :8081
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
              <text x="628" y="406" fontFamily="monospace" fontSize="10" className="fill-muted-foreground">
                :8084
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
              <text x="848" y="406" fontFamily="monospace" fontSize="10" className="fill-muted-foreground">
                :8083
              </text>
            </g>

            {/* ==================== Gateway → Services arrows ==================== */}
            <g style={{ opacity: lineOpacity("gateway", "order"), transition: "opacity 0.3s" }}>
              <line x1="320" y1="346" x2="120" y2="375" stroke="#3b82f6" strokeWidth="1.5" />
              <polygon points="124,371 116,371 120,378" fill="#3b82f6" />
            </g>
            <g style={{ opacity: lineOpacity("gateway", "payment"), transition: "opacity 0.3s" }}>
              <line x1="390" y1="346" x2="330" y2="375" stroke="#3b82f6" strokeWidth="1.5" />
              <polygon points="334,371 326,371 330,378" fill="#3b82f6" />
            </g>
            <g style={{ opacity: lineOpacity("gateway", "admin"), transition: "opacity 0.3s" }}>
              <line x1="490" y1="346" x2="540" y2="375" stroke="#3b82f6" strokeWidth="1.5" />
              <polygon points="544,371 536,371 540,378" fill="#3b82f6" />
            </g>
            <g style={{ opacity: lineOpacity("gateway", "notification"), transition: "opacity 0.3s" }}>
              <line x1="560" y1="346" x2="755" y2="375" stroke="#3b82f6" strokeWidth="1.5" />
              <polygon points="759,371 751,371 755,378" fill="#3b82f6" />
            </g>

            {/* ==================== Inter-service calls ==================== */}
            {/* Payment → Order (Feign) */}
            <g style={{ opacity: lineOpacity("payment", "order"), transition: "opacity 0.3s" }}>
              <line x1="250" y1="395" x2="200" y2="395"
                stroke="#1976d2" strokeWidth="1.5" strokeDasharray="6,3" />
              <polygon points="205,391 197,395 205,399" fill="#1976d2" />
              <text x="225" y="389" textAnchor="middle" fontSize="9" fill="#1976d2">
                Feign
              </text>
            </g>

            {/* Admin → Order (REST) */}
            <g style={{ opacity: lineOpacity("admin", "order"), transition: "opacity 0.3s" }}>
              <path d="M 460,415 Q 350,460 200,415"
                stroke="#1976d2" strokeWidth="1.5" strokeDasharray="6,3" fill="none" />
              <polygon points="205,411 197,415 205,419" fill="#1976d2" />
              <text x="340" y="453" textAnchor="middle" fontSize="9" fill="#1976d2">
                REST (query orders)
              </text>
            </g>

            {/* ==================== Layer 4: Data Stores + Kafka ==================== */}
            {/* MySQL */}
            <g style={nodeStyle("mysql")} onMouseEnter={() => setHoveredNode("mysql")} onMouseLeave={() => setHoveredNode(null)}>
              <rect x="10" y="470" width="160" height="54" rx="8"
                fill="rgba(0,137,123,0.08)" stroke="#00897b" strokeWidth="2" />
              <text x="90" y="495" textAnchor="middle" fontWeight="bold" fontSize="13" fill="#00897b">
                MySQL
              </text>
              <text x="90" y="512" textAnchor="middle" fontSize="10" fill="#4db6ac">
                Shared Database
              </text>
              <text x="90" y="535" fontFamily="monospace" fontSize="10" textAnchor="middle" className="fill-muted-foreground">
                :3306
              </text>
            </g>

            {/* Apache Kafka */}
            <g style={nodeStyle("kafka")} onMouseEnter={() => setHoveredNode("kafka")} onMouseLeave={() => setHoveredNode(null)}>
              <rect x="210" y="470" width="460" height="54" rx="8"
                fill="rgba(255,143,0,0.08)" stroke="#ff8f00" strokeWidth="2" />
              <text x="440" y="493" textAnchor="middle" fontWeight="bold" fontSize="13" fill="#ff8f00">
                Apache Kafka
              </text>
              <text x="440" y="511" textAnchor="middle" fontFamily="monospace" fontSize="10" fill="#ffb300">
                payment-events · ai-audit-log
              </text>
            </g>

            {/* Redis */}
            <g style={nodeStyle("redis")} onMouseEnter={() => setHoveredNode("redis")} onMouseLeave={() => setHoveredNode(null)}>
              <rect x="700" y="470" width="160" height="54" rx="8"
                fill="rgba(0,137,123,0.08)" stroke="#00897b" strokeWidth="2" />
              <text x="780" y="495" textAnchor="middle" fontWeight="bold" fontSize="13" fill="#00897b">
                Redis
              </text>
              <text x="780" y="512" textAnchor="middle" fontSize="10" fill="#4db6ac">
                Rate Limit · Idempotency
              </text>
              <text x="780" y="535" fontFamily="monospace" fontSize="10" textAnchor="middle" className="fill-muted-foreground">
                :6379
              </text>
            </g>

            {/* Services → Data stores */}
            {/* Payment → Kafka (produce) */}
            <g style={{ opacity: lineOpacity("payment", "kafka"), transition: "opacity 0.3s" }}>
              <line x1="330" y1="431" x2="330" y2="470"
                stroke="#ff8f00" strokeWidth="1.5" />
              <polygon points="326,466 334,466 330,473" fill="#ff8f00" />
              <text x="345" y="455" fontSize="9" fill="#ff8f00" fontStyle="italic">
                produce
              </text>
            </g>

            {/* Kafka → Order (consume) */}
            <g style={{ opacity: lineOpacity("kafka", "order"), transition: "opacity 0.3s" }}>
              <line x1="300" y1="470" x2="140" y2="431"
                stroke="#1976d2" strokeWidth="1.5" />
              <polygon points="144,436 136,436 140,427" fill="#1976d2" />
              <text x="200" y="460" fontSize="9" fill="#1976d2" fontStyle="italic">
                consume
              </text>
            </g>

            {/* Kafka → Notification (consume) */}
            <g style={{ opacity: lineOpacity("kafka", "notification"), transition: "opacity 0.3s" }}>
              <line x1="580" y1="470" x2="740" y2="431"
                stroke="#1976d2" strokeWidth="1.5" />
              <polygon points="744,436 736,436 740,427" fill="#1976d2" />
              <text x="680" y="460" fontSize="9" fill="#1976d2" fontStyle="italic">
                consume
              </text>
            </g>

            {/* Kafka → Admin (ai-audit-log consume) */}
            <g style={{ opacity: lineOpacity("kafka", "admin"), transition: "opacity 0.3s" }}>
              <line x1="500" y1="470" x2="540" y2="431"
                stroke="#ff8f00" strokeWidth="1.5" />
              <polygon points="544,436 536,436 540,427" fill="#ff8f00" />
              <text x="545" y="455" fontSize="9" fill="#ff8f00" fontStyle="italic">
                ai-audit-log
              </text>
            </g>

            {/* MCP → Kafka (audit) */}
            <g style={{ opacity: lineOpacity("mcp", "kafka"), transition: "opacity 0.3s" }}>
              <path d="M 250,191 Q 220,340 360,470" fill="none"
                stroke="#ff8f00" strokeWidth="1" strokeDasharray="4,3" />
            </g>
            {/* CLI → Kafka (audit) */}
            <g style={{ opacity: lineOpacity("ai-cli", "kafka"), transition: "opacity 0.3s" }}>
              <path d="M 640,191 Q 660,340 520,470" fill="none"
                stroke="#ff8f00" strokeWidth="1" strokeDasharray="4,3" />
            </g>

            {/* Services → MySQL (dashed) */}
            <line x1="120" y1="431" x2="50" y2="470"
              stroke="#00897b" strokeWidth="1" strokeDasharray="4,3"
              style={{ opacity: lineOpacity("order", "mysql"), transition: "opacity 0.3s" }} />
            <line x1="330" y1="431" x2="90" y2="470"
              stroke="#00897b" strokeWidth="1" strokeDasharray="4,3"
              style={{ opacity: lineOpacity("payment", "mysql"), transition: "opacity 0.3s" }} />
            <line x1="540" y1="431" x2="130" y2="470"
              stroke="#00897b" strokeWidth="1" strokeDasharray="4,3"
              style={{ opacity: lineOpacity("admin", "mysql"), transition: "opacity 0.3s" }} />
            <line x1="755" y1="431" x2="160" y2="470"
              stroke="#00897b" strokeWidth="1" strokeDasharray="4,3"
              style={{ opacity: lineOpacity("notification", "mysql"), transition: "opacity 0.3s" }} />

            {/* GW → Redis */}
            <line x1="600" y1="346" x2="740" y2="470"
              stroke="#00897b" strokeWidth="1" strokeDasharray="4,3"
              style={{ opacity: lineOpacity("gateway", "redis"), transition: "opacity 0.3s" }} />
            {/* Payment → Redis */}
            <line x1="380" y1="431" x2="720" y2="470"
              stroke="#00897b" strokeWidth="1" strokeDasharray="4,3"
              style={{ opacity: lineOpacity("payment", "redis"), transition: "opacity 0.3s" }} />

            {/* ==================== Layer 5: Monitoring ==================== */}
            <g style={nodeStyle("monitoring")} onMouseEnter={() => setHoveredNode("monitoring")} onMouseLeave={() => setHoveredNode(null)}>
              <rect x="200" y="560" width="480" height="44" rx="8"
                fill="rgba(63,81,181,0.08)" stroke="#3f51b5" strokeWidth="1.5" />
              <text x="440" y="586" textAnchor="middle" fontWeight="bold" fontSize="12" fill="#3b82f6">
                Prometheus · Grafana · Loki · Promtail
              </text>
            </g>

            {/* Monitoring dashed connections */}
            <line x1="90" y1="524" x2="350" y2="560"
              stroke="#7986cb" strokeWidth="1" strokeDasharray="3,3"
              style={{ opacity: lineOpacity("mysql", "monitoring"), transition: "opacity 0.3s" }} />
            <line x1="780" y1="524" x2="530" y2="560"
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
