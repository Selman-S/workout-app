import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Public paths that don't require authentication
const publicPaths = ['/login', '/register', '/', '/about'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token');
  const path = request.nextUrl.pathname;

  // Check if the current path is a public path
  const isPublicPath = publicPaths.some(publicPath => path.startsWith(publicPath));

  // If no token and trying to access protected route
  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If has token and trying to access auth pages
  if (token && (path.startsWith('/login') || path.startsWith('/register'))) {
    return NextResponse.redirect(new URL('/workout', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}; 