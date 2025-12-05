'use client';

import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
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
  quotedPost,
  onRemoveQuotedPost,
}: Readonly<CreatePostCardProps>) {
  const t = useTranslations('community');

  const {
    register,
    handleSubmit,
    errors,
    isValid,
    setValue,
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
  } = useCreatePostForm({ onPostSubmit, onAfterSubmit: onRemoveQuotedPost });

  useEffect(() => {
    setValue('quotedPostId', quotedPost?.id ?? '');
  }, [quotedPost, setValue]);

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
          <input type="hidden" {...register('quotedPostId')} />

          {quotedPost && (
            <div className="rounded-md border p-3 text-sm relative">
              <div className="flex items-center gap-2 mb-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage
                    src="/default-profile.jpg"
                    alt=""
                    className="object-cover"
                  />
                  <AvatarFallback className="text-[10px] leading-none">
                    {quotedPost.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground">
                    {quotedPost.author}
                  </span>
                  {quotedPost.time && (
                    <span className="text-xs text-muted-foreground">
                      {quotedPost.time}
                    </span>
                  )}
                </div>
              </div>
              <p className="line-clamp-2 text-muted-foreground">
                {quotedPost.content}
              </p>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-2"
                onClick={onRemoveQuotedPost}
                title={t('dashboard.shareModal.removeQuoted')}
                aria-label={t('dashboard.shareModal.removeQuoted')}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

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
