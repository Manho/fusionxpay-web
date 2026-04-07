import { beforeEach, describe, expect, it } from "vitest";
import {
  computeAnalyticsRoute,
  getVercelAnalyticsScriptSrc,
  initVercelAnalyticsQueue,
  injectVercelAnalyticsScript,
  trackVercelAnalyticsPageview,
} from "@/lib/vercel-analytics";

describe("vercel analytics helpers", () => {
  beforeEach(() => {
    document.head.innerHTML = "";
    window.va = undefined;
    window.vaq = [];
  });

  it("computes dynamic routes from single path params", () => {
    expect(computeAnalyticsRoute("/orders/ORD001", { id: "ORD001" })).toBe("/orders/[id]");
  });

  it("computes dynamic routes from catch-all path params", () => {
    expect(computeAnalyticsRoute("/docs/guides/install", { slug: ["guides", "install"] })).toBe(
      "/docs/[...slug]",
    );
  });

  it("returns the default script source when no base path is configured", () => {
    expect(getVercelAnalyticsScriptSrc()).toBe("/_vercel/insights/script.js");
  });

  it("injects the script once and preserves the base path endpoint", () => {
    const script = injectVercelAnalyticsScript({ basePath: "observability" });
    const duplicate = injectVercelAnalyticsScript({ basePath: "observability" });

    expect(script).toBeInstanceOf(HTMLScriptElement);
    expect(script?.src).toBe("http://localhost:3000/observability/insights/script.js");
    expect(script?.dataset.disableAutoTrack).toBe("1");
    expect(script?.dataset.endpoint).toBe("/observability/insights");
    expect(duplicate).toBe(script);
    expect(document.head.querySelectorAll('script[data-vercel-analytics-script="true"]')).toHaveLength(1);
  });

  it("queues pageview events before the external script is ready", () => {
    initVercelAnalyticsQueue();
    trackVercelAnalyticsPageview("/orders/[id]", "/orders/ORD001");

    expect(window.vaq).toEqual([
      ["pageview", { route: "/orders/[id]", path: "/orders/ORD001" }],
    ]);
  });
});
