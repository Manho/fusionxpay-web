"use client"

import { UserNav } from "./UserNav"
import { Sidebar } from "./Sidebar"
import { ShieldCheck } from "lucide-react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar - Desktop */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="sticky top-0 z-20 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-16 items-center px-6">
            <div className="lg:hidden flex items-center gap-2 mr-4">
                <ShieldCheck className="h-6 w-6 text-primary" />
            </div>

            <div className="ml-auto flex items-center space-x-4">
              <UserNav />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 space-y-4 p-8 pt-6">
          {children}
        </main>
      </div>
    </div>
  )
}
