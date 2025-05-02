import { NextResponse } from 'next/server';

import { auth } from '@/auth';
import { COOKIES_TIMEZONE_STRING, DEFAULT_TIMEZONE } from '@/constants/time';

const publicRoutes = ['/', '/user', '/login'];

function isPublicRoute(pathname: string) {
  return publicRoutes.some(
    (protectedRoute) =>
      pathname === protectedRoute || pathname.startsWith(`${protectedRoute}/`)
  );
}

export default auth((req) => {
  const pathname = req.nextUrl.pathname;
  const user = req.auth?.user;
  const timeZone =
    req.cookies.get(COOKIES_TIMEZONE_STRING)?.value || DEFAULT_TIMEZONE;

  console.log('[middleware]', { pathname, auth: req.auth, timeZone });

  // redirect if already logged in
  if (user && pathname.startsWith('/login')) {
    return NextResponse.redirect(new URL('/logs', req.nextUrl.origin));
  }

  // redirect if not logged in
  if (!user && !isPublicRoute(pathname)) {
    const loginUrl = new URL('/login', req.nextUrl.origin);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  const response = NextResponse.next();
  // response.headers.set(HEADERS_TIMEZONE_STRING, timeZone);
  return response;
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|icon.png).*)',
  ],
};
