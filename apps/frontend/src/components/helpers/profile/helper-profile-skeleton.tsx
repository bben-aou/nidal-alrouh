'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const HelperProfileSkeleton = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <Skeleton className="h-10 w-32 mb-6" />
        <Card>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr_auto] gap-8">
              <Skeleton className="w-32 h-32 rounded-full" />
              <div className="space-y-4">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-6 w-64" />
                <Skeleton className="h-20 w-full" />
              </div>
              <div className="space-y-4">
                <Skeleton className="h-12 w-48" />
                <Skeleton className="h-24 w-full" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HelperProfileSkeleton;
