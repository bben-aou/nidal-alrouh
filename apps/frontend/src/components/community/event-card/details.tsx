import { Calendar, Clock, MapPin, Users, Video } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { CardContent } from '@/components/ui/card';
import { CommunityEvent } from '@/types/community';
import { isFullyBooked } from '@/utils/community-events';
import { formatHHmmTo12h } from '@/utils/date-time';

import { EventCardOrganizer } from './organizer';

interface Props {
  event: CommunityEvent;
  t: (key: string) => string;
  formatDate: (iso: string) => string;
}

export function EventCardDetails({ event, t, formatDate }: Readonly<Props>) {
  return (
    <CardContent className="space-y-4">
      <p className="text-sm text-muted-foreground line-clamp-3">
        {event.description}
      </p>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span>{formatDate(event.startDate)}</span>
          {event.startDate !== event.endDate && (
            <span className="text-muted-foreground">
              - {formatDate(event.endDate)}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span>
            {formatHHmmTo12h(event.startTime)} -{' '}
            {formatHHmmTo12h(event.endTime)}
          </span>
          <span className="text-muted-foreground">({event.timezone})</span>
        </div>

        {event.location && (
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>{event.location}</span>
          </div>
        )}

        {event.meetingUrl && (
          <div className="flex items-center gap-2 text-sm">
            <Video className="h-4 w-4 text-muted-foreground" />
            <span className="text-primary">
              {t('events.details.onlineEvent')}
            </span>
          </div>
        )}

        <div className="flex items-center gap-2 text-sm">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span>
            {event.currentAttendees}
            {event.maxAttendees && ` / ${event.maxAttendees}`}
            <span className="ml-2">{t('events.details.attendees')}</span>
          </span>
          {isFullyBooked(event) && (
            <Badge variant="destructive" className="ml-2">
              {t('events.registration.full')}
            </Badge>
          )}
        </div>

        {event.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {event.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                #{tag}
              </Badge>
            ))}
          </div>
        )}
      </div>

      <EventCardOrganizer organizer={event.organizer} />
    </CardContent>
  );
}
