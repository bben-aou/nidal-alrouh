'use client';

import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';

interface NavigationItem {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}

interface DesktopNavigationProps {
  navigation: NavigationItem[];
  currentPath?: string;
}

export function DesktopNavigation({
  navigation,
  currentPath,
}: DesktopNavigationProps) {
  return (
    <nav className="hidden lg:flex items-center justify-center gap-1">
      {navigation.map((item) => {
        const isActive = currentPath
          ? item.href === '/dashboard'
            ? currentPath === item.href
            : currentPath === item.href ||
              currentPath.startsWith(item.href + '/')
          : false;
        return (
          <Button
            key={item.href}
            variant="ghost"
            className="relative h-9 px-4 text-sm font-medium transition-all duration-300 hover:bg-primary/5 hover:text-primary data-[active=true]:text-primary data-[active=true]:bg-primary/5"
            data-active={isActive}
            asChild
          >
            <Link href={item.href} className="flex items-center gap-2">
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          </Button>
        );
      })}
    </nav>
  );
}
