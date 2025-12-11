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
  likesCount?: number;
  commentsCount?: number;
  likes?: unknown[];
  comments?: unknown[];
  quotedPost?: {
    id: string | number;
    content: string;
    isAnonymous?: boolean;
    createdAt?: string;
    user?: {
      id?: string;
      name?: string | null;
      avatar?: string | null;
    } | null;
  };
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
  quotedPost?: {
    id?: string | number;
    content?: string;
    isAnonymous?: boolean;
    createdAt?: string;
    user?: {
      id?: string;
      name?: string | null;
      avatar?: string | null;
    } | null;
  };
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
  limit?: number;
  page?: number;
  /** Cursor for infinite pagination */
  cursor?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  page?: number;
  limit?: number;
  total?: number;
}

/**
 * Posts list API returns items plus an optional nextCursor for infinite pagination.
 */
export interface GetPostsResponse {
  items: CommunityPostItem[];
  nextCursor?: string;
}

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

// Community stats API response
export interface CommunityStatsResponse {
  totalPosts: number;
  totalPostsChange: number;
  totalLikes: number;
  totalLikesChange: number;
  totalComments: number;
  totalCommentsChange: number;
  activeMembers: number;
  activeMembersChange: number;
  upcomingEvents: number;
  upcomingEventsChange: number;
  period: {
    start: string;
    end: string;
  };
}

export interface GetCommunityStatsParams {
  period?: import('./journal').StatsPeriod;
  startDate?: string;
  endDate?: string;
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
  /** Optional quoted post preview when this post is a repost-with-comment */
  quotedPost?: {
    id: string;
    author?: string | null;
    content: string;
    hidden?: boolean;
    avatar?: string;
    time?: string;
  };
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
// Community Event Types
// ============================================================================

export type EventType =
  | 'workshop'
  | 'supportSession'
  | 'consultation'
  | 'communityMeeting'
  | 'webinar';
export type EventStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled';

export interface CommunityEvent {
  id: string;
  title: string;
  description: string;
  type: EventType;
  status: EventStatus;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  timezone: string;
  location?: string;
  meetingUrl?: string;
  maxAttendees?: number;
  currentAttendees: number;
  isRegistered: boolean;
  requiresApproval: boolean;
  coverImage?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  organizer: {
    id: string;
    name: string;
    avatar?: string | null;
    role?: string;
  };
  attendees?: Array<{
    id: string;
    name: string;
    avatar?: string | null;
    registeredAt: string;
  }>;
}

export interface GetEventsParams {
  q?: string;
  type?: EventType;
  status?: EventStatus;
  startDate?: string;
  endDate?: string;
  limit?: number;
  cursor?: string;
}

export interface GetEventsResponse {
  items: CommunityEvent[];
  nextCursor?: string;
  total: number;
}

export interface CreateEventData {
  title: string;
  description: string;
  type: EventType;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  timezone: string;
  location?: string;
  meetingUrl?: string;
  maxAttendees?: number;
  requiresApproval: boolean;
  coverImage?: string;
  tags: string[];
}

export interface UpdateEventData extends Partial<CreateEventData> {
  id: string;
}

export interface EventRegistrationData {
  eventId: string;
  userId: string;
  notes?: string;
}

export type EventRegistrationAction = 'register' | 'unregister';

export interface EventRegistrationUpdatePayload {
  userId: string;
  action: EventRegistrationAction;
  currentAttendees?: number;
}

export interface EventRegistrationUpdatedMessage {
  eventId: string;
  payload: EventRegistrationUpdatePayload;
  timestamp: string;
}

export interface EventFilters {
  search?: string;
  type?: EventType;
  status?: EventStatus;
  dateRange?: {
    start: Date;
    end: Date;
  };
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
  quotedPost?: Post;
  onRemoveQuotedPost?: () => void;
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
