'use client';

import { useQueryClient, InfiniteData } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

import {
  useGetPostsInfinite,
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
  hasMore: boolean;
  isFetchingNextPage: boolean;
  loadMore: () => void;
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

  const {
    data: postsPages,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useGetPostsInfinite({ limit: 20, locale });

  const serverPosts = useMemo(
    () => (postsPages?.pages ? postsPages.pages.flatMap((p) => p.items) : []),
    [postsPages]
  );

  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    setPosts(transformCommunityPosts(serverPosts, t));
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

      const postsQueryKey = ['community', 'posts', { locale }];
      queryClient.setQueryData<InfiniteData<GetPostsResponse>>(
        postsQueryKey,
        (old) => {
          if (!old) return old;
          const newPages = [...old.pages];
          const serverItem = {
            id: newPost.id,
            content: newPost.content,
            createdAt: new Date().toISOString(),
            hidden: newPost.hidden,
            tags: newPost.tags,
            likedByMe: newPost.likedByMe,
            likesCount: newPost.likes,
            commentsCount: newPost.comments,
          } as GetPostsResponse['items'][number];

          if (newPages[0]) {
            const existsInFirst = newPages[0].items.some(
              (p) => String(p.id) === String(newPost.id)
            );
            if (!existsInFirst) {
              newPages[0] = {
                ...newPages[0],
                items: [serverItem, ...newPages[0].items],
              };
            }
          } else {
            newPages[0] = { items: [serverItem], nextCursor: undefined };
          }
          return { ...old, pages: newPages };
        }
      );
    },
    onPostDeleted: (postId) => {
      // Remove post from local state
      setPosts((prev) => prev.filter((p) => p.id !== postId));

      const postsQueryKey = ['community', 'posts', { locale }];
      queryClient.setQueryData<InfiniteData<GetPostsResponse>>(
        postsQueryKey,
        (old) => {
          if (!old) return old;
          const newPages = old.pages.map((page) => ({
            ...page,
            items: page.items.filter((p) => String(p.id) !== String(postId)),
          }));
          return { ...old, pages: newPages };
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
        const postsQueryKey = ['community', 'posts', { locale }];
        queryClient.setQueryData<InfiniteData<GetPostsResponse>>(
          postsQueryKey,
          (old) => {
            if (!old) return old;
            const newPages = old.pages.map((page) => ({
              ...page,
              items: page.items.map((p) =>
                String(p.id) === String(postId)
                  ? { ...p, commentsCount: (p.commentsCount || 0) + 1 }
                  : p
              ),
            }));
            return { ...old, pages: newPages };
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
        const postsQueryKey = ['community', 'posts', { locale }];
        queryClient.setQueryData<InfiniteData<GetPostsResponse>>(
          postsQueryKey,
          (old) => {
            if (!old) return old;
            const newPages = old.pages.map((page) => ({
              ...page,
              items: page.items.map((p) =>
                String(p.id) === String(postId)
                  ? {
                      ...p,
                      commentsCount: Math.max((p.commentsCount || 0) - 1, 0),
                    }
                  : p
              ),
            }));
            return { ...old, pages: newPages };
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
    hasMore: !!hasNextPage,
    isFetchingNextPage,
    loadMore: () => {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    handlePostSubmit,
    handlePostLike,
    handlePostComment,
    handlePostShare,
    handlePostReport,
    handlePostHide,
    handlePostUnhide,
  };
}
