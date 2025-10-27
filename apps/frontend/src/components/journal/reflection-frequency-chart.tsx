'use client';

import { useTranslations, useLocale } from 'next-intl';
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { ChartProps, AnalyticsDataPoint } from '@/types/journal';

const chartConfig = {
  value: {
    label: 'Reflections',
    color: 'hsl(var(--primary))',
  },
};

export function ReflectionFrequencyChart({
  data,
  isLoading,
  isEmpty,
}: ChartProps) {
  const t = useTranslations('journal');
  const locale = useLocale();
  const reflectionData = data as AnalyticsDataPoint[];

  if (isLoading) {
    return (
      <div className="h-[350px] w-full bg-gradient-to-br from-muted/50 to-muted animate-pulse rounded-lg flex items-center justify-center">
        <div className="text-muted-foreground font-medium">
          {t('dashboard.charts.loadingChart')}
        </div>
      </div>
    );
  }

  if (isEmpty || reflectionData?.length === 0) {
    return (
      <div className="h-[350px] w-full border-2 border-dashed border-muted-foreground/20 rounded-lg flex items-center justify-center bg-gradient-to-br from-background to-muted/20">
        <div className="text-center text-muted-foreground space-y-2">
          <div className="text-lg font-semibold">
            {t('dashboard.charts.noDataAvailable')}
          </div>
          <div className="text-sm">
            {t('dashboard.charts.reflectionFrequencyDescription')}
          </div>
        </div>
      </div>
    );
  }

  // Calculate total reflections
  const totalReflections = reflectionData.reduce(
    (sum, point) => sum + point.value,
    0
  );
  const averageReflections = totalReflections / reflectionData.length;

  // Aggregate reflections by day of week for Radar chart
  const dayFormatter = new Intl.DateTimeFormat(locale, { weekday: 'short' });
  const baseSunday = new Date(2024, 0, 7); // A known Sunday to derive localized weekday labels
  const weekdayLabels = Array.from({ length: 7 }, (_, i) =>
    dayFormatter.format(
      new Date(
        baseSunday.getFullYear(),
        baseSunday.getMonth(),
        baseSunday.getDate() + i
      )
    )
  );

  const weekdayCounts = Array(7).fill(0);
  reflectionData.forEach(({ date, value }) => {
    const idx = new Date(date).getDay(); // 0=Sun .. 6=Sat
    weekdayCounts[idx] += value;
  });

  const radarData = weekdayCounts.map((count, i) => ({
    day: weekdayLabels[i],
    value: count,
  }));

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-foreground">
          {t('dashboard.charts.reflectionFrequency')}
        </h3>
        <p className="text-sm text-muted-foreground">
          {t('dashboard.charts.reflectionFrequencyDescription')}
        </p>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span>
            {t('dashboard.charts.total')}: {totalReflections}
          </span>
          <span>•</span>
          <span>
            {t('dashboard.charts.average')}: {averageReflections.toFixed(1)}
          </span>
        </div>
      </div>

      <ChartContainer config={chartConfig} className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart
            data={radarData}
            margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
          >
            <PolarGrid stroke="hsl(var(--border))" strokeOpacity={0.5} />
            <PolarAngleAxis
              dataKey="day"
              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
            />
            <PolarRadiusAxis
              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
              tickFormatter={(value) => `${value}`}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelKey="day"
                  formatter={(value) => [
                    `${value}`,
                    t('dashboard.charts.reflections'),
                  ]}
                  className="bg-background/95 backdrop-blur-sm border shadow-lg"
                />
              }
            />
            <Radar
              name={t('dashboard.charts.reflections')}
              dataKey="value"
              stroke="hsl(var(--primary))"
              fill="hsl(var(--primary))"
              fillOpacity={0.2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}
