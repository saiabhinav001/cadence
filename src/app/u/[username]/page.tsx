


import { createClient } from "@/lib/supabase/client"
import { notFound } from "next/navigation"
import { Heatmap } from "@/components/features/heatmap" // Reuse if possible, or make a readonly one
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Sparkles, Trophy, Calendar, Zap, Lock } from "lucide-react"

// Force dynamic rendering - no caching at all
export const dynamic = 'force-dynamic'
export const revalidate = 0

// Types matching DB
interface Entry {
    id: string
    title: string
    description: string
    date: string
    impact: 'High' | 'Medium' | 'Low'
    mood: 'Flow' | 'Drain' | 'Neutral'
}

interface Profile {
    username: string
    full_name: string
    is_public: boolean
}

// Server Component
export default async function PublicProfilePage({ params }: { params: Promise<{ username: string }> }) {
    const supabase = createClient()
    const { username } = await params

    // 1. Fetch Profile
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username.toLowerCase())
        .single()

    if (!profile) {
        return notFound()
    }

    if (!profile.is_public) {
        return (
            <div className="flex h-screen items-center justify-center bg-black text-white">
                <div className="text-center space-y-4">
                    <div className="bg-white/5 p-4 rounded-full inline-flex">
                        <Lock className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h1 className="text-2xl font-bold">Private Profile</h1>
                    <p className="text-muted-foreground">This user has kept their achievements private.</p>
                </div>
            </div>
        )
    }

    // 2. Fetch High Impact Entries
    const { data: entries } = await supabase
        .from('entries')
        .select('*')
        .eq('user_id', profile.id)
        .eq('impact', 'High')
        .order('date', { ascending: false })

    // Calculate stats
    const totalWins = entries?.length || 0
    const flowStates = entries?.filter(e => e.mood === 'Flow').length || 0

    return (
        <div className="min-h-screen bg-black text-white selection:bg-purple-500/30">
            {/* Header / Hero */}
            <div className="relative border-b border-white/10 bg-gradient-to-b from-purple-900/20 to-black/20">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
                <div className="container mx-auto px-4 py-16 relative z-10 text-center space-y-4">
                    <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-gradient-to-tr from-purple-500/20 to-pink-500/20 border border-white/10 mb-4">
                        <Trophy className="h-8 w-8 text-purple-400" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tighter bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                        {profile.username}'s Showcase
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        A curated collection of high-impact engineering achievements.
                    </p>

                    {/* Stats */}
                    <div className="flex justify-center gap-8 pt-8">
                        <div className="text-center">
                            <div className="text-3xl font-bold">{totalWins}</div>
                            <div className="text-xs uppercase tracking-widest text-muted-foreground">Epic Wins</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-yellow-400">{flowStates}</div>
                            <div className="text-xs uppercase tracking-widest text-muted-foreground">Flow States</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Timeline */}
            <div className="container mx-auto px-4 py-16 max-w-4xl">
                <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
                    {entries?.map((entry, i) => (
                        <div key={entry.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">

                            {/* Dot */}
                            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-black shadow-xl shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                                <Sparkles className="h-4 w-4 text-purple-400" />
                            </div>

                            {/* Content */}
                            <Card className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white/5 border-white/10 hover:border-purple-500/30 transition-colors backdrop-blur-sm">
                                <CardContent className="p-6 space-y-4">
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Badge variant="neon" className="bg-purple-500/20 text-purple-300 border-purple-500/20">
                                                {entry.impact} IMPACT
                                            </Badge>
                                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                {new Date(entry.date).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold">{entry.title}</h3>
                                        {entry.description && (
                                            <p className="text-muted-foreground leading-relaxed text-sm">
                                                {entry.description}
                                            </p>
                                        )}
                                    </div>

                                    {entry.mood === 'Flow' && (
                                        <div className="flex items-center gap-2 text-xs text-yellow-400/80 bg-yellow-400/10 px-3 py-1.5 rounded-full w-fit">
                                            <Zap className="h-3 w-3" />
                                            Achieved in Flow State
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    ))}

                    {(!entries || entries.length === 0) && (
                        <div className="text-center py-20 text-muted-foreground">
                            No high impact wins found yet.
                        </div>
                    )}
                </div>
            </div>

            {/* Footer */}
            <div className="py-8 text-center text-sm text-muted-foreground border-t border-white/10 mt-20">
                Powered by <span className="font-bold text-white">Cadence</span>
            </div>
        </div>
    )
}
