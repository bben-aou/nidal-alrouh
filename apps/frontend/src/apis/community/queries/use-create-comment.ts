import {
  useMutation,
  useQueryClient,
  InfiniteData,
} from '@tanstack/react-query';
import { toast } from 'sonner';

import { COMMUNITY_ENDPOINTS } from '@/apis/config/endpoints';
import { apiClient, ApiClientError } from '@/lib/api';
import {
  CreateCommentData,
  CommentItem,
  GetCommentsResponse,
  GetPostsResponse,
} from '@/types/community';

export const CREATE_COMMENT_KEY = 'CREATE_COMMENT_KEY';

const createCommentApiCall = async (
  postId: string | number,
  data: CreateCommentData
): Promise<{ data: CommentItem; message: string }> => {
  const endpoint = COMMUNITY_ENDPOINTS.POST_COMMENTS(postId.toString());
  const response = await apiClient.post<{ data: CommentItem; message: string }>(
    endpoint,
    data
  );
  return response;
};

export const useCreateComment = (postId: string | number) => {
  const queryClient = useQueryClient();

  return useMutation<
    { data: CommentItem; message: string },
    ApiClientError,
    CreateCommentData
  >({
    mutationKey: [CREATE_COMMENT_KEY, postId.toString()],
    mutationFn: (data) => createCommentApiCall(postId, data),
    onSuccess: (response) => {
      // Update the comments cache
      const commentsQueryKey = ['community', 'comments', postId.toString()];
      let insertedComment = false;
      queryClient.setQueryData<InfiniteData<GetCommentsResponse>>(
        commentsQueryKey,
        (oldData) => {
          if (!oldData) {
            insertedComment = true;
            return {
              pageParams: [undefined],
              pages: [
                {
                  items: [response.data],
                  nextCursor: undefined,
                },
              ],
            } as InfiniteData<GetCommentsResponse>;
          }

          // Guard against duplicates (normalize ids to string)
          const exists = oldData.pages.some((page) =>
            page.items.some((c) => String(c.id) === String(response.data.id))
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
              items: [response.data, ...newPages[0].items],
            };
          } else {
            newPages[0] = {
              items: [response.data],
              nextCursor: undefined,
            };
          }
          return { ...oldData, pages: newPages };
        }
      );

      // Update posts cache to increment comment count ONLY if we inserted
      if (insertedComment) {
        queryClient.setQueryData<GetPostsResponse>(
          ['community', 'posts'],
          (oldData) => {
            if (!oldData?.items) return oldData;
            return {
              ...oldData,
              items: oldData.items.map((post) =>
                post.id === postId
                  ? { ...post, commentsCount: (post.commentsCount || 0) + 1 }
                  : post
              ),
            };
          }
        );
      }

      toast.success(response.message || 'Comment posted successfully');
    },
    onError: (error) => {
      const errorMessage = error.message || 'Failed to create comment';
      toast.error(errorMessage);
    },
  });
};
