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
