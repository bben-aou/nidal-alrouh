'use client';

import { Sparkles, Flame, Smile, Zap } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React, { useMemo } from 'react';

import FlameIcon from '@/assets/icons/flameIcon';
import MoodIcon from '@/assets/icons/moodIcon';
import StartsIcons from '@/assets/icons/startsIcons';
import ThunderIcon from '@/assets/icons/thunderIcon';
import { JournalStatsData } from '@/types/journal';

export function useJournalStatsConfig(stats: JournalStatsData) {
  const t = useTranslations('journal');

  // Format change values with proper sign
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

  const journalStats = useMemo(
    () => [
      {
        id: 1,
        icon: Sparkles,
        label: t('dashboard.stats.totalReflections'),
        value: stats.totalReflections,
        change: formatChange(stats.totalReflectionsChange),
        changeColor: getChangeColor(stats.totalReflectionsChange),
        bgColor: 'bg-primary/5',
        iconBg: 'bg-primary/10',
        pattern: React.createElement(StartsIcons),
        fromLastWeek: t('dashboard.fromLastWeek'),
      },
      {
        id: 2,
        icon: Flame,
        label: t('dashboard.stats.streakDays'),
        value: stats.streakDays.toString(),
        change: formatChange(stats.streakDaysChange),
        changeColor: getChangeColor(stats.streakDaysChange),
        bgColor: 'bg-primary/5',
        iconBg: 'bg-primary/10',
        pattern: React.createElement(FlameIcon),
        fromLastWeek: t('dashboard.fromLastWeek'),
      },
      {
        id: 3,
        icon: Smile,
        label: t('dashboard.stats.avgMood'),
        value: stats.avgMood.toFixed(1),
        change: formatChange(Number(stats.avgMoodChange.toFixed(1))),
        changeColor: getChangeColor(stats.avgMoodChange),
        bgColor: 'bg-primary/5',
        iconBg: 'bg-primary/10',
        pattern: React.createElement(MoodIcon),
        fromLastWeek: t('dashboard.fromLastWeek'),
      },
      {
        id: 4,
        icon: Zap,
        label: t('dashboard.stats.totalWords'),
        value: stats.totalWords.toLocaleString(),
        change: formatChange(stats.totalWordsChange),
        changeColor: getChangeColor(stats.totalWordsChange),
        bgColor: 'bg-primary/5',
        iconBg: 'bg-primary/10',
        pattern: React.createElement(ThunderIcon),
        fromLastWeek: t('dashboard.fromLastWeek'),
      },
    ],
    [stats, t]
  );

  return journalStats;
}
