"use client";

import { useSearchParams } from "next/navigation";
import AiConsentPanel from "@/components/auth/AiConsentPanel";

export default function AiDevicePage() {
  const searchParams = useSearchParams();
  return <AiConsentPanel mode="device" initialUserCode={searchParams.get("user_code") ?? undefined} />;
}
