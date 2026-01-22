import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const TOKEN_KEY = 'fusionxpay_admin_token'

// Routes that don't require authentication
const publicRoutes = ['/login']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get(TOKEN_KEY)?.value

  // Check if it's a public route
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))

  // If no token and trying to access protected route, redirect to login
  if (!token && !isPublicRoute) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // If has token and trying to access login page, redirect to orders
  if (token && pathname === '/login') {
    return NextResponse.redirect(new URL('/orders', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}
