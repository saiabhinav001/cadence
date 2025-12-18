import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
                    response = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    const {
        data: { user },
    } = await supabase.auth.getUser()

    // Protected routes
    if (!user && request.nextUrl.pathname.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // Auth routes (redirect to dashboard if logged in)
    if (user && (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/signup')) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // Handle Supabase redirecting to root with code (Case where specific redirect URL is stripped)
    const code = request.nextUrl.searchParams.get('code')
    if (request.nextUrl.pathname === '/' && code) {
        const url = request.nextUrl.clone()
        url.pathname = '/auth/callback'
        return NextResponse.redirect(url)
    }

    if (request.nextUrl.pathname === '/') {
        // Landing page logic or redirect to dashboard/login?
        // For now, let landing page be visible, or redirect to login.
        // If user is logged in, -> dashboard
        if (user) {
            return NextResponse.redirect(new URL('/dashboard', request.url))
        }
        // If not, allow showing landing (or redirect to login since we are building an app, not a landing page yet)
        // I'll leave it falling through to the landing page.
    }

    return response
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * Feel free to modify this pattern to include more paths.
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
