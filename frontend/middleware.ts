import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Check if the user is trying to access dashboard routes
  if (request.nextUrl.pathname.startsWith('/dashboard') || 
      request.nextUrl.pathname.startsWith('/analytics') ||
      request.nextUrl.pathname.startsWith('/compliance') ||
      request.nextUrl.pathname.startsWith('/finance') ||
      request.nextUrl.pathname.startsWith('/hr')) {
    
    // Check for JWT token in cookies
    const token = request.cookies.get('jwt')?.value
    
    if (!token) {
      // No token found, redirect to landing page
      return NextResponse.redirect(new URL('/landing', request.url))
    }
    
    // Token exists, allow access (detailed validation happens client-side)
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/analytics/:path*',
    '/compliance/:path*',
    '/finance/:path*',
    '/hr/:path*'
  ]
}
