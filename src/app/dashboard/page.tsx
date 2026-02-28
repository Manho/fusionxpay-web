"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { auth } from "@/lib/auth"
import {
  getMerchantStats,
  getOrderStatusSummary,
  getRecentOrders,
  listMerchants,
  updateMerchantStatus,
} from "@/lib/admin"
import { MerchantListItem, Order } from "@/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
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
import {
  Users,
  UserCheck,
  UserX,
  ShoppingCart,
  CheckCircle2,
  Clock,
  XCircle,
  RotateCcw,
  Loader2,
  RefreshCw,
} from "lucide-react"

// ─── Stat card ────────────────────────────────────────────────────────────────

interface StatCardProps {
  title: string
  value: number | null
  icon: React.ReactNode
  valueClassName?: string
  loading?: boolean
}

function StatCard({ title, value, icon, valueClassName = "", loading }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <span className="text-muted-foreground">{icon}</span>
      </CardHeader>
      <CardContent>
        {loading || value === null ? (
          <Skeleton className="h-9 w-20" />
        ) : (
          <p className={`text-3xl font-bold ${valueClassName}`}>{value}</p>
        )}
      </CardContent>
    </Card>
  )
}

// ─── Order status badge ────────────────────────────────────────────────────────

const ORDER_STATUS_META: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline"; icon: React.ReactNode }> = {
  COMPLETED: { label: "Completed", variant: "default", icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
  PENDING: { label: "Pending", variant: "secondary", icon: <Clock className="h-3.5 w-3.5" /> },
  FAILED: { label: "Failed", variant: "destructive", icon: <XCircle className="h-3.5 w-3.5" /> },
  REFUNDED: { label: "Refunded", variant: "outline", icon: <RotateCcw className="h-3.5 w-3.5" /> },
}

function OrderStatusBadge({ status }: { status: string }) {
  const meta = ORDER_STATUS_META[status] ?? { label: status, variant: "outline" as const, icon: null }
  return (
    <Badge variant={meta.variant} className="gap-1">
      {meta.icon}
      {meta.label}
    </Badge>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const currentUser = auth.getUser()

  // ── Stats ──────────────────────────────────────────────────────────────────
  const [statsLoading, setStatsLoading] = useState(true)
  const [merchantStats, setMerchantStats] = useState<{ total: number; active: number; disabled: number } | null>(null)
  const [orderSummary, setOrderSummary] = useState<Record<string, number> | null>(null)

  const fetchStats = useCallback(async () => {
    setStatsLoading(true)
    try {
      const [ms, os] = await Promise.all([getMerchantStats(), getOrderStatusSummary()])
      setMerchantStats(ms)
      setOrderSummary(os)
    } catch {
      // stats are non-critical – silently fail
    } finally {
      setStatsLoading(false)
    }
  }, [])

  // ── Recent orders ──────────────────────────────────────────────────────────
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [recentLoading, setRecentLoading] = useState(true)

  const fetchRecentOrders = useCallback(async () => {
    setRecentLoading(true)
    try {
      setRecentOrders(await getRecentOrders(10))
    } catch {
      setRecentOrders([])
    } finally {
      setRecentLoading(false)
    }
  }, [])

  // ── Merchant table ─────────────────────────────────────────────────────────
  const [tableLoading, setTableLoading] = useState(true)
  const [tableError, setTableError] = useState<string | null>(null)
  const [merchants, setMerchants] = useState<MerchantListItem[]>([])
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [keyword, setKeyword] = useState("")
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "DISABLED">("ALL")

  const fetchMerchants = useCallback(async () => {
    setTableLoading(true)
    setTableError(null)
    try {
      const res = await listMerchants({
        page,
        size: 10,
        keyword: keyword.trim() || undefined,
        status: statusFilter === "ALL" ? undefined : statusFilter,
      })
      setMerchants(res.merchants ?? [])
      setTotalPages(res.totalPages ?? 0)
    } catch {
      setTableError("Failed to load merchants")
      setMerchants([])
    } finally {
      setTableLoading(false)
    }
  }, [keyword, page, statusFilter])

  // ── Initial load ───────────────────────────────────────────────────────────
  useEffect(() => {
    fetchStats()
    fetchRecentOrders()
  }, [fetchStats, fetchRecentOrders])

  useEffect(() => {
    fetchMerchants()
  }, [fetchMerchants])

  // ── Toggle merchant status ─────────────────────────────────────────────────
  async function handleToggleStatus(item: MerchantListItem) {
    try {
      await updateMerchantStatus(item.id, item.status === "ACTIVE" ? "DISABLED" : "ACTIVE")
      fetchMerchants()
      fetchStats() // refresh global counts
    } catch {
      setTableError("Failed to update merchant status")
    }
  }

  // ── Non-admin guard ────────────────────────────────────────────────────────
  if (currentUser?.role !== "ADMIN") {
    return (
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Only administrators can access this page.</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Merchant Dashboard</h1>
          <p className="text-muted-foreground mt-1">Overview of merchants and recent activity.</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => { fetchStats(); fetchRecentOrders(); fetchMerchants() }}
          disabled={statsLoading || recentLoading || tableLoading}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${statsLoading || recentLoading || tableLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* ── Merchant stat cards ─────────────────────────────────────────────── */}
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">Merchants</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard
            title="Total Merchants"
            value={merchantStats?.total ?? null}
            icon={<Users className="h-4 w-4" />}
            loading={statsLoading}
          />
          <StatCard
            title="Active"
            value={merchantStats?.active ?? null}
            icon={<UserCheck className="h-4 w-4 text-green-500" />}
            valueClassName="text-green-600"
            loading={statsLoading}
          />
          <StatCard
            title="Disabled"
            value={merchantStats?.disabled ?? null}
            icon={<UserX className="h-4 w-4 text-red-500" />}
            valueClassName={merchantStats?.disabled ? "text-red-600" : ""}
            loading={statsLoading}
          />
        </div>
      </div>

      {/* ── Order summary + Recent orders ───────────────────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Order status summary */}
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">Orders by Status</h2>
          <Card className="h-full">
            <CardContent className="pt-6 space-y-4">
              {statsLoading || !orderSummary ? (
                <>
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <Skeleton className="h-5 w-24" />
                      <Skeleton className="h-5 w-8" />
                    </div>
                  ))}
                </>
              ) : (
                Object.entries(ORDER_STATUS_META).map(([key, meta]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground">{meta.icon}</span>
                      <span>{meta.label}</span>
                    </div>
                    <span className="font-semibold tabular-nums">{orderSummary[key] ?? 0}</span>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent orders */}
        <div className="lg:col-span-2">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            <ShoppingCart className="h-3.5 w-3.5 inline mr-1.5 -mt-0.5" />
            Recent Orders
          </h2>
          <Card>
            <CardContent className="pt-0 px-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-6">Order #</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="pr-6">Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentLoading ? (
                    [...Array(5)].map((_, i) => (
                      <TableRow key={i}>
                        <TableCell className="pl-6"><Skeleton className="h-4 w-28" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-20 rounded-full" /></TableCell>
                        <TableCell className="pr-6"><Skeleton className="h-4 w-24" /></TableCell>
                      </TableRow>
                    ))
                  ) : recentOrders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                        No orders yet.
                      </TableCell>
                    </TableRow>
                  ) : recentOrders.map((order) => (
                    <TableRow key={order.orderId}>
                      <TableCell className="pl-6 font-mono text-xs">
                        <Link href={`/orders/${order.orderId}`} className="hover:underline text-primary">
                          {order.orderNumber}
                        </Link>
                      </TableCell>
                      <TableCell className="font-medium">
                        {(order.amount / 100).toFixed(2)} {order.currency}
                      </TableCell>
                      <TableCell>
                        <OrderStatusBadge status={order.status} />
                      </TableCell>
                      <TableCell className="pr-6 text-xs text-muted-foreground">
                        {new Date(order.createdAt).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ── Merchant table ──────────────────────────────────────────────────── */}
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">All Merchants</h2>

        <div className="flex flex-wrap items-center gap-3 mb-4">
          <Input
            placeholder="Search by name / email / code"
            className="max-w-sm"
            value={keyword}
            onChange={(e) => { setKeyword(e.target.value); setPage(0) }}
          />
          <Select value={statusFilter} onValueChange={(v: "ALL" | "ACTIVE" | "DISABLED") => { setStatusFilter(v); setPage(0) }}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Status</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="DISABLED">Disabled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {tableError && (
          <div className="text-sm text-destructive bg-destructive/10 border border-destructive/30 p-3 rounded-md mb-3">
            {tableError}
          </div>
        )}

        <div className="rounded-xl border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Merchant</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableLoading ? (
                [...Array(5)].map((_, i) => (
                  <TableRow key={i}>
                    {[...Array(6)].map((__, j) => (
                      <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                    ))}
                  </TableRow>
                ))
              ) : merchants.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No merchants found.
                  </TableCell>
                </TableRow>
              ) : merchants.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.merchantName}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{item.email}</TableCell>
                  <TableCell className="font-mono text-xs">{item.merchantCode}</TableCell>
                  <TableCell>
                    <Badge variant={item.status === "ACTIVE" ? "default" : "destructive"}>
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{item.role}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Link href={`/dashboard/merchants/${item.id}`}>
                      <Button variant="outline" size="sm">Details</Button>
                    </Link>
                    <Button
                      size="sm"
                      variant={item.status === "ACTIVE" ? "destructive" : "default"}
                      onClick={() => handleToggleStatus(item)}
                    >
                      {item.status === "ACTIVE" ? "Disable" : "Enable"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-end gap-2 mt-3">
          <span className="text-sm text-muted-foreground mr-auto">
            Page {page + 1} of {totalPages || 1}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0 || tableLoading}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => p + 1)}
            disabled={tableLoading || page >= totalPages - 1}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
