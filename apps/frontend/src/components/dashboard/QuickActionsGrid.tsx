'use client';

import { PenSquare, MessageCircle, BookOpen, Sparkles } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
        bgColor: 'bg-card',
        iconBg: 'bg-blue-500/10',
        pattern: (
          <svg className="opacity-50" width="100%" height="100%">
            <defs>
              <pattern
                id="journal-pattern"
                x="0"
                y="0"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="20" cy="20" r="1" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#journal-pattern)" />
          </svg>
        ),
      },
      {
        icon: MessageCircle,
        label: t('quickActionsCards.joinChat.label'),
        href: '/dashboard/community',
        description: t('quickActionsCards.joinChat.description'),
        bgColor: 'bg-card',
        iconBg: 'bg-green-500/10',
        pattern: (
          <svg className="opacity-50" width="100%" height="100%">
            <defs>
              <pattern
                id="chat-pattern"
                x="0"
                y="0"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M0 20h40M20 0v40"
                  stroke="currentColor"
                  strokeWidth="0.5"
                  fill="none"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#chat-pattern)" />
          </svg>
        ),
      },
      {
        icon: BookOpen,
        label: t('quickActionsCards.browseResources.label'),
        href: '/dashboard/resources',
        description: t('quickActionsCards.browseResources.description'),
        bgColor: 'bg-card',
        iconBg: 'bg-purple-500/10',
        pattern: (
          <svg className="opacity-50" width="100%" height="100%">
            <defs>
              <pattern
                id="resources-pattern"
                x="0"
                y="0"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <rect
                  x="15"
                  y="15"
                  width="10"
                  height="10"
                  fill="currentColor"
                  opacity="0.3"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#resources-pattern)" />
          </svg>
        ),
      },
    ],
    [t]
  );

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {memorizedQuickActions.map((action) => (
        <div
          key={action.label}
          className="group relative overflow-hidden rounded-sm transition-all duration-300 hover:scale-[1.02]"
        >
          <Card
            className={`relative h-full border-border/50 ${action.bgColor} shadow-sm transition-all duration-300 overflow-hidden hover:border-border/80`}
          >
            <div className="absolute inset-0 text-foreground/5 group-hover:text-foreground/10 transition-colors duration-300">
              {action.pattern}
            </div>

            <CardHeader className="relative flex flex-row items-start justify-between space-y-0 pb-3 pt-6">
              <div className="flex-1">
                <CardTitle className="text-sm font-semibold text-foreground/90 mb-2">
                  {action.label}
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  {action.description}
                </p>
              </div>
              <div
                className={`p-2.5 rounded-xl ${action.iconBg} border border-border/50 group-hover:scale-105 transition-transform duration-300 ml-3`}
              >
                <action.icon className="h-5 w-5 text-foreground" />
              </div>
            </CardHeader>

            <CardContent className="relative pb-6">
              <Button asChild className="w-full" size="sm">
                <Link href={action.href} className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  {t('quickActionsCards.getStarted')}
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
}
