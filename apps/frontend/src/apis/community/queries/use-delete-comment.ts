import {
  useMutation,
  useQueryClient,
  InfiniteData,
} from '@tanstack/react-query';
import { toast } from 'sonner';

import { COMMUNITY_ENDPOINTS } from '@/apis/config/endpoints';
import { apiClient, ApiClientError } from '@/lib/api';
import { GetCommentsResponse, GetPostsResponse } from '@/types/community';

export const DELETE_COMMENT_KEY = 'DELETE_COMMENT_KEY';

const deleteCommentApiCall = async (
  postId: string | number,
  commentId: string | number
): Promise<{ message: string }> => {
  const endpoint = COMMUNITY_ENDPOINTS.DELETE_COMMENT(
    postId.toString(),
    commentId.toString()
  );
  const response = await apiClient.del<{ message: string }>(endpoint);
  return response;
};

export const useDeleteComment = (postId: string | number) => {
  const queryClient = useQueryClient();

  return useMutation<{ message: string }, ApiClientError, string | number>({
    mutationKey: [DELETE_COMMENT_KEY, postId.toString()],
    mutationFn: (commentId) => deleteCommentApiCall(postId, commentId),
    onSuccess: (response, commentId) => {
      // Update the comments cache
      const commentsQueryKey = ['community', 'comments', postId.toString()];

      queryClient.setQueryData<InfiniteData<GetCommentsResponse>>(
        commentsQueryKey,
        (oldData) => {
          if (!oldData) return oldData;

          // Remove the comment from all pages
          const newPages = oldData.pages.map((page) => ({
            ...page,
            items: page.items.filter((comment) => comment.id !== commentId),
          }));

          return {
            ...oldData,
            pages: newPages,
          };
        }
      );

      // Update posts cache to decrement comment count
      queryClient.setQueryData<GetPostsResponse>(
        ['community', 'posts'],
        (oldData) => {
          if (!oldData?.items) return oldData;

          return {
            ...oldData,
            items: oldData.items.map((post) =>
              post.id === postId
                ? {
                    ...post,
                    commentsCount: Math.max(0, (post.commentsCount || 0) - 1),
                  }
                : post
            ),
          };
        }
      );

      toast.success(response.message || 'Comment deleted successfully');
    },
    onError: (error) => {
      const errorMessage = error.message || 'Failed to delete comment';
      toast.error(errorMessage);
    },
  });
};
