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

/**
 * Community API Endpoints Configuration
 * Centralized endpoint definitions for community-related API calls
 */
export const COMMUNITY_ENDPOINTS = {
  POSTS: '/community/posts',
  POST_BY_ID: (id: string) => `/community/posts/${id}`,
  POST_LIKES: (id: string) => `/community/posts/${id}/likes`,
  POST_LIKES_ME: (id: string) => `/community/posts/${id}/likes/me`,
  POST_COMMENTS: (id: string) => `/community/posts/${id}/comments`,
  DELETE_COMMENT: (postId: string, commentId: string) =>
    `/community/posts/${postId}/comments/${commentId}`,
  POST_REPORTS: (id: string) => `/community/posts/${id}/reports`,
  POST_HIDE: (id: string) => `/community/posts/${id}/hide`,
  POST_UNHIDE: (id: string) => `/community/posts/${id}/unhide`,
  STATS: '/community/stats',
} as const;

export type CommunityEndpoints = typeof COMMUNITY_ENDPOINTS;

/**
 * Chat API Endpoints Configuration
 */
export const CHAT_ENDPOINTS = {
  ROOMS: '/chat/rooms',
  ROOM_MESSAGES: (roomId: string) => `/chat/rooms/${roomId}/messages`,
  MARK_READ: (roomId: string) => `/chat/rooms/${roomId}/read`,
  DM: '/chat/dm',
} as const;

export type ChatEndpoints = typeof CHAT_ENDPOINTS;

/**
 * Helpers API Endpoints Configuration
 * Centralized endpoint definitions for helpers-related API calls
 */
export const HELPERS_ENDPOINTS = {
  SEARCH: '/helpers/search',
  HELPER_BY_ID: (id: string) => `/helpers/${id}`,
  ME: '/helpers/me',
  CREATE: '/helpers',
  REVIEWS: (id: string) => `/helpers/${id}/feedback`,
} as const;

export type HelpersEndpoints = typeof HELPERS_ENDPOINTS;
