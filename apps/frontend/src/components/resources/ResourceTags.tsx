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
    <div className="flex flex-wrap gap-1.5">
      {visibleTags.map((tag) => (
        <Badge
          key={tag}
          variant="secondary"
          className="text-[10px] px-1.5 py-0 h-5 font-normal bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
        >
          #{tag}
        </Badge>
      ))}
      {remainingCount > 0 && (
        <Badge
          variant="outline"
          className="text-[10px] px-1.5 py-0 h-5 font-normal text-muted-foreground"
        >
          +{remainingCount}
        </Badge>
      )}
    </div>
  );
}
