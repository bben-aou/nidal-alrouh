'use client';

import { useTranslations } from 'next-intl';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CircularProgress } from '@/components/ui/circular-progress';

interface StatCardProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  change: string;
  changeColor: string;
  bgColor: string;
  iconBg: string;
  pattern: React.ReactElement;
  progress: number;
}

export function StatCard({
  icon: Icon,
  label,
  value,
  change,
  changeColor,
  bgColor,
  iconBg,
  pattern,
  progress,
}: Readonly<StatCardProps>) {
  const t = useTranslations('resources');

  return (
    <div className="group relative overflow-hidden rounded-sm transition-all duration-300 hover:scale-[1.02]">
      <Card
        className={`relative h-full border-border/50 ${bgColor} shadow-sm transition-all duration-300 overflow-hidden hover:border-border/80`}
      >
        <div className="absolute inset-0 text-foreground/5 group-hover:text-foreground/10 transition-colors duration-300">
          {pattern}
        </div>

        <CardHeader className="relative flex flex-row items-start justify-between space-y-0 pb-0 pt-6">
          <CardTitle className="text-sm font-semibold text-foreground/90 max-w-xs">
            {label}
          </CardTitle>
          <div
            className={`p-2.5 rounded-xl ${iconBg} border border-border/50 group-hover:scale-105 transition-transform duration-300`}
          >
            <Icon className="h-5 w-5 text-foreground" />
          </div>
        </CardHeader>

        <CardContent className="relative pb-6">
          <div className="flex items-center justify-between gap-8">
            <div className="space-y-1">
              <div className="text-3xl font-bold text-foreground">{value}</div>
              <p className="text-sm font-medium text-muted-foreground">
                <span className={`font-bold ${changeColor}`}>{change}</span>{' '}
                <span>{t('dashboard.completed')}</span>
              </p>
            </div>
            <CircularProgress
              className=" ml-2 -mr-1.5 my-2 self-end"
              value={progress}
              size={56}
              strokeWidth={6}
              indicatorColor={changeColor}
              trackColor="text-muted-foreground/20"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
