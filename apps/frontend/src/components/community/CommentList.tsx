'use client';

import { Loader2 } from 'lucide-react';
import React, { useCallback } from 'react';

import { useDeleteComment } from '@/apis/community/queries/use-delete-comment';
import { useGetComments } from '@/apis/community/queries/use-get-comments';
import { CommentListHeader } from '@/components/community/comment-list-header';
import { CommentItem } from '@/components/community/CommentItem';
import { CommentsEmptyState } from '@/components/community/comments-empty-state';
import { LoadMoreBar } from '@/components/community/load-more-bar';
import { COMMENTS_PAGE_SIZE } from '@/lib/constants';
import { CommentListProps } from '@/types/community';

export function CommentList({ postId, className = '', t }: CommentListProps) {
  const {
    data: commentsData,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetComments(postId, { limit: COMMENTS_PAGE_SIZE });

  const deleteCommentMutation = useDeleteComment(postId);

  const handleDeleteComment = useCallback(
    async (commentId: string | number) => {
      try {
        await deleteCommentMutation.mutateAsync(commentId);
      } catch (error) {
        console.error('Failed to delete comment:', error);
        throw error;
      }
    },
    [deleteCommentMutation]
  );

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
    return <CommentsEmptyState t={t} className={className} />;
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <CommentListHeader total={totalComments} t={t} />

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
      {hasNextPage && (
        <LoadMoreBar
          loading={isFetchingNextPage}
          onLoadMore={fetchNextPage}
          label={t('dashboard.comments.loadMore')}
        />
      )}
    </div>
  );
}
