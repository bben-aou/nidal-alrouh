'use client';

import { LoadingStateProps } from '@/types/journal';

export function LoadingState({ count = 4 }: Readonly<LoadingStateProps>) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="h-56 bg-muted animate-pulse rounded-3xl" />
      ))}
    </div>
  );
}
