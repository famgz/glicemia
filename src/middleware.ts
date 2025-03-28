import { NextResponse } from 'next/server';

import { auth } from '@/auth';

const protectedRoutes = ['/logs', '/profile'];

function isRouteProtected(pathname: string) {
  return protectedRoutes.some(
    (protectedRoute) =>
      pathname === protectedRoute || pathname.startsWith(`${protectedRoute}/`)
  );
}

export default auth((req) => {
  const pathname = req.nextUrl.pathname;
  const user = req.auth?.user;

  console.log('[middleware]', { pathname, auth: req.auth });

  // redirect if already logged in
  if (user && pathname.startsWith('/login')) {
    return NextResponse.redirect(new URL('/user', req.nextUrl.origin));
  }

  // redirect if not logged in
  if (!user && isRouteProtected(pathname)) {
    const loginUrl = new URL('/login', req.nextUrl.origin);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
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
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
