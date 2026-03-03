"use client";

import { useEffect, useRef, useState } from "react";

export default function PaymentFlow() {
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

    const relations: Record<string, string[]> = {
        merchant: ["order"],
        order: ["merchant", "payment", "notification"],
        payment: ["order", "queue", "provider"],
        queue: ["payment", "order", "notification"],
        provider: ["payment"],
        notification: ["queue", "order"],
    };

    const isRelated = (nodeId: string) => {
        if (!hoveredNode) return true;
        return nodeId === hoveredNode || (relations[hoveredNode]?.includes(nodeId) ?? false);
    };

    const lineOpacity = (from: string, to: string) => {
        if (!hoveredNode) return 0.7;
        if (hoveredNode === from || hoveredNode === to) return 1;
        return 0.1;
    };

    const nodeStyle = (nodeId: string): React.CSSProperties => ({
        opacity: isRelated(nodeId) ? 1 : 0.15,
        transition: "opacity 0.3s, transform 0.3s",
        cursor: "default",
    });

    return (
        <section className="my-4 relative w-full" ref={sectionRef}>
            {/* SVG Architecture Diagram */}
            <div
                className={`relative w-full max-w-4xl mx-auto overflow-hidden transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                    }`}
            >
                <svg
                    viewBox="0 0 800 680"
                    className="w-full h-auto p-4 sm:p-8"
                    style={{ fontFamily: "'Inter', 'Arial', sans-serif" }}
                >
                    {/* Background glow lines to make it match the docs style */}
                    <defs>
                        <linearGradient id="flow-grad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="currentColor" stopOpacity="0.8" />
                            <stop offset="100%" stopColor="currentColor" stopOpacity="0.1" />
                        </linearGradient>
                    </defs>

                    {/* Actors */}
                    <g style={nodeStyle("merchant")} onMouseEnter={() => setHoveredNode("merchant")} onMouseLeave={() => setHoveredNode(null)}>
                        <rect x="50" y="50" width="120" height="40" rx="6" fill="rgba(124, 77, 255, 0.1)" stroke="#7c4dff" strokeWidth="1.5" />
                        <text x="110" y="74" textAnchor="middle" fontWeight="600" fontSize="13" className="fill-foreground">Merchant</text>
                        <line x1="110" y1="90" x2="110" y2="640" stroke="url(#flow-grad)" strokeWidth="1" strokeDasharray="4,4" className="text-muted-foreground" />
                    </g>

                    <g style={nodeStyle("order")} onMouseEnter={() => setHoveredNode("order")} onMouseLeave={() => setHoveredNode(null)}>
                        <rect x="200" y="50" width="120" height="40" rx="6" fill="rgba(25, 118, 210, 0.1)" stroke="#1976d2" strokeWidth="1.5" />
                        <text x="260" y="74" textAnchor="middle" fontWeight="600" fontSize="13" className="fill-foreground">Order Service</text>
                        <line x1="260" y1="90" x2="260" y2="640" stroke="url(#flow-grad)" strokeWidth="1" strokeDasharray="4,4" className="text-muted-foreground" />
                    </g>

                    <g style={nodeStyle("payment")} onMouseEnter={() => setHoveredNode("payment")} onMouseLeave={() => setHoveredNode(null)}>
                        <rect x="350" y="50" width="120" height="40" rx="6" fill="rgba(25, 118, 210, 0.1)" stroke="#1976d2" strokeWidth="1.5" />
                        <text x="410" y="74" textAnchor="middle" fontWeight="600" fontSize="13" className="fill-foreground">Payment Service</text>
                        <line x1="410" y1="90" x2="410" y2="640" stroke="url(#flow-grad)" strokeWidth="1" strokeDasharray="4,4" className="text-muted-foreground" />
                    </g>

                    <g style={nodeStyle("queue")} onMouseEnter={() => setHoveredNode("queue")} onMouseLeave={() => setHoveredNode(null)}>
                        <rect x="500" y="50" width="120" height="40" rx="6" fill="rgba(255, 143, 0, 0.1)" stroke="#ff8f00" strokeWidth="1.5" />
                        <text x="560" y="74" textAnchor="middle" fontWeight="600" fontSize="13" className="fill-foreground">Event Queue</text>
                        <line x1="560" y1="90" x2="560" y2="640" stroke="url(#flow-grad)" strokeWidth="1" strokeDasharray="4,4" className="text-muted-foreground" />
                    </g>

                    <g style={nodeStyle("provider")} onMouseEnter={() => setHoveredNode("provider")} onMouseLeave={() => setHoveredNode(null)}>
                        <rect x="650" y="50" width="120" height="40" rx="6" fill="rgba(0, 137, 123, 0.1)" stroke="#00897b" strokeWidth="1.5" />
                        <text x="710" y="74" textAnchor="middle" fontWeight="600" fontSize="13" className="fill-foreground">Payment Provider</text>
                        <line x1="710" y1="90" x2="710" y2="640" stroke="url(#flow-grad)" strokeWidth="1" strokeDasharray="4,4" className="text-muted-foreground" />
                    </g>

                    <g style={nodeStyle("notification")} onMouseEnter={() => setHoveredNode("notification")} onMouseLeave={() => setHoveredNode(null)}>
                        {/* Move notification service slightly separated at the left layer */}
                        <rect x="650" y="560" width="120" height="40" rx="6" fill="rgba(25, 118, 210, 0.1)" stroke="#1976d2" strokeWidth="1.5" />
                        <text x="710" y="584" textAnchor="middle" fontWeight="600" fontSize="13" className="fill-foreground">Notification Svc</text>
                    </g>

                    {/* Step 1: Create Order */}
                    <g style={{ opacity: lineOpacity("merchant", "order"), transition: "opacity 0.3s" }}>
                        <rect x="190" y="110" width="140" height="34" rx="4" fill="var(--card)" stroke="var(--border)" strokeWidth="1" className="bg-card/80 backdrop-blur" />
                        <text x="260" y="131" textAnchor="middle" fontSize="11" fontWeight="500" className="fill-foreground">1. Create Order (NEW)</text>
                        <line x1="110" y1="127" x2="190" y2="127" stroke="currentColor" strokeWidth="1.5" className="text-foreground" />
                        <polygon points="186,123 192,127 186,131" fill="currentColor" className="text-foreground" />
                        {/* Return Order ID */}
                        <line x1="190" y1="145" x2="110" y2="145" stroke="currentColor" strokeWidth="1" strokeDasharray="3,3" className="text-muted-foreground" />
                        <polygon points="115,141 109,145 115,149" fill="currentColor" className="text-muted-foreground" />
                        <text x="150" y="141" textAnchor="middle" fontSize="10" className="fill-muted-foreground">Return orderId</text>
                    </g>

                    {/* Step 2: Initiate Payment */}
                    <g style={{ opacity: lineOpacity("merchant", "payment"), transition: "opacity 0.3s" }}>
                        <rect x="340" y="170" width="140" height="34" rx="4" fill="var(--card)" stroke="var(--border)" strokeWidth="1" />
                        <text x="410" y="191" textAnchor="middle" fontSize="11" fontWeight="500" className="fill-foreground">2. Initiate Payment</text>
                        <line x1="110" y1="187" x2="340" y2="187" stroke="currentColor" strokeWidth="1.5" className="text-foreground" />
                        <polygon points="336,183 342,187 336,191" fill="currentColor" className="text-foreground" />
                    </g>

                    {/* Step 3: Publish Status update */}
                    <g style={{ opacity: lineOpacity("payment", "queue"), transition: "opacity 0.3s" }}>
                        <rect x="490" y="220" width="140" height="44" rx="4" fill="var(--card)" stroke="var(--border)" strokeWidth="1" />
                        <text x="560" y="240" textAnchor="middle" fontSize="11" fontWeight="500" className="fill-foreground">3. Publish Status</text>
                        <text x="560" y="254" textAnchor="middle" fontSize="10" className="fill-muted-foreground">Update (PROCESSING)</text>
                        <line x1="410" y1="242" x2="490" y2="242" stroke="currentColor" strokeWidth="1.5" className="text-foreground" />
                        <polygon points="486,238 492,242 486,246" fill="currentColor" className="text-foreground" />
                    </g>

                    {/* Order subscribes to status */}
                    <g style={{ opacity: lineOpacity("queue", "order"), transition: "opacity 0.3s" }}>
                        <rect x="190" y="270" width="140" height="34" rx="4" fill="var(--card)" stroke="var(--border)" strokeWidth="1" />
                        <text x="260" y="291" textAnchor="middle" fontSize="11" fontWeight="500" className="fill-foreground">Update Order Status</text>
                        <line x1="560" y1="287" x2="330" y2="287" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4,4" className="text-foreground" />
                        <polygon points="335,283 329,287 335,291" fill="currentColor" className="text-foreground" />
                    </g>

                    {/* Step 4: Process Payment */}
                    <g style={{ opacity: lineOpacity("payment", "provider"), transition: "opacity 0.3s" }}>
                        <rect x="640" y="320" width="140" height="34" rx="4" fill="var(--card)" stroke="var(--border)" strokeWidth="1" />
                        <text x="710" y="341" textAnchor="middle" fontSize="11" fontWeight="500" className="fill-foreground">4. Process Payment</text>
                        <line x1="410" y1="337" x2="640" y2="337" stroke="currentColor" strokeWidth="1.5" className="text-foreground" />
                        <polygon points="636,333 642,337 636,341" fill="currentColor" className="text-foreground" />
                    </g>

                    {/* Step 5: Callback */}
                    <g style={{ opacity: lineOpacity("provider", "payment"), transition: "opacity 0.3s" }}>
                        <rect x="340" y="380" width="140" height="34" rx="4" fill="var(--card)" stroke="var(--border)" strokeWidth="1" />
                        <text x="410" y="401" textAnchor="middle" fontSize="11" fontWeight="500" className="fill-foreground">5. Payment Callback</text>
                        <line x1="710" y1="397" x2="480" y2="397" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4,4" className="text-foreground" />
                        <polygon points="485,393 479,397 485,401" fill="currentColor" className="text-foreground" />
                    </g>

                    {/* Step 6: Update Payment */}
                    <g style={{ opacity: lineOpacity("payment", "payment"), transition: "opacity 0.3s" }}>
                        <rect x="340" y="430" width="140" height="44" rx="4" fill="var(--card)" stroke="var(--border)" strokeWidth="1" />
                        <text x="410" y="450" textAnchor="middle" fontSize="11" fontWeight="500" className="fill-foreground">6. Update Payment</text>
                        <text x="410" y="464" textAnchor="middle" fontSize="10" className="fill-muted-foreground">Transaction Status</text>
                    </g>

                    {/* Step 7: Final Update */}
                    <g style={{ opacity: lineOpacity("payment", "queue"), transition: "opacity 0.3s" }}>
                        <rect x="490" y="490" width="140" height="44" rx="4" fill="var(--card)" stroke="var(--border)" strokeWidth="1" />
                        <text x="560" y="510" textAnchor="middle" fontSize="11" fontWeight="500" className="fill-foreground">7. Publish Final</text>
                        <text x="560" y="524" textAnchor="middle" fontSize="10" className="fill-muted-foreground">Status Update</text>
                        <line x1="410" y1="512" x2="490" y2="512" stroke="currentColor" strokeWidth="1.5" className="text-foreground" />
                        <polygon points="486,508 492,512 486,516" fill="currentColor" className="text-foreground" />
                    </g>

                    {/* Final Order Update */}
                    <g style={{ opacity: lineOpacity("queue", "order"), transition: "opacity 0.3s" }}>
                        <rect x="190" y="550" width="140" height="44" rx="4" fill="var(--card)" stroke="var(--border)" strokeWidth="1" />
                        <text x="260" y="570" textAnchor="middle" fontSize="11" fontWeight="500" className="fill-foreground">Update Order Status</text>
                        <text x="260" y="584" textAnchor="middle" fontSize="10" className="fill-muted-foreground">(SUCCESS/FAILED)</text>
                        <line x1="560" y1="572" x2="330" y2="572" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4,4" className="text-foreground" />
                        <polygon points="335,568 329,572 335,576" fill="currentColor" className="text-foreground" />
                    </g>

                    {/* Final Notification Update */}
                    <g style={{ opacity: lineOpacity("queue", "notification"), transition: "opacity 0.3s" }}>
                        <line x1="560" y1="580" x2="650" y2="580" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4,4" className="text-foreground" />
                        <polygon points="646,576 652,580 646,584" fill="currentColor" className="text-foreground" />
                        <text x="605" y="570" textAnchor="middle" fontSize="10" className="fill-muted-foreground">Async trigger</text>
                    </g>

                    {/* Legend */}
                    <g className="opacity-70">
                        <rect x="50" y="630" width="12" height="12" fill="var(--card)" stroke="var(--border)" strokeWidth="1" />
                        <text x="68" y="640" fontSize="10" className="fill-muted-foreground">Process Step</text>

                        <line x1="150" y1="636" x2="165" y2="636" stroke="currentColor" strokeWidth="1.5" className="text-foreground" />
                        <polygon points="161,632 167,636 161,640" fill="currentColor" className="text-foreground" />
                        <text x="175" y="640" fontSize="10" className="fill-muted-foreground">Sync Call</text>

                        <line x1="250" y1="636" x2="265" y2="636" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3,3" className="text-foreground" />
                        <polygon points="261,632 267,636 261,640" fill="currentColor" className="text-foreground" />
                        <text x="275" y="640" fontSize="10" className="fill-muted-foreground">Async Message</text>
                    </g>
                </svg>
            </div>
        </section>
    );
}
