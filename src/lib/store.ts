import { create } from 'zustand'
import { createClient } from '@/lib/supabase/client'
import { getBadges, Badge } from '@/lib/gamification'

export type Impact = 'Low' | 'Medium' | 'High'
export type Mood = 'Flow' | 'Drain' | 'Neutral'

export interface Entry {
    id: string
    user_id: string
    title: string
    description?: string
    date: string
    impact: Impact
    mood: Mood
    created_at: string
    tags?: Tag[]
}

export interface Tag {
    id: string
    name: string
    color: string
    category: string
}

interface AppState {
    entries: Entry[]
    tags: Tag[]
    isLoading: boolean
    isCommandBarOpen: boolean
    setCommandBarOpen: (open: boolean) => void
    isAIStudioOpen: boolean
    setAIStudioOpen: (open: boolean) => void
    editingEntry: Entry | null
    setEditingEntry: (entry: Entry | null) => void
    fetchEntries: () => Promise<void>
    addEntry: (entry: Omit<Entry, 'id' | 'created_at' | 'user_id'>, tags?: string[]) => Promise<void>
    updateEntry: (entry: Entry) => Promise<void>
    deleteEntry: (id: string) => Promise<boolean>
    restoreEntry: (entry: Entry) => Promise<void>
    newlyUnlockedBadges: Badge[]
    clearNewlyUnlockedBadge: (id: string) => void
}

export const useStore = create<AppState>((set, get) => ({
    entries: [],
    tags: [],
    isLoading: false,
    isCommandBarOpen: false,
    isAIStudioOpen: false,
    editingEntry: null,
    setCommandBarOpen: (open) => set({ isCommandBarOpen: open }),
    setAIStudioOpen: (open) => set({ isAIStudioOpen: open }),
    setEditingEntry: (entry) => set({ editingEntry: entry, isCommandBarOpen: !!entry }), // Auto open if entry set
    newlyUnlockedBadges: [],
    clearNewlyUnlockedBadge: (id) => set((state) => ({
        newlyUnlockedBadges: state.newlyUnlockedBadges.filter(b => b.id !== id)
    })),
    fetchEntries: async () => {
        set({ isLoading: true })
        const supabase = createClient()

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            set({ entries: [], isLoading: false })
            return
        }

        const { data: entries, error } = await supabase
            .from('entries')
            .select(`*, tags:entry_tags(tags(*))`)
            .eq('user_id', user.id)
            .order('date', { ascending: false })

        // Simplification for now: load entries. Join needs proper setup.
        // For now assuming standard join logic works if relationships are set.
        // Supabase returns nested data: entries -> entry_tags -> tags. 
        // We'll map it to Entry structure.

        if (!error && entries) {
            set({ entries: entries as Entry[], isLoading: false })
        } else {
            set({ isLoading: false })
        }
    },
    addEntry: async (entry, tagIds) => {
        // Calculate badges BEFORE update
        const currentEntries = get().entries
        const currentBadges = getBadges(currentEntries)

        // Optimistic update
        const tempId = crypto.randomUUID()
        const newEntryStub = {
            ...entry,
            id: tempId,
            user_id: 'me',
            created_at: new Date().toISOString(),
            tags: [] // tags handling is complex optimistically
        }

        set((state) => ({ entries: [newEntryStub, ...state.entries] }))

        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return;

        // Insert Entry
        const { data, error } = await supabase
            .from('entries')
            .insert({
                title: entry.title,
                description: entry.description,
                date: entry.date,
                impact: entry.impact,
                mood: entry.mood,
                user_id: user.id
            })
            .select()
            .single()

        if (error) {
            // Revert on error
            set((state) => ({ entries: state.entries.filter(e => e.id !== tempId) }))
            console.error(error)
            return
        }

        // Insert tags
        if (tagIds && tagIds.length > 0) {
            const tagInserts = tagIds.map(tId => ({
                entry_id: data.id,
                tag_id: tId
            }))
            await supabase.from('entry_tags').insert(tagInserts)
        }

        // Replace optimistic with real
        set((state) => {
            const newEntries = state.entries.map(e => e.id === tempId ? { ...data, tags: [] } : e)

            // Calculate badges AFTER update
            const newBadges = getBadges(newEntries)

            // Diff to find newly unlocked
            const newlyUnlocked = newBadges.filter(newBadge => {
                if (!newBadge.achieved) return false
                const oldBadge = currentBadges.find(b => b.id === newBadge.id)
                // It's new if it wasn't achieved before
                return !oldBadge?.achieved
            })

            return {
                entries: newEntries,
                newlyUnlockedBadges: [...state.newlyUnlockedBadges, ...newlyUnlocked]
            }
        })
        // Trigger refetch to get tags properly
        get().fetchEntries()
    },
    updateEntry: async (updatedEntry) => {
        // Optimistic update
        set((state) => ({
            entries: state.entries.map(e => e.id === updatedEntry.id ? updatedEntry : e)
        }))

        const supabase = createClient()
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { tags, ...entryData } = updatedEntry // Remove tags from update payload if it exists

        const { error } = await supabase
            .from('entries')
            .update({
                title: entryData.title,
                description: entryData.description,
                date: entryData.date,
                impact: entryData.impact,
                mood: entryData.mood,
            })
            .eq('id', updatedEntry.id)

        if (error) {
            console.error(error)
            // Revert would require keeping old state, complex for now.
            // Just refetch to sync.
            get().fetchEntries()
        }
    },
    deleteEntry: async (id: string) => {
        // Optimistic delete
        const originalEntries = get().entries
        set((state) => ({
            entries: state.entries.filter(e => e.id !== id)
        }))

        const supabase = createClient()
        const { error } = await supabase.from('entries').delete().eq('id', id)

        if (error) {
            console.error(error)
            // Revert
            set({ entries: originalEntries })
            return false // Failed
        }
        return true
    },
    restoreEntry: async (entry: Entry) => {
        // Optimistic restore
        // We give it a temp ID if needed, or just insert.
        // For restore, we want to respect the original created_at if possible to keep order,
        // but we'll let the DB handle ID unless we want to force it.
        // Simplest strategy: treat it like valid data to re-insert.

        set((state) => ({ entries: [entry, ...state.entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) }))

        const supabase = createClient()
        const { error } = await supabase.from('entries').insert({
            title: entry.title,
            description: entry.description,
            date: entry.date,
            impact: entry.impact,
            mood: entry.mood,
            user_id: entry.user_id,
            // We use the original created_at or let it renew?
            // If we renewed, it might jump to top if we sorted by created_at.
            // We sort by 'date' (the user date), so created_at matters less for order,
            // but good to keep history if possible.
            // Let's just re-insert data.
        })

        if (error) {
            console.error(error)
            // Revert/Refetch
            get().fetchEntries()
        } else {
            get().fetchEntries() // Ensure ID is synced
        }
    }
}))
