import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Public sayfalar
const publicPaths = ['/', '/login', '/register', '/about'];

// Auth gerektiren sayfalar
const protectedPaths = [ '/workout', '/profile', '/progress'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token');
  const { pathname } = request.nextUrl;

  // Public path kontrolü
  const isPublicPath = publicPaths.some(path => pathname === path || pathname.startsWith(path + '/'));
  
  // Protected path kontrolü
  const isProtectedPath = protectedPaths.some(path => pathname === path || pathname.startsWith(path + '/'));

  // API rotaları için token kontrolü
  if (pathname.startsWith('/api') && !token) {
    return NextResponse.json(
      { message: 'Unauthorized' },
      { status: 401 }
    );
  }

  // Kullanıcı giriş yapmış ve login/register sayfalarına erişmeye çalışıyor
  if (token && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/workout', request.url));
  }

  // Kullanıcı giriş yapmamış ve protected sayfaya erişmeye çalışıyor
  if (!token && isProtectedPath) {
    const redirectUrl = new URL('/login', request.url);
    redirectUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}; 