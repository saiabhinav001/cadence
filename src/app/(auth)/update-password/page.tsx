
"use client"

import { useTransition } from "react"
import { updatePassword } from "../actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Loader2, Lock } from "lucide-react"

export default function UpdatePasswordPage() {
    const [isPending, startTransition] = useTransition()

    async function handleSubmit(formData: FormData) {
        startTransition(async () => {
            const result = await updatePassword(formData)
            if (result?.error) {
                toast.error(result.error)
            }
            // Success handles redirect in the action
        })
    }

    return (
        <Card className="w-full max-w-md border-border/50 bg-card/50 backdrop-blur-xl saas-shadow animate-in fade-in-0 duration-500">
            <CardHeader>
                <CardTitle>Set New Password</CardTitle>
                <CardDescription>Enter your new password below</CardDescription>
            </CardHeader>
            <CardContent>
                <form action={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="password">New Password</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                minLength={6}
                                placeholder="••••••••"
                                required
                                disabled={isPending}
                                className="pl-9 bg-background/50"
                            />
                        </div>
                    </div>
                    <Button type="submit" className="w-full" disabled={isPending}>
                        {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Update Password"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
