'use client';

import { ResourceStatsLoading } from '@/components/resources/ResourceStatsLoading';
import { StatCard } from '@/components/resources/StatCard';
import { useResourceStats } from '@/hooks/use-resource-stats';
import { useResourceStatsConfig } from '@/hooks/use-resource-stats-config';

export default function ResourceStats() {
  const { stats, loading } = useResourceStats();

  const resourceStats = useResourceStatsConfig(
    stats || {
      totalViews: 0,
      bookmarkCount: 0,
      completionCount: 0,
      topPreferences: [],
      byType: {
        ARTICLE: { total: 0, completed: 0 },
        VIDEO: { total: 0, completed: 0 },
        LINK: { total: 0, completed: 0 },
      },
    }
  );

  if (loading) {
    return <ResourceStatsLoading />;
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {resourceStats.map((stat) => (
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
          progress={stat.progressValue}
        />
      ))}
    </div>
  );
}
