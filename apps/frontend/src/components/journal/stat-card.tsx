'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatCardProps } from '@/types/journal';

export function StatCard({
  icon: IconComponent,
  label,
  value,
  change,
  changeColor,
  bgColor,
  iconBg,
  pattern,
  fromLastWeek,
}: Readonly<StatCardProps>) {
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
            <IconComponent className="h-5 w-5 text-foreground" />
          </div>
        </CardHeader>

        <CardContent className="relative pb-6">
          <div className="space-y-2">
            <div className="text-3xl font-bold text-foreground">{value}</div>
            <p className="text-sm font-medium text-muted-foreground">
              <span className={`font-bold ${changeColor}`}>{change}</span>{' '}
              <span>{fromLastWeek}</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
