'use client';

import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { BookmarkCard } from '@/components/resources/BookmarkCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { Bookmark } from '@/types/resource';

interface BookmarksTabProps {
  bookmarks: Bookmark[];
  loading: boolean;
  onContinue: (id: string) => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
  loadingMore?: boolean;
}

export function BookmarksTab({
  bookmarks,
  loading,
  onContinue,
  onLoadMore,
  hasMore = false,
  loadingMore = false,
}: Readonly<BookmarksTabProps>) {
  const t = useTranslations('resources');

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">{t('dashboard.myBookmarks')}</h2>
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="h-28" />
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
        <>
          <div className="space-y-3">
            {bookmarks.map((bookmark) => (
              <BookmarkCard
                key={bookmark.id}
                bookmark={bookmark}
                onContinue={() => onContinue(bookmark.resource.id)}
              />
            ))}
          </div>

          {hasMore && onLoadMore && (
            <div className="flex justify-center pt-4">
              <Button
                onClick={onLoadMore}
                disabled={loadingMore}
                variant="outline"
                size="lg"
              >
                {loadingMore ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  'Load More'
                )}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
