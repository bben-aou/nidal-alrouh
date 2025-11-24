'use client';

import { useTranslations } from 'next-intl';

import { ResourceCard } from '@/components/resources/ResourceCard';
import { ResourceSkeleton } from '@/components/resources/ResourceSkeleton';
import { Card, CardContent } from '@/components/ui/card';
import type { Resource } from '@/types/resource';

interface RecommendedTabProps {
  resources: Resource[];
  loading: boolean;
  onBookmark: (id: string) => void;
  onView: (id: string) => void;
}

export function RecommendedTab({
  resources,
  loading,
  onBookmark,
  onView,
}: Readonly<RecommendedTabProps>) {
  const t = useTranslations('resources');

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">
        {t('dashboard.recommendedForYou')}
      </h2>
      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <ResourceSkeleton key={i} />
          ))}
        </div>
      ) : resources.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">
              {t('dashboard.emptyStates.noRecommendations')}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {resources.map((resource) => (
            <ResourceCard
              key={resource.id}
              resource={resource}
              onBookmark={onBookmark}
              onView={onView}
            />
          ))}
        </div>
      )}
    </div>
  );
}
