import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';

import { routing } from './i18n/routing';

// Define protected routes that require authentication
const protectedRoutes = ['/dashboard', '/profile', '/settings'];

// Define auth routes that should redirect to dashboard if already authenticated
const authRoutes = ['/login', '/register', '/forgot-password'];

// Define public routes that should redirect to dashboard if authenticated
const publicRoutes = ['/', '/home', '/about', '/contact'];

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Extract locale from pathname
  const pathnameIsMissingLocale = routing.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // Get the locale from the pathname or default to 'en'
  let locale = 'en';
  if (!pathnameIsMissingLocale) {
    locale = pathname.split('/')[1];
  }

  // Remove locale from pathname for route checking
  const pathWithoutLocale = pathnameIsMissingLocale
    ? pathname
    : pathname.replace(`/${locale}`, '') || '/';

  // Check if user has authentication token and validate session
  const accessToken = request.cookies.get('access_token');
  const refreshToken = request.cookies.get('refresh_token');
  const csrfToken = request.headers.get('x-csrf-token');

  // Validate CSRF token for state-changing requests
  const isStateChangingRequest = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(
    request.method
  );
  const hasValidCsrfToken =
    csrfToken && csrfToken === request.cookies.get('csrf_token')?.value;

  if (isStateChangingRequest && !hasValidCsrfToken) {
    return new NextResponse('CSRF token validation failed', { status: 403 });
  }

  const isAuthenticated = !!(accessToken && refreshToken);

  // Handle protected routes
  if (protectedRoutes.some((route) => pathWithoutLocale.startsWith(route))) {
    if (!isAuthenticated) {
      const loginUrl = new URL(`/${locale}/login`, request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl, { status: 302 });
    }
  }

  // Handle auth routes (redirect to dashboard if already authenticated)
  if (authRoutes.some((route) => pathWithoutLocale.startsWith(route))) {
    if (isAuthenticated) {
      const dashboardUrl = new URL(`/${locale}/dashboard`, request.url);
      return NextResponse.redirect(dashboardUrl, { status: 302 });
    }
  }

  // Handle public routes (redirect to dashboard if authenticated)
  if (
    publicRoutes.some(
      (route) =>
        pathWithoutLocale === route || pathWithoutLocale.startsWith(route + '/')
    )
  ) {
    if (isAuthenticated) {
      const dashboardUrl = new URL(`/${locale}/dashboard`, request.url);
      return NextResponse.redirect(dashboardUrl, { status: 302 });
    }
  }

  // Apply internationalization middleware
  return intlMiddleware(request);
}

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(ar|en|fr)/:path*'],
};
