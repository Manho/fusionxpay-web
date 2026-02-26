"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod/v4"
import { Loader2 } from "lucide-react"
import axios from "axios"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { auth } from "@/lib/auth"
import { registerMerchant } from "@/lib/admin"

const formSchema = z.object({
  merchantName: z.string().min(2, { message: "Merchant name is required." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
})

export function RegisterForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [initialApiKey, setInitialApiKey] = useState<string | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      merchantName: "",
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setError(null)

    try {
      const response = await registerMerchant(values)
      if (response.token) {
        auth.setToken(response.token)
      }
      if (response.merchant) {
        auth.setUser(response.merchant)
      }
      setInitialApiKey(response.apiKey || null)
    } catch (err: unknown) {
      if (axios.isAxiosError<{ message?: string }>(err)) {
        setError(err.response?.data?.message || "Registration failed")
      } else {
        setError("Registration failed")
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (initialApiKey) {
    return (
      <Card className="w-full max-w-md border-border/50 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <CardHeader>
          <CardTitle className="text-2xl font-bold tracking-tight text-primary">Registration Success</CardTitle>
          <CardDescription>Your merchant account is active and ready to use.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-2">Initial API Key</p>
            <div className="rounded-md bg-muted p-3 font-mono text-sm break-all">{initialApiKey}</div>
          </div>
          <p className="text-xs text-muted-foreground">
            Save this key securely. You can also reveal/rotate it later in Settings.
          </p>
          <Button className="w-full" onClick={() => router.push("/orders")}>Go to Console</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md border-border/50 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold tracking-tight text-primary">Register Merchant</CardTitle>
        <CardDescription>Create an account and receive an API key instantly.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="merchantName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Merchant Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Acme Store" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="owner@example.com" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {error && <div className="text-sm font-medium text-destructive">{error}</div>}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Account
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center text-sm text-muted-foreground">
        <span>
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </span>
      </CardFooter>
    </Card>
  )
}
