'use client';

import { Send, Loader2 } from 'lucide-react';
import React, { useState } from 'react';

import { useCreateComment } from '@/apis/community/queries/use-create-comment';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CommentComposerProps } from '@/types/community';

/**
 * CommentComposer component allows users to write and submit comments with anonymous option
 */
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
    <form onSubmit={handleSubmit} className={`space-y-3 ${className}`}>
      {/* Comment Input */}
      <div className="space-y-2">
        <Textarea
          value={content}
          onChange={(e) => handleContentChange(e.target.value)}
          placeholder={t('dashboard.comments.writeComment')}
          className={`min-h-[80px] resize-none ${
            contentError ? 'border-red-500 focus:border-red-500' : ''
          }`}
          disabled={isSubmitting}
          maxLength={2000}
        />

        {/* Character count and error */}
        <div className="flex justify-between items-center text-xs">
          <div>
            {contentError && (
              <span className="text-red-500 dark:text-red-400">
                {contentError}
              </span>
            )}
          </div>
          <span
            className={`${
              content.length > 1800 ? 'text-orange-500' : 'text-gray-400'
            }`}
          >
            {content.length}/2000
          </span>
        </div>
      </div>

      {/* Anonymous Toggle and Submit */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="anonymous-comment"
            checked={isAnonymous}
            onCheckedChange={(checked) => setIsAnonymous(checked as boolean)}
            disabled={isSubmitting}
          />
          <Label
            htmlFor="anonymous-comment"
            className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer"
          >
            {t('dashboard.comments.commentAnonymously')}
          </Label>
        </div>

        <Button
          type="submit"
          size="sm"
          disabled={!canSubmit}
          className="min-w-[80px]"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              {t('dashboard.comments.posting')}
            </>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              {t('dashboard.comments.comment')}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
