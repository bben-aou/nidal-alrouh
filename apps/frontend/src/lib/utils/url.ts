'use client';

import type { ReadonlyURLSearchParams } from 'next/navigation';

/**
 * Builds a new URL path from the given pathname and current search params,
 * applying provided updates (set/delete). Empty string, null, or undefined
 * values will delete the key.
 */
export function buildUrlWithUpdatedQuery(
  pathname: string,
  current: ReadonlyURLSearchParams | null,
  updates: Record<string, string | null | undefined>
): string {
  const params = new URLSearchParams(current?.toString());
  for (const [key, value] of Object.entries(updates)) {
    if (value === undefined || value === null || value === '') {
      params.delete(key);
    } else {
      params.set(key, value);
    }
  }
  const qs = params.toString();
  return qs ? `${pathname}?${qs}` : pathname;
}
