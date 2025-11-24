'use client';

import { useTranslations } from 'next-intl';

import { BookmarkCard } from '@/components/resources/BookmarkCard';
import { Card, CardContent } from '@/components/ui/card';
import type { Bookmark } from '@/types/resource';

interface BookmarksTabProps {
  bookmarks: Bookmark[];
  loading: boolean;
  onContinue: (id: string) => void;
}

export function BookmarksTab({
  bookmarks,
  loading,
  onContinue,
}: Readonly<BookmarksTabProps>) {
  const t = useTranslations('resources');

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">{t('dashboard.myBookmarks')}</h2>
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="h-20" />
            </Card>
          ))}
        </div>
      ) : bookmarks.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">
              {t('dashboard.emptyStates.noBookmarks')}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {bookmarks.map((bookmark) => (
            <BookmarkCard
              key={bookmark.id}
              bookmark={bookmark}
              onContinue={() => onContinue(bookmark.resource.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
