'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import { GET_COMMUNITY_STATS_KEY } from '@/apis/community/queries/use-get-community-stats';
import { useAuth } from '@/contexts/auth-context';
import { useSocket } from '@/contexts/socket-context';
import { transformCommunityPosts } from '@/lib/utils/community';
import type {
  RealtimePostCreatedPayload,
  RealtimeCommentCreatedPayload,
  CommunityPostItem,
  CommentItem,
  Post,
} from '@/types/community';

interface UseCommunityRealtimeProps {
  onPostCreated?: (post: Post) => void;
  onPostDeleted?: (postId: string) => void;
  onPostHidden?: (postId: string) => void;
  onPostUnhidden?: (postId: string) => void;
  onPostLiked?: (payload: {
    postId: string;
    userId: string;
    likeCount: number;
  }) => void;
  onPostUnliked?: (payload: {
    postId: string;
    userId: string;
    likeCount: number;
  }) => void;
  onCommentCreated?: (payload: {
    postId: string;
    comment: CommentItem;
  }) => void;
  onCommentDeleted?: (payload: { postId: string; commentId: string }) => void;
  postIds?: string[];
  t: (key: string) => string;
}

export function useCommunityRealtime({
  onPostCreated,
  onPostDeleted,
  onPostHidden,
  onPostUnhidden,
  onPostLiked,
  onPostUnliked,
  onCommentCreated,
  onCommentDeleted,
  postIds,
  t,
}: UseCommunityRealtimeProps) {
  const socket = useSocket();
  const { user } = useAuth();
  const queryClient = useQueryClient();

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

        // Refresh community stats (posts and active members)
        queryClient.invalidateQueries({ queryKey: [GET_COMMUNITY_STATS_KEY] });
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

    const handlePostDeleted = (payload: {
      postId: string;
      timestamp: string;
    }) => {
      try {
        const postId = payload?.postId;
        if (!postId) return;
        if (onPostDeleted) {
          onPostDeleted(postId);
        }
        // Refresh community stats (posts and possibly active members)
        queryClient.invalidateQueries({ queryKey: [GET_COMMUNITY_STATS_KEY] });
      } catch (error) {
        console.error(
          '[useCommunityRealtime] Error handling post.deleted:',
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

    const handlePostLiked = (payload: {
      postId: string;
      userId: string;
      likeCount: number;
      timestamp: string;
    }) => {
      try {
        if (onPostLiked && payload?.postId) {
          onPostLiked({
            postId: payload.postId,
            userId: payload.userId,
            likeCount: payload.likeCount,
          });
        }
        // Ensure community stats refresh on like events
        queryClient.invalidateQueries({ queryKey: [GET_COMMUNITY_STATS_KEY] });
      } catch (error) {
        console.error(
          '[useCommunityRealtime] Error handling post.liked:',
          error
        );
      }
    };

    const handlePostUnliked = (payload: {
      postId: string;
      userId: string;
      likeCount: number;
      timestamp: string;
    }) => {
      try {
        if (onPostUnliked && payload?.postId) {
          onPostUnliked({
            postId: payload.postId,
            userId: payload.userId,
            likeCount: payload.likeCount,
          });
        }
        // Ensure community stats refresh on unlike events
        queryClient.invalidateQueries({ queryKey: [GET_COMMUNITY_STATS_KEY] });
      } catch (error) {
        console.error(
          '[useCommunityRealtime] Error handling post.unliked:',
          error
        );
      }
    };

    const handleCommentCreated = (payload: RealtimeCommentCreatedPayload) => {
      try {
        const rawComment = payload?.comment;
        if (!rawComment || !onCommentCreated) {
          return;
        }
        // Transform realtime payload to CommentItem format
        const comment: CommentItem = {
          id: rawComment.id,
          content: rawComment.content,
          createdAt: rawComment.createdAt,
          isAnonymous: Boolean(rawComment.isAnonymous),
          isOwner: rawComment.isOwner,
          // isOwner: user?.id ? String(rawComment.user?.id) === user.id : false,
          postId: rawComment.postId,
          user: rawComment.isAnonymous
            ? null
            : rawComment.user
              ? {
                  id: String(rawComment.user.id),
                  name: rawComment.user.name ?? undefined,
                  avatar: rawComment.user.avatar ?? null,
                }
              : undefined,
        };

        onCommentCreated({
          postId: String(rawComment.postId),
          comment,
        });

        // Refresh community stats (comments and active members)
        queryClient.invalidateQueries({ queryKey: [GET_COMMUNITY_STATS_KEY] });
      } catch (error) {
        console.error(
          '[useCommunityRealtime] Error handling comment.created:',
          error
        );
      }
    };

    const handleCommentDeleted = (payload: {
      postId: string;
      commentId: string;
      timestamp: string;
    }) => {
      try {
        if (!payload?.postId || !payload?.commentId || !onCommentDeleted) {
          return;
        }

        onCommentDeleted({
          postId: String(payload.postId),
          commentId: String(payload.commentId),
        });

        // Refresh community stats (comments and active members)
        queryClient.invalidateQueries({ queryKey: [GET_COMMUNITY_STATS_KEY] });
      } catch (error) {
        console.error(
          '[useCommunityRealtime] Error handling comment.deleted:',
          error
        );
      }
    };

    socket.on('post.created', handlePostCreated);
    socket.on('post.deleted', handlePostDeleted);
    socket.on('post.hidden', handlePostHidden);
    socket.on('post.unhidden', handlePostUnhidden);
    socket.on('post.liked', handlePostLiked);
    socket.on('post.unliked', handlePostUnliked);
    socket.on('comment.created', handleCommentCreated);
    socket.on('comment.deleted', handleCommentDeleted);

    return () => {
      socket.off('post.created', handlePostCreated);
      socket.off('post.deleted', handlePostDeleted);
      socket.off('post.hidden', handlePostHidden);
      socket.off('post.unhidden', handlePostUnhidden);
      socket.off('post.liked', handlePostLiked);
      socket.off('post.unliked', handlePostUnliked);
      socket.off('comment.created', handleCommentCreated);
      socket.off('comment.deleted', handleCommentDeleted);
    };
  }, [
    socket,
    onPostCreated,
    onPostDeleted,
    onPostHidden,
    onPostUnhidden,
    onPostLiked,
    onPostUnliked,
    onCommentCreated,
    onCommentDeleted,
  ]);

  // Join/leave post rooms for like/unlike realtime updates
  useEffect(() => {
    if (!socket) {
      return;
    }
    const ids = (postIds ?? []).map((id) => id.toString());
    if (ids.length === 0) {
      return;
    }

    ids.forEach((id) => {
      try {
        socket.emit('join-post', { postId: id });
      } catch (error) {
        console.error(
          '[useCommunityRealtime] Error joining post room:',
          id,
          error
        );
      }
    });

    return () => {
      ids.forEach((id) => {
        try {
          socket.emit('leave-post', { postId: id });
        } catch (error) {
          console.error(
            '[useCommunityRealtime] Error leaving post room:',
            id,
            error
          );
        }
      });
    };
  }, [socket, postIds]);
}
