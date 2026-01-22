import { LoginForm } from "@/components/auth/LoginForm"
import { ShieldCheck } from "lucide-react"

export default function LoginPage() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col bg-muted/30 p-10 text-white dark:border-r border-border/10">
        <div className="flex items-center gap-2 text-lg font-medium text-foreground">
          <ShieldCheck className="h-6 w-6 text-primary" />
          FusionXPay Admin
        </div>
        <div className="my-auto space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Enterprise Payment <br />
            Management Gateway
          </h1>
          <p className="text-lg text-muted-foreground">
            Monitor transactions, manage orders, and view comprehensive reports in real-time.
          </p>
        </div>
        <div className="text-sm text-muted-foreground mt-auto">
          &copy; 2025 FusionXPay Inc. All rights reserved.
        </div>
      </div>
      <div className="flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-4">
          <div className="lg:hidden flex items-center justify-center gap-2 mb-8 text-foreground">
            <ShieldCheck className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">FusionXPay</span>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
