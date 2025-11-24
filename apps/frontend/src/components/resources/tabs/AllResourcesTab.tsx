'use client';

import { Filter, Loader2, Search } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { ResourceCard } from '@/components/resources/ResourceCard';
import { ResourceSkeleton } from '@/components/resources/ResourceSkeleton';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { Resource } from '@/types/resource';

interface AllResourcesTabProps {
  resources: Resource[];
  loading: boolean;
  onBookmark: (id: string) => void;
  onView: (id: string) => void;
  onFilter: () => void;
}

export function AllResourcesTab({
  resources,
  loading,
  onBookmark,
  onView,
  onFilter,
}: Readonly<AllResourcesTabProps>) {
  const t = useTranslations('resources');

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{t('dashboard.allResources')}</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={onFilter}
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="mr-2 h-3 w-3 animate-spin" />
          ) : (
            <Filter className="mr-2 h-3 w-3" />
          )}
          {t('dashboard.filter')}
        </Button>
      </div>
      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <ResourceSkeleton key={i} />
          ))}
        </div>
      ) : resources.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.allResources')}</CardTitle>
            <CardDescription>
              {t('dashboard.allResourcesDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {t('dashboard.browseAllResources')}
              </p>
              <Button className="mt-4" onClick={onFilter}>
                <Search className="mr-2 h-4 w-4" />
                {t('dashboard.exploreAll')}
              </Button>
            </div>
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
