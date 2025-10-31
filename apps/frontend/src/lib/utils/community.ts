import { formatDistanceToNow } from 'date-fns';

import { type CommunityPostItem, type Post } from '@/types/community';

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
    };
  });
};
