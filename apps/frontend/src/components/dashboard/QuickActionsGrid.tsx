'use client';

import { PenSquare, MessageCircle, BookOpen } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Link } from '@/i18n/navigation';

export function QuickActionsGrid() {
  const t = useTranslations('dashboard');

  const memorizedQuickActions = useMemo(
    () => [
      {
        icon: PenSquare,
        label: t('quickActionsCards.writeJournal.label'),
        href: '/dashboard/journal',
        description: t('quickActionsCards.writeJournal.description'),
      },
      {
        icon: MessageCircle,
        label: t('quickActionsCards.joinChat.label'),
        href: '/dashboard/community',
        description: t('quickActionsCards.joinChat.description'),
      },
      {
        icon: BookOpen,
        label: t('quickActionsCards.browseResources.label'),
        href: '/dashboard/resources',
        description: t('quickActionsCards.browseResources.description'),
      },
    ],
    [t]
  );

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {memorizedQuickActions.map((action) => (
        <Card key={action.label} className="group relative overflow-hidden">
          <CardHeader>
            <div className="flex items-center gap-2">
              <action.icon className="h-5 w-5 text-primary" />
              <CardTitle>{action.label}</CardTitle>
            </div>
            <CardDescription>{action.description}</CardDescription>
          </CardHeader>
          <CardContent className="relative z-10">
            <Button asChild className="w-full">
              <Link href={action.href}>
                {t('quickActionsCards.getStarted')}
              </Link>
            </Button>
          </CardContent>
          <div className="absolute inset-0 rounded-lg transition-colors group-hover:bg-primary/5 pointer-events-none" />
        </Card>
      ))}
    </div>
  );
}
