'use client';

import { BarChart3, TrendingUp, FileText, Flame } from 'lucide-react';

import { AnalyticsSummaryProps } from '@/types/journal';

import { StatCard } from './stat-card';

export function AnalyticsSummary({
  data,
  comparison,
  isLoading = false,
}: AnalyticsSummaryProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-24 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  const formatChange = (value?: number) => {
    if (value === undefined) return '+0%';
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(1)}`;
  };

  const getChangeColor = (value?: number) => {
    if (value === undefined || value === 0) return 'text-muted-foreground';
    return value >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const summaryStats = [
    {
      icon: BarChart3,
      label: 'Total Reflections',
      value: data.totalReflections,
      change: formatChange(comparison?.reflectionsChange),
      changeColor: getChangeColor(comparison?.reflectionsChange),
      bgColor: 'bg-primary/5 dark:bg-primary/10',
      iconBg: 'bg-primary/10 dark:bg-primary/20',
      pattern: null,
      fromLastWeek: 'from last period',
    },
    {
      icon: TrendingUp,
      label: 'Average Mood',
      value: data.averageMood.toFixed(1),
      change: formatChange(comparison?.moodChange),
      changeColor: getChangeColor(comparison?.moodChange),
      bgColor: 'bg-secondary/5 dark:bg-secondary/10',
      iconBg: 'bg-secondary/10 dark:bg-secondary/20',
      pattern: null,
      fromLastWeek: 'from last period',
    },
    {
      icon: FileText,
      label: 'Total Words',
      value: data.totalWords.toLocaleString(),
      change: formatChange(comparison?.wordsChange),
      changeColor: getChangeColor(comparison?.wordsChange),
      bgColor: 'bg-accent/20 dark:bg-accent/30',
      iconBg: 'bg-accent/30 dark:bg-accent/40',
      pattern: null,
      fromLastWeek: 'from last period',
    },
    {
      icon: Flame,
      label: 'Streak Days',
      value: data.streakDays,
      change: '+0',
      changeColor: 'text-muted-foreground',
      bgColor: 'bg-muted/50 dark:bg-muted/70',
      iconBg: 'bg-muted/70 dark:bg-muted/90',
      pattern: null,
      fromLastWeek: 'from last period',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {summaryStats.map((stat, index) => (
        <StatCard
          key={index}
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
  );
}
