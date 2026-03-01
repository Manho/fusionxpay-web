"use client"

import { useState } from "react"
import { UserNav } from "./UserNav"
import { Sidebar, SidebarNav } from "./Sidebar"
import { ShieldCheck, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { LayoutDashboard, ShoppingCart, Settings } from "lucide-react"
import { useSyncExternalStore } from "react"
import { auth } from "@/lib/auth"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [mobileOpen, setMobileOpen] = useState(false)

  // Mirror sidebar items for mobile sheet
  const subscribe = () => () => { }
  const mounted = useSyncExternalStore(subscribe, () => true, () => false)
  const userRole = mounted ? auth.getUser()?.role : null

  const sidebarItems = [
    ...(userRole === "ADMIN"
      ? [{ title: "Dashboard", href: "/dashboard", icon: <LayoutDashboard className="h-4 w-4" /> }]
      : []),
    { title: "Orders", href: "/orders", icon: <ShoppingCart className="h-4 w-4" /> },
    { title: "Settings", href: "/settings", icon: <Settings className="h-4 w-4" /> },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop sidebar */}
      <Sidebar />

      {/* Mobile navigation sheet */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <SheetHeader className="px-6 py-5 border-b border-border/40">
            <SheetTitle className="flex items-center gap-2 text-base">
              <ShieldCheck className="h-5 w-5 text-primary" />
              FusionXPay
            </SheetTitle>
          </SheetHeader>
          <div className="px-4 py-4" onClick={() => setMobileOpen(false)}>
            <SidebarNav items={sidebarItems} vertical />
          </div>
        </SheetContent>
      </Sheet>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Top header */}
        <header className="sticky top-0 z-20 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-16 items-center px-4 gap-3">
            {/* Mobile: hamburger + logo */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="lg:hidden flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <span className="font-semibold text-sm">FusionXPay</span>
            </div>

            <div className="ml-auto flex items-center space-x-4">
              <UserNav />
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          {children}
        </main>
      </div>
    </div>
  )
}
