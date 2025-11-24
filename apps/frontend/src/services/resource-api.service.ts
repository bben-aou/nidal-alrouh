import type {
  Bookmark,
  FindResourcesParams,
  RecentlyViewedItem,
  Resource,
  ResourcesResponse,
  UserResourceStats,
} from '@/types/resource';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

/**
 * Resource API Service
 * Handles all HTTP requests to the backend resources API
 */
export class ResourceApiService {
  private static async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include', // Include cookies for authentication
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get all resources with optional filtering and pagination
   */
  static async getAllResources(
    params: FindResourcesParams = {}
  ): Promise<ResourcesResponse> {
    const queryParams = new URLSearchParams();

    if (params.type) queryParams.append('type', params.type);
    if (params.search) queryParams.append('search', params.search);
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.tags) {
      params.tags.forEach((tag) => queryParams.append('tags', tag));
    }

    return this.request<ResourcesResponse>(
      `/resources?${queryParams.toString()}`
    );
  }

  /**
   * Get a single resource by ID
   */
  static async getResourceById(id: string): Promise<Resource> {
    return this.request<Resource>(`/resources/${id}`);
  }

  /**
   * Get personalized recommendations for the current user
   */
  static async getRecommendedResources(
    limit: number = 10
  ): Promise<Resource[]> {
    return this.request<Resource[]>(`/resources/recommended?limit=${limit}`);
  }

  /**
   * Get trending resources
   */
  static async getTrendingResources(limit: number = 10): Promise<Resource[]> {
    return this.request<Resource[]>(`/resources/trending?limit=${limit}`);
  }

  /**
   * Get user's bookmarks
   */
  static async getBookmarks(): Promise<Bookmark[]> {
    return this.request<Bookmark[]>('/resources/bookmarks');
  }

  /**
   * Get recently viewed resources
   */
  static async getRecentViews(
    limit: number = 20
  ): Promise<RecentlyViewedItem[]> {
    return this.request<RecentlyViewedItem[]>(
      `/resources/recent-views?limit=${limit}`
    );
  }

  /**
   * Get similar resources based on tags
   */
  static async getSimilarResources(
    resourceId: string,
    limit: number = 5
  ): Promise<Resource[]> {
    return this.request<Resource[]>(
      `/resources/${resourceId}/similar?limit=${limit}`
    );
  }

  /**
   * Get user's resource statistics
   */
  static async getUserStats(): Promise<UserResourceStats> {
    return this.request<UserResourceStats>('/resources/stats');
  }

  /**
   * Create a new resource
   */
  static async createResource(data: {
    title: string;
    description: string;
    type: 'ARTICLE' | 'VIDEO' | 'LINK';
    content?: string;
    url?: string;
    tags?: string[];
  }): Promise<Resource> {
    return this.request<Resource>('/resources', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Update a resource
   */
  static async updateResource(
    id: string,
    data: Partial<{
      title: string;
      description: string;
      type: 'ARTICLE' | 'VIDEO' | 'LINK';
      content?: string;
      url?: string;
      tags?: string[];
    }>
  ): Promise<Resource> {
    return this.request<Resource>(`/resources/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  /**
   * Delete a resource
   */
  static async deleteResource(id: string): Promise<void> {
    return this.request<void>(`/resources/${id}`, {
      method: 'DELETE',
    });
  }

  /**
   * Record a resource view
   */
  static async recordView(resourceId: string): Promise<void> {
    return this.request<void>(`/resources/${resourceId}/view`, {
      method: 'POST',
      body: JSON.stringify({}),
    });
  }

  /**
   * Add a bookmark
   */
  static async addBookmark(resourceId: string): Promise<Bookmark> {
    return this.request<Bookmark>(`/resources/${resourceId}/bookmark`, {
      method: 'POST',
      body: JSON.stringify({}),
    });
  }

  /**
   * Remove a bookmark
   */
  static async removeBookmark(resourceId: string): Promise<void> {
    return this.request<void>(`/resources/${resourceId}/bookmark`, {
      method: 'DELETE',
    });
  }

  /**
   * Update bookmark progress
   */
  static async updateBookmarkProgress(
    resourceId: string,
    progress: number
  ): Promise<Bookmark> {
    return this.request<Bookmark>(
      `/resources/${resourceId}/bookmark/progress`,
      {
        method: 'PATCH',
        body: JSON.stringify({ progress }),
      }
    );
  }

  /**
   * Mark a resource as completed
   */
  static async markComplete(resourceId: string): Promise<void> {
    return this.request<void>(`/resources/${resourceId}/complete`, {
      method: 'POST',
      body: JSON.stringify({}),
    });
  }

  /**
   * Toggle bookmark status
   */
  static async toggleBookmark(
    resourceId: string,
    isCurrentlyBookmarked: boolean
  ): Promise<void | Bookmark> {
    if (isCurrentlyBookmarked) {
      return this.removeBookmark(resourceId);
    } else {
      return this.addBookmark(resourceId);
    }
  }
}
