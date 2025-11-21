import { Calendar, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState, useEffect, useMemo } from 'react';

import { useGetEvents, useUpdateEvent, useDeleteEvent } from '@/apis/events';
import { useRegisterForEvent } from '@/apis/events/queries/use-register-for-event';
import { useUnregisterForEvent } from '@/apis/events/queries/use-unregister-for-event';
import { DeleteEventDialog } from '@/components/community/DeleteEventDialog';
import { EventCreateDialog } from '@/components/community/EventCreateDialog';
import { EventFilters } from '@/components/community/EventFilters';
import { EventFormDialog } from '@/components/community/EventFormDialog';
import { EventList } from '@/components/community/EventList';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/auth-context';
import { useEventsRealtime } from '@/hooks/use-events-realtime';
import {
  EventType,
  EventStatus,
  CommunityEvent,
  CreateEventData,
} from '@/types/community';

interface EventsContentProps {
  className?: string;
}

export function EventsContent({ className }: Readonly<EventsContentProps>) {
  const t = useTranslations('community.events');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<EventType | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<EventStatus | 'all'>(
    'all'
  );
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const [eventToEdit, setEventToEdit] = useState<CommunityEvent | null>(null);
  const [eventToDelete, setEventToDelete] = useState<CommunityEvent | null>(
    null
  );

  const {
    events: serverEvents,
    error,
    isLoading,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetEvents({
    params: {
      type: selectedType === 'all' ? undefined : selectedType,
      status: selectedStatus === 'all' ? undefined : selectedStatus,
      limit: 20,
    },
  });

  const { updateEvent, isPending: isUpdating } = useUpdateEvent({
    config: {
      onSuccess: () => {
        toast({
          title: t('messages.updateSuccess'),
          description: t('messages.updateSuccessDescription'),
        });
        setEventToEdit(null);
        refetch();
      },
      onError: () => {
        toast({
          variant: 'destructive',
          title: t('messages.updateError'),
          description: t('messages.updateErrorDescription'),
        });
      },
    },
  });

  const { deleteEvent, isPending: isDeleting } = useDeleteEvent({
    config: {
      onSuccess: () => {
        toast({
          title: t('messages.deleteSuccess'),
          description: t('messages.deleteSuccessDescription'),
        });
        setEventToDelete(null);
        refetch();
      },
      onError: () => {
        toast({
          variant: 'destructive',
          title: t('messages.deleteError'),
          description: t('messages.deleteErrorDescription'),
        });
      },
    },
  });

  const events = useMemo(() => {
    if (!serverEvents) return [];

    return serverEvents.filter((ev) => {
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch = q
        ? (ev.title || '').toLowerCase().includes(q) ||
          (ev.description || '').toLowerCase().includes(q) ||
          (ev.tags || []).some((tag) => tag.toLowerCase().includes(q))
        : true;
      const matchesDateFrom = dateFrom ? ev.startDate >= dateFrom : true;
      const matchesDateTo = dateTo ? ev.endDate <= dateTo : true;
      return matchesSearch && matchesDateFrom && matchesDateTo;
    });
  }, [serverEvents, searchQuery, dateFrom, dateTo]);

  const visibleEventIds = useMemo(() => events.map((e) => e.id), [events]);
  useEventsRealtime(visibleEventIds);

  useEffect(() => {
    refetch();
  }, [selectedType, selectedStatus, refetch]);

  const handleEventCreated = () => {
    toast({
      title: t('eventCreated'),
      description: t('eventCreatedDescription'),
    });
    refetch();
  };

  const { registerForEvent } = useRegisterForEvent();
  const { unregisterForEvent } = useUnregisterForEvent();
  const { user } = useAuth();

  const handleRegisterEvent = (eventId: string) => {
    registerForEvent({ eventId });
  };

  const handleUnregisterEvent = (eventId: string) => {
    const ev = events.find((e) => e.id === eventId);
    if (ev && user?.id === ev.organizer.id) {
      toast({
        title: t('eventOrganizerCannotUnregisterTitle'),
        description: t('eventOrganizerCannotUnregisterDescription'),
      });
      return;
    }
    unregisterForEvent({ eventId });
  };

  const handleEditEvent = (event: CommunityEvent) => {
    setEventToEdit(event);
  };

  const handleDeleteEvent = (event: CommunityEvent) => {
    setEventToDelete(event);
  };

  const handleUpdateSubmit = async (data: CreateEventData) => {
    if (eventToEdit) {
      await updateEvent({ eventId: eventToEdit.id, data });
    }
  };

  const handleConfirmDelete = async () => {
    if (eventToDelete) {
      await deleteEvent({ eventId: eventToDelete.id });
    }
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedType('all');
    setSelectedStatus('all');
    setDateFrom('');
    setDateTo('');
  };

  const hasActiveFilters = Boolean(
    searchQuery ||
      selectedType !== 'all' ||
      selectedStatus !== 'all' ||
      dateFrom ||
      dateTo
  );

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-2xl font-bold">{t('events')}</h2>
        </div>
        <EventCreateDialog onEventCreated={handleEventCreated} />
      </div>

      <div className="mb-6">
        <EventFilters
          searchQuery={searchQuery}
          selectedType={selectedType}
          selectedStatus={selectedStatus}
          dateFrom={dateFrom}
          dateTo={dateTo}
          onSearchChange={setSearchQuery}
          onTypeChange={setSelectedType}
          onStatusChange={setSelectedStatus}
          onDateFromChange={setDateFrom}
          onDateToChange={setDateTo}
          onClearFilters={handleClearFilters}
          showClearButton={hasActiveFilters}
        />
      </div>

      <EventList
        events={events}
        isLoading={isLoading}
        isError={Boolean(error)}
        error={error ?? null}
        onRegisterEvent={handleRegisterEvent}
        onUnregisterEvent={handleUnregisterEvent}
        onEditEvent={handleEditEvent}
        onDeleteEvent={handleDeleteEvent}
        emptyMessage={t('noEventsFound')}
      />

      {hasNextPage && (
        <div className="mt-8 flex justify-center">
          <Button
            variant="outline"
            size="lg"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('actions.loadingMore')}
              </>
            ) : (
              t('actions.loadMore')
            )}
          </Button>
        </div>
      )}

      {eventToEdit && (
        <EventFormDialog
          mode="edit"
          open={Boolean(eventToEdit)}
          onOpenChange={(open) => !open && setEventToEdit(null)}
          initialValues={{
            ...eventToEdit,
            startTime: eventToEdit.startTime,
            endTime: eventToEdit.endTime,
            tags: eventToEdit.tags || [],
            startDate: new Date(eventToEdit.startDate),
            endDate: new Date(eventToEdit.endDate),
            meetingUrl: eventToEdit.meetingUrl || '',
            location: eventToEdit.location || '',
            coverImage: eventToEdit.coverImage || '',
            maxAttendees: eventToEdit.maxAttendees || 0,
            requiresApproval: eventToEdit.requiresApproval,
          }}
          onSubmit={handleUpdateSubmit}
          isPending={isUpdating}
        />
      )}

      <DeleteEventDialog
        open={Boolean(eventToDelete)}
        onOpenChange={(open) => !open && setEventToDelete(null)}
        onConfirm={handleConfirmDelete}
        isPending={isDeleting}
      />
    </div>
  );
}
