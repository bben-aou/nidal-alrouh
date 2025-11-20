'use client';

// Derive the WS base URL from NEXT_PUBLIC_API_URL, dropping any trailing path like '/api'.
export function getWsBaseUrl(): string {
  const api = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api';
  try {
    const url = new URL(api);
    // Use origin only, strip any path component (e.g., '/api') for Socket.IO namespace usage
    return `${url.protocol}//${url.host}`;
  } catch {
    // Fallback if NEXT_PUBLIC_API_URL is not a valid URL
    return 'http://localhost:8080';
  }
}

export const COMMUNITY_NAMESPACE = '/community';
export const CHAT_NAMESPACE = '/chat';
export const EVENTS_NAMESPACE = '/events';
