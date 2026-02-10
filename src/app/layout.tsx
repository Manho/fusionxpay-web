import type { Metadata } from "next";
import { IBM_Plex_Sans } from "next/font/google";
import "./globals.css";
import ThemeController from "@/components/theme/ThemeController";

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "FusionXPay - Unified Payment Gateway",
    template: "%s | FusionXPay",
  },
  description:
    "Aggregate PayPal, Stripe, and 50+ payment channels through a single API. Built for developers, designed for scale.",
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
      </body>
    </html>
  );
}
