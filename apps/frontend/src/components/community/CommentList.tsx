'use client';

import { Loader2 } from 'lucide-react';
import React from 'react';

import { useDeleteComment } from '@/apis/community/queries/use-delete-comment';
import { useGetComments } from '@/apis/community/queries/use-get-comments';
import { Button } from '@/components/ui/button';
import { CommentListProps } from '@/types/community';

import { CommentItem } from './CommentItem';

/**
 * CommentList component displays a list of comments with pagination and loading states
 */
export function CommentList({ postId, className = '', t }: CommentListProps) {
  const {
    data: commentsData,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetComments(postId);

  const deleteCommentMutation = useDeleteComment(postId);

  const handleDeleteComment = async (commentId: string | number) => {
    try {
      await deleteCommentMutation.mutateAsync(commentId);
    } catch (error) {
      console.error('Failed to delete comment:', error);
      throw error;
    }
  };

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center py-8 ${className}`}>
        <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm">{t('dashboard.comments.loading')}</span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={`py-4 ${className}`}>
        <div className="text-center text-red-600 dark:text-red-400">
          <p className="text-sm">
            {error instanceof Error ? error.message : 'Failed to load comments'}
          </p>
        </div>
      </div>
    );
  }

  const allComments = commentsData?.pages.flatMap((page) => page.items) || [];
  const totalComments = allComments.length;

  if (allComments.length === 0) {
    return (
      <div className={`py-8 ${className}`}>
        <div className="text-center text-gray-500 dark:text-gray-400">
          <p className="text-sm mb-1">{t('dashboard.comments.noComments')}</p>
          <p className="text-xs">{t('dashboard.comments.beFirst')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-1 ${className}`}>
      {/* Comments Header */}
      <div className="flex items-center justify-between pb-2 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
          {t('dashboard.comments.title')} ({totalComments})
        </h3>
      </div>

      {/* Comments List */}
      <div className="space-y-0 divide-y divide-gray-100 dark:divide-gray-800">
        {allComments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onDelete={comment.isOwner ? handleDeleteComment : undefined}
            t={t}
          />
        ))}
      </div>

      {/* Load More Button */}
      {hasNextPage && (
        <div className="pt-4 flex justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="text-sm"
          >
            {isFetchingNextPage ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Loading...
              </>
            ) : (
              t('dashboard.comments.loadMore')
            )}
          </Button>
        </div>
      )}

      {/* Loading indicator for next page */}
      {isFetchingNextPage && (
        <div className="flex items-center justify-center py-2">
          <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
            <Loader2 className="h-3 w-3 animate-spin" />
            <span className="text-xs">{t('dashboard.comments.loading')}</span>
          </div>
        </div>
      )}
    </div>
  );
}
