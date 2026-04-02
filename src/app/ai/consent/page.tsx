"use client";

import { useSearchParams } from "next/navigation";
import AiConsentPanel from "@/components/auth/AiConsentPanel";

export default function AiConsentPage() {
  const searchParams = useSearchParams();
  return <AiConsentPanel mode="session" initialSessionId={searchParams.get("session") ?? undefined} />;
}
