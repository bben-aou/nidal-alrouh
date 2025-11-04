import { LucideIcon } from 'lucide-react';
import { KeyboardEvent, ChangeEvent } from 'react';
import { UseFormRegisterReturn, FieldError } from 'react-hook-form';

import { CreatePostFormData } from '@/lib/validations/community';

export interface CommunityPostItem {
  id: string | number;
  content: string;
  createdAt: string;
  hidden: boolean;
  tags: string[];
  isAnonymous?: boolean;
  isOwner?: boolean;
  likedByMe?: boolean;
  // Some APIs return counts, others return arrays; support both.
  likesCount?: number;
  commentsCount?: number;
  likes?: unknown[];
  comments?: unknown[];
  user?: {
    id: string;
    name?: string | null;
    email?: string;
    avatar?: string | null;
  } | null;
}

// Realtime event payloads
export interface RealtimePostCreated {
  id: string | number;
  content?: string | null;
  createdAt?: string;
  tags?: string[];
  isAnonymous?: boolean;
  userId?: string | number;
  user?: {
    id?: string;
    name?: string | null;
    avatar?: string | null;
  };
}

export interface RealtimePostCreatedPayload {
  post: RealtimePostCreated;
  timestamp: string;
}

export interface GetPostsParams {
  q?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  page?: number;
  limit?: number;
  total?: number;
}

export type GetPostsResponse = PaginatedResponse<CommunityPostItem>;

// ============================================================================
// Comment Interfaces
// ============================================================================

export interface CommentItem {
  id: string | number;
  content: string;
  createdAt: string;
  isAnonymous?: boolean;
  isOwner?: boolean;
  postId: string | number;
  user?: {
    id: string;
    name?: string | null;
    email?: string;
    avatar?: string | null;
  } | null;
}

export interface GetCommentsParams {
  limit?: number;
  cursor?: string;
}

export interface GetCommentsResponse {
  items: CommentItem[];
  nextCursor?: string;
}

export interface CreateCommentData {
  content: string;
  isAnonymous?: boolean;
}

// Realtime comment event payloads
export interface RealtimeCommentCreated {
  id: string | number;
  content: string;
  createdAt: string;
  isAnonymous?: boolean;
  postId: string | number;
  isOwner?: boolean;
  user?: {
    id: string;
    name?: string | null;
    avatar?: string | null;
  } | null;
}

export interface RealtimeCommentCreatedPayload {
  comment: RealtimeCommentCreated;
  timestamp: string;
}

// Community statistics interface
export interface CommunityStats {
  icon: LucideIcon;
  label: string;
  value: string | number;
  change: string;
  color: string;
}

// Legacy Post interface (for mock data compatibility)
export interface Post {
  id: string;
  author: string;
  avatar: string;
  time: string;
  content: string;
  likes: number;
  comments: number;
  tags: string[];
  hidden: boolean;
  likedByMe?: boolean;
}

// Support group interface
export interface SupportGroup {
  name: string;
  members: number;
  description: string;
  nextMeeting: string;
  isJoined: boolean;
}

// ============================================================================
// Component Props Interfaces
// ============================================================================

/**
 * Props for the AnonymousToggle component
 */
export interface AnonymousToggleProps {
  isAnonymous: boolean;
  onToggle: (checked: boolean) => void;
}

/**
 * Props for the PostContentInput component
 */
export interface PostContentInputProps {
  register: UseFormRegisterReturn;
  error?: FieldError;
}

/**
 * Props for the TagsSection component
 */
export interface TagsSectionProps {
  tags: string[];
  tagInput: string;
  isTagInputFocused: boolean;
  error?: { message?: string };
  onRemoveTag: (index: number) => void;
  onTagInputKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
  onTagInputBlur: () => void;
  onTagInputFocus: () => void;
  onTagInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

/**
 * Props for the SubmitButton component
 */
export interface SubmitButtonProps {
  isValid: boolean;
  hasContent: boolean;
}

/**
 * Props for the CreatePostCard component
 */
export interface CreatePostCardProps {
  className?: string;
  onPostSubmit?: (data: CreatePostFormData) => void;
}

/**
 * Props for the CommentItem component
 */
export interface CommentItemProps {
  comment: CommentItem;
  onDelete?: (commentId: string | number) => void;
  t: (key: string) => string;
}

/**
 * Props for the CommentList component
 */
export interface CommentListProps {
  postId: string | number;
  className?: string;
  t: (key: string) => string;
}

/**
 * Props for the CommentComposer component
 */
export interface CommentComposerProps {
  postId: string | number;
  onCommentCreated?: (comment: CommentItem) => void;
  className?: string;
  t: (key: string) => string;
}

export interface CommentListHeaderProps {
  total: number;
  t: (key: string) => string;
  className?: string;
}

export interface CommentsEmptyStateProps {
  t: (key: string) => string;
  className?: string;
}

export interface LoadMoreBarProps {
  loading: boolean;
  onLoadMore: () => void;
  label: string;
  className?: string;
}

// ============================================================================
// Report Types
// ============================================================================

export type ReportReason =
  | 'spam'
  | 'harassment'
  | 'misinformation'
  | 'inappropriate'
  | 'other';

export interface CreateReportData {
  reason: ReportReason;
}

export interface ReportPostModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  postId: string | number;
}
