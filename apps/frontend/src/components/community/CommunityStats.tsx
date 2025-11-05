'use client';

import { useTranslations } from 'next-intl';

import { useGetCommunityStats } from '@/apis/community/queries';
import { ErrorState } from '@/components/journal/error-state';
import { LoadingState } from '@/components/journal/loading-state';
import { StatCard } from '@/components/journal/stat-card';
import { useCommunityStatsConfig } from '@/hooks/use-community-stats-config';

interface CommunityStatsProps {
  className?: string;
}

export function CommunityStats({ className }: Readonly<CommunityStatsProps>) {
  const t = useTranslations('community');
  const tJournal = useTranslations('journal');
  const { communityStats, isLoading, isError } = useGetCommunityStats();
  const statsConfig = useCommunityStatsConfig(communityStats);

  return (
    <div
      className={`grid gap-6 md:grid-cols-2 lg:grid-cols-4 ${className || ''}`}
    >
      {isLoading && <LoadingState count={4} />}
      {isError && (
        <ErrorState
          count={4}
          errorMessage={t('dashboard.emptyState.loading')}
          tryAgainMessage={tJournal('dashboard.fromLastWeek')}
        />
      )}
      {!isLoading &&
        !isError &&
        statsConfig.map((stat) => (
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
