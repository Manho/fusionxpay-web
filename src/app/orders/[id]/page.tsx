"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { OrderDetail } from "@/types"
import api from "@/lib/api"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge"
import { ArrowLeft, Printer, AlertCircle } from "lucide-react"

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const orderId = params.id as string

  const [order, setOrder] = useState<OrderDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!orderId) return

    const fetchOrder = async () => {
      setLoading(true)
      try {
        const response = await api.get<OrderDetail>(`/orders/${orderId}`)
        setOrder(response.data)
      } catch (err: unknown) {
        console.error("Failed to fetch order details", err)
        const message = err instanceof Error ? err.message : "Order not found or access denied"
        setError(message)
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [orderId])

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="flex flex-col h-96 items-center justify-center space-y-4">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <h2 className="text-xl font-semibold">Order Not Found</h2>
        <p className="text-muted-foreground">{error}</p>
        <Button onClick={() => router.push('/orders')}>Back to Orders</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
                <h1 className="text-2xl font-bold tracking-tight flex items-center gap-3">
                    Order {order.orderId}
                    <OrderStatusBadge status={order.status} />
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Created on {new Date(order.createdAt).toLocaleString()}
                </p>
            </div>
        </div>
        <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
                <Printer className="mr-2 h-4 w-4" />
                Print Invoice
            </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Payment Details */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Amount</span>
              <span className="font-semibold text-lg">
                {order.currency} {(order.amount / 100).toFixed(2)}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-muted-foreground">Payment Method</span>
              <span className="font-medium">{order.paymentMethod || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Order Number</span>
              <span className="font-mono text-sm">{order.orderNumber || '-'}</span>
            </div>
            {order.errorMessage && (
                <div className="mt-4 p-3 bg-destructive/10 text-destructive rounded-md text-sm border border-destructive/20">
                    <span className="font-semibold block mb-1">Error Message:</span>
                    {order.errorMessage}
                </div>
            )}
          </CardContent>
        </Card>

        {/* Customer Info (Placeholder as our Order model currently lacks extensive customer data) */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Customer Email</span>
              <span>{order.customerEmail || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Customer ID</span>
              <span className="font-mono text-sm">{order.customerId || "N/A"}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Raw Gateway Response */}
      <Card>
        <CardHeader>
          <CardTitle>Gateway Response</CardTitle>
          <CardDescription>
            Raw JSON response from the payment provider (for debugging).
          </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="bg-muted p-4 rounded-md overflow-x-auto max-h-96">
                <pre className="text-xs font-mono text-muted-foreground">
                    {order.rawResponse
                        ? (() => {
                            try {
                              return JSON.stringify(JSON.parse(order.rawResponse), null, 2)
                            } catch {
                              return order.rawResponse
                            }
                          })()
                        : "// No raw response data available"}
                </pre>
            </div>
        </CardContent>
      </Card>
    </div>
  )
}
