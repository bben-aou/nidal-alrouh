import { KeyboardEvent, ChangeEvent } from 'react';
import { UseFormRegisterReturn, FieldError } from 'react-hook-form';

import { CreatePostFormData } from '@/lib/validations/community';

export interface CommunityPostItem {
  id: string | number;
  content: string;
  createdAt: string;
  hidden: boolean;
  tags: string[];
  // Some APIs return counts, others return arrays; support both.
  likesCount?: number;
  commentsCount?: number;
  likes?: unknown[];
  comments?: unknown[];
  user: {
    id: string;
    name?: string | null;
    email?: string;
    avatar?: string | null;
  };
}

// Realtime event payloads
export interface RealtimePostCreated {
  id: string | number;
  content?: string | null;
  createdAt?: string;
  tags?: string[];
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

// Community statistics interface
export interface CommunityStats {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
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
