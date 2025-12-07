'use client';

import { User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect } from 'react';

import { useGetMyHelperStats } from '@/apis/helpers/queries';
import { SessionsList } from '@/components/helpers/sessions-list';
import { StatCard } from '@/components/journal/stat-card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth-context';
import { useHelperStatsConfig } from '@/hooks/use-helper-stats-config';
import { TUserRole } from '@/types/user';

export default function HelperDashboardPage() {
  const t = useTranslations('helpers.dashboard');
  const { user } = useAuth();
  const isHelper = user?.role === TUserRole.HELPER;
  const locale = useLocale();
  const router = useRouter();

  useEffect(() => {
    if (user && !isHelper) {
      router.replace(`/${locale}/dashboard`);
    }
  }, [user, isHelper, router, locale]);

  const { stats } = useGetMyHelperStats({ enabled: isHelper });
  const helperStats = useHelperStatsConfig(stats ?? null);

  if (user && !isHelper) {
    return null;
  }

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
