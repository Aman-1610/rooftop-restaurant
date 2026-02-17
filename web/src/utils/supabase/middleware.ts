
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
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
                    cookiesToSet.forEach(({ name, value, options }) =>
                        request.cookies.set(name, value)
                    )
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // Get the user from the current session
    const {
        data: { user },
    } = await supabase.auth.getUser()

    // Logic:
    // If no user & not on login page & trying to access protected route (e.g. /admin) -> redirect /login
    // If user & on login page -> redirect /admin

    // Protected Routes: /admin/*
    // Only redirect if we are SURE there is no user.
    // Note: If getUser() refreshed the token, we might lose the new token here if we just redirect.
    // But usually the browser has a valid refresh token, so it might work out or cause a loop.
    // For robustness, ideally we'd transfer cookies.
    if (request.nextUrl.pathname.startsWith('/admin') && !user) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // Auth Routes: /login
    if (request.nextUrl.pathname === '/login' && user) {
        return NextResponse.redirect(new URL('/admin', request.url))
    }

    return supabaseResponse
}
