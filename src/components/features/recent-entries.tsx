"use client"

import { useStore } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion, AnimatePresence } from "framer-motion"
import { formatDate } from "@/lib/utils"

export function RecentEntries() {
    const entries = useStore((state) => state.entries)
    const recent = entries.slice(0, 5)

    return (
        <Card className="saas-card h-full">
            <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">Recent Wins</CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6">
                <motion.ul
                    className="space-y-2"
                    initial="hidden"
                    animate="visible"
                    variants={{
                        visible: { transition: { staggerChildren: 0.1 } }
                    }}
                >
                    <AnimatePresence initial={false} mode="popLayout">
                        {recent.map((entry) => (
                            <motion.li
                                key={entry.id}
                                layout
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                whileHover={{
                                    scale: 1.02,
                                    x: 5,
                                    backgroundColor: "rgba(255,255,255,0.03)",
                                    transition: { type: "spring", stiffness: 400, damping: 17 }
                                }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                className="overflow-hidden rounded-lg"
                            >
                                <div className="flex flex-col gap-1 rounded-lg border border-border/40 bg-card p-3 transition-colors">
                                    <div className="flex items-start justify-between gap-2">
                                        <span className="font-semibold text-sm line-clamp-2 leading-tight">{entry.title}</span>
                                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-mono shrink-0 mt-0.5">{entry.impact}</span>
                                    </div>
                                    <span className="text-xs text-muted-foreground">{formatDate(entry.date)}</span>
                                </div>
                            </motion.li>
                        ))}
                    </AnimatePresence>
                    {recent.length === 0 && (
                        <div className="p-4 text-center text-sm text-muted-foreground">No entries yet. Press Cmd+K</div>
                    )}
                </motion.ul>
            </CardContent>
        </Card>
    )
}
