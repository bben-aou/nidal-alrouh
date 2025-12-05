'use client';

import {
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  Calendar,
  CheckCircle,
  Circle,
  Clock,
  Share2,
} from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import type { Resource } from '@/types/resource';

interface ResourceDetailHeaderProps {
  resource: Resource;
  isBookmarked: boolean;
  isCompleted: boolean;
  onBack: () => void;
  onShare: () => void;
  onBookmark: () => void;
  onComplete: () => void;
  t: (key: string) => string;
}

export function ResourceDetailHeader({
  resource,
  isBookmarked,
  isCompleted,
  onBack,
  onShare,
  onBookmark,
  onComplete,
  t,
}: Readonly<ResourceDetailHeaderProps>) {
  const readTime =
    resource.type === 'ARTICLE'
      ? Math.ceil((resource.content?.split(' ').length || 0) / 200)
      : 0;

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        size="sm"
        className="pl-0 hover:pl-2 transition-all"
        onClick={onBack}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        {t('detail.backToResources')}
      </Button>

      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{resource.type}</Badge>
          {resource.tags.map((tag) => (
            <Badge key={tag} variant="outline">
              #{tag}
            </Badge>
          ))}
        </div>

        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {resource.title}
        </h1>

        <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={resource.author.avatarUrl ?? '/default-profile.jpg'}
                />
                <AvatarFallback>
                  {resource.author.name?.[0] || 'U'}
                </AvatarFallback>
              </Avatar>
              <span className="font-medium text-foreground">
                {resource.author.name}
              </span>
            </div>
            <Separator orientation="vertical" className="h-4" />
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{new Date(resource.createdAt).toLocaleDateString()}</span>
            </div>
            {resource.type === 'ARTICLE' && readTime > 0 && (
              <>
                <Separator orientation="vertical" className="h-4" />
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>
                    {readTime} {t('detail.minRead')}
                  </span>
                </div>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onShare}>
              <Share2 className="mr-2 h-4 w-4" />
              {t('detail.share')}
            </Button>
            <Button
              variant={isBookmarked ? 'secondary' : 'outline'}
              size="sm"
              onClick={onBookmark}
            >
              {isBookmarked ? (
                <BookmarkCheck className="mr-2 h-4 w-4 text-primary" />
              ) : (
                <Bookmark className="mr-2 h-4 w-4" />
              )}
              {t(isBookmarked ? 'detail.saved' : 'detail.save')}
            </Button>
            <Button
              variant={isCompleted ? 'default' : 'outline'}
              size="sm"
              onClick={onComplete}
              disabled={isCompleted}
              className={isCompleted ? 'bg-green-600 hover:bg-green-700' : ''}
            >
              {isCompleted ? (
                <CheckCircle className="mr-2 h-4 w-4" />
              ) : (
                <Circle className="mr-2 h-4 w-4" />
              )}
              {t(isCompleted ? 'detail.completed' : 'detail.markComplete')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
