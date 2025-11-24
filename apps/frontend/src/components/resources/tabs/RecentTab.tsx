'use client';

import { useTranslations } from 'next-intl';

import { RecentlyViewedCard } from '@/components/resources/RecentlyViewedCard';
import { Card, CardContent } from '@/components/ui/card';
import type { RecentlyViewedItem } from '@/types/resource';

interface RecentTabProps {
  items: RecentlyViewedItem[];
  loading: boolean;
  onView: (id: string) => void;
}

export function RecentTab({
  items,
  loading,
  onView,
}: Readonly<RecentTabProps>) {
  const t = useTranslations('resources');

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">{t('dashboard.recentlyViewed')}</h2>
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="h-16" />
            </Card>
          ))}
        </div>
      ) : items.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">
              {t('dashboard.emptyStates.noRecentViews')}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <RecentlyViewedCard key={item.id} item={item} onView={onView} />
          ))}
        </div>
      )}
    </div>
  );
}
