export const EventsRt = {
  EventCreated: 'events.event.created',
  RegistrationUpdated: 'events.event.registration.updated',
} as const;

export type EventsRtName = (typeof EventsRt)[keyof typeof EventsRt];
