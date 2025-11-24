'use client';

import { Clock, Eye, Play, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { Bookmark } from '@/types/resource';

interface BookmarkCardProps {
  bookmark: Bookmark;
  onContinue?: (bookmarkId: string) => void;
  onRemove?: (bookmarkId: string) => void;
}

const TYPE_ICONS = {
  ARTICLE: BookOpen,
  VIDEO: Play,
  LINK: Eye,
};

export function BookmarkCard({
  bookmark,
  onContinue,
}: Readonly<BookmarkCardProps>) {
  const t = useTranslations('resources');
  const Icon = TYPE_ICONS[bookmark.resource.type];

  const getTimeAgo = (date: string) => {
    const now = new Date();
    const created = new Date(date);
    const diffMs = now.getTime() - created.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return 'Added ' + new Date(date).toLocaleDateString();
  };

  const isCompleted = bookmark.progress === 100;

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="flex items-center justify-between gap-4 p-4">
        <div className="flex flex-1 items-center gap-3">
          <div
            className={`rounded-full p-2 ${isCompleted ? 'bg-green-100 dark:bg-green-900' : 'bg-primary/10'}`}
          >
            <Icon
              className={`h-5 w-5 ${isCompleted ? 'text-green-600 dark:text-green-400' : 'text-primary'}`}
            />
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <h3 className="font-medium line-clamp-1">
                {bookmark.resource.title}
              </h3>
              <Badge variant="outline" className="text-xs">
                {bookmark.resource.type}
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{getTimeAgo(bookmark.createdAt)}</span>
              </div>
              <span>•</span>
              <span className="font-medium">{bookmark.progress}% complete</span>
            </div>
            {bookmark.progress > 0 && bookmark.progress < 100 && (
              <Progress value={bookmark.progress} className="h-1.5" />
            )}
          </div>
        </div>
        <Link href={`/dashboard/resources/${bookmark.resource.id}`}>
          <Button
            size="sm"
            variant={isCompleted ? 'outline' : 'default'}
            onClick={() => onContinue?.(bookmark.id)}
          >
            <Eye className="mr-2 h-3 w-3" />
            {isCompleted ? t('dashboard.review') : t('dashboard.continue')}
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
