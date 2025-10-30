'use client';

import { useTranslations } from 'next-intl';

import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { PostContentInputProps } from '@/types/community';

export function PostContentInput({
  register,
  error,
}: Readonly<PostContentInputProps>) {
  const t = useTranslations('community');

  return (
    <div className="space-y-2">
      <Textarea
        {...register}
        placeholder={t('dashboard.postPlaceholder')}
        className={cn(
          'min-h-[120px]',
          error && 'border-destructive focus-visible:ring-destructive'
        )}
      />
      {error && <p className="text-sm text-destructive">{error.message}</p>}
    </div>
  );
}
