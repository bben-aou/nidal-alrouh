import { CommunityEvent, EventType, EventStatus } from '@/types/community';

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

export function getEventStatusColor(status: EventStatus): string {
  switch (status) {
    case 'upcoming':
      return 'hsl(var(--primary))';
    case 'ongoing':
      return 'hsl(var(--chart-2))';
    case 'completed':
      return 'hsl(var(--muted))';
    case 'cancelled':
      return 'hsl(var(--destructive))';
    default:
      return 'hsl(var(--muted))';
  }
}

export function getEventTypeLabel(
  type: EventType,
  t: (key: string) => string
): string {
  return t(`events.type.${type}`);
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

export function getUserAvatar(
  avatar: string | null | undefined,
  name: string
): string {
  if (avatar) {
    return avatar;
  }
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=random&size=128`;
}
