"use client"

import { useEffect } from "react"
import { useStore } from "@/lib/store"
import { motion } from "framer-motion"
import { formatDate } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Zap, BatteryWarning, Circle, Pencil, Trash2 } from "lucide-react"
import { toast } from "sonner"

export function TimelineView() {
    // Re-call fetch entries to ensure up to date if navigating directly
    const { entries, fetchEntries, setEditingEntry, deleteEntry, restoreEntry } = useStore()

    useEffect(() => {
        fetchEntries()
    }, [fetchEntries])

    return (
        <div className="max-w-3xl mx-auto py-8">
            <div className="relative border-l border-border/50 ml-4 space-y-8">
                {entries.map((entry, index) => (
                    <motion.div
                        key={entry.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="relative pl-8"
                    >
                        {/* Dot */}
                        <div className="absolute -left-[5px] top-2 h-2.5 w-2.5 rounded-full bg-primary ring-4 ring-background" />

                        <div className="flex flex-col gap-2 rounded-xl border border-border/50 bg-card/30 p-4 hover:bg-card/50 transition-colors">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <h3 className="font-semibold text-lg leading-tight">{entry.title}</h3>
                                <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-2">
                                    <span className="text-sm text-muted-foreground">{formatDate(entry.date)}</span>
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => setEditingEntry(entry)}
                                            className="text-muted-foreground hover:text-primary transition-colors p-1"
                                            title="Edit Entry"
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={async () => {
                                                const success = await deleteEntry(entry.id)
                                                if (success) {
                                                    toast("Entry deleted", {
                                                        description: "It is gone from your timeline.",
                                                        action: {
                                                            label: "Undo",
                                                            onClick: () => restoreEntry(entry)
                                                        }
                                                    })
                                                }
                                            }}
                                            className="text-muted-foreground hover:text-destructive transition-colors p-1"
                                            title="Delete Entry"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {entry.description && (
                                <p className="text-muted-foreground">{entry.description}</p>
                            )}

                            <div className="flex items-center gap-2 mt-2">
                                <Badge variant="outline">
                                    {entry.impact} Impact
                                </Badge>
                                <Badge variant="secondary" className="gap-1">
                                    {entry.mood === 'Flow' && <Zap className="h-3 w-3 text-yellow-500" />}
                                    {entry.mood === 'Drain' && <BatteryWarning className="h-3 w-3 text-red-500" />}
                                    {entry.mood === 'Neutral' && <Circle className="h-3 w-3 text-gray-500" />}
                                    {entry.mood}
                                </Badge>
                            </div>
                        </div>
                    </motion.div>
                ))}

                {entries.length === 0 && (
                    <div className="pl-8 text-muted-foreground">No entries yet. Start by pressing <span className="text-foreground font-medium">Cmd+K</span> or clicking the <span className="text-foreground font-medium">+</span> button.</div>
                )}
            </div>
        </div>
    )
}
