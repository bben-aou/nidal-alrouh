'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useEffect, ReactNode } from 'react';

import { useAuth } from '@/contexts/auth-context';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'USER' | 'SEEKER' | 'HELPER' | 'ADMIN';
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  requiredRole,
  redirectTo,
}: ProtectedRouteProps) {
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

      if (requiredRole && user?.role !== requiredRole) {
        router.push('/unauthorized');
        return;
      }
    }
  }, [
    isLoading,
    isAuthenticated,
    user,
    requiredRole,
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

  if (!isAuthenticated || (requiredRole && user?.role !== requiredRole)) {
    return null;
  }

  return <>{children}</>;
}
