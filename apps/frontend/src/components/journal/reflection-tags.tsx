'use client';

import { Tag } from 'lucide-react';

import { Badge } from '@/components/ui/badge';

interface ReflectionTagsProps {
  tags: string[];
}

export function ReflectionTags({ tags }: Readonly<ReflectionTagsProps>) {
  if (tags?.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-1">
      {tags.map((tag: string) => (
        <Badge key={tag} variant="secondary" className="text-xs">
          <Tag className="mr-1 h-2 w-2" />
          {tag}
        </Badge>
      ))}
    </div>
  );
}
