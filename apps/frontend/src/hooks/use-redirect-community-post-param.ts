'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

import { useRouter } from '@/i18n/navigation';
import { getCommunityPostRedirectTarget } from '@/lib/utils/community';

/**
 * Watches `post` query param and redirects to the community post details page
 * when present, preserving common UTM params.
 */
export function useRedirectCommunityPostParam(): void {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const target = getCommunityPostRedirectTarget(searchParams);
    if (target) router.replace(target);
  }, [router, searchParams]);
}
