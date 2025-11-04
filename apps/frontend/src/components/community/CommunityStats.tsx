'use client';

import { Users, MessageCircle, Calendar, Heart } from 'lucide-react';
import { useTranslations } from 'next-intl';

import StartsIcons from '@/assets/icons/startsIcons';
import { StatCard } from '@/components/journal/stat-card';
import { mockCommunityStats } from '@/lib/mock-data/community';
import { type CommunityStats } from '@/types/community';

interface CommunityStatsProps {
  className?: string;
}

export function CommunityStats({ className }: Readonly<CommunityStatsProps>) {
  const t = useTranslations('community');
  const tJournal = useTranslations('journal');

  const icons = [Users, MessageCircle, Heart, Calendar];
  const labels = [
    t('stats.activeMembers'),
    t('stats.todayPosts'),
    t('stats.supportGiven'),
    t('stats.upcomingEvents'),
  ];

  const communityStats: CommunityStats[] = mockCommunityStats.map(
    (stat, index) => ({
      ...stat,
      icon: icons[index],
      label: labels[index],
    })
  );

  const getChangeColor = (change: string) => {
    const trimmed = change.trim();
    if (trimmed.startsWith('+')) {
      return 'text-emerald-600 dark:text-emerald-400';
    }
    if (trimmed.startsWith('-')) {
      return 'text-rose-600 dark:text-rose-400';
    }
    return 'text-muted-foreground';
  };

  return (
    <div
      className={`grid gap-6 md:grid-cols-2 lg:grid-cols-4 ${className || ''}`}
    >
      {communityStats.map((stat, index) => (
        <StatCard
          key={index}
          icon={stat.icon}
          label={stat.label}
          value={stat.value}
          change={stat.change}
          changeColor={getChangeColor(stat.change)}
          bgColor="bg-primary/5"
          iconBg="bg-primary/10"
          pattern={<StartsIcons />}
          fromLastWeek={tJournal('dashboard.fromLastWeek')}
        />
      ))}
    </div>
  );
}
