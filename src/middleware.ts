import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
  ADMIN_SESSION_COOKIE,
  verifyAdminSessionToken,
} from './lib/admin-auth';

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === '/admin/login') {
    return NextResponse.next();
  }

  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;

  if (!(await verifyAdminSessionToken(token))) {
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('next', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};
