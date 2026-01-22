"use client"

import { useEffect, useState, useCallback } from "react"
import { Order, PageResponse } from "@/types"
import api from "@/lib/api"
import { OrderTable } from "@/components/orders/OrderTable"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ChevronLeft, ChevronRight, Search } from "lucide-react"

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(0)
  const [size] = useState(10)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>("ALL")

  // Fix hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      // Build query params
      const params = new URLSearchParams()
      params.append("page", page.toString())
      params.append("size", size.toString())

      if (statusFilter !== "ALL") {
        params.append("status", statusFilter)
      }

      const response = await api.get<PageResponse<Order>>(`/orders?${params.toString()}`)

      setOrders(response.data.orders || [])
      setTotalPages(response.data.totalPages || 0)
      setTotalElements(response.data.totalElements || 0)
    } catch (err) {
      console.error("Failed to fetch orders:", err)
      setError("Failed to load orders. Please try again.")
      setOrders([])
    } finally {
      setLoading(false)
    }
  }, [page, size, statusFilter])

  // Reload when page or filters change
  useEffect(() => {
    if (mounted) {
      fetchOrders()
    }
  }, [mounted, fetchOrders])

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage)
    }
  }

  const handleStatusChange = (val: string) => {
    setStatusFilter(val)
    setPage(0) // Reset to first page
  }

  // Calculate display values safely
  const ordersCount = orders?.length || 0
  const showingFrom = ordersCount > 0 ? page * size + 1 : 0
  const showingTo = Math.min((page + 1) * size, totalElements)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground mt-1">
            Manage and view your transaction history.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Could add Export button here */}
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex items-center gap-4">
        <div className="relative w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search order ID..."
            className="pl-9"
            disabled // Search by ID backend not yet implemented in MVP
          />
        </div>
        {mounted && (
          <Select value={statusFilter} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Statuses</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="FAILED">Failed</SelectItem>
              <SelectItem value="REFUNDED">Refunded</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
          {error}
        </div>
      )}

      {/* Data Table */}
      <OrderTable orders={orders} isLoading={loading} />

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {showingFrom} to {showingTo} of {totalElements} orders
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 0 || loading}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(page + 1)}
            disabled={page >= totalPages - 1 || loading}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
