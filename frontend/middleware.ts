import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Check if the user is trying to access dashboard routes
  if (request.nextUrl.pathname.startsWith('/dashboard') || 
      request.nextUrl.pathname.startsWith('/analytics') ||
      request.nextUrl.pathname.startsWith('/compliance') ||
      request.nextUrl.pathname.startsWith('/finance') ||
      request.nextUrl.pathname.startsWith('/hr')) {
    
    // In a real app, you'd check for a proper authentication token
    // For now, we'll skip the check since we can't access localStorage from middleware
    // The authentication check will be handled client-side
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
