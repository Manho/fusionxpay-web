"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ShieldCheck } from "lucide-react";
import api from "@/lib/api";
import { auth } from "@/lib/auth";
import type { AiConsentApproveResponse, AiConsentViewResponse } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface Props {
  mode: "session" | "device";
  initialSessionId?: string;
  initialUserCode?: string;
}

export default function AiConsentPanel({ mode, initialSessionId, initialUserCode }: Props) {
  const router = useRouter();
  const [userCode, setUserCode] = useState(initialUserCode ?? "");
  const [data, setData] = useState<AiConsentViewResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const hasLookupKey = useMemo(
    () => !!initialSessionId || !!initialUserCode || (!!userCode && mode === "device"),
    [initialSessionId, initialUserCode, userCode, mode]
  );

  useEffect(() => {
    if (!auth.isAuthenticated()) {
      const target = mode === "session"
        ? `/ai/consent?session=${encodeURIComponent(initialSessionId ?? "")}`
        : `/ai/device${initialUserCode ? `?user_code=${encodeURIComponent(initialUserCode)}` : ""}`;
      router.replace(`/login?redirect=${encodeURIComponent(target)}`);
      return;
    }

    if (!hasLookupKey) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    api.get<AiConsentViewResponse>("/auth/ai/consent", {
      params: {
        sessionId: mode === "session" ? initialSessionId : undefined,
        userCode: mode === "device" ? (initialUserCode || userCode || undefined) : undefined,
      },
    })
      .then((response) => {
        if (!cancelled) {
          setData(response.data);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          console.error(err);
          setError("Unable to resolve this authorization request.");
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [router, hasLookupKey, mode, initialSessionId, initialUserCode, userCode]);

  const onLookup = () => {
    if (!userCode.trim()) {
      setError("Enter the user code shown in your terminal.");
      return;
    }
    setData(null);
    setLoading(true);
    setError(null);
    router.replace(`/ai/device?user_code=${encodeURIComponent(userCode.trim().toUpperCase())}`);
  };

  const onApprove = async () => {
    if (!data) {
      return;
    }
    setSubmitting(true);
    setError(null);
    setMessage(null);

    try {
      const response = await api.post<AiConsentApproveResponse>("/auth/ai/consent/approve", {
        sessionId: data.sessionId,
        userCode: data.userCode,
      });
      if (response.data.redirectUrl) {
        window.location.href = response.data.redirectUrl;
        return;
      }
      setMessage(response.data.message);
    } catch (err: unknown) {
      console.error(err);
      setError("Unable to approve this session.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="w-full max-w-xl border-border/50 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <CardHeader className="space-y-3">
          <div className="flex items-center gap-2 text-primary">
            <ShieldCheck className="h-5 w-5" />
            <span className="text-sm font-medium uppercase tracking-[0.2em]">
              Browser Authorization
            </span>
          </div>
          <CardTitle>
            {mode === "session" ? "Approve CLI or MCP access" : "Approve device code access"}
          </CardTitle>
          <CardDescription>
            Authorize a first-party FusionXPay AI client without exposing your password to local tooling.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          {mode === "device" && !initialUserCode && !data && !loading && (
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">Enter your device code</label>
              <div className="flex gap-3">
                <Input
                  value={userCode}
                  onChange={(event) => setUserCode(event.target.value.toUpperCase())}
                  placeholder="ABCD1234"
                  className="font-mono"
                />
                <Button onClick={onLookup}>Lookup</Button>
              </div>
            </div>
          )}

          {loading && (
            <div className="flex items-center gap-3 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Resolving authorization request...
            </div>
          )}

          {error && <div className="text-sm font-medium text-destructive">{error}</div>}

          {data && !loading && (
            <div className="space-y-4">
              <div className="rounded-xl border border-border/60 bg-muted/30 p-4 space-y-2 text-sm">
                <div><span className="font-medium text-foreground">Client:</span> FusionXPay {data.clientType}</div>
                <div><span className="font-medium text-foreground">Audience:</span> {data.audience}</div>
                <div><span className="font-medium text-foreground">Merchant:</span> {data.merchantName} ({data.merchantEmail})</div>
                <div><span className="font-medium text-foreground">Expires in:</span> {data.expiresIn}s</div>
                {data.userCode && (
                  <div><span className="font-medium text-foreground">User code:</span> <span className="font-mono">{data.userCode}</span></div>
                )}
                {data.callbackDisplay && (
                  <div><span className="font-medium text-foreground">Callback:</span> <span className="font-mono text-xs break-all">{data.callbackDisplay}</span></div>
                )}
              </div>

              <div className="flex gap-3">
                <Button onClick={onApprove} disabled={submitting}>
                  {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Approve
                </Button>
                <Button variant="outline" onClick={() => router.push("/")}>
                  Cancel
                </Button>
              </div>

              {message && (
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-sm text-emerald-700 dark:text-emerald-300">
                  {message}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
