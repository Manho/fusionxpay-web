"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CTA() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative max-w-4xl mx-auto">
          {/* Animated background blobs */}
          <div className="absolute -top-20 -left-20 w-60 h-60 bg-[#2d1ef5]/30 rounded-full blur-[80px] animate-blob" />
          <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-[#ffe9a9]/20 rounded-full blur-[80px] animate-blob [animation-delay:2s]" />

          <div className="relative glass rounded-3xl p-8 sm:p-12 lg:p-16 text-center border border-[#2d1ef5]/20 glow-blue">
            {/* Shimmer effect */}
            <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
              <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/5 to-transparent" />
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 relative">
              Ready to{" "}
              <span className="text-gradient">Transform Your Payments</span>?
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8 leading-relaxed relative">
              Join hundreds of businesses already using FusionXPay to simplify
              their payment infrastructure. Get started in minutes.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative">
              <Button
                size="lg"
                className="bg-[#2d1ef5] hover:bg-[#4a3fff] text-white text-base px-8 group"
                asChild
              >
                <Link href="/login">
                  Start Building
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-border/70 text-foreground hover:bg-accent/70 text-base px-8"
                asChild
              >
                <a href="#pricing">View Pricing</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
