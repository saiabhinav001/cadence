"use client"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

interface SignOutConfirmProps {
    children?: React.ReactNode
    className?: string
    variant?: "default" | "ghost" | "destructive" | "outline"
    fullWidth?: boolean
}

export function SignOutConfirm({ children, className, variant = "ghost", fullWidth = false }: SignOutConfirmProps) {
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleSignOut = async () => {
        try {
            setLoading(true)
            const supabase = createClient()
            await supabase.auth.signOut()
            toast.success("Signed out successfully")
            router.push('/login')
        } catch (error) {
            toast.error("Failed to sign out")
        } finally {
            setLoading(false)
            setOpen(false)
        }
    }

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                {children ? children : (
                    <Button
                        variant={variant}
                        className={`justify-start gap-2 ${fullWidth ? "w-full" : ""} ${className}`}
                    >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                    </Button>
                )}
            </AlertDialogTrigger>
            <AlertDialogContent className="saas-card border-white/10 bg-black/90 backdrop-blur-xl max-w-md">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-xl font-bold tracking-tight flex items-center gap-2">
                        <LogOut className="h-5 w-5 text-red-500" />
                        Sign out of Cadence?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-muted-foreground body-comfortable">
                        You will need to sign in again to access your wins and timeline.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="gap-2 sm:gap-0">
                    <AlertDialogCancel className="border-white/10 hover:bg-white/5 rounded-lg h-10">Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault()
                            handleSignOut()
                        }}
                        className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/30 rounded-lg h-10"
                    >
                        {loading ? "Signing out..." : "Sign Out"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
