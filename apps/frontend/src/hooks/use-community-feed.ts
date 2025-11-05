'use client';

import { useQueryClient, InfiniteData } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

import {
  useGetPosts,
  useCreatePost,
  useLikePost,
  useUnlikePost,
  useHidePost,
  useUnhidePost,
} from '@/apis/community/queries';
import { GET_COMMUNITY_STATS_KEY } from '@/apis/community/queries/use-get-community-stats';
import { useAuth } from '@/contexts/auth-context';
import { useCommunityRealtime } from '@/hooks/use-community-realtime';
import { transformCommunityPosts } from '@/lib/utils/community';
import type {
  Post,
  GetCommentsResponse,
  GetPostsResponse,
} from '@/types/community';

type TFunction = (key: string) => string;

interface UseCommunityFeedParams {
  locale: string;
  t: TFunction;
}

interface UseCommunityFeedResult {
  posts: Post[];
  visiblePosts: Post[];
  isLoading: boolean;
  handlePostSubmit: (data: {
    content: string;
    tags: string[];
    isAnonymous: boolean;
    quotedPostId?: string;
  }) => void;
  handlePostLike: (postId: string) => void;
  handlePostComment: (postId: string) => void;
  handlePostShare: (postId: string) => void;
  handlePostReport: (postId: string) => void;
  handlePostHide: (postId: string) => void;
  handlePostUnhide: (postId: string) => void;
}

export function useCommunityFeed({
  locale,
  t,
}: UseCommunityFeedParams): UseCommunityFeedResult {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Initialize API hooks with localized toast handling, avoiding duplicate toasts
  const createPostMutation = useCreatePost({
    config: {
      onSuccess: (resp) => {
        toast.success(
          resp?.message || t('dashboard.messages.createPostSuccess')
        );
        queryClient.invalidateQueries({ queryKey: ['community', 'posts'] });
      },
      onError: (error) => {
        toast.error(error?.message || t('dashboard.messages.createPostError'));
      },
    },
  });

  const likePostMutation = useLikePost({
    config: {
      onSuccess: () => {
        // Avoid success toast duplication; rely on optimistic UI and cache refresh
        queryClient.invalidateQueries({ queryKey: ['community', 'posts'] });
        queryClient.invalidateQueries({ queryKey: [GET_COMMUNITY_STATS_KEY] });
      },
      onError: (err) => {
        toast.error(err.message || t('dashboard.messages.likePostError'));
      },
    },
  });

  const unlikePostMutation = useUnlikePost({
    config: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['community', 'posts'] });
        queryClient.invalidateQueries({ queryKey: [GET_COMMUNITY_STATS_KEY] });
      },
      onError: (err) => {
        toast.error(err.message || t('dashboard.messages.unlikePostError'));
      },
    },
  });

  const hidePostMutation = useHidePost({
    config: {
      onSuccess: (resp) => {
        toast.success(resp?.message || t('dashboard.messages.hidePostSuccess'));
        queryClient.invalidateQueries({ queryKey: ['community', 'posts'] });
      },
      onError: (err) => {
        toast.error(err.message || t('dashboard.messages.hidePostError'));
      },
    },
  });

  const unhidePostMutation = useUnhidePost({
    config: {
      onSuccess: (resp) => {
        toast.success(
          resp?.message || t('dashboard.messages.unhidePostSuccess')
        );
        queryClient.invalidateQueries({ queryKey: ['community', 'posts'] });
      },
      onError: (err) => {
        toast.error(err.message || t('dashboard.messages.unhidePostError'));
      },
    },
  });

  // Fetch server posts and seed local UI state
  const { posts: serverPosts, isLoading } = useGetPosts({
    params: { limit: 20 },
  });

  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    if (serverPosts?.length) {
      setPosts(transformCommunityPosts(serverPosts, t));
    }
  }, [serverPosts, t]);

  const visiblePostIds = useMemo(
    () => posts.filter((p) => !p.hidden).map((p) => p.id.toString()),
    [posts]
  );

  // Realtime: handle post creation, hiding, unhide, likes, comments
  useCommunityRealtime({
    onPostCreated: (newPost) => {
      setPosts((prev) => {
        const existingPost = prev.find((p) => p.id === newPost.id);
        if (existingPost) return prev;
        return [newPost, ...prev];
      });
    },
    onPostDeleted: (postId) => {
      // Remove post from local state
      setPosts((prev) => prev.filter((p) => p.id !== postId));

      // Remove post from posts query cache
      queryClient.setQueryData<GetPostsResponse>(
        ['community', 'posts'],
        (oldData) => {
          if (!oldData?.items) return oldData;
          return {
            ...oldData,
            items: oldData.items.filter(
              (p) => p.id.toString() !== postId.toString()
            ),
          };
        }
      );

      // Stats invalidation is handled in useCommunityRealtime
    },
    onPostHidden: (postId) => {
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId ? { ...post, hidden: true } : post
        )
      );
    },
    onPostUnhidden: (postId) => {
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId ? { ...post, hidden: false } : post
        )
      );
    },
    onPostLiked: ({ postId, userId, likeCount }) => {
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId
            ? {
                ...post,
                likes: likeCount,
                likedByMe: user?.id
                  ? userId === user.id
                    ? true
                    : post.likedByMe
                  : post.likedByMe,
              }
            : post
        )
      );
    },
    onPostUnliked: ({ postId, userId, likeCount }) => {
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId
            ? {
                ...post,
                likes: likeCount,
                likedByMe: user?.id
                  ? userId === user.id
                    ? false
                    : post.likedByMe
                  : post.likedByMe,
              }
            : post
        )
      );
    },
    onCommentCreated: ({ postId, comment }) => {
      const commentsQueryKey = ['community', 'comments', postId.toString()];
      let insertedComment = false;
      queryClient.setQueryData<InfiniteData<GetCommentsResponse>>(
        commentsQueryKey,
        (oldData) => {
          if (!oldData) {
            insertedComment = true;
            return {
              pageParams: [undefined],
              pages: [{ items: [comment], nextCursor: undefined }],
            } as InfiniteData<GetCommentsResponse>;
          }
          const exists = oldData.pages.some((page) =>
            page.items.some((c) => String(c.id) === String(comment.id))
          );
          if (exists) {
            insertedComment = false;
            return oldData;
          }
          insertedComment = true;
          const newPages = [...oldData.pages];
          if (newPages[0]) {
            newPages[0] = {
              ...newPages[0],
              items: [comment, ...newPages[0].items],
            };
          } else {
            newPages[0] = { items: [comment], nextCursor: undefined };
          }
          return { ...oldData, pages: newPages };
        }
      );

      if (insertedComment) {
        queryClient.setQueryData<GetPostsResponse>(
          ['community', 'posts'],
          (oldData) => {
            if (!oldData?.items) return oldData;
            return {
              ...oldData,
              items: oldData.items.map((p) =>
                p.id.toString() === postId.toString()
                  ? { ...p, commentsCount: (p.commentsCount || 0) + 1 }
                  : p
              ),
            };
          }
        );

        setPosts((prev) =>
          prev.map((p) =>
            p.id.toString() === postId.toString()
              ? { ...p, comments: (p.comments ?? 0) + 1 }
              : p
          )
        );
      }
    },
    onCommentDeleted: ({ postId, commentId }) => {
      const commentsQueryKey = ['community', 'comments', postId.toString()];
      let removedComment = false;
      queryClient.setQueryData<InfiniteData<GetCommentsResponse>>(
        commentsQueryKey,
        (oldData) => {
          if (!oldData) return oldData;
          const newPages = oldData.pages.map((page) => ({
            ...page,
            items: page.items.filter((c) => {
              const shouldRemove = String(c.id) === String(commentId);
              if (shouldRemove) removedComment = true;
              return !shouldRemove;
            }),
          }));
          return { ...oldData, pages: newPages };
        }
      );

      if (removedComment) {
        queryClient.setQueryData<GetPostsResponse>(
          ['community', 'posts'],
          (oldData) => {
            if (!oldData?.items) return oldData;
            return {
              ...oldData,
              items: oldData.items.map((p) =>
                p.id.toString() === postId.toString()
                  ? {
                      ...p,
                      commentsCount: Math.max((p.commentsCount || 0) - 1, 0),
                    }
                  : p
              ),
            };
          }
        );

        setPosts((prev) =>
          prev.map((p) =>
            p.id.toString() === postId.toString()
              ? { ...p, comments: Math.max((p.comments ?? 0) - 1, 0) }
              : p
          )
        );
      }
    },
    postIds: visiblePostIds,
    t,
  });

  const visiblePosts = useMemo(() => posts.filter((p) => !p.hidden), [posts]);

  const handlePostSubmit = (data: {
    content: string;
    tags: string[];
    isAnonymous: boolean;
    quotedPostId?: string;
  }) => {
    createPostMutation.mutate({
      content: data.content,
      tags: data.tags,
      locale,
      isAnonymous: data.isAnonymous,
      ...(data.quotedPostId ? { quotedPostId: data.quotedPostId } : {}),
    });
  };

  const handlePostLike = (postId: string) => {
    const target = posts.find((p) => p.id === postId);
    const isLiked = target?.likedByMe ?? false;

    // Optimistic local update
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              likedByMe: !isLiked,
              likes: Math.max(0, (p.likes ?? 0) + (isLiked ? -1 : 1)),
            }
          : p
      )
    );

    if (isLiked) {
      unlikePostMutation.mutate(
        { postId },
        {
          onError: () => {
            // Rollback on error
            setPosts((prev) =>
              prev.map((p) =>
                p.id === postId
                  ? { ...p, likedByMe: true, likes: (p.likes ?? 0) + 1 }
                  : p
              )
            );
          },
        }
      );
    } else {
      likePostMutation.mutate(
        { postId },
        {
          onError: () => {
            // Rollback on error
            setPosts((prev) =>
              prev.map((p) =>
                p.id === postId
                  ? {
                      ...p,
                      likedByMe: false,
                      likes: Math.max(0, (p.likes ?? 0) - 1),
                    }
                  : p
              )
            );
          },
        }
      );
    }
  };

  const handlePostComment = (postId: string) => {
    // TODO: Implement comment functionality
    // Placeholder for future comment modal or navigation
    console.log('Comment on post:', postId);
  };

  const handlePostShare = (postId: string) => {
    // TODO: Implement share functionality
    console.log('Share post:', postId);
  };

  const handlePostReport = (postId: string) => {
    // TODO: Implement report functionality
    console.log('Report post:', postId);
  };

  const handlePostHide = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, hidden: true } : p))
    );
    hidePostMutation.mutate(
      { postId },
      {
        onError: () => {
          setPosts((prev) =>
            prev.map((p) => (p.id === postId ? { ...p, hidden: false } : p))
          );
        },
      }
    );
  };

  const handlePostUnhide = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, hidden: false } : p))
    );
    unhidePostMutation.mutate(
      { postId },
      {
        onError: () => {
          setPosts((prev) =>
            prev.map((p) => (p.id === postId ? { ...p, hidden: true } : p))
          );
        },
      }
    );
  };

  return {
    posts,
    visiblePosts,
    isLoading,
    handlePostSubmit,
    handlePostLike,
    handlePostComment,
    handlePostShare,
    handlePostReport,
    handlePostHide,
    handlePostUnhide,
  };
}
