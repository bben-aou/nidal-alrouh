import { MoreVertical, Edit, Trash } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CommunityEvent } from '@/types/community';
import {
  getEventStatusBadgeVariant,
  getEventTypeBadgeVariant,
} from '@/utils/community-events';

interface Props {
  event: CommunityEvent;
  t: (key: string) => string;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function EventCardHeader({
  event,
  t,
  onEdit,
  onDelete,
}: Readonly<Props>) {
  const showActions = Boolean(onEdit || onDelete);

  return (
    <CardHeader>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <CardTitle className="text-lg mb-2">{event.title}</CardTitle>
            {showActions && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {onEdit && (
                    <DropdownMenuItem onClick={onEdit}>
                      <Edit className="mr-2 h-4 w-4" />
                      {t('events.form.editTitle')}
                    </DropdownMenuItem>
                  )}
                  {onDelete && (
                    <DropdownMenuItem
                      onClick={onDelete}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      {t('events.deleteEvent')}
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
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
        <div className="relative h-20 w-20 overflow-hidden rounded-lg flex-shrink-0">
          <img
            src={event.coverImage || '/default-event-banner.png'}
            alt={event.title}
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </CardHeader>
  );
}
