import { api } from '@/lib/api';

export interface CommunityPost {
  id: string;
  content: string;
  authorId?: string;
  type?: 'POLL' | 'POST';
  createdAt: string;
  updatedAt: string;
  pinned?: boolean;
  isAnonymous?: boolean;
  user: {
    id: string;
    name: string | null;
    avatarUrl?: string | null;
  } | null;
  _count?: {
    likes: number;
    comments: number;
  };
  likesCount?: number;
  commentsCount?: number;
  hasLiked?: boolean;
}

export interface GetPostsResponse {
  items: CommunityPost[];
  nextCursor?: string;
}

export class CommunityApiService {
  /**
   * Get community posts
   */
  static async getPosts(
    params: {
      limit?: number;
      cursor?: string;
    } = {}
  ): Promise<GetPostsResponse> {
    const queryParams = new URLSearchParams();
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.cursor) queryParams.append('cursor', params.cursor);

    return await api.get<GetPostsResponse>(
      `/community/posts?${queryParams.toString()}`
    );
  }
}
