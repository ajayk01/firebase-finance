import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getIronSession } from 'iron-session';
import { SessionData, sessionOptions } from './lib/session';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const session = await getIronSession<SessionData>(request.cookies, sessionOptions);

  const { isLoggedIn } = session;
  const { pathname } = request.nextUrl;

  const isAuthPage = pathname.startsWith('/login');

  // If user is logged in
  if (isLoggedIn) {
    // and tries to access an auth page, redirect to dashboard
    if (isAuthPage) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    // otherwise, let them proceed
    return response;
  }

  // If user is not logged in
  // and tries to access a protected page, redirect to login
  if (!isAuthPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // and tries to access an auth page, let them proceed
  return response;
}

export const config = {
  // Match all routes except for API routes, static files, and image optimization files
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
