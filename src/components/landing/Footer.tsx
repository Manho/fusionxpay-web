import Link from "next/link";
import { Github, Twitter, Linkedin } from "lucide-react";

const footerLinks = {
  product: {
    title: "Product",
    links: [
      { label: "Payment API", href: "#features" },
      { label: "Analytics", href: "#features" },
      { label: "Smart Routing", href: "#features" },
      { label: "Security", href: "#features" },
      { label: "Webhooks", href: "#features" },
    ],
  },
  developers: {
    title: "Developers",
    links: [
      { label: "Documentation", href: "#" },
      { label: "API Reference", href: "#" },
      { label: "SDKs", href: "#" },
      { label: "Changelog", href: "#" },
      { label: "Status", href: "#" },
    ],
  },
  company: {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
  legal: {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "Compliance", href: "#" },
    ],
  },
};

const socialLinks = [
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Github, href: "#", label: "GitHub" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
];

export default function Footer() {
  return (
    <footer className="border-t border-border/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-6 group">
              <div className="w-9 h-9 rounded-lg bg-[#2d1ef5] flex items-center justify-center group-hover:glow-blue transition-all duration-300">
                <span className="text-white font-bold text-base">F</span>
              </div>
              <span className="text-foreground font-bold text-xl tracking-tight">
                FusionX<span className="text-[#ffe9a9]">Pay</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground/80 leading-relaxed max-w-xs mb-6">
              Unified payment gateway for modern businesses. Aggregate 50+
              providers through a single API.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="w-9 h-9 rounded-full glass flex items-center justify-center text-muted-foreground/80 hover:text-[#2d1ef5] hover:border-[#2d1ef5]/30 transition-all duration-300"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
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
              &copy; {new Date().getFullYear()} FusionXPay. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a
                href="#"
                className="text-xs text-muted-foreground/70 hover:text-foreground transition-colors"
              >
                Privacy
              </a>
              <a
                href="#"
                className="text-xs text-muted-foreground/70 hover:text-foreground transition-colors"
              >
                Terms
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
