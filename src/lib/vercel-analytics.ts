"use client";

const DEFAULT_SCRIPT_SRC = "/_vercel/insights/script.js";
const SDK_NAME = "@fusionxpay/vercel-analytics/next";
const SDK_VERSION = "1.0.0";

type AnalyticsRouteParams = Record<string, string | string[]>;

declare global {
  interface Window {
    va?: (...params: [string, Record<string, string | null> | undefined]) => void;
    vaq?: Array<[string, Record<string, string | null> | undefined]>;
  }
}

function isBrowser() {
  return typeof window !== "undefined";
}

function makeAbsolute(url: string) {
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("/")) {
    return url;
  }

  return `/${url}`;
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function turnValueToRegExp(value: string) {
  return new RegExp(`/${escapeRegExp(value)}(?=[/?#]|$)`);
}

export function computeAnalyticsRoute(
  pathname: string | null,
  pathParams?: AnalyticsRouteParams | null,
) {
  if (!pathname || !pathParams) {
    return pathname;
  }

  let result = pathname;

  try {
    const entries = Object.entries(pathParams);

    for (const [key, value] of entries) {
      if (Array.isArray(value)) {
        continue;
      }

      const matcher = turnValueToRegExp(value);

      if (matcher.test(result)) {
        result = result.replace(matcher, `/[${key}]`);
      }
    }

    for (const [key, value] of entries) {
      if (!Array.isArray(value)) {
        continue;
      }

      const matcher = turnValueToRegExp(value.join("/"));

      if (matcher.test(result)) {
        result = result.replace(matcher, `/[...${key}]`);
      }
    }

    return result;
  } catch {
    return pathname;
  }
}

export function getVercelAnalyticsScriptSrc(basePath?: string) {
  if (!basePath) {
    return DEFAULT_SCRIPT_SRC;
  }

  return makeAbsolute(`${basePath}/insights/script.js`);
}

export function initVercelAnalyticsQueue() {
  if (!isBrowser() || window.va) {
    return;
  }

  window.va = (...params) => {
    if (!window.vaq) {
      window.vaq = [];
    }

    window.vaq.push(params);
  };
}

export function injectVercelAnalyticsScript(options: { basePath?: string } = {}) {
  if (!isBrowser()) {
    return null;
  }

  const src = getVercelAnalyticsScriptSrc(options.basePath);
  const existingScript = document.head.querySelector<HTMLScriptElement>(
    `script[data-vercel-analytics-script="true"][src="${src}"]`,
  );

  initVercelAnalyticsQueue();

  if (existingScript) {
    return existingScript;
  }

  const script = document.createElement("script");
  script.src = src;
  script.defer = true;
  script.dataset.vercelAnalyticsScript = "true";
  script.dataset.disableAutoTrack = "1";
  script.dataset.sdkn = SDK_NAME;
  script.dataset.sdkv = SDK_VERSION;

  if (options.basePath) {
    script.dataset.endpoint = makeAbsolute(`${options.basePath}/insights`);
  }

  document.head.appendChild(script);

  return script;
}

export function trackVercelAnalyticsPageview(route: string | null, path: string | null) {
  if (!isBrowser() || !path) {
    return;
  }

  window.va?.("pageview", { route, path });
}
