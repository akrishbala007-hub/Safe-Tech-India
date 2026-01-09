
import { createServerClient, type CookieOptions } from '@supabase/ssr'
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
                get(name: string) {
                    return request.cookies.get(name)?.value
                },
                set(name: string, value: string, options: CookieOptions) {
                    request.cookies.set({
                        name,
                        value,
                        ...options,
                    })
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    response.cookies.set({
                        name,
                        value,
                        ...options,
                    })
                },
                remove(name: string, options: CookieOptions) {
                    request.cookies.set({
                        name,
                        value: '',
                        ...options,
                    })
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    response.cookies.set({
                        name,
                        value: '',
                        ...options,
                    })
                },
            },
        }
    )

    let user = null
    try {
        const { data, error } = await supabase.auth.getUser()
        if (error) {
            // If the error is 'AuthApiError: Invalid Refresh Token', we should probably ignore it 
            // and treat as signed out, rather than crashing or throwing 500.
            console.error('Middleware Auth Error:', error.message)
        }
        user = data?.user ?? null
    } catch (err) {
        console.error('Middleware Unexpected Error:', err)
        // Treat as signed out
    }

    // Protect /dashboard routes
    if (request.nextUrl.pathname.startsWith('/dashboard')) {
        if (!user) {
            return NextResponse.redirect(new URL('/login', request.url))
        }

        // Check user role and subscription status
        const { data: profile } = await supabase
            .from('profiles')
            .select('role, subscription_status')
            .eq('id', user.id)
            .single()

        // Only dealers and service engineers need active subscription
        // Regular users can access dashboard without subscription
        if (profile && (profile.role === 'dealer' || profile.role === 'service_engineer')) {
            if (profile.subscription_status !== 'active' && profile.subscription_status !== 'pending') {
                return NextResponse.redirect(new URL('/register?error=subscription_required', request.url))
            }
        }
    }

    // Protect /admin routes
    if (request.nextUrl.pathname.startsWith('/admin')) {
        if (!user) {
            return NextResponse.redirect(new URL('/login', request.url))
        }

        // Check if admin
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()

        if (!profile || profile.role !== 'admin') {
            return NextResponse.redirect(new URL('/', request.url))
        }
    }

    return response
}

export const config = {
    matcher: ['/dashboard/:path*', '/admin/:path*'],
}
