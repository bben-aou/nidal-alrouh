'use client';

import { BookOpen, Video, FileText, Bookmark } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React, { useMemo } from 'react';

import BookIcon from '@/assets/icons/bookIcon';
import BookmarkIcon from '@/assets/icons/bookmarkIcon';
import LinkIcon from '@/assets/icons/linkIcon';
import VideoIcon from '@/assets/icons/videoIcon';
import type { UserResourceStats } from '@/types/resource';

export function useResourceStatsConfig(stats: UserResourceStats) {
  const t = useTranslations('resources');

  const resourceStats = useMemo(
    () => [
      {
        id: 1,
        icon: BookOpen,
        label: t('dashboard.stats.articles'),
        value: `${stats.byType.ARTICLE.completed} / ${stats.byType.ARTICLE.total}`,
        progress: stats.byType.ARTICLE.total
          ? (stats.byType.ARTICLE.completed / stats.byType.ARTICLE.total) * 100
          : 0,
        change: `${(stats.byType.ARTICLE.total ? (stats.byType.ARTICLE.completed / stats.byType.ARTICLE.total) * 100 : 0).toFixed(0)}%`,
        changeColor: 'text-blue-600 dark:text-blue-400',
        bgColor: 'bg-primary/5',
        iconBg: 'bg-primary/10',
        pattern: React.createElement(BookIcon),
        progressValue: stats.byType.ARTICLE.total
          ? (stats.byType.ARTICLE.completed / stats.byType.ARTICLE.total) * 100
          : 0,
      },
      {
        id: 2,
        icon: Video,
        label: t('dashboard.stats.videos'),
        value: `${stats.byType.VIDEO.completed} / ${stats.byType.VIDEO.total}`,
        progress: stats.byType.VIDEO.total
          ? (stats.byType.VIDEO.completed / stats.byType.VIDEO.total) * 100
          : 0,
        change: `${(stats.byType.VIDEO.total ? (stats.byType.VIDEO.completed / stats.byType.VIDEO.total) * 100 : 0).toFixed(0)}%`,
        changeColor: 'text-red-600 dark:text-red-400',
        bgColor: 'bg-primary/5',
        iconBg: 'bg-primary/10',
        pattern: React.createElement(VideoIcon),
        progressValue: stats.byType.VIDEO.total
          ? (stats.byType.VIDEO.completed / stats.byType.VIDEO.total) * 100
          : 0,
      },
      {
        id: 3,
        icon: FileText,
        label: t('dashboard.stats.links'),
        value: `${stats.byType.LINK.completed} / ${stats.byType.LINK.total}`,
        progress: stats.byType.LINK.total
          ? (stats.byType.LINK.completed / stats.byType.LINK.total) * 100
          : 0,
        change: `${(stats.byType.LINK.total ? (stats.byType.LINK.completed / stats.byType.LINK.total) * 100 : 0).toFixed(0)}%`,
        changeColor: 'text-green-600 dark:text-green-400',
        bgColor: 'bg-primary/5',
        iconBg: 'bg-primary/10',
        pattern: React.createElement(LinkIcon),
        progressValue: stats.byType.LINK.total
          ? (stats.byType.LINK.completed / stats.byType.LINK.total) * 100
          : 0,
      },
      {
        id: 4,
        icon: Bookmark,
        label: t('dashboard.stats.totalBookmarks'),
        value: stats.bookmarkCount.toString(),
        progress: 100,
        change: `${stats.bookmarkCount}`,
        changeColor: 'text-amber-600 dark:text-amber-400',
        bgColor: 'bg-primary/5',
        iconBg: 'bg-primary/10',
        pattern: React.createElement(BookmarkIcon),
        progressValue: 100,
      },
    ],
    [stats, t]
  );

  return resourceStats;
}
