'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface StatCardProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  total: number;
  progress: number;
  color: string;
}

export function StatCard({
  icon: Icon,
  label,
  value,
  total,
  progress,
  color,
}: Readonly<StatCardProps>) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{label}</CardTitle>
        <Icon className={`h-4 w-4 ${color}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {value} / {total}
        </div>
        <Progress value={progress} className="mt-2" />
        <p className="mt-2 text-xs text-muted-foreground">
          {progress.toFixed(0)}% completed
        </p>
      </CardContent>
    </Card>
  );
}
