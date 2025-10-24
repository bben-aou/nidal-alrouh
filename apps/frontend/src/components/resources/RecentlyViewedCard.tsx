'use client';

import { Clock, Eye } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  type RecentlyViewedItem,
  getTypeIcon,
} from '@/lib/mock-data/resources';

interface RecentlyViewedCardProps {
  item: RecentlyViewedItem;
  onView?: (itemId: number) => void;
}

export function RecentlyViewedCard({
  item,
  onView,
}: Readonly<RecentlyViewedCardProps>) {
  const t = useTranslations('resources');
  const TypeIcon = getTypeIcon(item.type);

  const handleView = () => {
    onView?.(item.id);
  };

  return (
    <Card>
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <TypeIcon className="h-5 w-5 text-muted-foreground" />
          <div>
            <h3 className="font-medium">{item.title}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{item.viewedDate}</span>
            </div>
          </div>
        </div>
        <Button size="sm" variant="outline" onClick={handleView}>
          <Eye className="mr-2 h-3 w-3" />
          {t('dashboard.view')}
        </Button>
      </CardContent>
    </Card>
  );
}
