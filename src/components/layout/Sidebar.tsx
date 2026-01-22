"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, ShoppingCart, Settings, ShieldCheck } from "lucide-react"

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string
    title: string
    icon: React.ReactNode
  }[]
}

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
  const pathname = usePathname()

  return (
    <nav
      className={cn(
        "flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1",
        className
      )}
      {...props}
    >
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "justify-start text-sm font-medium transition-colors hover:text-primary flex items-center gap-3 rounded-md px-3 py-2",
            pathname.startsWith(item.href)
              ? "bg-secondary text-primary shadow-sm"
              : "text-muted-foreground hover:bg-muted/50"
          )}
        >
          {item.icon}
          {item.title}
        </Link>
      ))}
    </nav>
  )
}

export function Sidebar() {
  const sidebarItems = [
    {
      title: "Dashboard",
      href: "/dashboard", // Currently placeholder, might redirect to orders
      icon: <LayoutDashboard className="h-4 w-4" />,
    },
    {
      title: "Orders",
      href: "/orders",
      icon: <ShoppingCart className="h-4 w-4" />,
    },
    {
      title: "Settings",
      href: "/settings",
      icon: <Settings className="h-4 w-4" />,
    },
  ]

  return (
    <div className="pb-12 w-64 border-r border-border/40 bg-background hidden lg:block h-screen fixed left-0 top-0 z-30">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="flex items-center gap-2 mb-6 px-4">
            <ShieldCheck className="h-6 w-6 text-primary" />
            <h2 className="text-lg font-semibold tracking-tight">FusionXPay</h2>
          </div>
          <div className="px-1">
            <SidebarNav items={sidebarItems} />
          </div>
        </div>
      </div>
    </div>
  )
}
