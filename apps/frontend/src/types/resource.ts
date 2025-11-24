export interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'ARTICLE' | 'VIDEO' | 'LINK';
  content?: string;
  url?: string;
  tags: string[];
  authorId: string;
  createdAt: string;
  updatedAt: string;

  author: {
    id: string;
    name: string | null;
    avatarUrl: string | null;
  };

  isBookmarked?: boolean;
  isCompleted?: boolean;
  bookmarkProgress?: number;
  viewedAt?: string;
}

export interface ResourcesResponse {
  data: Resource[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface Bookmark {
  id: string;
  userId: string;
  resourceId: string;
  progress: number;
  createdAt: string;
  updatedAt: string;
  resource: Resource;
}

export interface RecentlyViewedItem extends Resource {
  viewedAt: string;
}
export interface UserResourceStats {
  totalViews: number;
  bookmarkCount: number;
  completionCount: number;
  topPreferences: {
    id: string;
    userId: string;
    tag: string;
    score: number;
  }[];
  byType: {
    ARTICLE: {
      completed: number;
      total: number;
    };
    VIDEO: {
      completed: number;
      total: number;
    };
    LINK: {
      completed: number;
      total: number;
    };
  };
}

export interface FindResourcesParams {
  type?: 'ARTICLE' | 'VIDEO' | 'LINK';
  tags?: string[];
  search?: string;
  page?: number;
  limit?: number;
}
