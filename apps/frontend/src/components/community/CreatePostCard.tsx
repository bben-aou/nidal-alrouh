'use client';

import { useTranslations } from 'next-intl';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCreatePostForm } from '@/hooks/useCreatePostForm';
import { cn } from '@/lib/utils';
import { CreatePostCardProps } from '@/types/community';

import { AnonymousToggle } from './anonymous-toggle';
import { PostContentInput } from './post-content-input';
import { SubmitButton } from './submit-button';
import { TagsSection } from './tags-section';

export function CreatePostCard({
  className,
  onPostSubmit,
}: Readonly<CreatePostCardProps>) {
  const t = useTranslations('community');

  const {
    register,
    handleSubmit,
    errors,
    isValid,
    watchedContent,
    watchedTags,
    watchedIsAnonymous,
    tagInput,
    isTagInputFocused,
    removeTag,
    handleTagInputKeyDown,
    handleTagInputBlur,
    handleTagInputFocus,
    handleTagInputChange,
    handleAnonymousToggle,
  } = useCreatePostForm({ onPostSubmit });

  return (
    <Card
      className={cn('transition-all duration-200 hover:shadow-md', className)}
    >
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            {t('dashboard.shareThoughts')}
          </CardTitle>

          <AnonymousToggle
            isAnonymous={watchedIsAnonymous}
            onToggle={handleAnonymousToggle}
          />
        </div>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <PostContentInput
            register={register('content')}
            error={errors.content}
          />

          <TagsSection
            tags={watchedTags}
            tagInput={tagInput}
            isTagInputFocused={isTagInputFocused}
            error={errors.tags}
            onRemoveTag={removeTag}
            onTagInputKeyDown={handleTagInputKeyDown}
            onTagInputBlur={handleTagInputBlur}
            onTagInputFocus={handleTagInputFocus}
            onTagInputChange={handleTagInputChange}
          />

          <SubmitButton
            isValid={isValid}
            hasContent={!!watchedContent.trim()}
          />
        </CardContent>
      </form>
    </Card>
  );
}
