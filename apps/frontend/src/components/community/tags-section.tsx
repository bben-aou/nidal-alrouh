'use client';

import { Hash, X } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { TagsSectionProps } from '@/types/community';

export function TagsSection({
  tags,
  tagInput,
  isTagInputFocused,
  error,
  onRemoveTag,
  onTagInputKeyDown,
  onTagInputBlur,
  onTagInputFocus,
  onTagInputChange,
}: Readonly<TagsSectionProps>) {
  const t = useTranslations('community');

  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-2">
        <Hash className="h-4 w-4 text-muted-foreground" />
        <Label className="text-sm font-medium text-muted-foreground">
          {t('dashboard.tags')}
        </Label>
      </div>

      <div
        className={cn(
          'flex flex-wrap items-center gap-2 p-3 rounded-lg border transition-all duration-200',
          isTagInputFocused
            ? 'border-primary/50 bg-background shadow-sm'
            : 'border-border bg-muted/30',
          error && 'border-destructive'
        )}
      >
        {tags.map((tag, index) => (
          <Badge
            key={tag.concat(new Date().toISOString())}
            variant="secondary"
            className="group flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary hover:bg-primary/20 transition-colors duration-200"
          >
            #{tag}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0 hover:bg-destructive/20 hover:text-destructive opacity-0 group-hover:opacity-100 transition-all duration-200"
              onClick={() => onRemoveTag(index)}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}

        {tags.length < 5 && (
          <Input
            placeholder={
              tags.length === 0
                ? t('dashboard.tagsPlaceholder')
                : t('dashboard.addMoreTags')
            }
            value={tagInput}
            onChange={onTagInputChange}
            onKeyDown={onTagInputKeyDown}
            onFocus={onTagInputFocus}
            onBlur={onTagInputBlur}
            className="border-0 outline-none shadow-none rounded-none bg-transparent p-0 h-auto focus-visible:ring-0 focus-visible:outline-none focus:outline-none focus:border-0 placeholder:text-muted-foreground/60 flex-1 min-w-[120px]"
          />
        )}
      </div>

      <div className="space-y-1">
        <p className="text-xs text-muted-foreground">
          {t('dashboard.tagsInstruction')} ({tags.length}/5)
        </p>
        {error && <p className="text-sm text-destructive">{error.message}</p>}
      </div>
    </div>
  );
}
