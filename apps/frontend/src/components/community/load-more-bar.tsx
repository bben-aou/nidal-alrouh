import { Loader2 } from 'lucide-react';
import React from 'react';

import { Button } from '@/components/ui/button';
import { LoadMoreBarProps } from '@/types/community';

export function LoadMoreBar({
  loading,
  onLoadMore,
  label,
  className = '',
}: Readonly<LoadMoreBarProps>) {
  return (
    <div className={`pt-3 w-full flex items-center ${className}`}>
      <span className="flex-1 border-t border-gray-200 dark:border-gray-700" />
      <Button
        variant="link"
        size="sm"
        onClick={onLoadMore}
        disabled={loading}
        className="mx-3 text-sm"
        aria-label={label}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {label}
          </>
        ) : (
          label
        )}
      </Button>
      <span className="flex-1 border-t border-gray-200 dark:border-gray-700" />
    </div>
  );
}
