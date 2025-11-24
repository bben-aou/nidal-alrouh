'use client';

import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';

import { ResourceCard } from '@/components/resources/ResourceCard';
import { ResourceDetailContent } from '@/components/resources/ResourceDetailContent';
import { ResourceDetailHeader } from '@/components/resources/ResourceDetailHeader';
import { ResourceDetailSkeleton } from '@/components/resources/ResourceDetailSkeleton';
import { useResourceDetail } from '@/hooks/use-resource-detail';

export default function ResourceDetailPage() {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const t = useTranslations('resources');

  const {
    resource,
    similarResources,
    loading,
    isBookmarked,
    isCompleted,
    handleBookmark,
    handleComplete,
    handleShare,
  } = useResourceDetail(id);

  if (loading) {
    return <ResourceDetailSkeleton />;
  }

  if (!resource) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <ResourceDetailHeader
        resource={resource}
        isBookmarked={isBookmarked}
        isCompleted={isCompleted}
        onBack={() => router.back()}
        onShare={() => handleShare(t)}
        onBookmark={() => handleBookmark(t)}
        onComplete={() => handleComplete(t)}
        t={t}
      />

      <ResourceDetailContent resource={resource} t={t} />

      {similarResources.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">{t('detail.similarResources')}</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {similarResources.map((item) => (
              <ResourceCard key={item.id} resource={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
