import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const TOKEN_KEY = 'fusionxpay_admin_token'
const USER_KEY = 'fusionxpay_admin_user'

// Routes that don't require authentication
// Use exact match for root, startsWith for others
const publicRoutesExact = ['/']
const publicRoutesPrefix = ['/login', '/register', '/docs']

function parseUserRole(request: NextRequest): 'ADMIN' | 'MERCHANT' | null {
  const raw = request.cookies.get(USER_KEY)?.value
  if (!raw) return null
  try {
    const decoded = decodeURIComponent(raw)
    const user = JSON.parse(decoded) as { role?: 'ADMIN' | 'MERCHANT' }
    return user.role ?? null
  } catch {
    return null
  }
}

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl
  const token = request.cookies.get(TOKEN_KEY)?.value
  const role = parseUserRole(request)

  // Check if it's a public route (exact match for root, prefix match for others)
  const isPublicRoute =
    publicRoutesExact.includes(pathname) ||
    publicRoutesPrefix.some(route => pathname.startsWith(route))

  // If no token and trying to access protected route, redirect to login
  if (!token && !isPublicRoute) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', `${pathname}${search}`)
    return NextResponse.redirect(loginUrl)
  }

  // If has token and trying to access auth pages, redirect to default area.
  if (token && (pathname === '/login' || pathname === '/register')) {
    const redirect = request.nextUrl.searchParams.get('redirect')
    if (pathname === '/login' && redirect) {
      return NextResponse.redirect(new URL(redirect, request.url))
    }
    return NextResponse.redirect(new URL(role === 'ADMIN' ? '/dashboard' : '/orders', request.url))
  }

  // Merchant users should not access admin dashboard routes.
  if (token && role === 'MERCHANT' && pathname.startsWith('/dashboard')) {
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
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg$).*)',
  ],
}
