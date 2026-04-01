import Navigation from "@/components/landing/Navigation";
import Hero from "@/components/landing/Hero";
import LogoMarquee from "@/components/landing/LogoMarquee";
import Features from "@/components/landing/Features";
import AIShowcase from "@/components/landing/AIShowcase";
import Architecture from "@/components/landing/Architecture";
import HowItWorks from "@/components/landing/HowItWorks";
import ProjectHighlights from "@/components/landing/ProjectHighlights";
import TechStack from "@/components/landing/TechStack";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navigation />
      <Hero />
      <LogoMarquee />
      <Features />
      <AIShowcase />
      <Architecture />
      <HowItWorks />
      <ProjectHighlights />
      <TechStack />
      <CTA />
      <Footer />
    </main>
  );
}
