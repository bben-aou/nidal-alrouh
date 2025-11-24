'use client';

import { BookOpen, Video, FileText } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { ResourceStatsLoading } from '@/components/resources/ResourceStatsLoading';
import { StatCard } from '@/components/resources/StatCard';
import { StatsSummary } from '@/components/resources/StatsSummary';
import { useResourceStats } from '@/hooks/use-resource-stats';

export default function ResourceStats() {
  const t = useTranslations('resources');
  const { stats, loading } = useResourceStats();

  if (loading) {
    return <ResourceStatsLoading />;
  }

  if (!stats) {
    return null;
  }

  const statsData = [
    {
      icon: BookOpen,
      label: t('dashboard.stats.articles'),
      value: stats.byType.ARTICLE.completed,
      total: stats.byType.ARTICLE.total || 1,
      progress: stats.byType.ARTICLE.total
        ? (stats.byType.ARTICLE.completed / stats.byType.ARTICLE.total) * 100
        : 0,
      color: 'text-blue-600',
    },
    {
      icon: Video,
      label: t('dashboard.stats.videos'),
      value: stats.byType.VIDEO.completed,
      total: stats.byType.VIDEO.total || 1,
      progress: stats.byType.VIDEO.total
        ? (stats.byType.VIDEO.completed / stats.byType.VIDEO.total) * 100
        : 0,
      color: 'text-red-600',
    },
    {
      icon: FileText,
      label: t('dashboard.stats.links'),
      value: stats.byType.LINK.completed,
      total: stats.byType.LINK.total || 1,
      progress: stats.byType.LINK.total
        ? (stats.byType.LINK.completed / stats.byType.LINK.total) * 100
        : 0,
      color: 'text-green-600',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {statsData.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>
      <StatsSummary stats={stats} />
    </div>
  );
}
