/**
 * Journal API Endpoints Configuration
 * Centralized endpoint definitions for journal-related API calls
 */

export const JOURNAL_ENDPOINTS = {
  // Reflections endpoints
  REFLECTIONS: '/journal/reflections',
  REFLECTION_BY_ID: (id: string) => `/journal/reflections/${id}`,

  // Future journal endpoints can be added here
  // JOURNAL_ENTRIES: '/journal-entries',
  // JOURNAL_ANALYTICS: '/journal/analytics',
  // JOURNAL_EXPORT: '/journal/export',
} as const;

export type JournalEndpoints = typeof JOURNAL_ENDPOINTS;
