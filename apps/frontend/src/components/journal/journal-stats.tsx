'use client';

import { BookOpen, Calendar, TrendingUp, Clock } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getJournalStats } from '@/lib/mock-data/journal';

export function JournalStats() {
  const t = useTranslations('journal');

  const journalStats = getJournalStats(t, {
    BookOpen,
    Calendar,
    TrendingUp,
    Clock,
  });

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {journalStats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">{stat.change}</span>{' '}
              {t('dashboard.fromLastWeek')}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
