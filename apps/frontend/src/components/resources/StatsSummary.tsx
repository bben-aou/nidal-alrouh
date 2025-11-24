'use client';

import { useTranslations } from 'next-intl';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { UserResourceStats } from '@/types/resource';

interface StatsSummaryProps {
  stats: UserResourceStats;
}

export function StatsSummary({ stats }: Readonly<StatsSummaryProps>) {
  const t = useTranslations('resources');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">
          {t('dashboard.stats.summary')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold">{stats.totalViews}</div>
            <p className="text-xs text-muted-foreground">
              {t('dashboard.stats.totalViews')}
            </p>
          </div>
          <div>
            <div className="text-2xl font-bold">{stats.bookmarkCount}</div>
            <p className="text-xs text-muted-foreground">
              {t('dashboard.stats.bookmarks')}
            </p>
          </div>
          <div>
            <div className="text-2xl font-bold">{stats.completionCount}</div>
            <p className="text-xs text-muted-foreground">
              {t('dashboard.stats.completed')}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
