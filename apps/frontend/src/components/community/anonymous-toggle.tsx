'use client';

import { Eye, HatGlasses } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { AnonymousToggleProps } from '@/types/community';

export function AnonymousToggle({
  isAnonymous,
  onToggle,
}: Readonly<AnonymousToggleProps>) {
  const t = useTranslations('community');

  return (
    <div
      className={cn(
        'flex items-center space-x-3 px-3 py-1.5 rounded-full transition-all duration-300',
        isAnonymous
          ? 'bg-primary/10 border-primary/20 shadow-sm shadow-primary/5'
          : 'bg-muted/30 hover:bg-muted/50'
      )}
    >
      <div className="flex items-center space-x-2">
        {isAnonymous ? (
          <HatGlasses className="h-4 w-4 text-primary animate-pulse" />
        ) : (
          <Eye className="h-4 w-4 text-muted-foreground" />
        )}
        <Label
          htmlFor="anonymous-mode"
          className={cn(
            'text-sm font-medium cursor-pointer transition-all duration-300 select-none',
            isAnonymous
              ? 'text-primary font-semibold'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          {isAnonymous ? t('dashboard.postAnonymously') : 'Post publicly'}
        </Label>
      </div>

      <Switch
        id="anonymous-mode"
        checked={isAnonymous}
        onCheckedChange={onToggle}
        className={cn(
          'transition-all duration-300 scale-90',
          'data-[state=checked]:bg-primary data-[state=checked]:border-primary',
          'data-[state=unchecked]:bg-muted data-[state=unchecked]:border-muted-foreground/30',
          'focus-visible:ring-2 focus-visible:ring-primary/20'
        )}
      />
    </div>
  );
}
