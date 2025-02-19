import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Public paths that don't require authentication
const publicPaths = ['/login', '/register', '/', '/about'];

// Protected paths that require authentication
const protectedPaths = [
  '/workout',
  '/profile',
  '/settings',
  '/onboarding'
];

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get('token');

  // API rotalarını ve statik dosyaları atla
  if (path.startsWith('/api') || 
      path.startsWith('/_next') || 
      path.includes('favicon.ico')) {
    return NextResponse.next();
  }

  // İstek public bir path için mi kontrol et
  const isPublicPath = publicPaths.some(publicPath => path === publicPath);
  
  // İstek korumalı bir path için mi kontrol et
  const isProtectedPath = protectedPaths.some(protectedPath => path.startsWith(protectedPath));

  // Eğer path public değilse ve korumalı bir path ise ve token yoksa
  if (!isPublicPath && isProtectedPath && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Eğer token varsa ve auth sayfalarına erişmeye çalışıyorsa
  if (token && (path === '/login' || path === '/register')) {
    return NextResponse.redirect(new URL('/workout', request.url));
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
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}; 