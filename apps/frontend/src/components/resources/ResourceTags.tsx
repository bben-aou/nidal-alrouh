'use client';

import { Badge } from '@/components/ui/badge';

interface ResourceTagsProps {
  tags: string[];
  maxVisible?: number;
}

export function ResourceTags({
  tags,
  maxVisible = 3,
}: Readonly<ResourceTagsProps>) {
  const visibleTags = tags.slice(0, maxVisible);
  const remainingCount = tags.length - maxVisible;

  return (
    <div className="flex flex-wrap gap-1">
      {visibleTags.map((tag) => (
        <Badge
          key={tag}
          variant="secondary"
          className="text-xs hover:bg-secondary/80 cursor-pointer transition-colors"
        >
          #{tag}
        </Badge>
      ))}
      {remainingCount > 0 && (
        <Badge variant="secondary" className="text-xs">
          +{remainingCount}
        </Badge>
      )}
    </div>
  );
}
