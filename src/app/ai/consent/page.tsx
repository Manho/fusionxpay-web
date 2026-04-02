import AiConsentPanel from "@/components/auth/AiConsentPanel";

export const dynamic = "force-dynamic";

interface AiConsentPageProps {
  searchParams: Promise<{
    session?: string;
  }>;
}

export default async function AiConsentPage({ searchParams }: AiConsentPageProps) {
  const resolvedSearchParams = await searchParams;
  return <AiConsentPanel mode="session" initialSessionId={resolvedSearchParams.session} />;
}
