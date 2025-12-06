'use client';

import { Calendar, Star, MessageSquare } from 'lucide-react';
import { useTranslations } from 'next-intl';
import * as React from 'react';
import { useMemo } from 'react';

import StartsIcons from '@/assets/icons/startsIcons';

export interface HelperStatsData {
  completedSessions: number;
  rating: number | null;
  reviewCount: number;
}

export function useHelperStatsConfig(stats: HelperStatsData | null) {
  const t = useTranslations('helpers.dashboard');

  const helperStats = useMemo(
    () => [
      {
        id: 1,
        icon: Calendar,
        label: t('stats.totalSessions'),
        value: stats?.completedSessions ?? 0,
        change: '',
        changeColor: 'text-muted-foreground',
        bgColor: 'bg-primary/5',
        iconBg: 'bg-primary/10',
        pattern: React.createElement(StartsIcons),
        fromLastWeek: '',
      },
      {
        id: 2,
        icon: Star,
        label: t('stats.averageRating'),
        value: stats?.rating?.toFixed(1) ?? 'N/A',
        change: '',
        changeColor: 'text-muted-foreground',
        bgColor: 'bg-primary/5',
        iconBg: 'bg-primary/10',
        pattern: React.createElement(StartsIcons),
        fromLastWeek: '',
      },
      {
        id: 3,
        icon: MessageSquare,
        label: t('stats.totalReviews'),
        value: stats?.reviewCount ?? 0,
        change: '',
        changeColor: 'text-muted-foreground',
        bgColor: 'bg-primary/5',
        iconBg: 'bg-primary/10',
        pattern: React.createElement(StartsIcons),
        fromLastWeek: '',
      },
    ],
    [stats, t]
  );

  return helperStats;
}
