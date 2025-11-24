'use client';

import { Bookmark, CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

import { ResourceActions } from '@/components/resources/ResourceActions';
import { ResourceMetadata } from '@/components/resources/ResourceMetadata';
import { ResourceProgress } from '@/components/resources/ResourceProgress';
import { ResourceTags } from '@/components/resources/ResourceTags';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import {
  getResourceThumbnail,
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
  const [isBookmarked, setIsBookmarked] = useState(
    resource.isBookmarked || false
  );

  useEffect(() => {
    setIsBookmarked(resource.isBookmarked || false);
  }, [resource.isBookmarked]);

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    onBookmark?.(resource.id);
  };

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg hover:scale-[1.02] duration-300">
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <img
            src={getResourceThumbnail(resource)}
            alt={resource.title}
            className="h-20 w-20 flex-shrink-0 rounded-md object-cover"
          />
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                'h-8 w-8 p-0 transition-transform hover:scale-110',
                isBookmarked && 'bg-accent text-accent-foreground'
              )}
              onClick={handleBookmark}
            >
              <Bookmark
                className={cn('h-4 w-4', isBookmarked && 'fill-current')}
              />
            </Button>
            {resource.isCompleted && (
              <CheckCircle className="h-4 w-4 text-green-600 animate-in zoom-in" />
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Badge variant="outline" className="text-xs w-fit">
            {TYPE_LABELS[resource.type]}
          </Badge>
          <CardTitle className="text-lg line-clamp-2 leading-snug">
            {resource.title}
          </CardTitle>
          <CardDescription className="line-clamp-2">
            {resource.description}
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <ResourceMetadata
          author={resource.author}
          createdAt={resource.createdAt}
        />
        <ResourceActions resource={resource} />
        <ResourceProgress progress={resource.bookmarkProgress || 0} />
        <ResourceTags tags={resource.tags} />
      </CardContent>
    </Card>
  );
}
