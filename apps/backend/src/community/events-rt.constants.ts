export const EventsRt = {
  EventCreated: 'events.event.created',
  RegistrationUpdated: 'events.event.registration.updated',
  EventUpdated: 'events.event.updated',
  EventDeleted: 'events.event.deleted',
} as const;

export type EventsRtName = (typeof EventsRt)[keyof typeof EventsRt];
