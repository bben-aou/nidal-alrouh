import { Edit, Share2, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CommunityEvent } from '@/types/community';

interface EventActionsProps {
  event: CommunityEvent;
  t: (key: string) => string;
  isOrganizer: boolean;
  isFull: boolean;
  canRegisterForEvent: boolean;
  isRegistering: boolean;
  isUnregistering: boolean;
  onRegister: () => void;
  onUnregister: () => void;
  onShare: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function EventActions({
  event,
  t,
  isOrganizer,
  isFull,
  canRegisterForEvent,
  isRegistering,
  isUnregistering,
  onRegister,
  onUnregister,
  onShare,
  onEdit,
  onDelete,
}: Readonly<EventActionsProps>) {
  return (
    <div className="space-y-3">
      {event.status === 'upcoming' && (
        <Button
          size="lg"
          className="w-full font-semibold"
          disabled={
            event.isRegistered
              ? isUnregistering
              : !canRegisterForEvent || isRegistering
          }
          variant={event.isRegistered ? 'outline' : 'default'}
          onClick={event.isRegistered ? onUnregister : onRegister}
        >
          {event.isRegistered
            ? t('events.registration.unregister')
            : isFull
              ? t('events.registration.full')
              : t('events.registration.register')}
        </Button>
      )}

      <Button
        variant="outline"
        size="lg"
        className="w-full gap-2 font-medium"
        onClick={onShare}
      >
        <Share2 className="h-4 w-4" />
        {t('events.details.actions.share')}
      </Button>

      {isOrganizer && (
        <>
          <Separator className="my-3" />
          <div className="space-y-2">
            <Button variant="outline" className="w-full gap-2" onClick={onEdit}>
              <Edit className="h-4 w-4" />
              {t('events.editEvent')}
            </Button>

            <Button
              variant="outline"
              className="w-full gap-2 text-destructive hover:bg-destructive hover:text-destructive-foreground"
              onClick={onDelete}
            >
              <Trash2 className="h-4 w-4" />
              {t('events.deleteEvent')}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
