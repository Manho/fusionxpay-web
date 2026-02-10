"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeModeSwitcher from "@/components/theme/ThemeModeSwitcher";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "Documentation", href: "/docs", external: false },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass-dark py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-lg bg-[#2d1ef5] flex items-center justify-center group-hover:glow-blue transition-all duration-300">
            <span className="text-white font-bold text-base">F</span>
          </div>
          <span className="text-foreground font-bold text-xl tracking-tight">
            FusionX<span className="text-[#ffe9a9]">Pay</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noopener noreferrer" : undefined}
              className="text-muted-foreground text-sm hover:text-foreground transition-colors relative group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#2d1ef5] group-hover:w-full transition-all duration-300" />
            </a>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeModeSwitcher />
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground hover:bg-accent/70"
            asChild
          >
            <Link href="/login">Sign In</Link>
          </Button>
          <Button
            size="sm"
            className="bg-[#2d1ef5] hover:bg-[#4a3fff] text-white"
            asChild
          >
            <Link href="/login">Get Started</Link>
          </Button>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden glass-dark mt-2 mx-4 rounded-xl p-6 space-y-4 animate-scale-in">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noopener noreferrer" : undefined}
              className="block text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <div className="pt-4 border-t border-border/60 space-y-2">
            <div className="flex justify-end">
              <ThemeModeSwitcher />
            </div>
            <Button variant="outline" className="w-full border-border/70 text-foreground" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
            <Button className="w-full bg-[#2d1ef5] hover:bg-[#4a3fff]" asChild>
              <Link href="/login">Get Started</Link>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
