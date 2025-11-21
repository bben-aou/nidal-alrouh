'use client';

import { useTranslations } from 'next-intl';
import * as React from 'react';

import { EventCardActions } from '@/components/community/event-card/actions';
import { EventCardDetails } from '@/components/community/event-card/details';
import { EventCardHeader } from '@/components/community/event-card/header';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/auth-context';
import { CommunityEvent } from '@/types/community';
import { getLocalizedDateFormatter } from '@/utils/date';

interface EventCardProps {
  event: CommunityEvent;
  className?: string;
  onRegister?: (eventId: string) => void;
  onUnregister?: (eventId: string) => void;
  onViewDetails?: (eventId: string) => void;
  onEdit?: (event: CommunityEvent) => void;
  onDelete?: (event: CommunityEvent) => void;
}

export function EventCard({
  event,
  className,
  onRegister,
  onUnregister,
  onViewDetails,
  onEdit,
  onDelete,
}: Readonly<EventCardProps>) {
  const t = useTranslations('community');
  const { formatDate } = getLocalizedDateFormatter(t);
  const { user } = useAuth();

  const isOrganizer = user?.id === event.organizer.id;

  const handleRegister = () => {
    onRegister?.(event.id);
  };

  const handleUnregister = () => {
    onUnregister?.(event.id);
  };

  const handleViewDetails = () => {
    onViewDetails?.(event.id);
  };

  return (
    <Card className={className}>
      <EventCardHeader
        event={event}
        t={t}
        onEdit={isOrganizer && onEdit ? () => onEdit(event) : undefined}
        onDelete={isOrganizer && onDelete ? () => onDelete(event) : undefined}
      />
      <EventCardDetails event={event} t={t} formatDate={formatDate} />
      <EventCardActions
        event={event}
        t={t}
        onRegister={handleRegister}
        onUnregister={handleUnregister}
        onViewDetails={handleViewDetails}
      />
    </Card>
  );
}
