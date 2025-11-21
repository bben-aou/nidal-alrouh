import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CommunityEvent } from '@/types/community';
import { getUserAvatar } from '@/utils/community-events';

interface EventOrganizerCardProps {
  event: CommunityEvent;
  t: (key: string) => string;
}

export function EventOrganizerCard({
  event,
  t,
}: Readonly<EventOrganizerCardProps>) {
  return (
    <Card className="border-none shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">
          {t('events.details.organizerInfo')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-3.5">
          <img
            src={getUserAvatar(event.organizer.avatar, event.organizer.name)}
            alt={event.organizer.name}
            className="h-12 w-12 rounded-full object-cover ring-2 ring-background shadow-sm"
          />
          <div className="flex-1 min-w-0">
            <p className="font-semibold truncate">{event.organizer.name}</p>
            {event.organizer.role && (
              <p className="text-sm text-muted-foreground truncate mt-0.5">
                {event.organizer.role}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
