'use client';

import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { ResourceCard } from '@/components/resources/ResourceCard';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ResourceApiService } from '@/services/resource-api.service';
import type { Resource } from '@/types/resource';

export function SuggestedResources() {
  const t = useTranslations('dashboard');
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrendingResources = async () => {
      try {
        setLoading(true);
        const data = await ResourceApiService.getTrendingResources(3);
        setResources(data);
      } catch (error) {
        console.error('Failed to fetch trending resources:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingResources();
  }, []);

  const handleBookmark = async (resourceId: string) => {
    try {
      const resource = resources.find((r) => r.id === resourceId);
      if (!resource) return;

      const wasBookmarked = resource.isBookmarked || false;
      await ResourceApiService.toggleBookmark(resourceId, wasBookmarked);

      setResources((prev) =>
        prev.map((r) =>
          r.id === resourceId ? { ...r, isBookmarked: !wasBookmarked } : r
        )
      );
    } catch (error) {
      console.error('Failed to toggle bookmark:', error);
    }
  };

  const handleView = async (resourceId: string) => {
    try {
      await ResourceApiService.recordView(resourceId);
    } catch (error) {
      console.error('Failed to record view:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('suggestedResources.title')}</CardTitle>
        <CardDescription>{t('suggestedResources.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : resources.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-3">
            {resources.map((resource) => (
              <ResourceCard
                key={resource.id}
                resource={resource}
                onBookmark={handleBookmark}
                onView={handleView}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-8">
            {t('suggestedResources.noResources')}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
