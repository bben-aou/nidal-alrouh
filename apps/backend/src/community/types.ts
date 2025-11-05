import { PostReport, PostPrivacy } from '@prisma/client';

// Base types for sanitized entities
export interface SanitizedUser {
  id: string;
  name: string | null;
  email?: string;
}

export interface SanitizedPost {
  id: string;
  content: string;
  tags: string[];
  isAnonymous: boolean;
  privacy: PostPrivacy;
  locale?: string | null;
  userId?: string;
  user?: SanitizedUser | null;
  createdAt: Date;
  updatedAt: Date;
  isOwner: boolean;
  likedByMe: boolean;
  likesCount: number;
  commentsCount: number;
  quotedPost?: {
    id: string;
    content: string;
    isAnonymous: boolean;
    user?: SanitizedUser | null;
    createdAt: Date;
  };
}

export interface SanitizedComment {
  id: string;
  content: string;
  isAnonymous: boolean;
  userId?: string;
  user?: SanitizedUser | null;
  postId: string;
  createdAt: Date;
  updatedAt: Date;
  isOwner: boolean;
}

// Event interfaces
export interface PostCreatedEvent {
  post: SanitizedPost;
}

export interface PostLikedEvent {
  postId: string;
  userId: string;
  likeCount: number;
}

export interface PostUnlikedEvent {
  postId: string;
  userId: string;
  likeCount: number;
}

export interface CommentCreatedEvent {
  postId: string;
  comment: SanitizedComment;
  authorUserId: string;
}

export interface PostUpdatedEvent {
  postId: string;
  post: SanitizedPost;
}

export interface PostDeletedEvent {
  postId: string;
}

export interface CommentDeletedEvent {
  postId: string;
  commentId: string;
}

export interface PostHiddenEvent {
  userId: string;
  postId: string;
}

export interface PostUnhiddenEvent {
  userId: string;
  postId: string;
}

export interface PostReportedEvent {
  postId: string;
  report: PostReport;
}

export interface Notification {
  type: string;
  title: string;
  message: string;
  data?: Record<string, unknown>;
}
