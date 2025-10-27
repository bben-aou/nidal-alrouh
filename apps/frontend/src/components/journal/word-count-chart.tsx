'use client';

import { useTranslations } from 'next-intl';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { ChartProps, WordsDataPoint } from '@/types/journal';
import { getLocalizedDateFormatter } from '@/utils/date';

const chartConfig = {
  words: {
    label: 'Words',
    color: 'hsl(var(--primary))',
  },
};

export function WordCountChart({ data, isLoading, isEmpty }: ChartProps) {
  const t = useTranslations('journal');
  const wordsData = data as WordsDataPoint[];

  if (isLoading) {
    return (
      <div className="h-[350px] w-full bg-gradient-to-br from-muted/50 to-muted animate-pulse rounded-lg flex items-center justify-center">
        <div className="text-muted-foreground font-medium">
          {t('dashboard.charts.loadingChart')}
        </div>
      </div>
    );
  }

  if (isEmpty || wordsData?.length === 0) {
    return (
      <div className="h-[350px] w-full border-2 border-dashed border-muted-foreground/20 rounded-lg flex items-center justify-center bg-gradient-to-br from-background to-muted/20">
        <div className="text-center text-muted-foreground space-y-2">
          <div className="text-lg font-semibold">
            {t('dashboard.charts.noDataAvailable')}
          </div>
          <div className="text-sm">
            {t('dashboard.charts.wordCountDescription')}
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const { formatDate: localizedFormatDate } = getLocalizedDateFormatter(t);
    return localizedFormatDate(dateString, 'short');
  };

  const formattedData = wordsData.map((point) => ({
    ...point,
    formattedDate: formatDate(point.date),
  }));

  // Calculate statistics
  const totalWords = wordsData.reduce((sum, point) => sum + point.words, 0);
  const averageWords = totalWords / wordsData.length;
  const maxWords = Math.max(...wordsData.map((point) => point.words));
  const minWords = Math.min(...wordsData.map((point) => point.words));

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-foreground">
          {t('dashboard.charts.wordCountTrend')}
        </h3>
        <p className="text-sm text-muted-foreground">
          {t('dashboard.charts.wordCountDescription')}
        </p>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span>
            {t('dashboard.charts.total')}: {totalWords.toLocaleString()}
          </span>
          <span>•</span>
          <span>
            {t('dashboard.charts.average')}: {averageWords.toFixed(0)}
          </span>
          <span>•</span>
          <span>
            {t('dashboard.charts.range')}: {minWords}-{maxWords}
          </span>
        </div>
      </div>

      <ChartContainer config={chartConfig} className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={formattedData}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <defs>
              <linearGradient id="colorWords" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="hsl(var(--primary))"
                  stopOpacity={0.4}
                />
                <stop
                  offset="50%"
                  stopColor="hsl(var(--primary))"
                  stopOpacity={0.2}
                />
                <stop
                  offset="95%"
                  stopColor="hsl(var(--primary))"
                  stopOpacity={0.05}
                />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="formattedDate"
              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
              tickLine={false}
              axisLine={{ stroke: 'hsl(var(--border))', strokeWidth: 1 }}
              tickMargin={8}
            />
            <YAxis
              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
              tickLine={false}
              axisLine={{ stroke: 'hsl(var(--border))', strokeWidth: 1 }}
              tickFormatter={(value) => `${value}`}
              tickMargin={8}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value) => [
                    `${Number(value).toLocaleString()}`,
                    t('dashboard.charts.words'),
                  ]}
                  labelFormatter={(label) =>
                    `${t('dashboard.charts.date')}: ${label}`
                  }
                  className="bg-background/95 backdrop-blur-sm border shadow-lg"
                />
              }
            />
            <ReferenceLine
              y={averageWords}
              stroke="hsl(var(--muted-foreground))"
              strokeDasharray="5 5"
              strokeOpacity={0.6}
              label={{
                value: `${t('dashboard.charts.average')}: ${averageWords.toFixed(0)}`,
                position: 'top',
              }}
            />
            <Area
              type="monotone"
              dataKey="words"
              stroke="hsl(var(--primary))"
              strokeWidth={2.5}
              fill="url(#colorWords)"
              className="hover:opacity-80 transition-opacity"
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}
