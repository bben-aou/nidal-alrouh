'use client';

import { X } from 'lucide-react';
import { KeyboardEvent } from 'react';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { TagInputProps } from '@/types/journal';
import { handleTagInputKeyDown } from '@/utils/journal';

export function TagInput({
  tags,
  tagInput,
  onTagInputChange,
  onTagAdd,
  onTagRemove,
  placeholder = 'Add tags...',
  instructionText = 'Press Enter or comma to add tags',
}: TagInputProps) {
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    handleTagInputKeyDown(
      e,
      tagInput,
      tags,
      onTagAdd,
      () => onTagRemove(tags[tags.length - 1]),
      () => onTagInputChange('')
    );
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <div
          className={cn(
            'flex flex-wrap items-center gap-1 min-h-[40px] w-full rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background',
            tags.length > 0 && 'pb-1'
          )}
        >
          {tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="flex items-center gap-1 py-0.5 pl-2 pr-1"
            >
              <span>{tag}</span>
              <button
                type="button"
                onClick={() => onTagRemove(tag)}
                className="ml-1 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remove {tag}</span>
              </button>
            </Badge>
          ))}
          <input
            value={tagInput}
            onChange={(e) => onTagInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={tags.length === 0 ? placeholder : ''}
            className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground min-w-[120px] h-8"
          />
        </div>
        {instructionText && (
          <p className="text-xs text-muted-foreground mt-3 ml-2">
            {instructionText}
          </p>
        )}
      </div>
    </div>
  );
}
