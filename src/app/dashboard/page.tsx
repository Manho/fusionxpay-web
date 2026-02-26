"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { auth } from "@/lib/auth"
import { listMerchants, updateMerchantStatus } from "@/lib/admin"
import { MerchantListItem } from "@/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [merchants, setMerchants] = useState<MerchantListItem[]>([])
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [keyword, setKeyword] = useState("")
  const [status, setStatus] = useState<"ALL" | "ACTIVE" | "DISABLED">("ALL")

  const currentUser = auth.getUser()

  const fetchMerchants = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await listMerchants({
        page,
        size: 10,
        keyword: keyword.trim() || undefined,
        status: status === "ALL" ? undefined : status,
      })
      setMerchants(response.merchants ?? [])
      setTotalPages(response.totalPages ?? 0)
    } catch {
      setError("Failed to load merchant data")
      setMerchants([])
    } finally {
      setLoading(false)
    }
  }, [keyword, page, status])

  useEffect(() => {
    fetchMerchants()
  }, [fetchMerchants])

  const activeCount = useMemo(() => merchants.filter(m => m.status === "ACTIVE").length, [merchants])
  const disabledCount = useMemo(() => merchants.filter(m => m.status === "DISABLED").length, [merchants])

  async function handleToggleStatus(item: MerchantListItem) {
    try {
      await updateMerchantStatus(item.id, item.status === "ACTIVE" ? "DISABLED" : "ACTIVE")
      await fetchMerchants()
    } catch {
      setError("Failed to update merchant status")
    }
  }

  if (currentUser?.role !== "ADMIN") {
    return (
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Only administrators can access this page.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Merchant Dashboard</h1>
        <p className="text-muted-foreground">Manage merchant lifecycle and account status.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader><CardTitle>Total (Current Page)</CardTitle></CardHeader>
          <CardContent className="text-3xl font-bold">{merchants.length}</CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Active</CardTitle></CardHeader>
          <CardContent className="text-3xl font-bold text-green-600">{activeCount}</CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Disabled</CardTitle></CardHeader>
          <CardContent className="text-3xl font-bold text-red-600">{disabledCount}</CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Input
          placeholder="Search by merchant name / email / code"
          className="max-w-sm"
          value={keyword}
          onChange={(e) => {
            setKeyword(e.target.value)
            setPage(0)
          }}
        />
        <Select value={status} onValueChange={(value: "ALL" | "ACTIVE" | "DISABLED") => {
          setStatus(value)
          setPage(0)
        }}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Status</SelectItem>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="DISABLED">Disabled</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={fetchMerchants} disabled={loading}>Refresh</Button>
      </div>

      {error && <div className="text-sm text-destructive">{error}</div>}

      <div className="rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Merchant</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <Loader2 className="h-4 w-4 animate-spin inline-block mr-2" />
                  Loading merchants...
                </TableCell>
              </TableRow>
            ) : merchants.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No merchants found.
                </TableCell>
              </TableRow>
            ) : merchants.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.merchantName}</TableCell>
                <TableCell>{item.email}</TableCell>
                <TableCell>{item.merchantCode}</TableCell>
                <TableCell>
                  <Badge variant={item.status === "ACTIVE" ? "default" : "destructive"}>
                    {item.status}
                  </Badge>
                </TableCell>
                <TableCell>{item.role}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Link href={`/dashboard/merchants/${item.id}`}>
                    <Button variant="outline" size="sm">Details</Button>
                  </Link>
                  <Button size="sm" variant="secondary" onClick={() => handleToggleStatus(item)}>
                    {item.status === "ACTIVE" ? "Disable" : "Enable"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0 || loading}>Previous</Button>
        <Button variant="outline" size="sm" onClick={() => setPage((p) => p + 1)} disabled={loading || page >= totalPages - 1}>Next</Button>
      </div>
    </div>
  )
}
