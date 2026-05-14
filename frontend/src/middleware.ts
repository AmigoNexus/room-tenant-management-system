import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-storage')?.value;
  const { pathname } = request.nextUrl;

  // Simple check for protected routes
  if (!token && (pathname.startsWith('/dashboard') || pathname.startsWith('/properties') || pathname.startsWith('/tenants') || pathname.startsWith('/payments') || pathname.startsWith('/tenant'))) {
    // return NextResponse.redirect(new URL('/auth/login', request.url));
    // Note: Since I'm using client-side Zustand for auth in this demo, 
    // I'll handle protection in the DashboardLayout to avoid cookie complexity here.
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
