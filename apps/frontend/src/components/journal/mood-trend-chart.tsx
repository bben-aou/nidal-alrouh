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
import { ChartProps, MoodDataPoint } from '@/types/journal';
import { getLocalizedDateFormatter } from '@/utils/date';

const chartConfig = {
  mood: {
    label: 'Mood',
    color: 'hsl(var(--primary))',
  },
};

// Mood level mappings with colors and labels using project palette
const moodLevels = {
  1: {
    label: 'Very Sad',
    color: 'hsl(var(--destructive))',
    bgColor: 'hsl(var(--destructive) / 0.1)',
  },
  2: {
    label: 'Sad',
    color: 'hsl(30 47% 65%)',
    bgColor: 'hsl(30 47% 65% / 0.1)',
  }, // Accent-dark variant
  3: {
    label: 'Neutral',
    color: 'hsl(var(--muted-foreground))',
    bgColor: 'hsl(var(--muted))',
  },
  4: {
    label: 'Good',
    color: 'hsl(var(--secondary))',
    bgColor: 'hsl(var(--secondary) / 0.1)',
  },
  5: {
    label: 'Excellent',
    color: 'hsl(var(--primary))',
    bgColor: 'hsl(var(--primary) / 0.1)',
  },
};

export function MoodTrendChart({ data, isLoading, isEmpty }: ChartProps) {
  const t = useTranslations('journal');
  const moodData = data as MoodDataPoint[];

  if (isLoading) {
    return (
      <div className="h-[350px] w-full bg-gradient-to-br from-muted/50 to-muted animate-pulse rounded-lg flex items-center justify-center">
        <div className="text-muted-foreground font-medium">
          {t('dashboard.charts.loadingChart')}
        </div>
      </div>
    );
  }

  if (isEmpty || moodData?.length === 0) {
    return (
      <div className="h-[350px] w-full border-2 border-dashed border-muted-foreground/20 rounded-lg flex items-center justify-center bg-gradient-to-br from-background to-muted/20">
        <div className="text-center text-muted-foreground space-y-2">
          <div className="text-lg font-semibold">
            {t('dashboard.charts.noDataAvailable')}
          </div>
          <div className="text-sm">
            {t('dashboard.charts.moodTrendDescription')}
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const { formatDate: localizedFormatDate } = getLocalizedDateFormatter(t);
    return localizedFormatDate(dateString, 'short');
  };

  const getMoodLabel = (moodValue: number) => {
    const roundedMood = Math.round(moodValue);
    const moodKeys = ['verySad', 'sad', 'neutral', 'good', 'excellent'];
    const moodKey = moodKeys[roundedMood - 1];
    return moodKey
      ? t(`dashboard.chartMoods.${moodKey}`)
      : t('dashboard.chartMoods.neutral');
  };

  const getMoodColor = (moodValue: number) => {
    const roundedMood = Math.round(moodValue);
    return (
      moodLevels[roundedMood as keyof typeof moodLevels]?.color || '#6b7280'
    );
  };

  const formattedData = moodData.map((point) => ({
    ...point,
    formattedDate: formatDate(point.date),
    moodLabel: getMoodLabel(point.mood),
    moodColor: getMoodColor(point.mood),
  }));

  // Calculate average mood for reference line
  const averageMood =
    moodData.reduce((sum, point) => sum + point.mood, 0) / moodData.length;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-foreground">
          {t('dashboard.charts.moodTrend')}
        </h3>
        <p className="text-sm text-muted-foreground">
          {t('dashboard.charts.moodTrendDescription')}
        </p>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span>
            {t('dashboard.charts.average')}: {averageMood.toFixed(1)}
          </span>
          <span>•</span>
          <span>
            {moodData.length} {t('dashboard.charts.reflections').toLowerCase()}
          </span>
        </div>
      </div>

      {/* Mood Scale Legend */}
      <div className="flex flex-wrap gap-2 p-3 bg-muted/30 rounded-lg">
        {Object.entries(moodLevels).map(([level, config]) => (
          <div key={level} className="flex items-center gap-1.5 text-xs">
            <div
              className="w-3 h-3 rounded-full border-2 border-white shadow-sm"
              style={{ backgroundColor: config.color }}
            />
            <span className="font-medium">{level}</span>
            <span className="text-muted-foreground">
              {getMoodLabel(Number(level))}
            </span>
          </div>
        ))}
      </div>

      <ChartContainer config={chartConfig} className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={formattedData}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <defs>
              <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="hsl(var(--primary))"
                  stopOpacity={0.3}
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
              domain={[0.5, 5.5]}
              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
              tickLine={false}
              axisLine={{ stroke: 'hsl(var(--border))', strokeWidth: 1 }}
              tickFormatter={(value) => `${value}`}
              ticks={[1, 2, 3, 4, 5]}
              tickMargin={8}
            />

            {/* Average mood reference line */}
            <ReferenceLine
              y={averageMood}
              stroke="hsl(var(--muted-foreground))"
              strokeDasharray="5 5"
              strokeWidth={1}
              label={{
                value: `Avg: ${averageMood.toFixed(1)}`,
                position: 'top',
                fontSize: 10,
                fill: 'hsl(var(--muted-foreground))',
              }}
            />

            {/* Mood level reference lines */}
            {[1, 2, 3, 4, 5].map((level) => (
              <ReferenceLine
                key={level}
                y={level}
                stroke={moodLevels[level as keyof typeof moodLevels].color}
                strokeOpacity={0.1}
                strokeWidth={1}
              />
            ))}

            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value) => [
                    `${Number(value).toFixed(1)} - ${getMoodLabel(Number(value))}`,
                    t('dashboard.charts.mood'),
                  ]}
                  labelFormatter={(label) =>
                    `${t('dashboard.charts.date')}: ${label}`
                  }
                  className="bg-background/95 backdrop-blur-sm border shadow-lg"
                />
              }
            />

            <Area
              type="monotone"
              dataKey="mood"
              stroke="hsl(var(--primary))"
              strokeWidth={3}
              fill="url(#moodGradient)"
              dot={{
                fill: 'hsl(var(--primary))',
                strokeWidth: 2,
                r: 4,
                stroke: 'hsl(var(--background))',
              }}
              activeDot={{
                r: 7,
                stroke: 'hsl(var(--primary))',
                strokeWidth: 3,
                fill: 'hsl(var(--background))',
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}
