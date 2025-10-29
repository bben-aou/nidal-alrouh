'use client';

import { useEffect } from 'react';

import { useSocket } from '@/contexts/socket-context';
import { transformCommunityPosts } from '@/lib/utils/community';
import type {
  RealtimePostCreatedPayload,
  CommunityPostItem,
  Post,
} from '@/types/community';

interface UseCommunityRealtimeProps {
  onPostCreated?: (post: Post) => void;
  onPostHidden?: (postId: string) => void;
  onPostUnhidden?: (postId: string) => void;
}

export function useCommunityRealtime({
  onPostCreated,
  onPostHidden,
  onPostUnhidden,
}: UseCommunityRealtimeProps) {
  const socket = useSocket();

  useEffect(() => {
    if (!socket) {
      return;
    }

    const handlePostCreated = (payload: RealtimePostCreatedPayload) => {
      try {
        const raw = payload?.post;
        if (!raw) {
          return;
        }

        // Transform realtime payload to CommunityPostItem format
        const item: CommunityPostItem = {
          id: raw.id,
          content: raw.content ?? '',
          createdAt: raw.createdAt ?? new Date().toISOString(),
          hidden: false,
          tags: Array.isArray(raw.tags) ? raw.tags : [],
          user: {
            id: String(raw.userId ?? ''),
            name: undefined,
            email: undefined,
            avatar: null,
          },
        };

        const transformedPosts = transformCommunityPosts([item]);
        const newPost = transformedPosts[0];

        if (onPostCreated && newPost) {
          onPostCreated(newPost);
        }
      } catch (error) {
        console.error('[useCommunityRealtime] Error transforming post:', error);
      }
    };

    const handlePostHidden = (payload: {
      postId: string;
      userId: string;
      timestamp: string;
    }) => {
      try {
        if (onPostHidden && payload?.postId) {
          onPostHidden(payload.postId);
        }
      } catch (error) {
        console.error(
          '[useCommunityRealtime] Error handling post.hidden:',
          error
        );
      }
    };

    const handlePostUnhidden = (payload: {
      postId: string;
      userId: string;
      timestamp: string;
    }) => {
      try {
        if (onPostUnhidden && payload?.postId) {
          onPostUnhidden(payload.postId);
        }
      } catch (error) {
        console.error(
          '[useCommunityRealtime] Error handling post.unhidden:',
          error
        );
      }
    };

    socket.on('post.created', handlePostCreated);
    socket.on('post.hidden', handlePostHidden);
    socket.on('post.unhidden', handlePostUnhidden);

    return () => {
      socket.off('post.created', handlePostCreated);
      socket.off('post.hidden', handlePostHidden);
      socket.off('post.unhidden', handlePostUnhidden);
    };
  }, [socket, onPostCreated, onPostHidden, onPostUnhidden]);
}
