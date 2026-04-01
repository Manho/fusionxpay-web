"use client";

import { motion } from "framer-motion";
import {
  Shield,
  Zap,
  Globe,
  Bot,
  ShieldAlert,
  ScrollText,
} from "lucide-react";

const features = [
  {
    icon: Globe,
    title: "Multi-Channel Aggregation",
    description:
      "Integrate PayPal, Stripe, and 50+ payment providers through a single unified API endpoint.",
    color: "#2563eb",
  },
  {
    icon: Zap,
    title: "Sub-300ms Latency",
    description:
      "Lightning-fast payment processing powered by our distributed microservices architecture.",
    color: "#2563eb",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description:
      "PCI DSS Level 1 compliant with end-to-end encryption, tokenization, and fraud detection.",
    color: "#2563eb",
  },
  {
    icon: Bot,
    title: "AI Agent Operations",
    description:
      "Claude Desktop can discover 8 MCP tools to search payments, inspect orders, and prepare merchant-scoped actions.",
    color: "#8b5cf6", // Violet to mix it up
  },
  {
    icon: ShieldAlert,
    title: "Human-in-the-Loop Safety",
    description:
      "Write flows return confirmation tokens first. No payment or refund executes until a human explicitly confirms it.",
    color: "#8b5cf6",
  },
  {
    icon: ScrollText,
    title: "Full Audit Pipeline",
    description:
      "Every CLI and MCP action is captured by Spring AOP, published to Kafka, and persisted by Admin Service.",
    color: "#2563eb",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.7 } 
  },
};

export default function Features() {
  return (
    <section id="features" className="py-24 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#2563eb]/5 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div 
          className="text-center max-w-2xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <span className="text-[#2563eb] text-sm font-medium uppercase tracking-wider">
            Features
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-3 mb-4">
            Payments Meet <span className="text-gradient">AI</span>
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            A complete payment infrastructure enhanced with AI-native operations.
            Built with Spring Boot microservices and Spring AI, designed for
            reliability at any scale.
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            // Distinguish the glow color depending on the feature's color
            const isViolet = feature.color === "#8b5cf6";
            return (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                className="group glass rounded-2xl p-6 hover-lift transition-all duration-300 hover-glow cursor-default"
                // Adding custom style inline variable for generic glow if wanted, but standard CSS works well
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110"
                  style={{ backgroundColor: `${feature.color}20` }}
                >
                  <Icon className="w-6 h-6" style={{ color: feature.color }} />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
