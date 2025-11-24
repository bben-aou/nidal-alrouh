'use client';

import { useEffect } from 'react';

import { useResourcesSocket } from '@/contexts/socket-context';
import type { Resource } from '@/types/resource';

interface UseResourcesRealtimeProps {
  onResourceCreated?: (resource: Resource) => void;
  onResourceUpdated?: (resourceId: string, resource: Resource) => void;
  onResourceDeleted?: (resourceId: string) => void;
  onResourceBookmarked?: (userId: string, resourceId: string) => void;
  onResourceUnbookmarked?: (userId: string, resourceId: string) => void;
  onResourceViewed?: (userId: string, resourceId: string) => void;
  onResourceCompleted?: (userId: string, resourceId: string) => void;
  onBookmarkProgressUpdated?: (
    userId: string,
    resourceId: string,
    progress: number
  ) => void;
  onUserStatsUpdated?: (userId: string) => void;
}

export function useResourcesRealtime({
  onResourceCreated,
  onResourceUpdated,
  onResourceDeleted,
  onResourceBookmarked,
  onResourceUnbookmarked,
  onResourceViewed,
  onResourceCompleted,
  onBookmarkProgressUpdated,
  onUserStatsUpdated,
}: UseResourcesRealtimeProps) {
  const socket = useResourcesSocket();

  useEffect(() => {
    if (!socket) {
      return;
    }

    const handleResourceCreated = (payload: {
      resource: Resource;
      timestamp: string;
    }) => {
      if (onResourceCreated && payload?.resource) {
        onResourceCreated(payload.resource);
      }
    };

    const handleResourceUpdated = (payload: {
      resourceId: string;
      resource: Resource;
      timestamp: string;
    }) => {
      if (onResourceUpdated && payload?.resourceId && payload?.resource) {
        onResourceUpdated(payload.resourceId, payload.resource);
      }
    };

    const handleResourceDeleted = (payload: {
      resourceId: string;
      timestamp: string;
    }) => {
      if (onResourceDeleted && payload?.resourceId) {
        onResourceDeleted(payload.resourceId);
      }
    };

    const handleResourceBookmarked = (payload: {
      userId: string;
      resourceId: string;
      timestamp: string;
    }) => {
      if (onResourceBookmarked && payload?.userId && payload?.resourceId) {
        onResourceBookmarked(payload.userId, payload.resourceId);
      }
    };

    const handleResourceUnbookmarked = (payload: {
      userId: string;
      resourceId: string;
      timestamp: string;
    }) => {
      if (onResourceUnbookmarked && payload?.userId && payload?.resourceId) {
        onResourceUnbookmarked(payload.userId, payload.resourceId);
      }
    };

    const handleResourceViewed = (payload: {
      userId: string;
      resourceId: string;
      timestamp: string;
    }) => {
      if (onResourceViewed && payload?.userId && payload?.resourceId) {
        onResourceViewed(payload.userId, payload.resourceId);
      }
    };

    const handleResourceCompleted = (payload: {
      userId: string;
      resourceId: string;
      timestamp: string;
    }) => {
      if (onResourceCompleted && payload?.userId && payload?.resourceId) {
        onResourceCompleted(payload.userId, payload.resourceId);
      }
    };

    const handleBookmarkProgressUpdated = (payload: {
      userId: string;
      resourceId: string;
      progress: number;
      timestamp: string;
    }) => {
      if (
        onBookmarkProgressUpdated &&
        payload?.userId &&
        payload?.resourceId &&
        payload?.progress !== undefined
      ) {
        onBookmarkProgressUpdated(
          payload.userId,
          payload.resourceId,
          payload.progress
        );
      }
    };

    const handleUserStatsUpdated = (payload: {
      userId: string;
      timestamp: string;
    }) => {
      if (onUserStatsUpdated && payload?.userId) {
        onUserStatsUpdated(payload.userId);
      }
    };

    socket.on('resource.created', handleResourceCreated);
    socket.on('resource.updated', handleResourceUpdated);
    socket.on('resource.deleted', handleResourceDeleted);
    socket.on('resource.bookmarked', handleResourceBookmarked);
    socket.on('resource.unbookmarked', handleResourceUnbookmarked);
    socket.on('resource.viewed', handleResourceViewed);
    socket.on('resource.completed', handleResourceCompleted);
    socket.on('bookmark.progress.updated', handleBookmarkProgressUpdated);
    socket.on('user.stats.updated', handleUserStatsUpdated);

    return () => {
      socket.off('resource.created', handleResourceCreated);
      socket.off('resource.updated', handleResourceUpdated);
      socket.off('resource.deleted', handleResourceDeleted);
      socket.off('resource.bookmarked', handleResourceBookmarked);
      socket.off('resource.unbookmarked', handleResourceUnbookmarked);
      socket.off('resource.viewed', handleResourceViewed);
      socket.off('resource.completed', handleResourceCompleted);
      socket.off('bookmark.progress.updated', handleBookmarkProgressUpdated);
      socket.off('user.stats.updated', handleUserStatsUpdated);
    };
  }, [
    socket,
    onResourceCreated,
    onResourceUpdated,
    onResourceDeleted,
    onResourceBookmarked,
    onResourceUnbookmarked,
    onResourceViewed,
    onResourceCompleted,
    onBookmarkProgressUpdated,
    onUserStatsUpdated,
  ]);
}
