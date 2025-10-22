'use client';

import { useRouter, usePathname } from 'next/navigation';
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
  redirectTo = '/login',
}: ProtectedRouteProps) {
  const {
    user,
    isLoading,
    isAuthenticated,
    sessionExpired,
    clearSessionExpired,
  } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading) {
      // Handle session expiration
      if (sessionExpired) {
        // Clear the session expired flag and redirect to login with session expired message
        clearSessionExpired();
        const loginUrl = `${redirectTo}?sessionExpired=true&redirect=${encodeURIComponent(pathname || '/')}`;
        router.push(loginUrl);
        return;
      }

      if (!isAuthenticated) {
        // Redirect to login with original destination
        const loginUrl = `${redirectTo}?redirect=${encodeURIComponent(pathname || '/')}`;
        router.push(loginUrl);
        return;
      }

      if (requiredRole && user?.role !== requiredRole) {
        // Redirect to unauthorized page or dashboard
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
    redirectTo,
    sessionExpired,
    clearSessionExpired,
    pathname,
  ]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Don't render children if not authenticated or doesn't have required role
  if (!isAuthenticated || (requiredRole && user?.role !== requiredRole)) {
    return null;
  }

  return <>{children}</>;
}
