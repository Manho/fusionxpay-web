"use client";

import { useEffect, useMemo } from "react";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import {
  computeAnalyticsRoute,
  injectVercelAnalyticsScript,
  trackVercelAnalyticsPageview,
} from "@/lib/vercel-analytics";

const basePath = process.env.NEXT_PUBLIC_VERCEL_OBSERVABILITY_BASEPATH;

export default function VercelWebAnalytics() {
  const params = useParams<Record<string, string | string[]>>();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const route = useMemo(() => {
    const routeParams =
      params && Object.keys(params).length > 0 ? params : Object.fromEntries(searchParams.entries());

    return computeAnalyticsRoute(pathname, routeParams);
  }, [params, pathname, searchParams]);

  useEffect(() => {
    injectVercelAnalyticsScript({ basePath });
  }, []);

  useEffect(() => {
    trackVercelAnalyticsPageview(route, pathname);
  }, [pathname, route]);

  return null;
}
