import Link from "next/link";
import { Github } from "lucide-react";

const footerLinks = {
  product: {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "Architecture", href: "#architecture" },
      { label: "How It Works", href: "#how-it-works" },
      { label: "Tech Stack", href: "#tech-stack" },
    ],
  },
  developers: {
    title: "Developers",
    links: [
      { label: "Documentation", href: "/docs" },
      { label: "API Reference", href: "/docs/developer/03-api-and-auth" },
      { label: "Quick Start", href: "/docs/user-guide/quick-start" },
      { label: "Security Model", href: "/docs/developer/07-security-model" },
    ],
  },
  engineering: {
    title: "Source Code",
    links: [
      {
        label: "Backend (Java)",
        href: "https://github.com/Manho/FusionXPay",
        external: true,
      },
      {
        label: "Frontend (Next.js)",
        href: "https://github.com/Manho/fusionxpay-web",
        external: true,
      },
      {
        label: "Pull Requests",
        href: "https://github.com/Manho/FusionXPay/pulls?q=is%3Apr+is%3Amerged",
        external: true,
      },
      {
        label: "CI/CD Workflows",
        href: "https://github.com/Manho/FusionXPay/actions",
        external: true,
      },
    ],
  },
};

export default function Footer() {
  return (
    <footer className="border-t border-border/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center mb-6 group">
              <span className="text-foreground font-bold text-xl tracking-tight">
                FusionX<span className="text-[var(--cream)]">Pay</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground/80 leading-relaxed max-w-xs mb-6">
              A production-ready payment gateway platform built with Java 21
              microservices, demonstrating enterprise architecture patterns.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://github.com/Manho/FusionXPay"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="w-9 h-9 rounded-full glass flex items-center justify-center text-muted-foreground/80 hover:text-[#2563eb] hover:border-[#2563eb]/30 transition-all duration-300"
              >
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([key, section]) => (
            <div key={key}>
              <h4 className="font-semibold text-sm mb-4 text-foreground">
                {section.title}
              </h4>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target={"external" in link && link.external ? "_blank" : undefined}
                      rel={"external" in link && link.external ? "noopener noreferrer" : undefined}
                      className="text-sm text-muted-foreground/80 hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-muted-foreground/70">
              &copy; {new Date().getFullYear()} FusionXPay. MIT License.
            </p>
            <div className="flex items-center gap-6">
              <a
                href="https://github.com/Manho/FusionXPay/blob/main/LICENSE"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-muted-foreground/70 hover:text-foreground transition-colors"
              >
                License
              </a>
              <a
                href="https://github.com/Manho/FusionXPay"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-muted-foreground/70 hover:text-foreground transition-colors"
              >
                Source Code
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
