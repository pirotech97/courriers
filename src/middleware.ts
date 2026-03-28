import { auth } from '@/auth.config';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// Protected admin routes
const protectedRoutes = ['/admin/dashboard', '/admin/users', '/admin/settings'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

  if (isProtectedRoute) {
    // Get session using callback-based approach
    const session = await auth();

    // Check if user is authenticated and is admin
    if (!session || !(session.user as any)?.isAdmin) {
      // Redirect to login with callback URL
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
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
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png|.*\\.svg|.*\\.jpg|.*\\.jpeg|public).*)',
  ],
};
