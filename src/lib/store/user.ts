import { create } from 'zustand'
import { createClient } from '@/lib/supabase/client'

interface UserState {
    user: any | null
    profile: {
        full_name?: string
        username?: string
        is_public?: boolean
        avatar_url?: string
    } | null
    loading: boolean
    fetchUser: () => Promise<void>
    updateProfile: (updates: Partial<UserState['profile']>) => void
}

export const useUserStore = create<UserState>((set) => ({
    user: null,
    profile: null,
    loading: true,
    fetchUser: async () => {
        set({ loading: true })
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (user) {
            const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single()

            set({ user, profile: profile || {}, loading: false })
        } else {
            set({ user: null, profile: null, loading: false })
        }
    },
    updateProfile: (updates) => {
        set((state) => ({
            profile: { ...state.profile, ...updates }
        }))
    }
}))
