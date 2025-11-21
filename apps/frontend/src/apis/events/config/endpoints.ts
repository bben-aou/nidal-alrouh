/**
 * Events API Endpoints Configuration
 * Centralized endpoint definitions for events-related API calls
 */
export const EVENTS_ENDPOINTS = {
  EVENTS: '/events',
  EVENT_BY_ID: (id: string) => `/events/${id}`,
  REGISTER: (id: string) => `/events/${id}/register`,
  UNREGISTER: (id: string) => `/events/${id}/unregister`,
  UPDATE: (id: string) => `/events/${id}`,
  DELETE: (id: string) => `/events/${id}`,
} as const;

export type EventsEndpoints = typeof EVENTS_ENDPOINTS;
