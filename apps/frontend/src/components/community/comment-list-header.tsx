import { MessageSquare } from 'lucide-react';
import React from 'react';

import { CommentListHeaderProps } from '@/types/community';

export function CommentListHeader({
  total,
  t,
  className = '',
}: Readonly<CommentListHeaderProps>) {
  return (
    <div
      className={`flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700 ${className}`}
    >
      <div className="flex items-center gap-2">
        <MessageSquare className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-sm font-semibold text-foreground">
          {t('dashboard.comments.title')}
        </h3>
        <span className="text-xs text-muted-foreground">({total})</span>
      </div>
    </div>
  );
}
