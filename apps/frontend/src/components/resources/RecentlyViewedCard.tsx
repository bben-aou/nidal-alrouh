'use client';

import { Clock, Eye, BookOpen, Video, FileText } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { RecentlyViewedItem } from '@/types/resource';

interface RecentlyViewedCardProps {
  item: RecentlyViewedItem;
  onView?: (itemId: string) => void;
}

const TYPE_ICONS = {
  ARTICLE: BookOpen,
  VIDEO: Video,
  LINK: FileText,
};

export function RecentlyViewedCard({
  item,
  onView,
}: Readonly<RecentlyViewedCardProps>) {
  const t = useTranslations('resources');
  const Icon = TYPE_ICONS[item.type];

  // Format date
  const getTimeAgo = (date: string) => {
    const now = new Date();
    const viewed = new Date(date);
    const diffMs = now.getTime() - viewed.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 60) return `${diffMinutes} min ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
  };

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3 flex-1">
          <Icon className="h-5 w-5 text-muted-foreground" />
          <div className="flex-1">
            <h3 className="font-medium line-clamp-1">{item.title}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{getTimeAgo(item.viewedAt)}</span>
              <span>•</span>
              <Badge variant="outline" className="text-xs">
                {item.type}
              </Badge>
            </div>
          </div>
        </div>
        <Link href={`/dashboard/resources/${item.id}`}>
          <Button size="sm" variant="outline" onClick={() => onView?.(item.id)}>
            <Eye className="mr-2 h-3 w-3" />
            {t('dashboard.view')}
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
