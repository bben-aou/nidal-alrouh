'use client';

import { useState, useEffect } from 'react';

import { useAuth } from '@/contexts/auth-context';
import { useResourcesRealtime } from '@/hooks/use-resources-realtime';
import { useToast } from '@/hooks/use-toast';
import { ResourceApiService } from '@/services/resource-api.service';
import type { Resource, Bookmark, RecentlyViewedItem } from '@/types/resource';

function getErrorMessage(error: unknown): string | null {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return null;
}

export function useResourcesDashboard() {
  const { toast } = useToast();
  const { user } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [recommendedResources, setRecommendedResources] = useState<Resource[]>(
    []
  );
  const [allResources, setAllResources] = useState<Resource[]>([]);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [recentViews, setRecentViews] = useState<RecentlyViewedItem[]>([]);
  const [trendingResources, setTrendingResources] = useState<Resource[]>([]);

  const [loadingRecommended, setLoadingRecommended] = useState(true);
  const [loadingBookmarks, setLoadingBookmarks] = useState(false);
  const [loadingRecent, setLoadingRecent] = useState(false);
  const [loadingAll, setLoadingAll] = useState(false);
  const [loadingTrending, setLoadingTrending] = useState(false);

  useEffect(() => {
    fetchRecommendedResources();
  }, []);

  useResourcesRealtime({
    onResourceCreated: (resource) => {
      setRecommendedResources((prev) => [resource, ...prev].slice(0, 12));
    },
    onResourceDeleted: (resourceId) => {
      setRecommendedResources((prev) =>
        prev.filter((r) => r.id !== resourceId)
      );
      setAllResources((prev) => prev.filter((r) => r.id !== resourceId));
      setTrendingResources((prev) => prev.filter((r) => r.id !== resourceId));
    },
    onResourceBookmarked: (userId, resourceId) => {
      if (user?.id === userId) {
        const updateResource = (r: Resource) =>
          r.id === resourceId ? { ...r, isBookmarked: true } : r;

        setRecommendedResources((prev) => prev.map(updateResource));
        setAllResources((prev) => prev.map(updateResource));
        setTrendingResources((prev) => prev.map(updateResource));
      }
    },
    onResourceUnbookmarked: (userId, resourceId) => {
      if (user?.id === userId) {
        const updateResource = (r: Resource) =>
          r.id === resourceId ? { ...r, isBookmarked: false } : r;

        setRecommendedResources((prev) => prev.map(updateResource));
        setAllResources((prev) => prev.map(updateResource));
        setTrendingResources((prev) => prev.map(updateResource));
      }
    },
    onResourceCompleted: (userId, resourceId) => {
      if (user?.id === userId) {
        const updateResource = (r: Resource) =>
          r.id === resourceId ? { ...r, isCompleted: true } : r;

        setRecommendedResources((prev) => prev.map(updateResource));
        setAllResources((prev) => prev.map(updateResource));
        setTrendingResources((prev) => prev.map(updateResource));
      }
    },
  });

  const fetchRecommendedResources = async () => {
    try {
      setLoadingRecommended(true);
      const data = await ResourceApiService.getRecommendedResources(12);
      setRecommendedResources(data);
    } catch (error) {
      console.error('Failed to fetch recommendations:', error);
      const errorMessage = getErrorMessage(error);
      toast({
        title: 'Error',
        description: errorMessage || 'Failed to load recommended resources',
        variant: 'destructive',
      });
    } finally {
      setLoadingRecommended(false);
    }
  };

  const fetchBookmarks = async () => {
    try {
      setLoadingBookmarks(true);
      const data = await ResourceApiService.getBookmarks();
      setBookmarks(data);
    } catch (error) {
      console.error('Failed to fetch bookmarks:', error);
    } finally {
      setLoadingBookmarks(false);
    }
  };

  const fetchRecentViews = async () => {
    try {
      setLoadingRecent(true);
      const data = await ResourceApiService.getRecentViews(20);
      setRecentViews(data);
    } catch (error) {
      console.error('Failed to fetch recent views:', error);
    } finally {
      setLoadingRecent(false);
    }
  };

  const fetchAllResources = async () => {
    try {
      setLoadingAll(true);
      const response = await ResourceApiService.getAllResources({
        search: searchTerm || undefined,
        limit: 20,
      });
      setAllResources(response.data);
    } catch (error) {
      console.error('Failed to fetch all resources:', error);
    } finally {
      setLoadingAll(false);
    }
  };

  const fetchTrendingResources = async () => {
    try {
      setLoadingTrending(true);
      const data = await ResourceApiService.getTrendingResources(12);
      setTrendingResources(data);
    } catch (error) {
      console.error('Failed to fetch trending:', error);
    } finally {
      setLoadingTrending(false);
    }
  };

  const handleBookmark = async (resourceId: string) => {
    try {
      const resource = [
        ...recommendedResources,
        ...allResources,
        ...trendingResources,
      ].find((r) => r.id === resourceId);

      if (!resource) return;

      const wasBookmarked = resource.isBookmarked || false;
      const willBeBookmarked = !wasBookmarked;

      const updateResource = (r: Resource) =>
        r.id === resourceId ? { ...r, isBookmarked: willBeBookmarked } : r;

      setRecommendedResources((prev) => prev.map(updateResource));
      setAllResources((prev) => prev.map(updateResource));
      setTrendingResources((prev) => prev.map(updateResource));

      await ResourceApiService.toggleBookmark(resourceId, wasBookmarked);

      toast({
        title: wasBookmarked ? 'Bookmark removed' : 'Bookmark added',
        description: wasBookmarked
          ? 'Resource removed from bookmarks'
          : 'Resource added to bookmarks',
      });

      if (bookmarks.length > 0) {
        fetchBookmarks();
      }
    } catch (error) {
      const revertResource = (r: Resource) =>
        r.id === resourceId ? { ...r, isBookmarked: !r.isBookmarked } : r;

      setRecommendedResources((prev) => prev.map(revertResource));
      setAllResources((prev) => prev.map(revertResource));
      setTrendingResources((prev) => prev.map(revertResource));

      const errorMessage = getErrorMessage(error);
      toast({
        title: 'Error',
        description: errorMessage || 'Failed to update bookmark',
        variant: 'destructive',
      });
    }
  };

  const handleView = async (resourceId: string) => {
    try {
      await ResourceApiService.recordView(resourceId);
    } catch (error) {
      console.error('Failed to record view:', error);
    }
  };

  const handleTabChange = (tab: string) => {
    if (tab === 'bookmarks' && bookmarks.length === 0) {
      fetchBookmarks();
    } else if (tab === 'recent' && recentViews.length === 0) {
      fetchRecentViews();
    } else if (tab === 'all' && allResources.length === 0) {
      fetchAllResources();
    }
  };

  return {
    searchTerm,
    setSearchTerm,
    recommendedResources,
    allResources,
    bookmarks,
    recentViews,
    trendingResources,
    loadingRecommended,
    loadingBookmarks,
    loadingRecent,
    loadingAll,
    loadingTrending,
    fetchRecommendedResources,
    fetchBookmarks,
    fetchRecentViews,
    fetchAllResources,
    fetchTrendingResources,
    handleBookmark,
    handleView,
    handleTabChange,
  };
}
