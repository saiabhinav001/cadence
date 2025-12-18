"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutGrid, List, LogOut, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { UserProfile } from "@/components/layout/user-profile"

const items = [
    {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutGrid,
    },
    {
        title: "Timeline",
        href: "/dashboard/timeline",
        icon: List,
    },
    {
        title: "Settings",
        href: "/dashboard/settings",
        icon: User,
    },
]

export function Sidebar() {
    const pathname = usePathname()
    const router = useRouter()

    const handleSignOut = async () => {
        const supabase = createClient()
        await supabase.auth.signOut()
        router.push('/login')
    }

    return (
        <div className="hidden border-r border-white/5 bg-background/50 backdrop-blur-xl md:flex md:w-64 md:flex-col">
            <div className="flex select-none flex-col gap-2 p-4">
                <div className="flex h-12 items-center px-2 mb-4">
                    <span className="text-xl font-bold tracking-tighter text-primary">Cadence</span>
                </div>
                <div className="flex flex-col gap-1">
                    {items.map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="relative group block"
                            >
                                <motion.div
                                    className={cn(
                                        "flex h-9 items-center gap-2 rounded-md px-3 text-sm font-medium transition-colors relative z-10",
                                        isActive ? "text-accent-foreground" : "text-muted-foreground group-hover:text-foreground"
                                    )}
                                    whileHover={{ x: 4 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                >
                                    <item.icon className="h-4 w-4" />
                                    {item.title}
                                </motion.div>
                                {isActive && (
                                    <motion.div
                                        layoutId="sidebar-active"
                                        className="absolute inset-0 bg-accent rounded-md z-0"
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                            </Link>
                        )
                    })}
                </div>
            </div>
            <div className="mt-auto p-4 border-t border-white/5">
                <UserProfile />
            </div>
        </div>
    )
}
