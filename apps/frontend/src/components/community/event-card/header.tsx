import Image from 'next/image';

import { Badge } from '@/components/ui/badge';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { CommunityEvent } from '@/types/community';
import {
  getEventStatusBadgeVariant,
  getEventTypeBadgeVariant,
} from '@/utils/community-events';

interface Props {
  event: CommunityEvent;
  t: (key: string) => string;
}

export function EventCardHeader({ event, t }: Readonly<Props>) {
  return (
    <CardHeader>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <CardTitle className="text-lg mb-2">{event.title}</CardTitle>
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge variant={getEventTypeBadgeVariant(event.type)}>
              {t(`events.type.${event.type}`)}
            </Badge>
            <Badge variant={getEventStatusBadgeVariant(event.status)}>
              {t(`events.status.${event.status}`)}
            </Badge>
            {event.isRegistered && (
              <Badge variant="secondary">
                {t('events.registration.registered')}
              </Badge>
            )}
          </div>
        </div>
        {event.coverImage && (
          <div className="relative h-20 w-20 overflow-hidden rounded-lg">
            <Image
              src={event.coverImage}
              alt={event.title}
              fill
              sizes="80px"
              className="object-cover"
            />
          </div>
        )}
      </div>
    </CardHeader>
  );
}
