'use client';

import { formatDistanceToNow } from 'date-fns';
import { Trash2 } from 'lucide-react';
import { useLocale } from 'next-intl';
import React, { useState } from 'react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  CommentItemProps,
  CommentItem as CommentItemType,
} from '@/types/community';
import { resolveDateFnsLocale } from '@/utils/date';

export function CommentItem({ comment, onDelete, t }: CommentItemProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const appLocale = useLocale();

  const handleDelete = async () => {
    if (!onDelete || isDeleting) return;

    setIsDeleting(true);
    try {
      await onDelete(comment.id);
    } catch (error) {
      console.error('Failed to delete comment:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const getAuthorLabel = (comment: CommentItemType) => {
    if (comment.isAnonymous) {
      return comment.isOwner
        ? t('dashboard.authorLabels.anonymousYou')
        : t('dashboard.authorLabels.anonymous');
    }
    return comment.user?.name || t('dashboard.authorLabels.member');
  };

  const formatDate = (date: string | Date) => {
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return formatDistanceToNow(dateObj, {
        addSuffix: true,
        locale: resolveDateFnsLocale(appLocale),
      });
    } catch {
      return '';
    }
  };

  return (
    <div className="flex items-start gap-3 py-3">
      <div className="flex-shrink-0">
        <Avatar className="h-9 w-9">
          <AvatarImage
            src={comment.user?.avatar ?? ''}
            alt={comment.user?.name ?? 'User'}
          />
          <AvatarFallback className="text-xs font-medium">
            {comment.isAnonymous
              ? '?'
              : comment.user?.name?.[0]?.toUpperCase() || 'U'}
          </AvatarFallback>
        </Avatar>
      </div>

      {/* Comment Content */}
      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {getAuthorLabel(comment)}
            </span>
            <span className="text-xs text-muted-foreground">
              • {formatDate(comment.createdAt) as React.ReactNode}
            </span>
          </div>

          {/* Delete Button - Only show for comment owner */}
          {comment.isOwner && onDelete && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                  disabled={isDeleting}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">
                    {t('dashboard.comments.delete')}
                  </span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    {t('dashboard.comments.delete')}
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    {t('dashboard.comments.deleteConfirm')}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700"
                    disabled={isDeleting}
                  >
                    {isDeleting
                      ? 'Deleting...'
                      : t('dashboard.comments.delete')}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>

        <div
          className="mt-1 text-sm text-gray-700 dark:text-gray-300 prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: comment.content }}
        />
      </div>
    </div>
  );
}
