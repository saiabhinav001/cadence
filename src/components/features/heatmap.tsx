"use client"

import { useMemo, memo } from "react"
import { subDays, eachDayOfInterval, format, startOfWeek, isSameDay } from "date-fns"
import { useStore } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { motion } from "framer-motion"

// Memoized Cell Component to prevent flickering & improve performance
// Added Framer Motion for "Addictive" Spring Physics
const HeatmapCell = memo(({ date, count }: { date: Date, count: number }) => {
    const dateStr = format(date, 'yyyy-MM-dd')
    const tooltipDate = format(date, 'MMMM do')
    const tooltipText = `${count} wins on ${tooltipDate}`

    // Determine color intensity
    let bgClass = "bg-white/5"
    if (count === 1) bgClass = "bg-primary/40"
    if (count > 1 && count <= 3) bgClass = "bg-primary/70"
    if (count > 3) bgClass = "bg-primary"

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <motion.div
                    initial={false}
                    whileHover={{
                        scale: 1.4,
                        zIndex: 50,
                        transition: { type: "spring", stiffness: 500, damping: 15, mass: 0.5 }
                    }}
                    className={cn("h-3 w-3 rounded-[2px] cursor-pointer relative", bgClass)}
                />
            </TooltipTrigger>
            <TooltipContent
                side="top"
                sideOffset={5}
                className="text-xs font-bold pointer-events-none select-none bg-black/90 text-white border-white/10 shadow-2xl backdrop-blur-sm"
            >
                {tooltipText}
            </TooltipContent>
        </Tooltip>
    )
}, (prev, next) => prev.count === next.count && isSameDay(prev.date, next.date))

HeatmapCell.displayName = "HeatmapCell"

export function Heatmap() {
    const entries = useStore((state) => state.entries)

    // Data Processing
    const { days, data, months } = useMemo(() => {
        const today = new Date()
        const endDate = today
        const roughlyOneYearAgo = subDays(today, 365)
        const startDate = startOfWeek(roughlyOneYearAgo, { weekStartsOn: 1 })

        const dayList = eachDayOfInterval({ start: startDate, end: endDate })

        const map = new Map<string, number>()
        entries.forEach(e => {
            const dateStr = format(new Date(e.date), 'yyyy-MM-dd')
            map.set(dateStr, (map.get(dateStr) || 0) + 1)
        })

        const monthLabels: { name: string, colIndex: number }[] = []
        let lastMonth = -1

        dayList.forEach((day, index) => {
            if (index % 7 === 0) {
                const m = day.getMonth()
                if (m !== lastMonth) {
                    monthLabels.push({ name: format(day, 'MMM'), colIndex: index / 7 })
                    lastMonth = m
                }
            }
        })

        return { days: dayList, data: map, months: monthLabels }
    }, [entries])

    return (
        <Card className="saas-card h-full w-full">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Activity Rhythm</CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6">
                <TooltipProvider delayDuration={0}> {/* Instant feedback */}
                    <div className="w-full overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] [-webkit-overflow-scrolling:touch]">
                        <div className="min-w-max pr-4">
                            {/* Month Labels */}
                            <div className="relative h-6 mb-2 text-xs text-muted-foreground/60 w-full pl-[30px] font-mono uppercase tracking-wider">
                                {months.map((m, i) => (
                                    <span
                                        key={m.name + i}
                                        className="absolute top-0 text-left"
                                        style={{ left: `${30 + (m.colIndex * 16)}px` }}
                                    >
                                        {m.name}
                                    </span>
                                ))}
                            </div>

                            <div className="flex gap-1">
                                {/* Day Labels */}
                                <div className="flex flex-col gap-1 text-[9px] text-muted-foreground/60 pr-2 pt-0.5 w-[25px] h-full justify-between font-mono uppercase">
                                    <span className="h-3 leading-3">Mon</span>
                                    <span className="h-3 leading-3 opacity-0">Tue</span>
                                    <span className="h-3 leading-3">Wed</span>
                                    <span className="h-3 leading-3 opacity-0">Thu</span>
                                    <span className="h-3 leading-3">Fri</span>
                                    <span className="h-3 leading-3 opacity-0">Sat</span>
                                    <span className="h-3 leading-3">Sun</span>
                                </div>

                                {/* The Grid */}
                                <div className="grid grid-rows-7 grid-flow-col gap-1">
                                    {days.map((day) => {
                                        const dateStr = format(day, 'yyyy-MM-dd')
                                        const count = data.get(dateStr) || 0
                                        return (
                                            <HeatmapCell key={dateStr} date={day} count={count} />
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </TooltipProvider>
            </CardContent>
        </Card>
    )
}
