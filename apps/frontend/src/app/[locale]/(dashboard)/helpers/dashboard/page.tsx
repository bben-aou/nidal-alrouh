'use client';

import { User } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { useGetMyHelperStats } from '@/apis/helpers/queries';
import { SessionsList } from '@/components/helpers/sessions-list';
import { StatCard } from '@/components/journal/stat-card';
import { Button } from '@/components/ui/button';
import { useHelperStatsConfig } from '@/hooks/use-helper-stats-config';

export default function HelperDashboardPage() {
  const t = useTranslations('helpers.dashboard');
  const { stats } = useGetMyHelperStats();
  const helperStats = useHelperStatsConfig(stats ?? null);

  return (
    <div className="container pb-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
          <p className="text-muted-foreground mt-1">{t('subtitle')}</p>
        </div>
        <Button variant="outline" asChild className="gap-2">
          <Link href={`/helpers/${stats ? 'me' : ''}`}>
            <User className="h-4 w-4" />
            {t('viewProfile')}
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {helperStats.map((stat) => (
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

      <SessionsList />
    </div>
  );
}
