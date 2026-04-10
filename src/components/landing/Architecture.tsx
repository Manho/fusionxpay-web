"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

/* ── Relation graph for interactive hover highlighting ── */
const relations: Record<string, string[]> = {
  "web-clients": ["gateway"],
  "ai-agents": ["mcp", "ai-cli"],
  mcp: ["ai-agents", "gateway"],
  "ai-cli": ["ai-agents", "gateway"],
  gateway: ["web-clients", "mcp", "ai-cli", "order", "payment", "admin", "notification", "redis", "kafka"],
  admin: ["gateway", "order", "mysql"], // Removed kafka
  order: ["gateway", "payment", "mysql", "kafka"],
  payment: ["gateway", "order", "stripe", "mysql", "kafka", "redis"],
  notification: ["gateway", "mysql", "kafka"],
  stripe: ["payment"],
  mysql: ["order", "payment", "admin", "notification", "kafka", "monitoring"],
  kafka: ["payment", "order", "notification", "mysql", "gateway"], // Removed admin
  redis: ["gateway", "monitoring", "payment"],
  monitoring: ["mysql", "redis"],
};

/* ── Tailwind styles specifically handling SVG internal properties via className ── */
const T = {
  // Title
  title: "fill-slate-800 dark:fill-slate-100",
  groupBox: "fill-transparent stroke-slate-300/80 dark:stroke-slate-700/60",

  // Node Boxes (Soft glass effects: very low opacity fill)
  boxExternal: "fill-slate-400/10 stroke-slate-400 dark:fill-slate-400/20 dark:stroke-slate-500",
  textExternal: "fill-slate-600 dark:fill-slate-300",
  
  boxAi: "fill-blue-500/10 stroke-blue-500 dark:fill-blue-500/20 dark:stroke-blue-400",
  textAi: "fill-blue-600 dark:fill-blue-300",
  
  boxGateway: "fill-emerald-500/10 stroke-emerald-500 dark:fill-emerald-500/20 dark:stroke-emerald-500",
  textGateway: "fill-emerald-600 dark:fill-emerald-300",
  
  boxService: "fill-blue-600/10 stroke-blue-600 dark:fill-blue-600/20 dark:stroke-blue-500",
  textService: "fill-blue-700 dark:fill-blue-300",
  
  boxDb: "fill-teal-600/10 stroke-teal-600 dark:fill-teal-600/20 dark:stroke-teal-500",
  textDb: "fill-teal-700 dark:fill-teal-300",
  
  boxKafka: "fill-amber-500/10 stroke-amber-500 dark:fill-amber-500/20 dark:stroke-amber-500",
  textKafka: "fill-amber-700 dark:fill-amber-300",
  
  boxMonitor: "fill-indigo-500/10 stroke-indigo-500 dark:fill-indigo-500/20 dark:stroke-indigo-400",
  textMonitor: "fill-indigo-600 dark:fill-indigo-300",

  // Lines (Stroke only, NO FILL)
  lineExternal: "stroke-slate-500 dark:stroke-slate-400 fill-transparent",
  lineAi: "stroke-blue-500 dark:stroke-blue-400 fill-transparent",
  lineGateway: "stroke-emerald-500 dark:stroke-emerald-400 fill-transparent",
  lineService: "stroke-blue-500 dark:stroke-blue-400 fill-transparent",
  lineDb: "stroke-teal-600 dark:stroke-teal-400 fill-transparent",
  lineKafka: "stroke-amber-500 dark:stroke-amber-400 fill-transparent",
  lineMonitor: "stroke-indigo-500 dark:stroke-indigo-400 fill-transparent",

  // Arrows (Fill only, NO STROKE)
  arrowExternal: "fill-slate-500 dark:fill-slate-400",
  arrowAi: "fill-blue-500 dark:fill-blue-400",
  arrowGateway: "fill-emerald-500 dark:fill-emerald-400",
  arrowService: "fill-blue-500 dark:fill-blue-400",
  arrowDb: "fill-teal-600 dark:fill-teal-400",
  arrowKafka: "fill-amber-500 dark:fill-amber-400",
  arrowMonitor: "fill-indigo-500 dark:fill-indigo-400",
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
            <span className="text-[#2563eb] dark:text-blue-400 text-sm font-medium uppercase tracking-wider">
              Architecture
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-3 mb-4 text-slate-800 dark:text-slate-200">
              AI-Enhanced Architecture
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Spring AI MCP Server, 4 core microservices, and dynamic bypass channels — connected
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
            <text x="440" y="24" textAnchor="middle" fontWeight="bold" fontSize="18" className={T.title}>
              FusionXPay Architecture
            </text>

            {/* ==================== Layer 1: External Users ==================== */}
            <text x="30" y="52" fontSize="11" className="fill-slate-500 dark:fill-slate-400" fontWeight="600" letterSpacing="1">
              EXTERNAL CALLERS
            </text>
            <rect x="30" y="60" width="820" height="56" rx="10"
              className={T.groupBox} strokeWidth="1" strokeDasharray="6 4" />

            <g style={nodeStyle("web-clients")} onMouseEnter={() => setHoveredNode("web-clients")} onMouseLeave={() => setHoveredNode(null)}>
              <rect x="40" y="72" width="200" height="34" rx="8"
                className={T.boxExternal} strokeWidth="1.5" />
              <text x="140" y="88" textAnchor="middle" fontWeight="600" fontSize="11" className={T.textExternal}>Web Clients</text>
              <text x="140" y="100" textAnchor="middle" fontWeight="500" fontSize="9" className={T.textExternal} opacity="0.8">Frontend interactions</text>
            </g>

            <g style={nodeStyle("ai-agents")} onMouseEnter={() => setHoveredNode("ai-agents")} onMouseLeave={() => setHoveredNode(null)}>
              <rect x="310" y="72" width="430" height="34" rx="8"
                className={T.boxExternal} strokeWidth="1.5" />
              <text x="525" y="88" textAnchor="middle" fontWeight="600" fontSize="11" className={T.textExternal}>AI Agents &amp; Workflows</text>
              <text x="525" y="100" textAnchor="middle" fontWeight="500" fontSize="9" className={T.textExternal} opacity="0.8">Claude Code, Codex, etc.</text>
            </g>

            {/* ==================== Layer 2: AI Interface ==================== */}
            <text x="30" y="128" fontSize="11" className="fill-blue-500 dark:fill-blue-400" fontWeight="600" letterSpacing="1">
              AI INTEGRATION LAYER
            </text>
            <rect x="30" y="136" width="820" height="74" rx="10"
              className={T.groupBox} strokeWidth="1" strokeDasharray="6 4" />

            <g style={nodeStyle("mcp")} onMouseEnter={() => setHoveredNode("mcp")} onMouseLeave={() => setHoveredNode(null)}>
              <rect x="310" y="148" width="200" height="52" rx="8"
                className={T.boxAi} strokeWidth="2" />
              <text x="410" y="166" textAnchor="middle" fontWeight="bold" fontSize="13" className={T.textAi}>
                MCP Server
              </text>
              <text x="410" y="180" textAnchor="middle" fontSize="10" className={T.textAi} opacity="0.8">
                Model Context Protocol
              </text>
              <text x="410" y="192" textAnchor="middle" fontSize="9" className={T.textAi} opacity="0.6">
                Injects ToolAuditAspect
              </text>
            </g>

            <g style={nodeStyle("ai-cli")} onMouseEnter={() => setHoveredNode("ai-cli")} onMouseLeave={() => setHoveredNode(null)}>
              <rect x="540" y="148" width="200" height="52" rx="8"
                className={T.boxAi} strokeWidth="2" />
              <text x="640" y="166" textAnchor="middle" fontWeight="bold" fontSize="13" className={T.textAi}>
                AI CLI Tool
              </text>
              <text x="640" y="180" textAnchor="middle" fontSize="10" className={T.textAi} opacity="0.8">
                Terminal Automation
              </text>
              <text x="640" y="192" textAnchor="middle" fontSize="9" className={T.textAi} opacity="0.6">
                Injects ExecutionStrategy
              </text>
            </g>

            {/* ==================== Layer 3: Gateway ==================== */}
            <text x="30" y="235" fontSize="11" className="fill-emerald-600 dark:fill-emerald-400" fontWeight="600" letterSpacing="1">
              EDGE
            </text>
            <rect x="30" y="243" width="820" height="68" rx="10"
              className={T.groupBox} strokeWidth="1" strokeDasharray="6 4" />

            <g style={nodeStyle("gateway")} onMouseEnter={() => setHoveredNode("gateway")} onMouseLeave={() => setHoveredNode(null)}>
              <rect x="40" y="255" width="800" height="46" rx="8"
                className={T.boxGateway} strokeWidth="2" />
              <text x="440" y="276" textAnchor="middle" fontWeight="bold" fontSize="14" className={T.textGateway}>
                API Gateway
              </text>
              <text x="440" y="290" textAnchor="middle" fontSize="10" className={T.textGateway} opacity="0.8">
                Ingress Routing · JWT Auth · Validation · X-Audit-* Filter
              </text>
            </g>

            {/* Arrows: External → AI / Gateway */}
            <g style={{ opacity: lineOpacity("web-clients", "gateway"), transition: "opacity 0.3s" }}>
              <line x1="140" y1="106" x2="140" y2="248" className={T.lineExternal} strokeWidth="1.3" />
              <polygon points="136,248 144,248 140,255" className={T.arrowExternal} stroke="none" />
            </g>
            
            <g style={{ opacity: lineOpacity("ai-agents", "mcp"), transition: "opacity 0.3s" }}>
              <line x1="410" y1="106" x2="410" y2="140" className={T.lineExternal} strokeWidth="1.3" />
              <polygon points="413,140 407,140 410,148" className={T.arrowExternal} stroke="none" />
            </g>
            <g style={{ opacity: lineOpacity("ai-agents", "ai-cli"), transition: "opacity 0.3s" }}>
              <line x1="640" y1="106" x2="640" y2="140" className={T.lineExternal} strokeWidth="1.3" />
              <polygon points="643,140 637,140 640,148" className={T.arrowExternal} stroke="none" />
            </g>

            <g style={{ opacity: lineOpacity("mcp", "gateway"), transition: "opacity 0.3s" }}>
              <line x1="410" y1="200" x2="410" y2="248" className={T.lineAi} strokeWidth="1.3" />
              <polygon points="407,248 413,248 410,255" className={T.arrowAi} stroke="none" />
            </g>
            <g style={{ opacity: lineOpacity("ai-cli", "gateway"), transition: "opacity 0.3s" }}>
              <line x1="640" y1="200" x2="640" y2="248" className={T.lineAi} strokeWidth="1.3" />
              <polygon points="637,248 643,248 640,255" className={T.arrowAi} stroke="none" />
            </g>

            {/* ==================== Layer 3B: Services ==================== */}
            <text x="30" y="335" fontSize="11" className="fill-blue-600 dark:fill-blue-400" fontWeight="600" letterSpacing="1">
              MICROSERVICES
            </text>
            <rect x="30" y="343" width="820" height="82" rx="10"
              className={T.groupBox} strokeWidth="1" strokeDasharray="6 4" />

            <g style={nodeStyle("admin")} onMouseEnter={() => setHoveredNode("admin")} onMouseLeave={() => setHoveredNode(null)}>
              <rect x="40" y="355" width="160" height="56" rx="8"
                className={T.boxService} strokeWidth="2" />
              <text x="120" y="380" textAnchor="middle" fontWeight="bold" fontSize="13" className={T.textService}>
                Admin Service
              </text>
              <text x="120" y="396" textAnchor="middle" fontSize="10" className={T.textService} opacity="0.8">
                Merchants Setup
              </text>
              <text x="120" y="407" textAnchor="middle" fontSize="9" className={T.textService} opacity="0.6">
                AI OAuth Approvals
              </text>
            </g>

            <g style={nodeStyle("order")} onMouseEnter={() => setHoveredNode("order")} onMouseLeave={() => setHoveredNode(null)}>
              <rect x="250" y="355" width="160" height="56" rx="8"
                className={T.boxService} strokeWidth="2" />
              <text x="330" y="380" textAnchor="middle" fontWeight="bold" fontSize="13" className={T.textService}>
                Order Service
              </text>
              <text x="330" y="396" textAnchor="middle" fontSize="10" className={T.textService} opacity="0.8">
                Order Lifecycle
              </text>
              <text x="330" y="407" textAnchor="middle" fontSize="9" className={T.textService} opacity="0.6">
                Merchant Isolation
              </text>
            </g>

            <g style={nodeStyle("payment")} onMouseEnter={() => setHoveredNode("payment")} onMouseLeave={() => setHoveredNode(null)}>
              <rect x="460" y="355" width="160" height="56" rx="8"
                className={T.boxService} strokeWidth="2" />
              <text x="540" y="380" textAnchor="middle" fontWeight="bold" fontSize="13" className={T.textService}>
                Payment Service
              </text>
              <text x="540" y="396" textAnchor="middle" fontSize="10" className={T.textService} opacity="0.8">
                Provider Connect
              </text>
              <text x="540" y="407" textAnchor="middle" fontSize="9" className={T.textService} opacity="0.6">
                Refunds &amp; Callbacks
              </text>
            </g>

            <g style={nodeStyle("notification")} onMouseEnter={() => setHoveredNode("notification")} onMouseLeave={() => setHoveredNode(null)}>
              <rect x="670" y="355" width="170" height="56" rx="8"
                className={T.boxService} strokeWidth="2" />
              <text x="755" y="380" textAnchor="middle" fontWeight="bold" fontSize="13" className={T.textService}>
                Notification Service
              </text>
              <text x="755" y="396" textAnchor="middle" fontSize="10" className={T.textService} opacity="0.8">
                Async Alerts
              </text>
              <text x="755" y="407" textAnchor="middle" fontSize="9" className={T.textService} opacity="0.6">
                Merchant Dispatch
              </text>
            </g>

            {/* Gateway → Services arrows */}
            <g style={{ opacity: lineOpacity("gateway", "admin"), transition: "opacity 0.3s" }}>
              <line x1="120" y1="301" x2="120" y2="348" className={T.lineGateway} strokeWidth="1.5" />
              <polygon points="124,345 116,345 120,355" className={T.arrowGateway} stroke="none" />
            </g>
            <g style={{ opacity: lineOpacity("gateway", "order"), transition: "opacity 0.3s" }}>
              <line x1="330" y1="301" x2="330" y2="348" className={T.lineGateway} strokeWidth="1.5" />
              <polygon points="334,345 326,345 330,355" className={T.arrowGateway} stroke="none" />
            </g>
            <g style={{ opacity: lineOpacity("gateway", "payment"), transition: "opacity 0.3s" }}>
              <line x1="540" y1="301" x2="540" y2="348" className={T.lineGateway} strokeWidth="1.5" />
              <polygon points="544,345 536,345 540,355" className={T.arrowGateway} stroke="none" />
            </g>
            <g style={{ opacity: lineOpacity("gateway", "notification"), transition: "opacity 0.3s" }}>
              <line x1="755" y1="301" x2="755" y2="348" className={T.lineGateway} strokeWidth="1.5" />
              <polygon points="759,345 751,345 755,355" className={T.arrowGateway} stroke="none" />
            </g>

            {/* Inter-service calls */}
            <g style={{ opacity: lineOpacity("payment", "order"), transition: "opacity 0.3s" }}>
              <path d="M 460,383 L 417,383" className={T.lineService} strokeWidth="1.5" strokeDasharray="6,3" />
              <polygon points="417,379 410,383 417,387" className={T.arrowService} stroke="none" />
              <text x="435" y="378" textAnchor="middle" fontSize="9" className={T.textService} fontWeight="600">Feign</text>
            </g>
            <g style={{ opacity: lineOpacity("admin", "order"), transition: "opacity 0.3s" }}>
              <path d="M 200,383 L 243,383" className={T.lineService} strokeWidth="1.5" strokeDasharray="6,3" />
              <polygon points="243,379 250,383 243,387" className={T.arrowService} stroke="none" />
              <text x="225" y="378" textAnchor="middle" fontSize="9" className={T.textService} fontWeight="600">REST</text>
            </g>

            {/* External API straight down out of Microservices */}
            <g style={nodeStyle("stripe")} onMouseEnter={() => setHoveredNode("stripe")} onMouseLeave={() => setHoveredNode(null)}>
              <rect x="465" y="440" width="66" height="18" rx="4" className={T.boxExternal} strokeWidth="1.5" strokeDasharray="3,2" />
              <text x="498" y="452" textAnchor="middle" fontSize="8" className={T.textExternal} fontWeight="600">Stripe / PayPal</text>
            </g>
            <g style={{ opacity: lineOpacity("payment", "stripe"), transition: "opacity 0.3s" }}>
              <line x1="498" y1="411" x2="498" y2="440" className={T.lineExternal} strokeWidth="1.5" />
              <polygon points="494,432 502,432 498,440" className={T.arrowExternal} stroke="none" />
            </g>

            {/* ========================================================================================= */}
            {/* CROSS-LAYER DATA PATHS (Drawn FIRST so they fall UNDER the Event / Data nodes in Z-index) */}
            {/* ========================================================================================= */}
            
            {/* Services → Kafka routes */}
            <g style={{ opacity: lineOpacity("payment", "kafka"), transition: "opacity 0.3s" }}>
              <line x1="548" y1="411" x2="548" y2="474" className={T.lineKafka} strokeWidth="1.5" />
              <polygon points="544,474 552,474 548,484" className={T.arrowKafka} stroke="none" />
              <rect x="536" y="442" width="24" height="14" rx="3" className="fill-white dark:fill-slate-900" />
              <rect x="536" y="442" width="24" height="14" rx="3" className={T.boxKafka} strokeWidth="1" />
              <text x="548" y="452" fontSize="8" className={T.textKafka} textAnchor="middle" fontWeight="bold">PUB</text>
            </g>
            <g style={{ opacity: lineOpacity("order", "kafka"), transition: "opacity 0.3s" }}>
              <line x1="330" y1="411" x2="330" y2="474" className={T.lineKafka} strokeWidth="1.5" />
              <polygon points="326,474 334,474 330,484" className={T.arrowKafka} stroke="none" />
              <rect x="317" y="442" width="26" height="14" rx="3" className="fill-white dark:fill-slate-900" />
              <rect x="317" y="442" width="26" height="14" rx="3" className={T.boxKafka} strokeWidth="1" />
              <text x="330" y="452" fontSize="8" className={T.textKafka} textAnchor="middle" fontWeight="bold">PUB</text>
            </g>
            <g style={{ opacity: lineOpacity("notification", "kafka"), transition: "opacity 0.3s" }}>
              <line x1="755" y1="484" x2="755" y2="421" className={T.lineKafka} strokeWidth="1.5" />
              <polygon points="751,421 759,421 755,411" className={T.arrowKafka} stroke="none" />
              <rect x="742" y="442" width="26" height="14" rx="3" className="fill-white dark:fill-slate-900" />
              <rect x="742" y="442" width="26" height="14" rx="3" className={T.boxKafka} strokeWidth="1" />
              <text x="755" y="452" fontSize="8" className={T.textKafka} textAnchor="middle" fontWeight="bold">SUB</text>
            </g>

            {/* Gateway → Kafka bypass */}
            <g style={{ opacity: lineOpacity("gateway", "kafka"), transition: "opacity 0.3s" }}>
              <line x1="225" y1="301" x2="225" y2="474" className={T.lineKafka} strokeWidth="1.5" strokeDasharray="4,3" />
              <polygon points="221,474 229,474 225,484" className={T.arrowKafka} stroke="none" />
              <rect x="205" y="442" width="40" height="14" rx="3" className="fill-white dark:fill-slate-900" />
              <rect x="205" y="442" width="40" height="14" rx="3" className={T.boxKafka} strokeWidth="1" />
              <text x="225" y="452" fontSize="8" className={T.textKafka} textAnchor="middle" fontWeight="bold">Audit</text>
            </g>

            {/* Gateway & Services → Databases (Dropping straight down through Kafka layer ether) */}
            <g style={{ opacity: lineOpacity("admin", "mysql"), transition: "opacity 0.3s" }}>
              <line x1="120" y1="411" x2="120" y2="575" className={T.lineDb} strokeWidth="1" strokeDasharray="4,3" />
              <polygon points="116,575 124,575 120,585" className={T.arrowDb} stroke="none" />
            </g>
            <g style={{ opacity: lineOpacity("order", "mysql"), transition: "opacity 0.3s" }}>
              <line x1="290" y1="411" x2="290" y2="575" className={T.lineDb} strokeWidth="1" strokeDasharray="4,3" />
              <polygon points="286,575 294,575 290,585" className={T.arrowDb} stroke="none" />
            </g>
            <g style={{ opacity: lineOpacity("payment", "mysql"), transition: "opacity 0.3s" }}>
              <path d="M 464,411 L 464,465 L 260,465 L 260,575" className={T.lineDb} strokeWidth="1" strokeDasharray="4,3" />
              <polygon points="256,575 264,575 260,585" className={T.arrowDb} stroke="none" />
            </g>
            <g style={{ opacity: lineOpacity("gateway", "redis"), transition: "opacity 0.3s" }}>
              <line x1="650" y1="301" x2="650" y2="575" className={T.lineDb} strokeWidth="1.5" strokeDasharray="4,3" />
              <polygon points="646,575 654,575 650,585" className={T.arrowDb} stroke="none" />
              <rect x="623" y="550" width="54" height="18" rx="4" className="fill-white dark:fill-slate-900" />
              <rect x="623" y="550" width="54" height="18" rx="4" className={T.boxDb} strokeWidth="1" />
              <text x="650" y="562" fontSize="9" className={T.textDb} textAnchor="middle">Rate Limits</text>
            </g>
            <g style={{ opacity: lineOpacity("payment", "redis"), transition: "opacity 0.3s" }}>
              <line x1="594" y1="411" x2="594" y2="575" className={T.lineDb} strokeWidth="1" strokeDasharray="4,3" />
              <polygon points="590,575 598,575 594,585" className={T.arrowDb} stroke="none" />
              <rect x="566" y="550" width="56" height="18" rx="4" className="fill-white dark:fill-slate-900" />
              <rect x="566" y="550" width="56" height="18" rx="4" className={T.boxDb} strokeWidth="1" />
              <text x="594" y="562" fontSize="9" className={T.textDb} textAnchor="middle">Idempotency</text>
            </g>

            {/* Kafka → MySQL Sync */}
            <g style={{ opacity: lineOpacity("kafka", "mysql"), transition: "opacity 0.3s" }}>
              <line x1="180" y1="536" x2="180" y2="575" className={T.lineDb} strokeWidth="1.5" />
              <polygon points="176,575 184,575 180,585" className={T.arrowDb} stroke="none" />
              <rect x="155" y="550" width="50" height="16" rx="4" className="fill-white dark:fill-slate-900" />
              <rect x="155" y="550" width="50" height="16" rx="4" className={T.boxDb} strokeWidth="1" />
              <text x="180" y="561" fontSize="7" className={T.textDb} textAnchor="middle">JDBC Sink</text>
            </g>


            {/* ========================================================================================= */}
            {/* ==================== Layer 4: Event Streaming ==================== */}
            {/* The nodes themselves are drawn AFTER the cross-layer lines to mask them */}
            <text x="30" y="465" fontSize="11" className="fill-amber-600 dark:fill-amber-400" fontWeight="600" letterSpacing="1">
              EVENT STREAMING
            </text>
            <rect x="30" y="473" width="820" height="74" rx="10"
              className={T.groupBox} strokeWidth="1" strokeDasharray="6 4" />

            <g style={nodeStyle("kafka")} onMouseEnter={() => setHoveredNode("kafka")} onMouseLeave={() => setHoveredNode(null)}>
              {/* Opaque backer to cleanly hide crossing lines */}
              <rect x="40" y="484" width="800" height="52" rx="8" className="fill-white dark:fill-slate-900" />
              {/* Box graphic */}
              <rect x="40" y="484" width="800" height="52" rx="8"
                className={T.boxKafka} strokeWidth="2" />
              <text x="440" y="506" textAnchor="middle" fontWeight="bold" fontSize="13" className={T.textKafka}>
                Apache Kafka Broker
              </text>
              <text x="440" y="522" textAnchor="middle" fontFamily="monospace" fontSize="10" className={T.textKafka} opacity="0.8">
                payment-events
              </text>
            </g>

            {/* ==================== Layer 5: Data Tier ==================== */}
            <text x="30" y="567" fontSize="11" className="fill-teal-600 dark:fill-teal-400" fontWeight="600" letterSpacing="1">
              DATA TIER
            </text>
            <rect x="30" y="575" width="820" height="74" rx="10"
              className={T.groupBox} strokeWidth="1" strokeDasharray="6 4" />

            <g style={nodeStyle("mysql")} onMouseEnter={() => setHoveredNode("mysql")} onMouseLeave={() => setHoveredNode(null)}>
              <rect x="40" y="585" width="380" height="54" rx="8" className="fill-white dark:fill-slate-900" />
              <rect x="40" y="585" width="380" height="54" rx="8"
                className={T.boxDb} strokeWidth="2" />
              <text x="230" y="610" textAnchor="middle" fontWeight="bold" fontSize="13" className={T.textDb}>
                MySQL
              </text>
              <text x="230" y="627" textAnchor="middle" fontSize="10" className={T.textDb} opacity="0.8">
                Shared Database
              </text>
            </g>

            <g style={nodeStyle("redis")} onMouseEnter={() => setHoveredNode("redis")} onMouseLeave={() => setHoveredNode(null)}>
              <rect x="460" y="585" width="380" height="54" rx="8" className="fill-white dark:fill-slate-900" />
              <rect x="460" y="585" width="380" height="54" rx="8"
                className={T.boxDb} strokeWidth="2" />
              <text x="650" y="610" textAnchor="middle" fontWeight="bold" fontSize="13" className={T.textDb}>
                Redis
              </text>
              <text x="650" y="627" textAnchor="middle" fontSize="10" className={T.textDb} opacity="0.8">
                Rate Limit · Idempotency
              </text>
            </g>

            {/* ==================== Layer 6: Monitoring ==================== */}
            <text x="30" y="670" fontSize="11" className="fill-indigo-600 dark:fill-indigo-400" fontWeight="600" letterSpacing="1">
              OBSERVABILITY &amp; MONITORING
            </text>
            <rect x="30" y="678" width="820" height="64" rx="10"
              className={T.groupBox} strokeWidth="1" strokeDasharray="6 4" />

            <g style={nodeStyle("monitoring")} onMouseEnter={() => setHoveredNode("monitoring")} onMouseLeave={() => setHoveredNode(null)}>
              <rect x="40" y="688" width="800" height="44" rx="8" className="fill-white dark:fill-slate-900" />
              <rect x="40" y="688" width="800" height="44" rx="8"
                className={T.boxMonitor} strokeWidth="1.5" />
              <text x="440" y="714" textAnchor="middle" fontWeight="bold" fontSize="12" className={T.textMonitor}>
                Prometheus · Grafana · Loki · Promtail
              </text>
              {/* Telemetry descriptor tab intersecting the top edge */}
              <rect x="340" y="678" width="200" height="20" rx="4" className="fill-white dark:fill-slate-900" />
              <rect x="340" y="678" width="200" height="20" rx="4" className={T.boxMonitor} strokeWidth="1" />
              <text x="440" y="691" fontSize="9" className={T.textMonitor} textAnchor="middle" fontWeight="600">Collects telemetry across all services</text>
            </g>

            {/* Cross-layer paths complete */}
          </svg>

          {/* Legend */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-4 text-[10px] text-muted-foreground/60 dark:text-slate-400">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded border-2 border-slate-400 dark:border-slate-500" />
              <span>External</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded border-2 border-blue-500 dark:border-blue-700" />
              <span>AI Interface</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded border-2 border-emerald-500 dark:border-emerald-700" />
              <span>Gateway</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded border-2 border-blue-600 dark:border-blue-600" />
              <span>Core Service</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded border-2 border-amber-500 dark:border-amber-700" />
              <span>Event Bus</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded border-2 border-teal-600 dark:border-teal-700" />
              <span>Data Store</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded border-2 border-indigo-500 dark:border-indigo-700" />
              <span>Monitoring</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-0 border-t border-dashed border-slate-400 dark:border-slate-500" />
              <span>Async / Query</span>
            </div>
            <span className="text-slate-400/80 italic">
              Hover to explore connections
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
