"use client"

import { useEffect, useState } from "react"
import { useUserStore } from "@/lib/store/user"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SignOutConfirm } from "@/components/auth/sign-out-confirm"
import { ChevronsUpDown, LogOut, Settings, Sparkles } from "lucide-react"
import Link from "next/link"

export function UserProfile() {
    const { user, profile, loading, fetchUser } = useUserStore()
    const [open, setOpen] = useState(false)

    useEffect(() => {
        // Fetch if profile is missing (e.g. direct reload on this page)
        if (!profile) {
            fetchUser()
        }
    }, [profile, fetchUser])

    if (loading && !user) {
        return (
            <div className="flex items-center gap-3 p-2 rounded-xl bg-white/5 animate-pulse">
                <div className="h-10 w-10 rounded-full bg-white/10" />
                <div className="flex-1 space-y-2">
                    <div className="h-4 w-24 bg-white/10 rounded" />
                    <div className="h-3 w-32 bg-white/10 rounded" />
                </div>
            </div>
        )
    }

    if (!user) return null

    const email = user.email || "User"
    // Use profile data from store, fallback to email logic
    const fullName = profile?.full_name || ""
    const displayName = fullName || email.split('@')[0]

    // Smart Initials: "Sai Abhinav" -> "SA", "John" -> "JO"
    const getInitials = () => {
        if (fullName) {
            const parts = fullName.trim().split(' ')
            if (parts.length >= 2) {
                // First char of first name + First char of last name
                return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
            }
            // First 2 chars of single name
            return parts[0].substring(0, 2).toUpperCase()
        }
        // Fallback to email
        return email.substring(0, 2).toUpperCase()
    }

    const initials = getInitials()

    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="w-full justify-start h-auto p-2 gap-3 hover:bg-white/5 rounded-xl transition-all group"
                >
                    <Avatar className="h-10 w-10 border border-white/10 group-hover:border-purple-500/50 transition-colors">
                        <AvatarImage src={user.user_metadata?.avatar_url} />
                        <AvatarFallback className="bg-purple-500/20 text-purple-400 font-medium">{initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start gap-0.5 text-left flex-1 min-w-0">
                        <span className="text-sm font-semibold truncate w-full text-foreground/90">{displayName}</span>
                        <span className="text-xs text-muted-foreground truncate w-full">{email}</span>
                    </div>
                    <ChevronsUpDown className="h-4 w-4 text-muted-foreground/50 group-hover:text-muted-foreground transition-colors" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 mb-2 saas-card bg-black/90 backdrop-blur-xl border-white/10" align="end" sideOffset={8}>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">My Account</p>
                        <p className="text-xs leading-none text-muted-foreground truncate">
                            {user.email}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuGroup>
                    <Link href="/dashboard/settings">
                        <DropdownMenuItem className="cursor-pointer focus:bg-white/5 focus:text-primary">
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Settings</span>
                        </DropdownMenuItem>
                    </Link>
                    <Link href="/dashboard">
                        <DropdownMenuItem className="cursor-pointer focus:bg-white/5 focus:text-primary">
                            <Sparkles className="mr-2 h-4 w-4" />
                            <span>My Wins</span>
                        </DropdownMenuItem>
                    </Link>
                </DropdownMenuGroup>
                <DropdownMenuSeparator className="bg-white/10" />

                <SignOutConfirm>
                    <DropdownMenuItem
                        onSelect={(e) => {
                            e.preventDefault()
                        }}
                        className="cursor-pointer text-red-400 focus:text-red-400 focus:bg-red-500/10"
                    >
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Sign Out</span>
                    </DropdownMenuItem>
                </SignOutConfirm>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
