/**
 * Journal API Endpoints Configuration
 * Centralized endpoint definitions for journal-related API calls
 */

export const JOURNAL_ENDPOINTS = {
  // Reflections endpoints
  REFLECTIONS: '/journal/reflections',
  REFLECTION_BY_ID: (id: string) => `/journal/reflections/${id}`,

  // Statistics endpoints
  STATS: '/journal/stats',

  // Analytics endpoints
  ANALYTICS: '/journal/analytics',

  // Future journal endpoints can be added here
  // JOURNAL_ENTRIES: '/journal-entries',
  // JOURNAL_EXPORT: '/journal/export',
} as const;

/**
 * Prompts API Endpoints Configuration
 * Centralized endpoint definitions for prompts-related API calls
 */
export const PROMPTS_ENDPOINTS = {
  // Prompts endpoints
  PROMPTS: '/prompts',
  PROMPT_BY_ID: (id: string) => `/prompts/${id}`,
  PROMPT_CATEGORIES: '/prompts/categories',
} as const;

export type JournalEndpoints = typeof JOURNAL_ENDPOINTS;
export type PromptsEndpoints = typeof PROMPTS_ENDPOINTS;
