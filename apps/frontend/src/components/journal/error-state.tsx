'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ErrorStateProps } from '@/types/journal';

export function ErrorState({
  count = 4,
  errorMessage = 'Error loading',
  tryAgainMessage = 'Try again later',
}: Readonly<ErrorStateProps>) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index} className="border-destructive/50 rounded-3xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-destructive">
              {errorMessage}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">--</div>
            <p className="text-xs text-muted-foreground">{tryAgainMessage}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
