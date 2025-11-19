'use client';

import { useTranslations } from 'next-intl';
import * as React from 'react';

import { EventListEmpty } from '@/components/community/event-list/empty-state';
import { EventListError } from '@/components/community/event-list/error-state';
import { EventListSkeleton } from '@/components/community/event-list/skeleton';
import { EventCard } from '@/components/community/EventCard';
import { Button } from '@/components/ui/button';
import { CommunityEvent } from '@/types/community';

interface EventListProps {
  events: CommunityEvent[];
  isLoading?: boolean;
  isError?: boolean;
  error?: Error | null;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  onLoadMore?: () => void;
  onRegisterEvent?: (eventId: string) => void;
  onUnregisterEvent?: (eventId: string) => void;
  onViewEventDetails?: (eventId: string) => void;
  className?: string;
  emptyMessage?: string;
}

export function EventList({
  events,
  isLoading = false,
  isError = false,
  error,
  hasNextPage = false,
  isFetchingNextPage = false,
  onLoadMore,
  onRegisterEvent,
  onUnregisterEvent,
  onViewEventDetails,
  className = '',
  emptyMessage,
}: Readonly<EventListProps>) {
  const t = useTranslations('community');

  if (isLoading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <EventListSkeleton count={3} />
      </div>
    );
  }

  if (isError) {
    return (
      <EventListError
        className={className}
        message={t('events.errors.loadError')}
        details={error?.message || t('events.errors.genericError')}
        onRetry={() => globalThis.location?.reload?.()}
      />
    );
  }

  if (events?.length === 0) {
    return (
      <EventListEmpty
        className={className}
        title={emptyMessage || t('events.empty.noEvents')}
        description={t('events.empty.noEventsDescription')}
      />
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            onRegister={onRegisterEvent}
            onUnregister={onUnregisterEvent}
            onViewDetails={onViewEventDetails}
          />
        ))}
      </div>

      {hasNextPage && (
        <div className="flex justify-center pt-4">
          <Button
            variant="outline"
            onClick={onLoadMore}
            disabled={isFetchingNextPage}
            className="min-w-32"
          >
            {isFetchingNextPage ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                {t('events.actions.loading')}
              </>
            ) : (
              t('events.actions.loadMore')
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
