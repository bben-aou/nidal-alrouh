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
    <div className="flex items-center gap-4 text-sm text-muted-foreground">
      <div className="flex items-center gap-2">
        <Avatar className="h-6 w-6 ring-1 ring-border">
          {author.avatarUrl && (
            <AvatarImage src={author.avatarUrl ?? '/default-profile.jpg'} />
          )}
          <AvatarFallback className="text-[10px]">{initials}</AvatarFallback>
        </Avatar>
        <span className="truncate max-w-[100px] font-medium text-foreground/80">
          {author.name || 'Unknown'}
        </span>
      </div>
      <span className="text-xs text-muted-foreground/60">
        {formatTimeAgo(createdAt)}
      </span>
    </div>
  );
}
