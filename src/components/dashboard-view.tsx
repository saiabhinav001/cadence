"use client"

import { useEffect, useMemo, useState } from "react"
import { useStore } from "@/lib/store"
import { Heatmap } from "@/components/features/heatmap"
import { RecentEntries } from "@/components/features/recent-entries"
import { AIStudio } from "@/components/features/ai-studio"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, TrendingUp, Zap, Flame } from "lucide-react"
import { isSameMonth } from "date-fns"
import { calculateStreak, getBadges } from "@/lib/gamification"
import { cn } from "@/lib/utils"
import { SmartExport } from "@/components/features/smart-export"
import { MagicButton } from "@/components/ui/shine-button"
import { motion, Variants } from "framer-motion"
import confetti from "canvas-confetti"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"

export function DashboardView() {
    const { entries, fetchEntries, setAIStudioOpen } = useStore()
    const [selectedBadge, setSelectedBadge] = useState<any>(null)

    useEffect(() => {
        fetchEntries()
    }, [fetchEntries])

    const stats = useMemo(() => {
        const now = new Date()
        const thisMonth = entries.filter(e => isSameMonth(new Date(e.date), now)).length
        const flowState = entries.filter(e => e.mood === 'Flow').length
        return {
            total: entries.length,
            month: thisMonth,
            flow: flowState
        }
    }, [entries])

    const streak = useMemo(() => calculateStreak(entries), [entries])
    const badges = useMemo(() => getBadges(entries), [entries])

    const cardVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
        hover: {
            y: -5,
            scale: 1.02,
            transition: { type: "spring", stiffness: 400, damping: 10 } as const
        }
    }

    return (
        <TooltipProvider>
            <div className="space-y-8 p-6 lg:p-10 max-w-[1600px] mx-auto">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                        <h1 className="h1-hero tracking-tight text-foreground/90">Dashboard</h1>
                        {streak > 0 && (
                            <div className="flex items-center gap-2 px-3 py-1 bg-orange-500/10 border border-orange-500/20 rounded-full text-orange-500 sm:hidden">
                                <Flame className={cn("h-4 w-4", streak > 3 && "animate-pulse fill-orange-500")} />
                                <span className="font-bold font-mono text-sm">{streak} Day Streak</span>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                        {streak > 0 && (
                            <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-orange-500/10 border border-orange-500/20 rounded-full text-orange-500">
                                <Flame className={cn("h-4 w-4", streak > 3 && "animate-pulse fill-orange-500")} />
                                <span className="font-bold font-mono">{streak} Day Streak</span>
                            </div>
                        )}
                        <div className="flex items-center gap-3 ml-auto sm:ml-0">
                            <SmartExport />
                            <MagicButton onClick={() => setAIStudioOpen(true)}>
                                AI Studio
                            </MagicButton>
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {/* Stat Cards */}
                    <motion.div variants={cardVariants} whileHover="hover">
                        <Card className="saas-card h-full">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Total Wins</CardTitle>
                                <Trophy className="h-4 w-4 text-primary" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold tracking-tight">{stats.total}</div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div variants={cardVariants} whileHover="hover">
                        <Card className="saas-card h-full">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">This Month</CardTitle>
                                <TrendingUp className="h-4 w-4 text-secondary-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold tracking-tight">{stats.month}</div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div variants={cardVariants} whileHover="hover">
                        <Card className="saas-card h-full">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Flow State</CardTitle>
                                <Zap className="h-4 w-4 text-yellow-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold tracking-tight">{stats.flow}</div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                {/* Main Content Grid */}
                <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
                    {/* Activity Rhythm */}
                    <motion.div className="col-span-1 lg:col-span-2 order-1" variants={cardVariants}>
                        <Heatmap />
                    </motion.div>

                    {/* Recent Wins */}
                    <motion.div className="col-span-1 lg:col-span-1 lg:row-span-2 order-2" variants={cardVariants}>
                        <RecentEntries />
                    </motion.div>

                    {/* Achievements */}
                    <motion.div className="col-span-1 lg:col-span-2 order-3" variants={cardVariants}>
                        <Card className="saas-card">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Trophy className="h-4 w-4 text-purple-400" />
                                    Achievements
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                    {badges.map((badge) => (
                                        <Tooltip key={badge.id}>
                                            <TooltipTrigger asChild>
                                                <motion.div
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => setSelectedBadge(badge)}
                                                    className={cn(
                                                        "aspect-square rounded-xl flex flex-col items-center justify-center gap-1 border transition-colors cursor-pointer relative group overflow-hidden",
                                                        badge.achieved
                                                            ? "bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10"
                                                            : "bg-white/2 border-white/5 opacity-40 grayscale"
                                                    )}
                                                >
                                                    <badge.icon className={cn("h-6 w-6", badge.achieved ? badge.color : "text-muted-foreground")} />
                                                    {badge.achieved && (
                                                        <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />
                                                    )}
                                                </motion.div>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p className="font-semibold">{badge.name}</p>
                                                <p className="text-xs text-muted-foreground">{badge.description}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-[10px] text-muted-foreground">{badge.progress}/{badge.total}</span>
                                                </div>
                                            </TooltipContent>
                                        </Tooltip>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                <AIStudio />

                {/* Achievement Details Dialog */}
                <Dialog open={!!selectedBadge} onOpenChange={() => setSelectedBadge(null)}>
                    <DialogContent className="saas-card border-white/10 sm:max-w-md">
                        {selectedBadge && (
                            <>
                                <DialogHeader className="flex flex-col items-center text-center gap-4">
                                    <div className={cn(
                                        "p-6 rounded-full ring-1 ring-white/10",
                                        selectedBadge.achieved ? "bg-white/5" : "bg-white/2 grayscale opacity-50"
                                    )}>
                                        <selectedBadge.icon className={cn("h-12 w-12", selectedBadge.achieved ? selectedBadge.color : "text-muted-foreground")} />
                                    </div>
                                    <div className="space-y-2">
                                        <DialogTitle className="text-xl">{selectedBadge.name}</DialogTitle>
                                        <DialogDescription className="text-base">
                                            {selectedBadge.description}
                                        </DialogDescription>
                                    </div>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Progress</span>
                                            <span className="font-mono">{selectedBadge.progress} / {selectedBadge.total}</span>
                                        </div>
                                        {/* Simple Progress Bar */}
                                        <Progress value={Math.min((selectedBadge.progress / selectedBadge.total) * 100, 100)} className="h-2" />
                                    </div>

                                    <div
                                        className={cn(
                                            "p-3 rounded-lg bg-white/5 border border-white/5 text-center transition-all duration-300",
                                            selectedBadge.achieved && "cursor-pointer hover:scale-105 active:scale-95 hover:bg-white/10"
                                        )}
                                        onClick={(e) => {
                                            if (selectedBadge.achieved) {
                                                const rect = (e.target as HTMLElement).getBoundingClientRect();
                                                const x = (rect.left + rect.width / 2) / window.innerWidth;
                                                const y = (rect.top + rect.height / 2) / window.innerHeight;

                                                confetti({
                                                    particleCount: 100,
                                                    spread: 70,
                                                    origin: { x, y },
                                                    zIndex: 9999
                                                });
                                            }
                                        }}
                                    >
                                        <span className={cn(
                                            "text-sm font-semibold select-none",
                                            selectedBadge.achieved ? "text-green-400" : "text-muted-foreground"
                                        )}>
                                            {selectedBadge.achieved ? "🎉 Unlocked" : "🔒 Locked"}
                                        </span>
                                    </div>
                                </div>
                            </>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </TooltipProvider>
    )
}
