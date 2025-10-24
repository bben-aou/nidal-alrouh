'use client';

import {
  Home,
  MessageCircle,
  BookOpen,
  PenSquare,
  LifeBuoy,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ReactNode } from 'react';

import { ProtectedRoute } from '@/components/auth/protected-route';
import { Header } from '@/components/dashboard/header';
import { useAuth } from '@/contexts/auth-context';
import { usePathname } from '@/i18n/navigation';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const t = useTranslations('dashboard');
  const currentPath = usePathname();

  const handleLogout = async () => {
    await logout();
  };

  const navigation = [
    { href: '/dashboard', icon: Home, label: t('nav.home') },
    {
      href: '/dashboard/community',
      icon: MessageCircle,
      label: t('nav.community'),
    },
    { href: '/dashboard/resources', icon: BookOpen, label: t('nav.resources') },
    { href: '/dashboard/journal', icon: PenSquare, label: t('nav.journal') },
    { href: '/dashboard/help', icon: LifeBuoy, label: t('nav.help') },
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Header
          navigation={navigation}
          user={user}
          onLogout={handleLogout}
          currentPath={currentPath}
        />

        <main className="container py-6 lg:py-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
