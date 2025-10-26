'use client';

import { BarChart3, TrendingUp } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export function JournalAnalyticsTab() {
  const t = useTranslations('journal');

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('dashboard.journalAnalytics')}</CardTitle>
        <CardDescription>{t('dashboard.analyticsDescription')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            {t('dashboard.analyticsComingSoon')}
          </p>
          <Button className="mt-4" variant="outline">
            <TrendingUp className="mr-2 h-4 w-4" />
            {t('dashboard.viewInsights')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
