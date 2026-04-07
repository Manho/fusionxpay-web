import type { Metadata } from "next";
import { Suspense } from "react";
import { IBM_Plex_Sans } from "next/font/google";
import "./globals.css";
import VercelWebAnalytics from "@/components/analytics/VercelWebAnalytics";
import ThemeController from "@/components/theme/ThemeController";

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "FusionXPay - Enterprise Payment Gateway Platform",
    template: "%s | FusionXPay",
  },
  description:
    "A production-ready microservices payment gateway built with Java 21, Spring Boot, Kafka, and Next.js. Supports Stripe and PayPal with full webhook lifecycle, CI/CD, and observability.",
  openGraph: {
    title: "FusionXPay - Enterprise Payment Gateway Platform",
    description:
      "Production-ready microservices payment gateway with Stripe, PayPal, CI/CD, and observability stack.",
    url: "https://fusionx.fun",
    siteName: "FusionXPay",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FusionXPay - Enterprise Payment Gateway",
    description:
      "Microservices payment gateway built with Java 21, Spring Boot, Kafka, Redis, and Next.js.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const themeInitScript = `
(() => {
  try {
    const storageKey = "fusionxpay-theme-mode";
    const fallbackMode = "system";
    const resolveTheme = (mode) => {
      if (mode === "light" || mode === "dark") return mode;
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    };

    const saved = localStorage.getItem(storageKey);
    const mode = saved === "light" || saved === "dark" || saved === "system" ? saved : fallbackMode;
    const resolved = resolveTheme(mode);
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(resolved);
    root.dataset.themeMode = mode;
    root.style.colorScheme = resolved;
  } catch (_) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body
        className={`${ibmPlexSans.variable} font-sans antialiased bg-background text-foreground`}
      >
        <ThemeController />
        {children}
        <Suspense fallback={null}>
          <VercelWebAnalytics />
        </Suspense>
      </body>
    </html>
  );
}
