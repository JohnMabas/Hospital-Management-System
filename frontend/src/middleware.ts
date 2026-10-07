import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PATIENT_ROUTES = ['/dashboard/patient'];
const DOCTOR_ROUTES = ['/dashboard/doctor'];
const ADMIN_ROUTES = ['/dashboard/admin'];
const AUTH_ROUTES = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Read auth state from cookie (we store a minimal flag)
  // Note: Full JWT verification should happen server-side; here we just check presence
  const refreshCookie = request.cookies.get('carebridge_refresh_token');
  const isLoggedIn = !!refreshCookie;

  // Redirect logged-in users away from auth pages
  if (isLoggedIn && AUTH_ROUTES.some((r) => pathname.startsWith(r))) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Protected routes: redirect to login if not authenticated
  const isProtected =
    PATIENT_ROUTES.some((r) => pathname.startsWith(r)) ||
    DOCTOR_ROUTES.some((r) => pathname.startsWith(r)) ||
    ADMIN_ROUTES.some((r) => pathname.startsWith(r));

  if (isProtected && !isLoggedIn) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/login',
    '/register',
  ],
};
