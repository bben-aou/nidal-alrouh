'use client';

import { useTranslations } from 'next-intl';
import * as React from 'react';

import { EventCardActions } from '@/components/community/event-card/actions';
import { EventCardDetails } from '@/components/community/event-card/details';
import { EventCardHeader } from '@/components/community/event-card/header';
import { Card } from '@/components/ui/card';
import { CommunityEvent } from '@/types/community';
import { getLocalizedDateFormatter } from '@/utils/date';

interface EventCardProps {
  event: CommunityEvent;
  className?: string;
  onRegister?: (eventId: string) => void;
  onUnregister?: (eventId: string) => void;
  onViewDetails?: (eventId: string) => void;
}

export function EventCard({
  event,
  className,
  onRegister,
  onUnregister,
  onViewDetails,
}: Readonly<EventCardProps>) {
  const t = useTranslations('community');
  const { formatDate } = getLocalizedDateFormatter(t);

  const handleRegisterClick = () => {
    if (event.isRegistered) {
      onUnregister?.(event.id);
    } else {
      onRegister?.(event.id);
    }
  };

  const handleViewDetails = () => {
    onViewDetails?.(event.id);
  };

  return (
    <Card className={className}>
      <EventCardHeader event={event} t={t} />
      <EventCardDetails event={event} t={t} formatDate={formatDate} />
      <EventCardActions
        event={event}
        t={t}
        onRegisterClick={handleRegisterClick}
        onViewDetails={handleViewDetails}
      />
    </Card>
  );
}
