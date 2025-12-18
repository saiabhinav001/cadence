"use client"

import { useTransition, useState } from "react"
import { signup } from "@/app/(auth)/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Loader2, MailCheck } from "lucide-react"

export function SignupForm() {
    const [isPending, startTransition] = useTransition()
    const [success, setSuccess] = useState(false)

    async function handleSubmit(formData: FormData) {
        startTransition(async () => {
            const result = await signup(formData)
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
            <Card className="border-border/50 bg-card/50 backdrop-blur-xl">
                <CardContent className="pt-6 flex flex-col items-center text-center space-y-4">
                    <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                        <MailCheck className="h-6 w-6" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-xl font-semibold">Check your email</h3>
                        <p className="text-muted-foreground">
                            We&apos;ve sent you a confirmation link. Please check your inbox to verify your account.
                        </p>
                    </div>
                    <Button variant="outline" className="w-full" onClick={() => window.location.href = '/login'}>
                        Back to Login
                    </Button>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="border-border/50 bg-card/50 backdrop-blur-xl">
            <CardHeader>
                <CardTitle>Create an account</CardTitle>
                <CardDescription>Start tracking your wins today</CardDescription>
            </CardHeader>
            <CardContent>
                <form action={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input id="fullName" name="fullName" placeholder="John Doe" required disabled={isPending} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" placeholder="you@example.com" required disabled={isPending} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" name="password" type="password" minLength={6} required disabled={isPending} />
                    </div>
                    <Button type="submit" className="w-full" disabled={isPending}>
                        {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Sign Up"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
