"use client"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useStore } from "@/lib/store"
import { Download } from "lucide-react"
import { subDays, isAfter } from "date-fns"
import { toast } from "sonner"

export function SmartExport() {
    const entries = useStore((state) => state.entries)

    const handleExport = (range: 'week' | 'month') => {
        const now = new Date()
        const cutoff = range === 'week' ? subDays(now, 7) : subDays(now, 30)

        const filtered = entries.filter(e => isAfter(new Date(e.date), cutoff))

        let md = `# Brag Document - Last ${range === 'week' ? '7 Days' : 'Month'}\n\n`

        if (filtered.length === 0) {
            md += "_No entries recorded._"
        } else {
            filtered.forEach(e => {
                md += `## ${e.date.split('T')[0]} - ${e.title}\n`
                md += `**Impact**: ${e.impact} | **Mood**: ${e.mood}\n`
                if (e.description) md += `\n${e.description}\n`
                md += `\n---\n`
            })
        }

        const blob = new Blob([md], { type: 'text/markdown' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `cadence-export-${range}-${new Date().toISOString().split('T')[0]}.md`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)

        toast.success("Exported successfully")
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                    <Download className="h-4 w-4" />
                    <span className="hidden sm:inline">Export</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Choose Period</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleExport('week')}>
                    Export Week
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('month')}>
                    Export Month
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
