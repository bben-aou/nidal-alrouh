import { Badge } from '@/components/ui/badge';
import { CommunityEvent } from '@/types/community';
import {
  getEventStatusColor,
  getEventTypeLabel,
} from '@/utils/community-events';

interface EventHeroProps {
  event: CommunityEvent;
  t: (key: string) => string;
}

export function EventHero({ event, t }: Readonly<EventHeroProps>) {
  return (
    <div className="relative mb-10 overflow-hidden rounded-2xl shadow-2xl">
      <div className="relative w-full aspect-[4/3] md:aspect-[21/9]">
        <img
          src={event.coverImage || '/default-event-banner.png'}
          alt={event.title}
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />

        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10">
          <div className="mb-4 flex flex-wrap gap-2.5">
            <Badge className="bg-white/20 backdrop-blur-md text-white border-white/30 hover:bg-white/25 px-4 py-1.5 shadow-lg">
              {getEventTypeLabel(event.type, t)}
            </Badge>
            <Badge
              className="backdrop-blur-md border-white/30 px-4 py-1.5 shadow-lg"
              style={{
                backgroundColor: getEventStatusColor(event.status),
                color: 'white',
              }}
            >
              {t(`events.status.${event.status}`)}
            </Badge>
          </div>
          <h1 className="text-3xl font-bold text-white md:text-5xl lg:text-6xl drop-shadow-2xl leading-tight max-w-4xl">
            {event.title}
          </h1>
        </div>
      </div>
    </div>
  );
}
