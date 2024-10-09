import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function middleware(request: NextRequest) {
  // Redirect only if the request is to the root path ("/")
  if (request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  // Allow access to other pages without redirecting
  return NextResponse.next();
}

export const config = {
  // Apply the middleware to all paths
  matcher: '/:path*',
};
