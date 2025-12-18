"use client"

import * as React from "react"
import { Gauge, Zap, Hash, AlignLeft, Calendar, BatteryWarning, Circle } from "lucide-react"
import { useStore, type Impact, type Mood } from "@/lib/store"
import { Button } from "@/components/ui/button"
import {
    CommandDialog,
    CommandInput,
    CommandList,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    CommandSeparator,
} from "@/components/ui/command"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

export function CommandBar() {
    const { isCommandBarOpen, setCommandBarOpen, addEntry, updateEntry, editingEntry, setEditingEntry } = useStore()

    // Form State
    const [title, setTitle] = React.useState("")
    const [description, setDescription] = React.useState("")
    const [impact, setImpact] = React.useState<Impact>("Medium")
    const [mood, setMood] = React.useState<Mood>("Flow")

    // Populate form when editingEntry changes
    React.useEffect(() => {
        if (editingEntry) {
            setTitle(editingEntry.title)
            setDescription(editingEntry.description || "")
            setImpact(editingEntry.impact)
            setMood(editingEntry.mood)
        } else {
            // Reset if opened clean
            setTitle("")
            setDescription("")
            setImpact("Medium")
            setMood("Flow")
        }
    }, [editingEntry, isCommandBarOpen]) // Run when open changes too, to ensure clean state if closed/reopened without edit

    // If closed, clear editing state
    React.useEffect(() => {
        if (!isCommandBarOpen) {
            const timer = setTimeout(() => {
                setEditingEntry(null)
                setTitle("")
                setDescription("")
            }, 300) // Wait for animation
            return () => clearTimeout(timer)
        }
    }, [isCommandBarOpen, setEditingEntry])


    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setCommandBarOpen(!isCommandBarOpen)
            }
        }
        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [isCommandBarOpen, setCommandBarOpen])

    const handleSubmit = async () => {
        if (!title.trim()) return

        if (editingEntry) {
            // Update Logic
            await updateEntry({
                ...editingEntry,
                title,
                description,
                impact,
                mood
            })
            toast.success("Entry updated", { className: "neon-border" })
        } else {
            // Create Logic
            await addEntry({
                title,
                description,
                date: new Date().toISOString(),
                impact,
                mood,
            })
            toast.success("Entry saved", {
                description: "Your win has been recorded.",
                className: "neon-border"
            })
        }


        // Reset handled by effect onClose but let's close prompt
        setCommandBarOpen(false)
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
            handleSubmit()
        }
    }

    return (
        <CommandDialog open={isCommandBarOpen} onOpenChange={setCommandBarOpen}>
            <div className="flex flex-col gap-4 p-4" onKeyDown={handleKeyDown}>
                {/* Header / Ghost Input */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between px-1">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                            {editingEntry ? "Edit Entry" : "New Entry"}
                        </span>
                    </div>
                    <input
                        className="flex h-14 w-full rounded-md bg-transparent px-1 py-2 text-2xl sm:text-3xl font-bold outline-none placeholder:text-muted-foreground/30 text-foreground"
                        placeholder="What's the win?"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        autoFocus
                    />
                    <textarea
                        className="flex w-full resize-none rounded-md bg-transparent px-1 py-1 text-base outline-none placeholder:text-muted-foreground/40 text-muted-foreground min-h-[80px]"
                        placeholder="Add some context..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                {/* Chips Selection */}
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        {/* Impact */}
                        <div className="flex items-center justify-between sm:justify-start p-1 bg-secondary/30 rounded-full border border-white/5 backdrop-blur-sm overflow-x-auto no-scrollbar">
                            {(['Low', 'Medium', 'High'] as Impact[]).map((i) => (
                                <button
                                    key={i}
                                    onClick={() => setImpact(i)}
                                    className={cn(
                                        "px-4 py-2 sm:py-1.5 text-xs font-medium rounded-full transition-all duration-300 flex-1 sm:flex-none text-center",
                                        impact === i
                                            ? "bg-primary text-white shadow-[0_0_15px_rgba(139,92,246,0.4)]"
                                            : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                                    )}
                                >
                                    {i}
                                </button>
                            ))}
                        </div>

                        {/* Mood */}
                        <div className="flex items-center justify-between sm:justify-start p-1 bg-secondary/30 rounded-full border border-white/5 backdrop-blur-sm overflow-x-auto no-scrollbar">
                            {(['Flow', 'Drain', 'Neutral'] as Mood[]).map((m) => (
                                <button
                                    key={m}
                                    onClick={() => setMood(m)}
                                    className={cn(
                                        "px-4 py-2 sm:py-1.5 text-xs font-medium rounded-full transition-all duration-300 flex items-center justify-center gap-1.5 flex-1 sm:flex-none",
                                        mood === m
                                            ? "bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                                            : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                                    )}
                                >
                                    {m === 'Flow' && <Zap className="h-3 w-3" />}
                                    {m === 'Drain' && <BatteryWarning className="h-3 w-3" />}
                                    {m === 'Neutral' && <Circle className="h-3 w-3" />}
                                    {m}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center justify-end pt-4 sm:pt-2 border-t border-white/5">
                        <Button
                            size="sm"
                            variant="neon"
                            onClick={handleSubmit}
                            className="w-full sm:w-auto h-11 sm:h-9 px-6 text-sm font-medium rounded-xl sm:rounded-full"
                        >
                            {editingEntry ? "Update Entry" : "Save Entry"}
                            <kbd className="hidden sm:inline-flex ml-2 pointer-events-none h-5 select-none items-center gap-1 rounded bg-white/10 px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                                <span className="text-xs">⌘</span>Enter
                            </kbd>
                        </Button>
                    </div>
                </div>
            </div>
        </CommandDialog>
    )
}
