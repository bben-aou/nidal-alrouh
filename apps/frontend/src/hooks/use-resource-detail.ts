'use client';

import { useEffect, useRef, useState } from 'react';

import { useToast } from '@/hooks/use-toast';
import { ResourceApiService } from '@/services/resource-api.service';
import type { Resource } from '@/types/resource';

function getErrorMessage(error: unknown): string | null {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return null;
}

export function useResourceDetail(id: string) {
  const { toast } = useToast();
  const [resource, setResource] = useState<Resource | null>(null);
  const [similarResources, setSimilarResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const fetchedRef = useRef(false);
  const currentIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!id || (fetchedRef.current && currentIdRef.current === id)) return;

    const fetchResource = async () => {
      try {
        fetchedRef.current = true;
        currentIdRef.current = id;
        setLoading(true);

        const [data, similar] = await Promise.all([
          ResourceApiService.getResourceById(id),
          ResourceApiService.getSimilarResources(id),
        ]);

        setResource(data);
        setIsBookmarked(data.isBookmarked || false);
        setIsCompleted(data.isCompleted || false);
        setSimilarResources(similar);

        ResourceApiService.recordView(id).catch((err) =>
          console.error('Failed to record view:', err)
        );
      } catch (error) {
        console.error('Failed to fetch resource:', error);
        fetchedRef.current = false;
      } finally {
        setLoading(false);
      }
    };

    fetchResource();

    return () => {
      if (currentIdRef.current !== id) {
        fetchedRef.current = false;
      }
    };
  }, [id]);

  const handleBookmark = async (t: (key: string) => string) => {
    if (!resource) return;

    try {
      const newStatus = !isBookmarked;
      setIsBookmarked(newStatus);

      await ResourceApiService.toggleBookmark(resource.id, !newStatus);

      toast({
        title: t(
          newStatus
            ? 'detail.toast.bookmarkAdded'
            : 'detail.toast.bookmarkRemoved'
        ),
        description: t(
          newStatus
            ? 'detail.toast.bookmarkAddedDesc'
            : 'detail.toast.bookmarkRemovedDesc'
        ),
      });
    } catch (error) {
      setIsBookmarked(!isBookmarked);
      const errorMessage = getErrorMessage(error);
      toast({
        title: t('detail.toast.error'),
        description: errorMessage || t('detail.toast.bookmarkError'),
        variant: 'destructive',
      });
    }
  };

  const handleComplete = async (t: (key: string) => string) => {
    if (!resource || isCompleted) return;

    try {
      setIsCompleted(true);
      await ResourceApiService.markComplete(resource.id);

      toast({
        title: t('detail.toast.resourceCompleted'),
        description: t('detail.toast.resourceCompletedDesc'),
      });
    } catch (error) {
      setIsCompleted(false);
      const errorMessage = getErrorMessage(error);
      toast({
        title: t('detail.toast.error'),
        description: errorMessage || t('detail.toast.completeError'),
        variant: 'destructive',
      });
    }
  };

  const handleShare = async (t: (key: string) => string) => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast({
        title: t('detail.toast.linkCopied'),
        description: t('detail.toast.linkCopiedDesc'),
      });
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return {
    resource,
    similarResources,
    loading,
    isBookmarked,
    isCompleted,
    handleBookmark,
    handleComplete,
    handleShare,
  };
}
