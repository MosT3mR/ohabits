import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // List of public routes that don't require authentication
  const publicRoutes = ['/login', '/signup', '/auth/callback']
  const isPublicRoute = publicRoutes.some(route => req.nextUrl.pathname.startsWith(route))

  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession()

    // If there's an error getting the session or no session, and trying to access a protected route
    if ((!session || error) && !isPublicRoute) {
      // Clear any invalid session data
      await supabase.auth.signOut()
      
      const redirectUrl = req.nextUrl.clone()
      redirectUrl.pathname = '/login'
      redirectUrl.searchParams.delete('error')
      redirectUrl.searchParams.delete('message')
      return NextResponse.redirect(redirectUrl)
    }

    // If there's a session and trying to access login/signup
    if (session && isPublicRoute) {
      const redirectUrl = req.nextUrl.clone()
      redirectUrl.pathname = '/'
      return NextResponse.redirect(redirectUrl)
    }

    return res
  } catch {
    // If there's an error, redirect to login
    if (!isPublicRoute) {
      const redirectUrl = req.nextUrl.clone()
      redirectUrl.pathname = '/login'
      return NextResponse.redirect(redirectUrl)
    }
    return res
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - svg (svg files)
     * - public files (public/*)
     * - api routes that don't require auth
     */
    '/((?!_next/static|_next/image|favicon\\.ico|svg|public|api/public).*)',
  ],
} 