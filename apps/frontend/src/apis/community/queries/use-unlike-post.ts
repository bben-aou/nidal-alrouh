import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from '@tanstack/react-query';
import { toast } from 'sonner';

import { COMMUNITY_ENDPOINTS } from '@/apis/config/endpoints';
import { apiClient, ApiClientError } from '@/lib/api';

interface UnlikePostParams {
  postId: string;
}

interface UnlikePostResponse {
  data?: { success: boolean; message?: string };
  message?: string;
}

const unlikePost = async ({
  postId,
}: UnlikePostParams): Promise<UnlikePostResponse> => {
  const response = await apiClient.del<UnlikePostResponse>(
    COMMUNITY_ENDPOINTS.POST_LIKES(postId.toString())
  );
  return response;
};

export const UNLIKE_POST_KEY = 'UNLIKE_POST_KEY';

type TUseUnlikePostParams = {
  config?: UseMutationOptions<
    UnlikePostResponse,
    ApiClientError,
    UnlikePostParams
  >;
};

export const useUnlikePost = ({ config }: TUseUnlikePostParams = {}) => {
  const queryClient = useQueryClient();

  const { mutate, data, error, isPending, isSuccess, isError, reset } =
    useMutation({
      mutationKey: [UNLIKE_POST_KEY],
      mutationFn: unlikePost,
      onSuccess: (resp) => {
        const success = resp?.data?.success ?? false;
        const message = resp?.data?.message ?? resp?.message;
        if (success) {
          toast.success(message || 'Post unliked successfully');
        } else {
          toast.error(message || 'Failed to unlike post');
        }
        // Refresh posts if necessary
        queryClient.invalidateQueries({ queryKey: ['community', 'posts'] });
      },
      onError: (err: ApiClientError) => {
        toast.error(err.message || 'Error unliking post');
        console.error('Error unliking post:', err);
      },
      ...config,
    });

  const invalidatePosts = () => {
    queryClient.invalidateQueries({ queryKey: ['community', 'posts'] });
  };

  const unlikePostWithParams = (params: UnlikePostParams) => {
    mutate(params);
  };

  return {
    mutate,
    unlikePost: mutate,
    unlikePostWithParams,
    resetUnlikePost: reset,
    invalidatePosts,
    data,
    error,
    isPending,
    isSuccess,
    isError,
  };
};

export type { UnlikePostResponse };
