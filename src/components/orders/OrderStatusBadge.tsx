import { Badge } from "@/components/ui/badge"

interface OrderStatusBadgeProps {
  status: string
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  let variant: "default" | "secondary" | "destructive" | "outline" = "default"
  let className = ""

  switch (status) {
    case "COMPLETED":
      variant = "default"
      className = "bg-emerald-500 hover:bg-emerald-600 border-transparent"
      break
    case "PENDING":
      variant = "secondary"
      className = "bg-amber-500/15 text-amber-500 hover:bg-amber-500/25 border-amber-500/20"
      break
    case "FAILED":
      variant = "destructive"
      break
    case "REFUNDED":
      variant = "outline"
      className = "text-muted-foreground"
      break
    default:
      variant = "outline"
  }

  return (
    <Badge variant={variant} className={className}>
      {status}
    </Badge>
  )
}
