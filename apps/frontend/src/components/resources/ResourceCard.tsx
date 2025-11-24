'use client';

import {
  Bookmark,
  CheckCircle,
  Clock,
  Play,
  Eye,
  ExternalLink,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';

import { ResourceMetadata } from '@/components/resources/ResourceMetadata';
import { ResourceProgress } from '@/components/resources/ResourceProgress';
import { ResourceTags } from '@/components/resources/ResourceTags';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import {
  getResourceThumbnail,
  calculateReadTime,
  TYPE_LABELS,
} from '@/lib/utils/resource-helpers';
import type { Resource } from '@/types/resource';

interface ResourceCardProps {
  resource: Resource;
  onBookmark?: (resourceId: string) => void;
  onView?: (resourceId: string) => void;
}

export function ResourceCard({
  resource,
  onBookmark,
}: Readonly<ResourceCardProps>) {
  const t = useTranslations('resources');
  const [isBookmarked, setIsBookmarked] = useState(
    resource.isBookmarked || false
  );

  useEffect(() => {
    setIsBookmarked(resource.isBookmarked || false);
  }, [resource.isBookmarked]);

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
    onBookmark?.(resource.id);
  };

  const actionConfig = {
    VIDEO: {
      icon: Play,
      label: t('dashboard.watch'),
      color: 'text-red-500',
    },
    LINK: {
      icon: ExternalLink,
      label: t('dashboard.visit'),
      color: 'text-blue-500',
    },
    ARTICLE: {
      icon: Eye,
      label: t('dashboard.view'),
      color: 'text-green-500',
    },
  };

  const config = actionConfig[resource.type];
  const TypeIcon = config.icon;

  return (
    <Link href={`/dashboard/resources/${resource.id}`} className="block h-full">
      <Card className="group relative flex h-full flex-col overflow-hidden border border-gray-200 dark:border-border/50 bg-card transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:-translate-y-1">
        <div className="relative aspect-video w-full overflow-hidden bg-muted">
          <img
            src={getResourceThumbnail(resource)}
            alt={resource.title}
            className="h-full w-full object-cover rounded-t-lg transition-transform duration-500 group-hover:scale-105"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

          <div className="absolute left-3 top-3">
            <Badge
              variant="secondary"
              className="bg-background/90 backdrop-blur-sm shadow-sm border-none font-medium"
            >
              <TypeIcon className={cn('mr-1.5 h-3 w-3', config.color)} />
              {TYPE_LABELS[resource.type]}
            </Badge>
          </div>

          <div className="absolute right-3 top-3">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      'h-8 w-8 rounded-full bg-background/90 backdrop-blur-sm shadow-sm transition-colors hover:bg-background',
                      isBookmarked && 'text-primary'
                    )}
                    onClick={handleBookmark}
                  >
                    <Bookmark
                      className={cn(
                        'h-4 w-4 transition-all',
                        isBookmarked && 'fill-current scale-110'
                      )}
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {isBookmarked
                      ? t('dashboard.removeBookmark')
                      : t('dashboard.bookmark')}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {resource.isCompleted && (
            <div className="absolute bottom-3 right-3">
              <Badge className="bg-green-500/90 hover:bg-green-500/90 backdrop-blur-sm border-none text-white gap-1">
                <CheckCircle className="h-3 w-3" />
                {t('dashboard.completed')}
              </Badge>
            </div>
          )}

          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-xs font-medium text-white/90">
            <Clock className="h-3.5 w-3.5" />
            <span>{calculateReadTime(resource)}</span>
          </div>
        </div>

        <CardHeader className="flex-none p-4 pb-2 space-y-2">
          <h3 className="line-clamp-2 text-lg font-semibold leading-tight tracking-tight group-hover:text-primary transition-colors">
            {resource.title}
          </h3>
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {resource.description}
          </p>
        </CardHeader>

        <CardContent className="flex-1 p-4 pt-2 space-y-4">
          <ResourceTags tags={resource.tags} maxVisible={3} />
          {resource.bookmarkProgress !== undefined &&
            resource.bookmarkProgress > 0 && (
              <ResourceProgress progress={resource.bookmarkProgress} />
            )}
        </CardContent>

        <CardFooter className="flex items-center justify-between border-t border-border/50 p-4 bg-muted/5">
          <ResourceMetadata
            author={resource.author}
            createdAt={resource.createdAt}
          />
          <div className="flex items-center text-sm font-medium text-primary opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
            {config.label}
            <ArrowRight className="ml-1 h-4 w-4" />
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
