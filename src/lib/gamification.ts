import { Entry } from "./store"
import { differenceInCalendarDays } from "date-fns"
import { Trophy, Zap, Target, Flame, Star, LucideIcon, Rocket, Mountain, Crown, Brain, Sparkles } from "lucide-react"

export interface Badge {
    id: string
    name: string
    description: string
    icon: LucideIcon
    color: string // Tailwind color class for icon/bg
    achieved: boolean
    progress: number
    total: number
}

export function calculateStreak(entries: Entry[]): number {
    if (!entries.length) return 0

    // Sort entries by date descending (newest first) just in case
    const sortedEntries = [...entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    // Get unique dates
    const uniqueDates = Array.from(new Set(sortedEntries.map(e => e.date.split('T')[0])))

    if (!uniqueDates.length) return 0

    const today = new Date()
    const lastEntryDate = new Date(uniqueDates[0])

    // If the last entry was not today or yesterday, streak is broken (0)
    // Note: If user hasn't logged today yet, but did yesterday, streak is still active but count depends on how we define it.
    // Usually: Current Streak includes today if logged, or is carried over from yesterday.
    // However, if last entry is older than yesterday, streak is 0.

    const diff = differenceInCalendarDays(today, lastEntryDate)
    if (diff > 1) return 0

    let streak = 1
    // Iterate through unique dates
    for (let i = 0; i < uniqueDates.length - 1; i++) {
        const current = new Date(uniqueDates[i])
        const next = new Date(uniqueDates[i + 1]) // This is actually the "previous" day in time

        const dayDiff = differenceInCalendarDays(current, next)

        if (dayDiff === 1) {
            streak++
        } else {
            break
        }
    }

    return streak
}

export function getBadges(entries: Entry[]): Badge[] {
    const totalWins = entries.length
    const flowStates = entries.filter(e => e.mood === 'Flow').length
    const highImpact = entries.filter(e => e.impact === 'High').length
    const streak = calculateStreak(entries)

    // Hat Trick Calculation: Check if any single day has >= 3 High Impact wins
    const entriesByDay = entries.reduce((acc, entry) => {
        const day = entry.date.split('T')[0]
        if (!acc[day]) acc[day] = []
        acc[day].push(entry)
        return acc
    }, {} as Record<string, Entry[]>)

    const hasHatTrick = Object.values(entriesByDay).some(dayEntries =>
        dayEntries.filter(e => e.impact === 'High').length >= 3
    )

    // Hat Trick progress (just binary 0 or 1 for visual simplicity, or count max high impact in a day)
    const maxHighImpactInOneDay = Math.max(0, ...Object.values(entriesByDay).map(dayEntries =>
        dayEntries.filter(e => e.impact === 'High').length
    ))


    return [
        // --- The Discipline (Streak) ---
        {
            id: 'unstoppable',
            name: 'Unstoppable',
            description: 'Maintained a 7-day streak',
            icon: Rocket,
            color: 'text-orange-500',
            achieved: streak >= 7,
            progress: streak,
            total: 7
        },
        {
            id: 'habit-machine',
            name: 'Habit Machine',
            description: 'Maintained a 30-day streak',
            icon: Mountain,
            color: 'text-blue-500',
            achieved: streak >= 30,
            progress: streak,
            total: 30
        },
        {
            id: 'legendary',
            name: 'Legendary',
            description: 'Maintained a 100-day streak',
            icon: Crown,
            color: 'text-yellow-500',
            achieved: streak >= 100,
            progress: streak,
            total: 100
        },

        // --- The Focus (Flow) ---
        {
            id: 'flow-master',
            name: 'Flow Master',
            description: 'Logged 10 entries in Flow state',
            icon: Zap,
            color: 'text-cyan-400',
            achieved: flowStates >= 10,
            progress: flowStates,
            total: 10
        },
        {
            id: 'deep-work',
            name: 'Deep Work',
            description: 'Logged 100 entries in Flow state',
            icon: Brain,
            color: 'text-violet-500',
            achieved: flowStates >= 100,
            progress: flowStates,
            total: 100
        },

        // --- The Impact ---
        {
            id: 'high-impact',
            name: 'High Impact',
            description: 'Delivered 10 High Impact wins',
            icon: Target,
            color: 'text-red-500',
            achieved: highImpact >= 10,
            progress: highImpact,
            total: 10
        },
        {
            id: 'world-class',
            name: 'World Class',
            description: 'Delivered 100 High Impact wins',
            icon: Trophy,
            color: 'text-amber-400',
            achieved: highImpact >= 100,
            progress: highImpact,
            total: 100
        },

        // --- Peak Performance ---
        {
            id: 'hat-trick',
            name: 'Hat Trick',
            description: '3 High Impact wins in a single day',
            icon: Sparkles,
            color: 'text-pink-500',
            achieved: hasHatTrick,
            progress: maxHighImpactInOneDay,
            total: 3
        }
    ]
}
