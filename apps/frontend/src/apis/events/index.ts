export { EVENTS_ENDPOINTS } from './config/endpoints';
export type { EventsEndpoints } from './config/endpoints';

export { useCreateEvent } from './queries/use-create-event';
export type {
  CreateEventRequestBody,
  CreateEventResponse,
} from './queries/use-create-event';

export { useGetEvents } from './queries/use-get-events';
export { GET_EVENTS_KEY } from './queries/use-get-events';
export { useGetEventById } from './queries/use-get-event-by-id';
export { GET_EVENT_BY_ID_KEY } from './queries/use-get-event-by-id';
