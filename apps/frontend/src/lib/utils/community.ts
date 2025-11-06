import { formatDistanceToNow } from 'date-fns';

import { type CommunityPostItem, type Post } from '@/types/community';

import type { ReadonlyURLSearchParams } from 'next/navigation';

type TranslationFunction = (key: string) => string;

export const transformCommunityPosts = (
  apiPosts: CommunityPostItem[],
  t: TranslationFunction
): Post[] => {
  return (apiPosts ?? []).map((p) => {
    const authorLabel = p.isAnonymous
      ? p.isOwner
        ? t('dashboard.authorLabels.anonymousYou')
        : t('dashboard.authorLabels.anonymous')
      : (p.user?.name ?? t('dashboard.authorLabels.member'));

    // Derive quoted post author label if present
    const quotedAuthorLabel = p.quotedPost?.isAnonymous
      ? t('dashboard.authorLabels.anonymous')
      : (p.quotedPost?.user?.name ?? t('dashboard.authorLabels.member'));

    const quotedAvatar = quotedAuthorLabel
      ? quotedAuthorLabel
          .split(' ')
          .map((word) => word.charAt(0))
          .join('')
          .toUpperCase()
          .slice(0, 2)
      : undefined;

    const quotedTime = p.quotedPost?.createdAt
      ? formatDistanceToNow(new Date(p.quotedPost.createdAt), {
          addSuffix: true,
        })
      : undefined;

    return {
      id: p.id.toString(),
      author: authorLabel,
      avatar: authorLabel
        .split(' ')
        .map((word) => word.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2),
      time: formatDistanceToNow(new Date(p.createdAt), { addSuffix: true }),
      content: p.content,
      likes: p.likesCount ?? p.likes?.length ?? 0,
      comments: p.commentsCount ?? p.comments?.length ?? 0,
      tags: p.tags ?? [],
      hidden: p.hidden,
      likedByMe: !!p.likedByMe,
      quotedPost: p.quotedPost
        ? {
            id: String(p.quotedPost.id),
            author: quotedAuthorLabel,
            content: p.quotedPost.content ?? '',
            hidden: false,
            avatar: quotedAvatar,
            time: quotedTime,
          }
        : undefined,
    };
  });
};

// Community tabs supported across the dashboard page
export type CommunityTab = 'feed' | 'groups' | 'events';

/**
 * Derive active community tab from URL query params.
 * Defaults to 'feed' for invalid or missing values.
 */
export function getActiveCommunityTab(
  searchParams: ReadonlyURLSearchParams | null
): CommunityTab {
  const tab = searchParams?.get('tab');
  if (tab === 'groups' || tab === 'events') return tab;
  return 'feed';
}

/**
 * If a `post` query param exists, returns the redirect target to the post page,
 * preserving common UTM parameters.
 */
export function getCommunityPostRedirectTarget(
  searchParams: ReadonlyURLSearchParams | null
): string | null {
  const postId = searchParams?.get('post');
  if (!postId) return null;

  const utmMedium = searchParams?.get('utm_medium');
  const utmSource = searchParams?.get('utm_source');

  const params = new URLSearchParams();
  if (utmMedium) params.set('utm_medium', utmMedium);
  if (utmSource) params.set('utm_source', utmSource);
  const qs = params.toString();
  return `/dashboard/community/posts/${encodeURIComponent(postId)}${qs ? `?${qs}` : ''}`;
}
