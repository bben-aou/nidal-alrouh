'use client';

import {
  BookmarkCheck,
  Bookmark,
  CheckCircle,
  Star,
  Clock,
  Play,
  Eye,
} from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { type Resource, getTypeIcon } from '@/lib/mock-data/resources';

interface ResourceCardProps {
  resource: Resource;
  onBookmark?: (resourceId: number) => void;
  onView?: (resourceId: number) => void;
}

export function ResourceCard({
  resource,
  onBookmark,
  // onView,
}: Readonly<ResourceCardProps>) {
  const t = useTranslations('resources');
  const TypeIcon = getTypeIcon(resource.type);

  const handleBookmark = () => {
    onBookmark?.(resource.id);
  };

  // const handleView = () => {
  //   onView?.(resource.id);
  // };

  return (
    <Card className="group hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="text-2xl">{resource.thumbnail}</div>
            <Badge variant="outline" className="text-xs">
              <TypeIcon className="mr-1 h-3 w-3" />
              {resource.type}
            </Badge>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={handleBookmark}
            >
              {resource.isBookmarked ? (
                <BookmarkCheck className="h-4 w-4 text-primary" />
              ) : (
                <Bookmark className="h-4 w-4" />
              )}
            </Button>
            {resource.isCompleted && (
              <CheckCircle className="h-4 w-4 text-green-600" />
            )}
          </div>
        </div>
        <CardTitle className="text-lg line-clamp-2">{resource.title}</CardTitle>
        <CardDescription className="line-clamp-2">
          {resource.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarFallback className="text-xs">
                {resource.author
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>
            <span>{resource.author}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span>{resource.rating}</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{resource.readTime}</span>
          </div>
          <Link href={`/dashboard/resources/${resource.id}`}>
            <Button size="sm">
              {resource.type === 'video' ? (
                <Play className="mr-2 h-3 w-3" />
              ) : (
                <Eye className="mr-2 h-3 w-3" />
              )}
              {t('dashboard.view')}
            </Button>
          </Link>
        </div>
        <div className="flex flex-wrap gap-1">
          {resource.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              #{tag}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
