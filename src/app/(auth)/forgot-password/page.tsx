
"use client"

import { useTransition, useState } from "react"
import { resetPassword } from "../actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Loader2, Mail, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function ForgotPasswordPage() {
    const [isPending, startTransition] = useTransition()
    const [success, setSuccess] = useState(false)

    async function handleSubmit(formData: FormData) {
        startTransition(async () => {
            const result = await resetPassword(formData)
            if (result?.error) {
                toast.error(result.error)
            } else if (result?.success) {
                setSuccess(true)
                toast.success(result.message)
            }
        })
    }

    if (success) {
        return (
            <Card className="w-full max-w-md border-border/50 bg-card/50 backdrop-blur-xl saas-shadow">
                <CardContent className="pt-6 flex flex-col items-center text-center space-y-4">
                    <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-primary animate-in zoom-in spin-in-180 duration-500">
                        <Mail className="h-6 w-6" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-xl font-semibold">Check your email</h3>
                        <p className="text-muted-foreground">
                            We've sent you a password reset link. Please check your inbox.
                        </p>
                    </div>
                    <Button variant="outline" className="w-full" onClick={() => setSuccess(false)}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Login
                    </Button>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="w-full max-w-md border-border/50 bg-card/50 backdrop-blur-xl saas-shadow animate-in fade-in-0 duration-500">
            <CardHeader>
                <CardTitle>Reset Password</CardTitle>
                <CardDescription>Enter your email to receive a reset link</CardDescription>
            </CardHeader>
            <CardContent>
                <form action={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="you@example.com"
                            required
                            disabled={isPending}
                            className="bg-background/50"
                        />
                    </div>
                    <Button type="submit" className="w-full" disabled={isPending}>
                        {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Send Reset Link"}
                    </Button>
                    <div className="text-center">
                        <Link href="/login" className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Login
                        </Link>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}
