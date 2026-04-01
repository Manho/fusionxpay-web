"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

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
  mysql: ["order", "payment", "admin", "notification", "observability"],
  kafka: ["mcp", "ai-cli", "aop", "order", "payment", "admin", "notification"],
  redis: ["gateway", "payment", "observability"],
  observability: ["mysql", "redis"],
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
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const isRelated = (nodeId: string) => {
    if (!hoveredNode) {
      return true;
    }

    return nodeId === hoveredNode || (relations[hoveredNode]?.includes(nodeId) ?? false);
  };

  const lineOpacity = (from: string, to: string) => {
    if (!hoveredNode) {
      return 0.78;
    }

    if (hoveredNode === from || hoveredNode === to) {
      return 1;
    }

    if ((relations[hoveredNode]?.includes(from) ?? false) || (relations[hoveredNode]?.includes(to) ?? false)) {
      return 0.82;
    }

    return 0.08;
  };

  const nodeStyle = (nodeId: string): CSSProperties => ({
    opacity: isRelated(nodeId) ? 1 : 0.16,
    transition: "opacity 0.3s ease, transform 0.3s ease",
    cursor: "default",
  });

  const SectionTag = variant === "landing" ? "section" : "section";

  return (
    <SectionTag
      id="architecture"
      ref={sectionRef}
      className={variant === "landing" ? "py-24 relative" : "my-4 relative w-full"}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 h-[760px] w-[760px] rounded-full bg-[#2563eb]/5 blur-[180px]" />
      </div>

      <div className={`relative z-10 ${variant === "landing" ? "container mx-auto px-4 sm:px-6 lg:px-8" : "w-full"}`}>
        {variant === "landing" && (
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <span className="text-[#2563eb] text-sm font-medium uppercase tracking-wider">
              Architecture
            </span>
            <h2 className="mt-3 mb-4 text-3xl sm:text-4xl lg:text-5xl font-bold">
              AI-Enhanced <span className="text-gradient">Architecture</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Spring AI MCP tooling, a 4-layer safety chain, and the core
              payment microservices connected through Kafka, secured by JWT,
              and audited end to end.
            </p>
          </div>
        )}

        <div
          className={`relative mx-auto max-w-6xl overflow-hidden rounded-3xl glass p-4 sm:p-8 transition-all duration-1000 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
          }`}
        >
          <svg viewBox="0 0 960 750" className="w-full h-auto">
            <text x="480" y="30" textAnchor="middle" fontWeight="700" fontSize="18" className="fill-foreground">
              FusionXPay AI + Microservices Architecture
            </text>

            <LayerFrame x={28} y={54} width={904} height={88} stroke="#64748b" label="Layer 1 · External Users & Surfaces" />
            <LayerFrame x={28} y={158} width={904} height={88} stroke="#2563eb" label="Layer 2 · AI Interface Layer" />
            <LayerFrame x={28} y={262} width={904} height={82} stroke="#f59e0b" label="Layer 2B · Cross-cutting Safety (Spring AOP)" />
            <LayerFrame x={28} y={360} width={904} height={154} stroke="#1976d2" label="Layer 3 · Core Services" />
            <LayerFrame x={28} y={532} width={904} height={132} stroke="#00897b" label="Layer 4 · Infrastructure" />

            <Node
              id="merchant"
              x={58}
              y={82}
              width={172}
              height={40}
              title="Merchant"
              subtitle="Human operator"
              stroke="#94a3b8"
              fill="rgba(148,163,184,0.08)"
              style={nodeStyle("merchant")}
              onEnter={setHoveredNode}
            />
            <Node
              id="agents"
              x={262}
              y={82}
              width={190}
              height={40}
              title="AI Agents"
              subtitle="Claude Desktop · Cursor"
              stroke="#94a3b8"
              fill="rgba(148,163,184,0.08)"
              style={nodeStyle("agents")}
              onEnter={setHoveredNode}
            />
            <Node
              id="dashboard"
              x={484}
              y={82}
              width={184}
              height={40}
              title="Dashboard"
              subtitle="Next.js admin UI"
              stroke="#94a3b8"
              fill="rgba(148,163,184,0.08)"
              style={nodeStyle("dashboard")}
              onEnter={setHoveredNode}
            />
            <Node
              id="terminal"
              x={700}
              y={82}
              width={176}
              height={40}
              title="CLI Terminal"
              subtitle="Operator shell"
              stroke="#94a3b8"
              fill="rgba(148,163,184,0.08)"
              style={nodeStyle("terminal")}
              onEnter={setHoveredNode}
            />

            <Node
              id="mcp"
              x={118}
              y={185}
              width={286}
              height={42}
              title="MCP Server"
              subtitle="Spring AI 1.0 · 8 tools · stdio · :8085"
              stroke="#2563eb"
              fill="rgba(37,99,235,0.1)"
              style={nodeStyle("mcp")}
              onEnter={setHoveredNode}
            />
            <Node
              id="ai-cli"
              x={556}
              y={185}
              width={286}
              height={42}
              title="AI CLI"
              subtitle="Picocli · 11 commands · audit-aware output"
              stroke="#2563eb"
              fill="rgba(37,99,235,0.1)"
              style={nodeStyle("ai-cli")}
              onEnter={setHoveredNode}
            />

            <g
              style={nodeStyle("aop")}
              onMouseEnter={() => setHoveredNode("aop")}
              onMouseLeave={() => setHoveredNode(null)}
            >
              <rect x="108" y="283" width="744" height="40" rx="12" fill="rgba(245,158,11,0.09)" stroke="#f59e0b" strokeWidth="1.8" />
              <text x="480" y="304" textAnchor="middle" fontWeight="700" fontSize="13" fill="#f59e0b">
                InputSafetyAspect → ToolAuditAspect → OutputSafetyAspect
              </text>
              <text x="480" y="320" textAnchor="middle" fontSize="10" fill="#fbbf24">
                Regex injection detection · Kafka audit · PII redaction
              </text>
            </g>

            <Node
              id="gateway"
              x={305}
              y={388}
              width={350}
              height={54}
              title="API Gateway"
              subtitle="JWT Auth · Rate Limiting · RBAC · Merchant headers"
              stroke="#2563eb"
              fill="rgba(37,99,235,0.1)"
              port=":8080"
              style={nodeStyle("gateway")}
              onEnter={setHoveredNode}
            />

            <Node
              id="order"
              x={54}
              y={462}
              width={170}
              height={42}
              title="Order Service"
              subtitle="Merchant isolation"
              stroke="#1976d2"
              fill="rgba(25,118,210,0.08)"
              port=":8082"
              style={nodeStyle("order")}
              onEnter={setHoveredNode}
            />
            <Node
              id="payment"
              x={250}
              y={462}
              width={180}
              height={42}
              title="Payment Service"
              subtitle="Stripe · PayPal"
              stroke="#1976d2"
              fill="rgba(25,118,210,0.08)"
              port=":8081"
              style={nodeStyle("payment")}
              onEnter={setHoveredNode}
            />
            <Node
              id="admin"
              x={456}
              y={462}
              width={176}
              height={42}
              title="Admin Service"
              subtitle="JWT auth · audit consumer"
              stroke="#1976d2"
              fill="rgba(25,118,210,0.08)"
              port=":8084"
              style={nodeStyle("admin")}
              onEnter={setHoveredNode}
            />
            <Node
              id="notification"
              x={658}
              y={462}
              width={246}
              height={42}
              title="Notification Service"
              subtitle="Async event delivery"
              stroke="#1976d2"
              fill="rgba(25,118,210,0.08)"
              port=":8083"
              style={nodeStyle("notification")}
              onEnter={setHoveredNode}
            />

            <Node
              id="mysql"
              x={78}
              y={573}
              width={188}
              height={44}
              title="MySQL"
              subtitle="Shared database"
              stroke="#00897b"
              fill="rgba(0,137,123,0.08)"
              port=":3306"
              style={nodeStyle("mysql")}
              onEnter={setHoveredNode}
            />
            <Node
              id="kafka"
              x={314}
              y={573}
              width={332}
              height={44}
              title="Apache Kafka"
              subtitle="payment-events · ai-audit-log"
              stroke="#ff8f00"
              fill="rgba(255,143,0,0.08)"
              style={nodeStyle("kafka")}
              onEnter={setHoveredNode}
            />
            <Node
              id="redis"
              x={694}
              y={573}
              width={188}
              height={44}
              title="Redis"
              subtitle="Rate limit · idempotency"
              stroke="#00897b"
              fill="rgba(0,137,123,0.08)"
              port=":6379"
              style={nodeStyle("redis")}
              onEnter={setHoveredNode}
            />
            <Node
              id="observability"
              x={246}
              y={628}
              width={468}
              height={28}
              title="Prometheus · Grafana · Loki"
              subtitle=""
              stroke="#00897b"
              fill="rgba(0,137,123,0.05)"
              style={nodeStyle("observability")}
              onEnter={setHoveredNode}
              compact
            />

            <Arrow from={{ x: 144, y: 122 }} to={{ x: 350, y: 388 }} stroke="#64748b" opacity={lineOpacity("merchant", "gateway")} />
            <Arrow from={{ x: 576, y: 122 }} to={{ x: 522, y: 388 }} stroke="#64748b" opacity={lineOpacity("dashboard", "gateway")} />
            <Arrow from={{ x: 788, y: 122 }} to={{ x: 612, y: 388 }} stroke="#64748b" opacity={lineOpacity("terminal", "gateway")} />
            <Arrow from={{ x: 356, y: 122 }} to={{ x: 262, y: 185 }} stroke="#64748b" opacity={lineOpacity("agents", "mcp")} />

            <Arrow from={{ x: 260, y: 227 }} to={{ x: 260, y: 283 }} stroke="#2563eb" opacity={lineOpacity("mcp", "aop")} />
            <Arrow from={{ x: 700, y: 227 }} to={{ x: 700, y: 283 }} stroke="#2563eb" opacity={lineOpacity("ai-cli", "gateway")} />
            <Arrow from={{ x: 480, y: 323 }} to={{ x: 480, y: 388 }} stroke="#f59e0b" opacity={lineOpacity("aop", "gateway")} />

            <Arrow from={{ x: 365, y: 442 }} to={{ x: 140, y: 462 }} stroke="#2563eb" opacity={lineOpacity("gateway", "order")} curved="left" label="route" />
            <Arrow from={{ x: 435, y: 442 }} to={{ x: 340, y: 462 }} stroke="#2563eb" opacity={lineOpacity("gateway", "payment")} curved="left-soft" />
            <Arrow from={{ x: 530, y: 442 }} to={{ x: 545, y: 462 }} stroke="#2563eb" opacity={lineOpacity("gateway", "admin")} />
            <Arrow from={{ x: 602, y: 442 }} to={{ x: 780, y: 462 }} stroke="#2563eb" opacity={lineOpacity("gateway", "notification")} curved="right" />

            <Arrow from={{ x: 348, y: 504 }} to={{ x: 490, y: 573 }} stroke="#ff8f00" opacity={lineOpacity("payment", "kafka")} label="publish" />
            <Arrow from={{ x: 490, y: 573 }} to={{ x: 136, y: 504 }} stroke="#1976d2" opacity={lineOpacity("kafka", "order")} label="consume" curved="left-soft" />
            <Arrow from={{ x: 490, y: 573 }} to={{ x: 778, y: 504 }} stroke="#1976d2" opacity={lineOpacity("kafka", "notification")} label="consume" curved="right-soft" />
            <Arrow from={{ x: 490, y: 573 }} to={{ x: 544, y: 504 }} stroke="#ff8f00" opacity={lineOpacity("kafka", "admin")} label="ai-audit-log" curved="right-tight" />
            <Arrow from={{ x: 260, y: 227 }} to={{ x: 430, y: 573 }} stroke="#ff8f00" opacity={lineOpacity("mcp", "kafka")} curved="right-soft" />
            <Arrow from={{ x: 700, y: 227 }} to={{ x: 566, y: 573 }} stroke="#ff8f00" opacity={lineOpacity("ai-cli", "kafka")} curved="left-soft" />

            <DashedLink from={{ x: 122, y: 504 }} to={{ x: 150, y: 573 }} stroke="#00897b" opacity={lineOpacity("order", "mysql")} />
            <DashedLink from={{ x: 318, y: 504 }} to={{ x: 192, y: 573 }} stroke="#00897b" opacity={lineOpacity("payment", "mysql")} />
            <DashedLink from={{ x: 544, y: 504 }} to={{ x: 234, y: 573 }} stroke="#00897b" opacity={lineOpacity("admin", "mysql")} />
            <DashedLink from={{ x: 780, y: 504 }} to={{ x: 258, y: 573 }} stroke="#00897b" opacity={lineOpacity("notification", "mysql")} />
            <DashedLink from={{ x: 618, y: 442 }} to={{ x: 788, y: 573 }} stroke="#00897b" opacity={lineOpacity("gateway", "redis")} />
            <DashedLink from={{ x: 390, y: 504 }} to={{ x: 742, y: 573 }} stroke="#00897b" opacity={lineOpacity("payment", "redis")} />
            <DashedLink from={{ x: 170, y: 617 }} to={{ x: 350, y: 628 }} stroke="#0ea5e9" opacity={lineOpacity("mysql", "observability")} />
            <DashedLink from={{ x: 790, y: 617 }} to={{ x: 620, y: 628 }} stroke="#0ea5e9" opacity={lineOpacity("redis", "observability")} />
          </svg>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-4 text-[10px] text-muted-foreground/65">
            <LegendSwatch label="External Surface" stroke="#94a3b8" />
            <LegendSwatch label="AI Interface" stroke="#2563eb" />
            <LegendSwatch label="AOP Safety" stroke="#f59e0b" />
            <LegendSwatch label="Core Service" stroke="#1976d2" />
            <LegendSwatch label="Infrastructure" stroke="#00897b" />
            <span className="text-muted-foreground/40">Hover nodes to trace related flows</span>
          </div>
        </div>
      </div>
    </SectionTag>
  );
}

function LayerFrame({
  x,
  y,
  width,
  height,
  stroke,
  label,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  stroke: string;
  label: string;
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx="16"
        fill="none"
        stroke={stroke}
        strokeWidth="1.2"
        strokeDasharray="8 6"
        opacity="0.5"
      />
      <text x={x + 18} y={y + 20} fontSize="11" fill={stroke} fontWeight="700">
        {label}
      </text>
    </g>
  );
}

function Node({
  id,
  x,
  y,
  width,
  height,
  title,
  subtitle,
  stroke,
  fill,
  port,
  style,
  onEnter,
  compact = false,
}: {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  title: string;
  subtitle: string;
  stroke: string;
  fill: string;
  port?: string;
  style: CSSProperties;
  onEnter: (nodeId: string | null) => void;
  compact?: boolean;
}) {
  return (
    <g
      style={style}
      onMouseEnter={() => onEnter(id)}
      onMouseLeave={() => onEnter(null)}
    >
      <rect x={x} y={y} width={width} height={height} rx="12" fill={fill} stroke={stroke} strokeWidth="1.8" />
      <text x={x + width / 2} y={compact ? y + 18 : y + 19} textAnchor="middle" fontWeight="700" fontSize={compact ? "12" : "13"} fill={stroke}>
        {title}
      </text>
      {subtitle ? (
        <text x={x + width / 2} y={y + height - 10} textAnchor="middle" fontSize="10" fill={stroke === "#94a3b8" ? "#cbd5e1" : stroke === "#f59e0b" ? "#fbbf24" : stroke === "#00897b" ? "#4db6ac" : "#60a5fa"}>
          {subtitle}
        </text>
      ) : null}
      {port ? (
        <text x={x + width - 12} y={y + 19} textAnchor="end" fontSize="10" className="fill-muted-foreground">
          {port}
        </text>
      ) : null}
    </g>
  );
}

function Arrow({
  from,
  to,
  stroke,
  opacity,
  curved,
  label,
}: {
  from: { x: number; y: number };
  to: { x: number; y: number };
  stroke: string;
  opacity: number;
  curved?: "left" | "right" | "left-soft" | "right-soft" | "right-tight";
  label?: string;
}) {
  let path = `M ${from.x} ${from.y} L ${to.x} ${to.y}`;

  if (curved === "left") {
    path = `M ${from.x} ${from.y} Q ${from.x - 80} ${from.y + 40} ${to.x} ${to.y}`;
  } else if (curved === "right") {
    path = `M ${from.x} ${from.y} Q ${from.x + 90} ${from.y + 44} ${to.x} ${to.y}`;
  } else if (curved === "left-soft") {
    path = `M ${from.x} ${from.y} Q ${from.x - 28} ${from.y + 48} ${to.x} ${to.y}`;
  } else if (curved === "right-soft") {
    path = `M ${from.x} ${from.y} Q ${from.x + 28} ${from.y + 48} ${to.x} ${to.y}`;
  } else if (curved === "right-tight") {
    path = `M ${from.x} ${from.y} Q ${from.x + 22} ${from.y - 36} ${to.x} ${to.y}`;
  }

  return (
    <g opacity={opacity} style={{ transition: "opacity 0.3s ease" }}>
      <path d={path} fill="none" stroke={stroke} strokeWidth="1.6" />
      <circle cx={to.x} cy={to.y} r="3.2" fill={stroke} />
      {label ? (
        <text
          x={(from.x + to.x) / 2}
          y={(from.y + to.y) / 2 - 8}
          textAnchor="middle"
          fontSize="9"
          fill={stroke}
          fontStyle="italic"
        >
          {label}
        </text>
      ) : null}
    </g>
  );
}

function DashedLink({
  from,
  to,
  stroke,
  opacity,
}: {
  from: { x: number; y: number };
  to: { x: number; y: number };
  stroke: string;
  opacity: number;
}) {
  return (
    <line
      x1={from.x}
      y1={from.y}
      x2={to.x}
      y2={to.y}
      stroke={stroke}
      strokeWidth="1.2"
      strokeDasharray="4 4"
      opacity={opacity}
      style={{ transition: "opacity 0.3s ease" }}
    />
  );
}

function LegendSwatch({ label, stroke }: { label: string; stroke: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="h-2.5 w-2.5 rounded-sm border-2" style={{ borderColor: stroke }} />
      <span>{label}</span>
    </div>
  );
}
