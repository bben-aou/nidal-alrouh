'use client';

import { useTranslations } from 'next-intl';

import { useGetJournalStats } from '@/apis/journal/queries/use-get-journal-stats';
import { useJournalStatsConfig } from '@/hooks/use-journal-stats-config';

import { ErrorState } from './error-state';
import { LoadingState } from './loading-state';
import { StatCard } from './stat-card';

export function JournalStats() {
  const t = useTranslations('journal');

  const {
    journalStats: stats,
    isLoading,
    isError,
  } = useGetJournalStats({
    params: { period: 'WEEK' },
  });

  const journalStats = useJournalStatsConfig(
    stats || {
      totalReflections: 0,
      totalReflectionsChange: 0,
      streakDays: 0,
      streakDaysChange: 0,
      avgMood: 0,
      avgMoodChange: 0,
      totalWords: 0,
      totalWordsChange: 0,
    }
  );

  if (isLoading) {
    return <LoadingState />;
  }

  if (isError || !stats) {
    return (
      <ErrorState
        errorMessage={t('dashboard.errorLoading')}
        tryAgainMessage={t('dashboard.tryAgainLater')}
      />
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {journalStats.map((stat) => (
        <StatCard
          key={stat.id}
          icon={stat.icon}
          label={stat.label}
          value={stat.value}
          change={stat.change}
          changeColor={stat.changeColor}
          bgColor={stat.bgColor}
          iconBg={stat.iconBg}
          pattern={stat.pattern}
          fromLastWeek={stat.fromLastWeek}
        />
      ))}
    </div>
  );
}
