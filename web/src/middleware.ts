import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const COOKIE_NAME = 'edubot_token';
const protectedPaths = ['/dashboard', '/create-agreement'];
const guestOnlyPaths = ['/login', '/registro'];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const token = request.cookies.get(COOKIE_NAME)?.value;
  const isAuthed = Boolean(token);

  if (protectedPaths.some((p) => pathname.startsWith(p)) && !isAuthed) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (guestOnlyPaths.some((p) => pathname.startsWith(p)) && isAuthed) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/create-agreement/:path*', '/login', '/registro'],
};
