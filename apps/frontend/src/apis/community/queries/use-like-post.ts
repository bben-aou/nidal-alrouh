import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from '@tanstack/react-query';
import { toast } from 'sonner';

import { COMMUNITY_ENDPOINTS } from '@/apis/config/endpoints';
import { apiClient, ApiClientError } from '@/lib/api';

import { GET_COMMUNITY_STATS_KEY } from './use-get-community-stats';

interface LikePostParams {
  postId: string;
}

interface LikePostResponse {
  data?: { success: boolean; message?: string };
  message?: string;
}

const likePost = async ({
  postId,
}: LikePostParams): Promise<LikePostResponse> => {
  const response = await apiClient.post<LikePostResponse>(
    COMMUNITY_ENDPOINTS.POST_LIKES(postId.toString())
  );
  return response;
};

export const LIKE_POST_KEY = 'LIKE_POST_KEY';

type TUseLikePostParams = {
  config?: UseMutationOptions<LikePostResponse, ApiClientError, LikePostParams>;
};

export const useLikePost = ({ config }: TUseLikePostParams = {}) => {
  const queryClient = useQueryClient();

  const { mutate, data, error, isPending, isSuccess, isError, reset } =
    useMutation({
      mutationKey: [LIKE_POST_KEY],
      mutationFn: likePost,
      onSuccess: (resp) => {
        const success = resp?.data?.success ?? false;
        const message = resp?.data?.message ?? resp?.message;
        if (success) {
          toast.success(message || 'Post liked successfully');
        } else {
          toast.error(message || 'Failed to like post');
        }
        // Refresh posts if necessary
        queryClient.invalidateQueries({ queryKey: ['community', 'posts'] });
        // Refresh community stats (likes and active members)
        queryClient.invalidateQueries({ queryKey: [GET_COMMUNITY_STATS_KEY] });
      },
      onError: (err: ApiClientError) => {
        toast.error(err.message || 'Error liking post');
        console.error('Error liking post:', err);
      },
      ...config,
    });

  const invalidatePosts = () => {
    queryClient.invalidateQueries({ queryKey: ['community', 'posts'] });
  };

  const likePostWithParams = (params: LikePostParams) => {
    mutate(params);
  };

  return {
    mutate,
    likePost: mutate,
    likePostWithParams,
    resetLikePost: reset,
    invalidatePosts,
    data,
    error,
    isPending,
    isSuccess,
    isError,
  };
};

export type { LikePostResponse };
