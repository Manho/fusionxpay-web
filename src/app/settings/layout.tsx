import DashboardLayout from "@/components/layout/DashboardLayout"

export default function SettingsRouteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <DashboardLayout>{children}</DashboardLayout>
}
