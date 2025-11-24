'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatTimeAgo } from '@/lib/utils/resource-helpers';
import type { Resource } from '@/types/resource';

interface ResourceMetadataProps {
  author: Resource['author'];
  createdAt: string;
}

export function ResourceMetadata({
  author,
  createdAt,
}: Readonly<ResourceMetadataProps>) {
  const initials =
    author.name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase() || 'U';

  return (
    <div className="flex items-center justify-between text-sm text-muted-foreground">
      <div className="flex items-center gap-2">
        <Avatar className="h-6 w-6">
          {author.avatarUrl && <AvatarImage src={author.avatarUrl} />}
          <AvatarFallback className="text-xs">{initials}</AvatarFallback>
        </Avatar>
        <span className="truncate">{author.name || 'Unknown'}</span>
      </div>
      <span className="text-xs">{formatTimeAgo(createdAt)}</span>
    </div>
  );
}
