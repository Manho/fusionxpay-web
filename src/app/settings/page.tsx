"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getCurrentApiKeyInfo, revealCurrentApiKey, rotateCurrentApiKey } from "@/lib/admin"
import { ApiKeyInfoResponse } from "@/types"

export default function SettingsPage() {
  const [apiKeyInfo, setApiKeyInfo] = useState<ApiKeyInfoResponse | null>(null)
  const [revealedKey, setRevealedKey] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function loadData() {
    setLoading(true)
    setError(null)
    try {
      const info = await getCurrentApiKeyInfo()
      setApiKeyInfo(info)
    } catch {
      setError("No active API key found. Generate one by rotating key.")
      setApiKeyInfo(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  async function handleReveal() {
    try {
      const result = await revealCurrentApiKey()
      setRevealedKey(result.apiKey)
    } catch {
      setError("Failed to reveal API key")
    }
  }

  async function handleRotate() {
    try {
      const result = await rotateCurrentApiKey()
      setRevealedKey(result.apiKey)
      await loadData()
    } catch {
      setError("Failed to rotate API key")
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your API credentials.</p>
      </div>

      {error && <div className="text-sm text-destructive">{error}</div>}

      <Card>
        <CardHeader>
          <CardTitle>API Key Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <p className="text-muted-foreground">Loading key metadata...</p>
          ) : apiKeyInfo ? (
            <div className="space-y-2 text-sm">
              <p><span className="text-muted-foreground">Prefix:</span> {apiKeyInfo.keyPrefix}</p>
              <p><span className="text-muted-foreground">Last Four:</span> ****{apiKeyInfo.lastFour}</p>
              <p>
                <span className="text-muted-foreground">Status:</span>{" "}
                <Badge variant={apiKeyInfo.active ? "default" : "outline"}>{apiKeyInfo.active ? "ACTIVE" : "INACTIVE"}</Badge>
              </p>
              <p><span className="text-muted-foreground">Created:</span> {new Date(apiKeyInfo.createdAt).toLocaleString()}</p>
            </div>
          ) : (
            <p className="text-muted-foreground">No active API key.</p>
          )}

          <div className="flex gap-2">
            <Button variant="outline" onClick={handleReveal}>Reveal Key</Button>
            <Button onClick={handleRotate}>Rotate Key</Button>
          </div>

          {revealedKey && (
            <div>
              <p className="text-sm text-muted-foreground mb-2">Current API Key</p>
              <div className="rounded-md bg-muted p-3 font-mono text-sm break-all">{revealedKey}</div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
