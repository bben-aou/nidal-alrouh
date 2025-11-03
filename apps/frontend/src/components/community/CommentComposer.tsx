'use client';

import { Send, Loader2, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

import { useCreateComment } from '@/apis/community/queries/use-create-comment';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import type { CommentComposerProps } from '@/types/community';

import type React from 'react';

export function CommentComposer({
  postId,
  onCommentCreated,
  className = '',
  t,
}: CommentComposerProps) {
  const [content, setContent] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [contentError, setContentError] = useState('');

  const createCommentMutation = useCreateComment(postId);

  const validateContent = (value: string): string => {
    if (!value.trim()) {
      return t('dashboard.comments.messages.contentRequired');
    }
    if (value.length > 2000) {
      return t('dashboard.comments.messages.contentTooLong');
    }
    return '';
  };

  const handleContentChange = (value: string) => {
    setContent(value);
    const error = validateContent(value);
    setContentError(error);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const error = validateContent(content);
    if (error) {
      setContentError(error);
      return;
    }

    try {
      const response = await createCommentMutation.mutateAsync({
        content: content.trim(),
        isAnonymous,
      });

      // Reset form
      setContent('');
      setIsAnonymous(false);
      setContentError('');

      // Notify parent component
      if (onCommentCreated) {
        onCommentCreated(response.data);
      }
    } catch (error) {
      console.error('Failed to create comment:', error);
      // Error handling is done in the mutation hook
    }
  };

  const isSubmitting = createCommentMutation.isPending;
  const canSubmit = content.trim() && !contentError && !isSubmitting;

  return (
    <form onSubmit={handleSubmit} className={`w-full ${className}`}>
      <div className="rounded-xl border border-border bg-card shadow-sm transition-all duration-200 hover:shadow-md overflow-hidden">
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <Textarea
              value={content}
              onChange={(e) => handleContentChange(e.target.value)}
              placeholder={t('dashboard.comments.writeComment')}
              className={`min-h-24 resize-none rounded-lg border-2 transition-all placeholder:text-muted-foreground/60 ${
                contentError
                  ? 'border-destructive focus:border-destructive focus:ring-destructive/20'
                  : 'border-input focus:border-primary focus:ring-primary/20'
              }`}
              disabled={isSubmitting}
              maxLength={2000}
            />

            <div className="flex items-center justify-between gap-3 px-1">
              <div className="min-h-5">
                {contentError && (
                  <span className="text-xs font-medium text-destructive">
                    {contentError}
                  </span>
                )}
              </div>
              <span
                className={`whitespace-nowrap text-xs font-medium transition-colors ${
                  content.length > 1800
                    ? 'text-orange-500'
                    : 'text-muted-foreground'
                }`}
              >
                {content.length}/2000
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 pt-4 border-t border-border">
            <Button
              type="button"
              variant={isAnonymous ? 'secondary' : 'outline'}
              size="default"
              onClick={() => setIsAnonymous(!isAnonymous)}
              disabled={isSubmitting}
              className={`gap-2 px-4 py-2 ${
                isAnonymous
                  ? 'bg-orange-100 hover:bg-orange-200 text-orange-800 border-orange-300 dark:bg-orange-900/20 dark:hover:bg-orange-900/30 dark:text-orange-300 dark:border-orange-700'
                  : ''
              }`}
            >
              {isAnonymous ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
              <span className="text-sm font-medium">
                {isAnonymous
                  ? t('dashboard.comments.commentAnonymously')
                  : t('dashboard.comments.commentPublicly')}
              </span>
            </Button>

            <Button
              type="submit"
              variant="default"
              size="default"
              disabled={!canSubmit}
              className="gap-2 px-4 py-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t('dashboard.comments.posting')}
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  {t('dashboard.comments.comment')}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
