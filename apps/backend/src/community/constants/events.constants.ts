export const CommunityEvent = {
  PostCreated: 'post.created',
  PostUpdated: 'post.updated',
  PostDeleted: 'post.deleted',
  PostLiked: 'post.liked',
  PostUnliked: 'post.unliked',
  CommentCreated: 'comment.created',
  CommentDeleted: 'comment.deleted',
  PostHidden: 'post.hidden',
  PostUnhidden: 'post.unhidden',
  PostReported: 'post.reported',
} as const;

export type CommunityEventName =
  (typeof CommunityEvent)[keyof typeof CommunityEvent];
