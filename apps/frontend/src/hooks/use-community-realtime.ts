'use client';

import { useEffect } from 'react';

import { useAuth } from '@/contexts/auth-context';
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
  t: (key: string) => string;
}

export function useCommunityRealtime({
  onPostCreated,
  onPostHidden,
  onPostUnhidden,
  t,
}: UseCommunityRealtimeProps) {
  const socket = useSocket();
  const { user } = useAuth();

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
        const rawUser = raw.user;
        const item: CommunityPostItem = {
          id: raw.id,
          content: raw.content ?? '',
          createdAt: raw.createdAt ?? new Date().toISOString(),
          hidden: false,
          tags: Array.isArray(raw.tags) ? raw.tags : [],
          isAnonymous: Boolean(raw.isAnonymous),
          isOwner: user?.id ? String(raw.userId) === user.id : false,
          user: raw.isAnonymous
            ? null
            : rawUser
              ? {
                  id: String(rawUser.id ?? ''),
                  name: rawUser.name ?? undefined,
                  avatar: rawUser.avatar ?? null,
                }
              : undefined,
        };

        const transformedPosts = transformCommunityPosts([item], t);
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
