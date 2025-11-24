'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function ResourceStatsLoading() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="animate-pulse">
          <CardHeader>
            <div className="h-4 w-20 rounded bg-muted" />
          </CardHeader>
          <CardContent>
            <div className="h-8 w-24 rounded bg-muted" />
            <div className="mt-2 h-2 w-full rounded bg-muted" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
