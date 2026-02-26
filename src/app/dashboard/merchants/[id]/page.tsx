"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ApiKeyInfoResponse, MerchantInfo } from "@/types"
import {
  getMerchantDetail,
  listMerchantApiKeys,
  revealMerchantApiKey,
  updateMerchantStatus,
} from "@/lib/admin"

export default function MerchantDetailPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const merchantId = params.id

  const [merchant, setMerchant] = useState<MerchantInfo | null>(null)
  const [keys, setKeys] = useState<ApiKeyInfoResponse[]>([])
  const [revealedKey, setRevealedKey] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function fetchData() {
    setLoading(true)
    setError(null)
    try {
      const [merchantData, keyData] = await Promise.all([
        getMerchantDetail(merchantId),
        listMerchantApiKeys(merchantId),
      ])
      setMerchant(merchantData)
      setKeys(keyData)
    } catch {
      setError("Failed to load merchant detail")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [merchantId])

  async function handleReveal() {
    try {
      const result = await revealMerchantApiKey(merchantId)
      setRevealedKey(result.apiKey)
    } catch {
      setError("Failed to reveal API key")
    }
  }

  async function toggleStatus() {
    if (!merchant) return
    try {
      await updateMerchantStatus(merchant.id, merchant.status === "ACTIVE" ? "DISABLED" : "ACTIVE")
      await fetchData()
    } catch {
      setError("Failed to update status")
    }
  }

  if (loading) {
    return <div className="text-muted-foreground">Loading merchant details...</div>
  }

  if (!merchant) {
    return <div className="text-destructive">Merchant not found</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{merchant.merchantName}</h1>
          <p className="text-muted-foreground">Merchant detail and API key operations.</p>
        </div>
        <div className="space-x-2">
          <Button variant="outline" onClick={() => router.push("/dashboard")}>Back</Button>
          <Button variant="secondary" onClick={toggleStatus}>
            {merchant.status === "ACTIVE" ? "Disable" : "Enable"} Merchant
          </Button>
        </div>
      </div>

      {error && <div className="text-sm text-destructive">{error}</div>}

      <Card>
        <CardHeader><CardTitle>Merchant Profile</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p><span className="text-muted-foreground">Email:</span> {merchant.email}</p>
          <p><span className="text-muted-foreground">Code:</span> {merchant.merchantCode}</p>
          <p><span className="text-muted-foreground">Role:</span> {merchant.role}</p>
          <p>
            <span className="text-muted-foreground">Status:</span>{" "}
            <Badge variant={merchant.status === "ACTIVE" ? "default" : "destructive"}>{merchant.status}</Badge>
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>API Keys</CardTitle>
          <Button onClick={handleReveal} variant="outline">Reveal Active Key</Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {revealedKey && (
            <div className="rounded-md bg-muted p-3 font-mono text-sm break-all">{revealedKey}</div>
          )}

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Prefix</TableHead>
                <TableHead>Last Four</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {keys.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">No API keys found</TableCell>
                </TableRow>
              ) : keys.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.keyPrefix}</TableCell>
                  <TableCell>****{item.lastFour}</TableCell>
                  <TableCell>
                    <Badge variant={item.active ? "default" : "outline"}>{item.active ? "ACTIVE" : "INACTIVE"}</Badge>
                  </TableCell>
                  <TableCell>{new Date(item.createdAt).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
