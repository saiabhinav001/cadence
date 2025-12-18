import { MobileNav } from "@/components/layout/mobile-nav"
import { Sidebar } from "@/components/layout/sidebar"
import { CommandBar } from "@/components/features/command-bar"
import { Fab } from "@/components/ui/fab"
import { AchievementUnlock } from "@/components/features/achievement-unlock"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen bg-background text-foreground max-w-[100vw] overflow-x-hidden">
            <Sidebar />
            <div className="flex flex-1 flex-col min-w-0 overflow-x-hidden">
                <header className="flex h-14 items-center gap-2 border-b border-white/5 bg-background/50 px-4 backdrop-blur-xl md:hidden">
                    <MobileNav />
                    <span className="font-bold">Cadence</span>
                </header>
                <main className="flex-1 overflow-y-auto overflow-x-hidden">
                    <div className="h-full px-4 py-6 md:px-8">
                        {children}
                    </div>
                </main>
            </div>
            <CommandBar />
            <Fab />
            <AchievementUnlock />
        </div>
    )
}
