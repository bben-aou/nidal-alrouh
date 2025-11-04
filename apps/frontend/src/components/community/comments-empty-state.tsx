import { MessageSquare } from 'lucide-react';
import React from 'react';

import { CommentsEmptyStateProps } from '@/types/community';

export function CommentsEmptyState({
  t,
  className = '',
}: Readonly<CommentsEmptyStateProps>) {
  return (
    <div className={`py-8 ${className}`}>
      <div className="text-center text-muted-foreground">
        <MessageSquare className="mx-auto mb-2 h-5 w-5" />
        <p className="text-sm mb-1">{t('dashboard.comments.noComments')}</p>
        <p className="text-xs">{t('dashboard.comments.beFirst')}</p>
      </div>
    </div>
  );
}
