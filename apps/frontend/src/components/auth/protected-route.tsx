'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useEffect, ReactNode } from 'react';

import { useAuth, User } from '@/contexts/auth-context';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: User['role'][];
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  allowedRoles,
  redirectTo,
}: Readonly<ProtectedRouteProps>) {
  const {
    user,
    isLoading,
    isAuthenticated,
    sessionExpired,
    clearSessionExpired,
    isLoggingOut,
  } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const computedRedirectTo = redirectTo ?? `/${locale}/login`;

  useEffect(() => {
    if (!isLoading) {
      // If a logout is in progress, skip route guarding redirects
      if (isLoggingOut) {
        return;
      }

      // Handle session expiration
      if (sessionExpired) {
        clearSessionExpired();
        const loginUrl = `${computedRedirectTo}?sessionExpired=true&redirect=${encodeURIComponent(pathname || '/')}`;
        router.push(loginUrl);
        return;
      }

      if (!isAuthenticated) {
        // Redirect to login with original destination
        const loginUrl = `${computedRedirectTo}?redirect=${encodeURIComponent(pathname || '/')}`;
        router.push(loginUrl);
        return;
      }

      if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        router.push('/unauthorized');
        return;
      }
    }
  }, [
    isLoading,
    isAuthenticated,
    user,
    allowedRoles,
    router,
    computedRedirectTo,
    sessionExpired,
    clearSessionExpired,
    pathname,
    isLoggingOut,
  ]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (
    !isAuthenticated ||
    (allowedRoles && user && !allowedRoles.includes(user.role))
  ) {
    return null;
  }

  return <>{children}</>;
}
