'use client';

import { Settings } from 'lucide-react';

import LanguageSwitcher from '@/components/LanguageSwitcher';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';

import { DesktopNavigation } from './desktop-navigation';
import { Logo } from './logo';
import { MobileMenu } from './mobile-menu';
import { UserProfileDropdown } from './user-profile-dropdown';

interface NavigationItem {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}

interface User {
  name?: string;
  email?: string;
  avatar?: string;
}

interface HeaderProps {
  navigation: NavigationItem[];
  user: User | null;
  onLogout: () => void;
  currentPath?: string;
}

export function Header({
  navigation,
  user,
  onLogout,
  currentPath,
}: Readonly<HeaderProps>) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
          <MobileMenu navigation={navigation} />
          <Logo />
        </div>

        <DesktopNavigation navigation={navigation} currentPath={currentPath} />

        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-full hover:bg-primary/5 hover:text-primary transition-colors"
            asChild
          >
            <Link href="/settings">
              <Settings className="h-4 w-4" />
            </Link>
          </Button>

          <UserProfileDropdown user={user} onLogout={onLogout} />
        </div>
      </div>
    </header>
  );
}
