'use client';

import { PenSquare, MessageCircle, BookOpen } from 'lucide-react';
import { useTranslations } from 'next-intl';

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

  const quickActions = [
    {
      icon: PenSquare,
      label: t('quickActionsCards.writeJournal.label'),
      href: '/journal',
      description: t('quickActionsCards.writeJournal.description'),
    },
    {
      icon: MessageCircle,
      label: t('quickActionsCards.joinChat.label'),
      href: '/community',
      description: t('quickActionsCards.joinChat.description'),
    },
    {
      icon: BookOpen,
      label: t('quickActionsCards.browseResources.label'),
      href: '/resources',
      description: t('quickActionsCards.browseResources.description'),
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {quickActions.map((action) => (
        <Card key={action.label} className="group relative overflow-hidden">
          <CardHeader>
            <div className="flex items-center gap-2">
              <action.icon className="h-5 w-5 text-primary" />
              <CardTitle>{action.label}</CardTitle>
            </div>
            <CardDescription>{action.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href={action.href}>
                {t('quickActionsCards.getStarted')}
              </Link>
            </Button>
          </CardContent>
          <div className="absolute inset-0 rounded-lg transition-colors group-hover:bg-primary/5" />
        </Card>
      ))}
    </div>
  );
}
