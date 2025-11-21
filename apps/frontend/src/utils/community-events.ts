import { CommunityEvent } from '@/types/community';

export type BadgeVariant = 'default' | 'secondary' | 'outline' | 'destructive';

export function getEventTypeBadgeVariant(
  type: CommunityEvent['type']
): BadgeVariant {
  switch (type) {
    case 'workshop':
      return 'default';
    case 'supportSession':
      return 'secondary';
    case 'consultation':
      return 'outline';
    case 'communityMeeting':
      return 'default';
    case 'webinar':
      return 'secondary';
    default:
      return 'default';
  }
}

export function getEventStatusBadgeVariant(
  status: CommunityEvent['status']
): BadgeVariant {
  switch (status) {
    case 'upcoming':
      return 'default';
    case 'ongoing':
      return 'secondary';
    case 'completed':
      return 'outline';
    case 'cancelled':
      return 'destructive';
    default:
      return 'default';
  }
}

export function isFullyBooked(event: CommunityEvent): boolean {
  return (
    Boolean(event.maxAttendees) &&
    event.currentAttendees >= (event.maxAttendees || 0)
  );
}

export function canRegister(event: CommunityEvent): boolean {
  return (
    !event.isRegistered &&
    !isFullyBooked(event) &&
    (event.status === 'upcoming' || event.status === 'ongoing')
  );
}

export function showRegistrationButton(event: CommunityEvent): boolean {
  return event.status === 'upcoming' || event.status === 'ongoing';
}
