'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'

export async function login(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/', 'layout')
    redirect('/dashboard')
}

export async function signup(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const fullName = formData.get('fullName') as string

    // Reliable URL generation using dynamic origin
    const getURL = async () => {
        const origin = (await headers()).get('origin');
        if (origin) {
            return origin.charAt(origin.length - 1) === '/' ? origin : `${origin}/`;
        }

        let url =
            process.env.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
            process.env.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
            'http://localhost:3000/';
        // Make sure to include `https://` when not localhost.
        url = url.includes('http') ? url : `https://${url}`;
        // Make sure to including trailing `/`.
        url = url.charAt(url.length - 1) === '/' ? url : `${url}/`;
        return url;
    };

    const origin = await getURL()

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName,
                avatar_url: '',
            },
            emailRedirectTo: `${origin}auth/callback`,
        },
    })

    if (error) {
        return { error: error.message }
    }

    return { success: true, message: 'Check your email to verify your account.' }
    // or if auto-confirm is on, redirect to dashboard. But usually requires email check.
}

export async function resetPassword(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string

    // Reliable URL generation using dynamic origin
    const getURL = async () => {
        const headersList = await headers();
        const origin = headersList.get('origin') || headersList.get('referer');
        const host = headersList.get('host');

        // 1. Try Origin or Referer (best for client-side matching)
        if (origin) {
            // Remove trailing slash if exists to standardize, then add it back
            const cleanOrigin = origin.replace(/\/$/, '');
            return `${cleanOrigin}/`;
        }

        // 2. Try Host header (robust fallback for servers)
        if (host) {
            const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
            return `${protocol}://${host}/`;
        }

        // 3. Environment variables or default
        let url =
            process.env.NEXT_PUBLIC_SITE_URL ??
            process.env.NEXT_PUBLIC_VERCEL_URL ??
            'http://localhost:3000/';
        url = url.includes('http') ? url : `https://${url}`;
        return url.charAt(url.length - 1) === '/' ? url : `${url}/`;
    };

    const origin = await getURL()

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${origin}auth/callback?next=/update-password`,
    })

    if (error) {
        return { error: error.message }
    }

    return { success: true, message: 'Check your email for the reset link.' }
}

export async function updatePassword(formData: FormData) {
    const supabase = await createClient()

    const password = formData.get('password') as string

    const { error } = await supabase.auth.updateUser({
        password,
    })

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/', 'layout')
    redirect('/dashboard')
}
