'use client';

import { User } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { useGetMyHelperStats } from '@/apis/helpers/queries';
import { SessionsList } from '@/components/helpers/sessions-list';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function HelperDashboardPage() {
  const t = useTranslations('helpers.dashboard');
  const { stats } = useGetMyHelperStats();

  return (
    <div className="container py-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
        <Button variant="outline" asChild>
          <Link href={`/helpers/${stats ? 'me' : ''}`}>
            <User className="mr-2 h-4 w-4" />
            {t('viewProfile')}
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('stats.totalSessions')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.completedSessions ?? 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('stats.averageRating')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.rating?.toFixed(1) ?? 'N/A'}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('stats.totalReviews')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.reviewCount ?? 0}</div>
          </CardContent>
        </Card>
      </div>

      <SessionsList />
    </div>
  );
}
