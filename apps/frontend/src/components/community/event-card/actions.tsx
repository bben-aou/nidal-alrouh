import Link from 'next/link';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { CardFooter } from '@/components/ui/card';
import { useAuth } from '@/contexts/auth-context';
import { CommunityEvent } from '@/types/community';
import {
  canRegister,
  isFullyBooked,
  showRegistrationButton,
} from '@/utils/community-events';

interface Props {
  event: CommunityEvent;
  t: (key: string) => string;
  onRegister?: () => void;
  onUnregister?: () => void;
  onViewDetails?: () => void;
}

export function EventCardActions({
  event,
  t,
  onRegister,
  onUnregister,
  onViewDetails,
}: Readonly<Props>) {
  const { user } = useAuth();
  const params = useParams();
  const localeParam = params?.locale;
  const locale =
    (Array.isArray(localeParam) ? localeParam[0] : localeParam) || 'en';

  const isMeRegistered = Boolean(event.isRegistered);
  const showButton = showRegistrationButton(event);
  const full = isFullyBooked(event);
  const canReg = canRegister(event);
  const organizerIsCreator = Boolean(
    user?.id === event.organizer.id && isMeRegistered
  );

  const handlePrimaryClick = () => {
    if (isMeRegistered) {
      if (organizerIsCreator) {
        toast.error(t('events.eventOrganizerCannotUnregisterTitle'), {
          description: t('events.eventOrganizerCannotUnregisterDescription'),
        });
        return;
      }
      onUnregister?.();
    } else {
      onRegister?.();
    }
  };

  const handleViewDetails = () => {
    onViewDetails?.();
  };

  return (
    <CardFooter className="flex flex-col gap-2">
      <Button variant="outline" className="w-full" asChild>
        <Link
          href={`/${locale}/dashboard/community/events/${event.id}`}
          onClick={handleViewDetails}
        >
          {t('events.details.viewDetails')}
        </Link>
      </Button>
      {showButton && (
        <Button
          variant={isMeRegistered ? 'outline' : 'default'}
          className="w-full"
          onClick={handlePrimaryClick}
          disabled={isMeRegistered ? false : !canReg}
        >
          {isMeRegistered
            ? t('events.registration.unregister')
            : full
              ? t('events.registration.full')
              : t('events.registration.register')}
        </Button>
      )}
    </CardFooter>
  );
}
