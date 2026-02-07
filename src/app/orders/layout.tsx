import DashboardLayout from "@/components/layout/DashboardLayout"

// This is a grouping layout, so we don't need "use client" unless we use hooks
// But our DashboardLayout is a client component.
// In Next.js App Router, layout.tsx wraps pages.
// We want /orders to use this layout.

export default function Layout({ children }: { children: React.ReactNode }) {
  // We could add server-side auth check here (middleware is better though)

  return (
    <DashboardLayout>
      {children}
    </DashboardLayout>
  )
}
