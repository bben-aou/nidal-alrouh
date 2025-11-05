'use client';

import {
  Users,
  MessageCircle,
  Heart,
  Calendar,
  LucideIcon,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import React, { useMemo } from 'react';

import StartsIcons from '@/assets/icons/startsIcons';
import { CommunityStatsResponse } from '@/types/community';

export function useCommunityStatsConfig(stats?: CommunityStatsResponse) {
  const t = useTranslations('community');
  const tJournal = useTranslations('journal');

  const formatChange = (change: number): string => {
    if (change > 0) return `+${change}`;
    if (change < 0) return `${change}`;
    return '0';
  };

  const getChangeColor = (change: number): string => {
    if (change > 0) return 'text-emerald-600 dark:text-emerald-400';
    if (change < 0) return 'text-rose-600 dark:text-rose-400';
    return 'text-muted-foreground';
  };

  const communityStats = useMemo(() => {
    if (!stats)
      return [] as Array<{
        id: number;
        icon: LucideIcon;
        label: string;
        value: string | number;
        change: string;
        changeColor: string;
        bgColor: string;
        iconBg: string;
        pattern: React.ReactNode;
        fromLastWeek: string;
      }>;

    return [
      {
        id: 1,
        icon: Users,
        label: t('stats.activeMembers'),
        value: stats.activeMembers,
        change: formatChange(stats.activeMembersChange),
        changeColor: getChangeColor(stats.activeMembersChange),
        bgColor: 'bg-primary/5',
        iconBg: 'bg-primary/10',
        pattern: React.createElement(StartsIcons),
        fromLastWeek: tJournal('dashboard.fromLastWeek'),
      },
      {
        id: 2,
        icon: MessageCircle,
        label: t('stats.todayPosts'),
        value: stats.totalPosts,
        change: formatChange(stats.totalPostsChange),
        changeColor: getChangeColor(stats.totalPostsChange),
        bgColor: 'bg-primary/5',
        iconBg: 'bg-primary/10',
        pattern: React.createElement(StartsIcons),
        fromLastWeek: tJournal('dashboard.fromLastWeek'),
      },
      {
        id: 3,
        icon: Heart,
        label: t('stats.supportGiven'),
        value: stats.totalLikes,
        change: formatChange(stats.totalLikesChange),
        changeColor: getChangeColor(stats.totalLikesChange),
        bgColor: 'bg-primary/5',
        iconBg: 'bg-primary/10',
        pattern: React.createElement(StartsIcons),
        fromLastWeek: tJournal('dashboard.fromLastWeek'),
      },
      {
        id: 4,
        icon: Calendar,
        label: t('stats.upcomingEvents'),
        value: stats.upcomingEvents,
        change: formatChange(stats.upcomingEventsChange),
        changeColor: getChangeColor(stats.upcomingEventsChange),
        bgColor: 'bg-primary/5',
        iconBg: 'bg-primary/10',
        pattern: React.createElement(StartsIcons),
        fromLastWeek: tJournal('dashboard.fromLastWeek'),
      },
    ];
  }, [stats, t, tJournal]);

  return communityStats;
}
