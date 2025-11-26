'use client';

import { Menu } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { VisuallyHidden } from '@/components/ui/visually-hidden';
import { Link } from '@/i18n/navigation';

interface NavigationItem {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}

interface MobileMenuProps {
  navigation: NavigationItem[];
}

export function MobileMenu({ navigation }: Readonly<MobileMenuProps>) {
  const t = useTranslations('dashboard');
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild className="lg:hidden">
        <Button variant="ghost" size="icon" className="-ml-2 h-9 w-9 shrink-0">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80">
        <VisuallyHidden>
          <SheetTitle>{t('mobileMenu.title')}</SheetTitle>
        </VisuallyHidden>
        <div className="mt-8 flex flex-col gap-6">
          {navigation.map((item) => (
            <Button
              key={item.href}
              variant="ghost"
              className="justify-start h-12 text-base hover:bg-primary/5"
              asChild
              onClick={() => setOpen(false)}
            >
              <Link href={item.href} className="flex items-center gap-3">
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            </Button>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
