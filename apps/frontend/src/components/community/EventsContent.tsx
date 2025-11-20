import { Calendar } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState, useEffect, useMemo } from 'react';

import { useGetEvents } from '@/apis/events';
import { useRegisterForEvent } from '@/apis/events/queries/use-register-for-event';
import { useUnregisterForEvent } from '@/apis/events/queries/use-unregister-for-event';
import { EventCreateDialog } from '@/components/community/EventCreateDialog';
import { EventFilters } from '@/components/community/EventFilters';
import { EventList } from '@/components/community/EventList';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/auth-context';
import { useEventsRealtime } from '@/hooks/use-events-realtime';
import { EventType, EventStatus } from '@/types/community';

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

  const {
    events: serverEvents,
    error,
    isLoading,
    refetch,
  } = useGetEvents({
    params: {
      type: selectedType === 'all' ? undefined : selectedType,
      status: selectedStatus === 'all' ? undefined : selectedStatus,
      limit: 20,
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
        emptyMessage={t('noEventsFound')}
      />
    </div>
  );
}
