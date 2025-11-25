'use client';

import { useState, useEffect, useRef, useMemo } from 'react';

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

  // Pagination state
  const [recommendedPage, setRecommendedPage] = useState(1);
  const [allPage, setAllPage] = useState(1);
  const [bookmarksPage, setBookmarksPage] = useState(1);
  const [recentPage, setRecentPage] = useState(1);
  const ITEMS_PER_PAGE = 12;

  const [hasMoreRecommended, setHasMoreRecommended] = useState(true);
  const [hasMoreAll, setHasMoreAll] = useState(true);
  const [hasMoreBookmarks, setHasMoreBookmarks] = useState(true);
  const [hasMoreRecent, setHasMoreRecent] = useState(true);

  const [loadingMoreRecommended, setLoadingMoreRecommended] = useState(false);
  const [loadingMoreAll, setLoadingMoreAll] = useState(false);
  const [loadingMoreBookmarks, setLoadingMoreBookmarks] = useState(false);
  const [loadingMoreRecent, setLoadingMoreRecent] = useState(false);

  const isInitialMount = useRef(true);

  useEffect(() => {
    fetchRecommendedResources();
  }, []);

  useEffect(() => {
    if (isInitialMount.current && !searchTerm) {
      isInitialMount.current = false;
      return;
    }

    const timer = setTimeout(() => {
      setAllPage(1);
      fetchAllResources(true);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useResourcesRealtime({
    onResourceCreated: (resource) => {
      setRecommendedResources((prev) =>
        [resource, ...prev].slice(0, ITEMS_PER_PAGE)
      );
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

  const fetchRecommendedResources = async (reset = true) => {
    try {
      setLoadingRecommended(true);
      const page = reset ? 1 : recommendedPage;
      const data = await ResourceApiService.getRecommendedResources(
        ITEMS_PER_PAGE,
        page
      );

      if (reset) {
        setRecommendedResources(data);
        setRecommendedPage(1);
      } else {
        setRecommendedResources((prev) => [...prev, ...data]);
      }

      setHasMoreRecommended(data.length === ITEMS_PER_PAGE);
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

  const loadMoreRecommended = async () => {
    if (!hasMoreRecommended || loadingMoreRecommended) return;

    try {
      setLoadingMoreRecommended(true);
      const nextPage = recommendedPage + 1;
      const data = await ResourceApiService.getRecommendedResources(
        ITEMS_PER_PAGE,
        nextPage
      );

      setRecommendedResources((prev) => [...prev, ...data]);
      setRecommendedPage(nextPage);
      setHasMoreRecommended(data.length === ITEMS_PER_PAGE);
    } catch (error) {
      console.error('Failed to load more recommendations:', error);
    } finally {
      setLoadingMoreRecommended(false);
    }
  };

  const fetchBookmarks = async (reset = true) => {
    try {
      setLoadingBookmarks(true);
      const page = reset ? 1 : bookmarksPage;
      const data = await ResourceApiService.getBookmarks(ITEMS_PER_PAGE, page);

      if (reset) {
        setBookmarks(data);
        setBookmarksPage(1);
      } else {
        setBookmarks((prev) => [...prev, ...data]);
      }

      setHasMoreBookmarks(data.length === ITEMS_PER_PAGE);
    } catch (error) {
      console.error('Failed to fetch bookmarks:', error);
    } finally {
      setLoadingBookmarks(false);
    }
  };

  const loadMoreBookmarks = async () => {
    if (!hasMoreBookmarks || loadingMoreBookmarks) return;

    try {
      setLoadingMoreBookmarks(true);
      const nextPage = bookmarksPage + 1;
      const data = await ResourceApiService.getBookmarks(
        ITEMS_PER_PAGE,
        nextPage
      );

      setBookmarks((prev) => [...prev, ...data]);
      setBookmarksPage(nextPage);
      setHasMoreBookmarks(data.length === ITEMS_PER_PAGE);
    } catch (error) {
      console.error('Failed to load more bookmarks:', error);
    } finally {
      setLoadingMoreBookmarks(false);
    }
  };

  const fetchRecentViews = async (reset = true) => {
    try {
      setLoadingRecent(true);
      const page = reset ? 1 : recentPage;
      const data = await ResourceApiService.getRecentViews(
        ITEMS_PER_PAGE,
        page
      );

      if (reset) {
        setRecentViews(data);
        setRecentPage(1);
      } else {
        setRecentViews((prev) => [...prev, ...data]);
      }

      setHasMoreRecent(data.length === ITEMS_PER_PAGE);
    } catch (error) {
      console.error('Failed to fetch recent views:', error);
    } finally {
      setLoadingRecent(false);
    }
  };

  const loadMoreRecent = async () => {
    if (!hasMoreRecent || loadingMoreRecent) return;

    try {
      setLoadingMoreRecent(true);
      const nextPage = recentPage + 1;
      const data = await ResourceApiService.getRecentViews(
        ITEMS_PER_PAGE,
        nextPage
      );

      setRecentViews((prev) => [...prev, ...data]);
      setRecentPage(nextPage);
      setHasMoreRecent(data.length === ITEMS_PER_PAGE);
    } catch (error) {
      console.error('Failed to load more recent views:', error);
    } finally {
      setLoadingMoreRecent(false);
    }
  };

  const fetchAllResources = async (reset = true) => {
    try {
      setLoadingAll(true);
      const page = reset ? 1 : allPage;
      const response = await ResourceApiService.getAllResources({
        search: searchTerm || undefined,
        limit: ITEMS_PER_PAGE,
        page,
      });

      if (reset) {
        setAllResources(response.data);
        setAllPage(1);
      } else {
        setAllResources((prev) => [...prev, ...response.data]);
      }

      setHasMoreAll(response.data.length === ITEMS_PER_PAGE);
    } catch (error) {
      console.error('Failed to fetch all resources:', error);
    } finally {
      setLoadingAll(false);
    }
  };

  const loadMoreAll = async () => {
    if (!hasMoreAll || loadingMoreAll) return;

    try {
      setLoadingMoreAll(true);
      const nextPage = allPage + 1;
      const response = await ResourceApiService.getAllResources({
        search: searchTerm || undefined,
        limit: ITEMS_PER_PAGE,
        page: nextPage,
      });

      setAllResources((prev) => [...prev, ...response.data]);
      setAllPage(nextPage);
      setHasMoreAll(response.data.length === ITEMS_PER_PAGE);
    } catch (error) {
      console.error('Failed to load more resources:', error);
    } finally {
      setLoadingMoreAll(false);
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
        fetchBookmarks(true);
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

  const filterResources = (resources: Resource[]) => {
    if (!searchTerm.trim()) return resources;

    const lowerSearch = searchTerm.toLowerCase();
    return resources.filter((resource) => {
      return (
        resource.title?.toLowerCase().includes(lowerSearch) ||
        resource.description?.toLowerCase().includes(lowerSearch) ||
        resource.tags?.some((tag) => tag.toLowerCase().includes(lowerSearch)) ||
        resource.content?.toLowerCase().includes(lowerSearch)
      );
    });
  };

  const filterBookmarks = (items: Bookmark[]) => {
    if (!searchTerm.trim()) return items;

    const lowerSearch = searchTerm.toLowerCase();
    return items.filter((bookmark) => {
      const { resource } = bookmark;
      return (
        resource.title?.toLowerCase().includes(lowerSearch) ||
        resource.description?.toLowerCase().includes(lowerSearch) ||
        resource.tags?.some((tag) => tag.toLowerCase().includes(lowerSearch)) ||
        resource.content?.toLowerCase().includes(lowerSearch)
      );
    });
  };

  const filterRecentViews = (items: RecentlyViewedItem[]) => {
    if (!searchTerm.trim()) return items;

    const lowerSearch = searchTerm.toLowerCase();
    return items.filter((item) => {
      return (
        item.title?.toLowerCase().includes(lowerSearch) ||
        item.description?.toLowerCase().includes(lowerSearch) ||
        item.tags?.some((tag: string) =>
          tag.toLowerCase().includes(lowerSearch)
        ) ||
        item.content?.toLowerCase().includes(lowerSearch)
      );
    });
  };

  const filteredRecommended = useMemo(
    () => filterResources(recommendedResources),
    [recommendedResources, searchTerm]
  );

  const filteredBookmarks = useMemo(
    () => filterBookmarks(bookmarks),
    [bookmarks, searchTerm]
  );

  const filteredRecentViews = useMemo(
    () => filterRecentViews(recentViews),
    [recentViews, searchTerm]
  );

  return {
    searchTerm,
    setSearchTerm,
    recommendedResources: filteredRecommended,
    allResources,
    bookmarks: filteredBookmarks,
    recentViews: filteredRecentViews,
    trendingResources,
    loadingRecommended,
    loadingBookmarks,
    loadingRecent,
    loadingAll,
    loadingTrending,
    loadingMoreRecommended,
    loadingMoreAll,
    loadingMoreBookmarks,
    loadingMoreRecent,
    hasMoreRecommended,
    hasMoreAll,
    hasMoreBookmarks,
    hasMoreRecent,
    fetchRecommendedResources,
    fetchBookmarks,
    fetchRecentViews,
    fetchAllResources,
    fetchTrendingResources,
    loadMoreRecommended,
    loadMoreAll,
    loadMoreBookmarks,
    loadMoreRecent,
    handleBookmark,
    handleView,
    handleTabChange,
  };
}
