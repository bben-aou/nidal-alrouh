'use client';

import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { type Bookmark, getTypeIcon } from '@/lib/mock-data/resources';

interface BookmarkCardProps {
  bookmark: Bookmark;
  onContinue?: (bookmarkId: string) => void;
  onReview?: (bookmarkId: string) => void;
}

export function BookmarkCard({
  bookmark,
  onContinue,
  onReview,
}: Readonly<BookmarkCardProps>) {
  const t = useTranslations('resources');
  const TypeIcon = getTypeIcon(bookmark.type);

  const handleAction = () => {
    if (bookmark.progress === 100) {
      onReview?.(bookmark.id);
    } else {
      onContinue?.(bookmark.id);
    }
  };

  return (
    <Card>
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <TypeIcon className="h-5 w-5 text-muted-foreground" />
          <div>
            <h3 className="font-medium">{bookmark.title}</h3>
            <p className="text-sm text-muted-foreground">
              {t('dashboard.addedOn')} {bookmark.addedDate}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-sm font-medium">{bookmark.progress}%</div>
            <Progress value={bookmark.progress} className="w-20 h-2" />
          </div>
          <Button size="sm" variant="outline" onClick={handleAction}>
            {bookmark.progress === 100
              ? t('dashboard.review')
              : t('dashboard.continue')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
