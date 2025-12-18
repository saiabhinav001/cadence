"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutGrid, List, User, Menu, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { useState } from "react"
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

export function MobileNav() {
    const pathname = usePathname()
    const [open, setOpen] = useState(false)

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle Menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0 border-r-0 bg-black/95 backdrop-blur-xl">
                <SheetHeader className="px-1 text-left">
                    <SheetTitle className="text-xl font-bold tracking-tighter text-primary">Cadence</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-1 mt-8 mr-6">
                    {items.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setOpen(false)}
                            className={cn(
                                "group flex h-12 items-center gap-2 rounded-md px-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                                pathname === item.href ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                            )}
                        >
                            <item.icon className="h-5 w-5" />
                            {item.title}
                        </Link>
                    ))}
                    <div className="my-2 border-t border-border/50" />
                    <div className="pt-2">
                        <UserProfile />
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}
