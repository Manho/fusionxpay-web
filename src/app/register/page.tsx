"use client"

import { RegisterForm } from "@/components/auth/RegisterForm"
import { ShieldCheck } from "lucide-react"

export default function RegisterPage() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col bg-muted/30 p-10 text-white dark:border-r border-border/10">
        <div className="flex items-center gap-2 text-lg font-medium text-foreground">
          <ShieldCheck className="h-6 w-6 text-primary" />
          FusionXPay Admin
        </div>
        <div className="my-auto space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Launch Merchant Integration <br />
            In Minutes
          </h1>
          <p className="text-lg text-muted-foreground">
            Register a merchant account and start receiving payments with your API key instantly.
          </p>
        </div>
      </div>
      <div className="flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-4">
          <div className="lg:hidden flex items-center justify-center gap-2 mb-8 text-foreground">
            <ShieldCheck className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">FusionXPay</span>
          </div>
          <RegisterForm />
        </div>
      </div>
    </div>
  )
}
