'use client';

import { AlertCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState, useMemo } from 'react';

import { useGetJournalAnalytics } from '@/apis/journal/queries/use-get-journal-analytics';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { TimeRange } from '@/types/journal';

import { AnalyticsControls } from './analytics-controls';
import { MoodTrendChart } from './mood-trend-chart';
import { ReflectionFrequencyChart } from './reflection-frequency-chart';
import { WordCountChart } from './word-count-chart';

export function JournalAnalyticsTab() {
  const t = useTranslations('journal');

  // Default time range: last 30 days
  const [timeRange, setTimeRange] = useState<TimeRange>({
    preset: '30D',
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0],
    end: new Date().toISOString().split('T')[0],
    granularity: 'day',
  });

  const {
    data: analyticsData,
    isLoading,
    error,
  } = useGetJournalAnalytics({
    params: {
      startDate: timeRange.start,
      endDate: timeRange.end,
      granularity: timeRange.granularity,
    },
  });

  const isEmpty = useMemo(() => {
    if (!analyticsData) return true;
    return (
      analyticsData.activityData.length === 0 &&
      analyticsData.moodData.length === 0 &&
      analyticsData.wordsData.length === 0
    );
  }, [analyticsData]);

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('dashboard.journalAnalytics')}</CardTitle>
          <CardDescription>
            {t('dashboard.analyticsDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {t('dashboard.errorLoading')}. {t('dashboard.tryAgainLater')}.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t('dashboard.journalAnalytics')}</CardTitle>
          <CardDescription>
            {t('dashboard.analyticsDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AnalyticsControls
            timeRange={timeRange}
            onTimeRangeChange={setTimeRange}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <ReflectionFrequencyChart
              data={analyticsData?.activityData || []}
              isLoading={isLoading}
              isEmpty={isEmpty}
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <MoodTrendChart
              data={analyticsData?.moodData || []}
              isLoading={isLoading}
              isEmpty={isEmpty}
            />
          </CardContent>
        </Card>
      </div>

      {/* Word Count Chart - Full Width */}
      <Card>
        <CardContent className="p-6">
          <WordCountChart
            data={analyticsData?.wordsData || []}
            isLoading={isLoading}
            isEmpty={isEmpty}
          />
        </CardContent>
      </Card>
    </div>
  );
}
