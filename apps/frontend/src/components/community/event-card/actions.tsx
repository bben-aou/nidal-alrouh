import { Button } from '@/components/ui/button';
import { CardFooter } from '@/components/ui/card';
import { CommunityEvent } from '@/types/community';
import {
  canRegister,
  isFullyBooked,
  showRegistrationButton,
} from '@/utils/community-events';

interface Props {
  event: CommunityEvent;
  t: (key: string) => string;
  onRegisterClick: () => void;
  onViewDetails: () => void;
}

export function EventCardActions({
  event,
  t,
  onRegisterClick,
  onViewDetails,
}: Readonly<Props>) {
  const showButton = showRegistrationButton(event);
  const full = isFullyBooked(event);
  const canReg = canRegister(event);

  return (
    <CardFooter className="flex gap-2">
      <Button variant="outline" className="flex-1" onClick={onViewDetails}>
        {t('events.details.viewDetails')}
      </Button>
      {showButton && (
        <Button
          variant={event.isRegistered ? 'outline' : 'default'}
          className="flex-1"
          onClick={onRegisterClick}
          disabled={!canReg && !event.isRegistered}
        >
          {event.isRegistered
            ? t('events.registration.unregister')
            : full
              ? t('events.registration.full')
              : t('events.registration.register')}
        </Button>
      )}
    </CardFooter>
  );
}
