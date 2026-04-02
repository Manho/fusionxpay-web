import AiConsentPanel from "@/components/auth/AiConsentPanel";

export const dynamic = "force-dynamic";

interface AiDevicePageProps {
  searchParams: Promise<{
    user_code?: string;
  }>;
}

export default async function AiDevicePage({ searchParams }: AiDevicePageProps) {
  const resolvedSearchParams = await searchParams;
  return <AiConsentPanel mode="device" initialUserCode={resolvedSearchParams.user_code} />;
}
