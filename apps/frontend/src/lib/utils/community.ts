import { formatDistanceToNow, isValid, parseISO } from 'date-fns';

import { type CommunityPostItem, type Post } from '@/types/community';

const toRelativeTime = (iso: string): string => {
  try {
    const date = parseISO(iso);
    if (!isValid(date)) return '';
    return formatDistanceToNow(date, { addSuffix: true });
  } catch {
    return '';
  }
};

export const transformCommunityPosts = (
  apiPosts: CommunityPostItem[]
): Post[] => {
  return (apiPosts ?? []).map((p) => {
    const authorLabel = p.user?.name ?? 'Member';
    const avatarFallback = (authorLabel || 'U')
      .trim()
      .slice(0, 2)
      .toUpperCase();

    return {
      id: String(p.id), // Preserve original ID as string (UUID or number)
      author: authorLabel,
      avatar: avatarFallback,
      time: toRelativeTime(p.createdAt),
      content: p.content,
      likes:
        typeof p.likesCount === 'number'
          ? p.likesCount
          : Array.isArray(p.likes)
            ? p.likes.length
            : 0,
      comments:
        typeof p.commentsCount === 'number'
          ? p.commentsCount
          : Array.isArray(p.comments)
            ? p.comments.length
            : 0,
      tags: p.tags ?? [],
      hidden: Boolean(p.hidden),
    };
  });
};
