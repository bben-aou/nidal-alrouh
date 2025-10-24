'use client';

import { useTranslations } from 'next-intl';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  mockResourceStats,
  type ResourceStats as ResourceStatsType,
} from '@/lib/mock-data/resources';

interface ResourceStatsProps {
  className?: string;
}

export function ResourceStats({ className }: Readonly<ResourceStatsProps>) {
  const t = useTranslations('resources');

  const labels = [
    t('dashboard.stats.articlesRead'),
    t('dashboard.stats.videosWatched'),
    t('dashboard.stats.podcastsListened'),
    t('dashboard.stats.guidesCompleted'),
  ];

  const resourceStats: ResourceStatsType[] = mockResourceStats.map(
    (stat, index) => ({
      ...stat,
      label: labels[index],
    })
  );

  return (
    <div
      className={`grid gap-4 md:grid-cols-2 lg:grid-cols-4 ${className || ''}`}
    >
      {resourceStats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-2xl font-bold">
              {stat.value}/{stat.total}
            </div>
            <Progress value={stat.progress} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {stat.progress}% {t('dashboard.completed')}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
