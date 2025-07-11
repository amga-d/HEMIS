import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // For now, let the client-side auth check handle the authentication
  // This prevents issues with cookie handling between different ports
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
