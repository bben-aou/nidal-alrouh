import { Calendar } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState, useEffect, useCallback } from 'react';

import { EventCreateDialog } from '@/components/community/EventCreateDialog';
import { EventFilters } from '@/components/community/EventFilters';
import { EventList } from '@/components/community/EventList';
import { toast } from '@/components/ui/use-toast';
import { getMockEvents } from '@/lib/mock-data/community-events';
import { EventType, EventStatus, CommunityEvent } from '@/types/community';

interface EventsContentProps {
  className?: string;
}

export function EventsContent({ className }: Readonly<EventsContentProps>) {
  const t = useTranslations('community.events');

  const [events, setEvents] = useState<CommunityEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<EventType | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<EventStatus | 'all'>(
    'all'
  );
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const loadEvents = useCallback(async () => {
    setIsLoading(true);
    try {
      const filters = {
        search: searchQuery || undefined,
        type: selectedType === 'all' ? undefined : selectedType,
        status: selectedStatus === 'all' ? undefined : selectedStatus,
        startDate: dateFrom || undefined,
        endDate: dateTo || undefined,
      };

      const response = await getMockEvents(1, 20, filters);
      setEvents(response.items);
    } catch (error) {
      console.error('Failed to load events:', error);
      toast({
        title: t('errorLoadingEvents'),
        description: t('errorLoadingEventsDescription'),
      });
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, selectedType, selectedStatus, dateFrom, dateTo, t]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const handleEventCreated = () => {
    toast({
      title: t('eventCreated'),
      description: t('eventCreatedDescription'),
    });
    loadEvents();
  };

  const handleEventRegistered = () => {
    toast({
      title: t('registrationSuccessful'),
      description: t('registrationSuccessfulDescription'),
    });
    loadEvents();
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
        onRegisterEvent={handleEventRegistered}
        emptyMessage={t('noEventsFound')}
      />
    </div>
  );
}
