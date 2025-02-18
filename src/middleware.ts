import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const userData = request.cookies.get('userData')?.value;
  const { pathname } = request.nextUrl;

  // Onboarding paths
  const onboardingPaths = ['/onboarding/step1', '/onboarding/step2', '/onboarding/step3'];
  
  // If user has completed onboarding and tries to access onboarding pages
  if (userData && onboardingPaths.includes(pathname)) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If user hasn't completed onboarding and tries to access protected routes
  if (!userData && !onboardingPaths.includes(pathname) && pathname !== '/') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

// Configure which routes the middleware should run on
export const config = {
  matcher: ['/', '/dashboard/:path*', '/onboarding/:path*', '/workout/:path*']
}; 