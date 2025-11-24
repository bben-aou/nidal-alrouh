'use client';

import {
  Clock,
  Play,
  BookOpen,
  ExternalLink,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import {
  getResourceThumbnail,
  formatTimeAgo,
} from '@/lib/utils/resource-helpers';
import type { Bookmark } from '@/types/resource';

interface BookmarkCardProps {
  bookmark: Bookmark;
  onContinue?: (bookmarkId: string) => void;
  onRemove?: (bookmarkId: string) => void;
}

const TYPE_CONFIG = {
  ARTICLE: { icon: BookOpen, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  VIDEO: { icon: Play, color: 'text-red-500', bg: 'bg-red-500/10' },
  LINK: { icon: ExternalLink, color: 'text-green-500', bg: 'bg-green-500/10' },
};

export function BookmarkCard({
  bookmark,
  onContinue,
}: Readonly<BookmarkCardProps>) {
  const t = useTranslations('resources');
  const config = TYPE_CONFIG[bookmark.resource.type];
  const Icon = config.icon;
  const isCompleted = bookmark.progress === 100;
  const thumbnail = getResourceThumbnail(bookmark.resource);

  return (
    <Link
      href={`/dashboard/resources/${bookmark.resource.id}`}
      className="block group"
    >
      <Card className="relative overflow-hidden border-none bg-card/50 hover:bg-card transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 group-hover:ring-1 group-hover:ring-primary/20">
        <div className="flex gap-4 p-3 sm:p-4">
          <div className="relative h-24 w-32 sm:h-28 sm:w-40 flex-none overflow-hidden rounded-lg bg-muted">
            <img
              src={thumbnail}
              alt={bookmark.resource.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />

            <div className="absolute left-2 top-2">
              <div
                className={cn(
                  'rounded-full p-1.5 backdrop-blur-md bg-black/30 text-white shadow-sm',
                  config.color
                )}
              >
                <Icon className="h-3.5 w-3.5" />
              </div>
            </div>

            {bookmark.progress > 0 && !isCompleted && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${bookmark.progress}%` }}
                />
              </div>
            )}
          </div>

          <div className="flex flex-1 flex-col justify-between py-1">
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                  {bookmark.resource.title}
                </h3>
                {isCompleted && (
                  <CheckCircle2 className="h-5 w-5 text-green-500 flex-none" />
                )}
              </div>

              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <Badge
                  variant="secondary"
                  className="text-[10px] h-5 px-1.5 font-normal bg-secondary/50"
                >
                  {bookmark.resource.type}
                </Badge>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{formatTimeAgo(bookmark.createdAt)}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-2">
              <div className="text-xs font-medium text-muted-foreground">
                {isCompleted ? (
                  <span className="text-green-600 dark:text-green-400">
                    {t('dashboard.completed')}
                  </span>
                ) : bookmark.progress > 0 ? (
                  <span className="text-primary">
                    {bookmark.progress}% {t('dashboard.completed')}
                  </span>
                ) : (
                  <span>
                    {t('dashboard.addedOn')}{' '}
                    {new Date(bookmark.createdAt).toLocaleDateString()}
                  </span>
                )}
              </div>

              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 rounded-full opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
                onClick={(e) => {
                  e.preventDefault();
                  onContinue?.(bookmark.id);
                }}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
