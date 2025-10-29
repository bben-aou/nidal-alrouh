import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from '@tanstack/react-query';
import { toast } from 'sonner';

import { COMMUNITY_ENDPOINTS } from '@/apis/config/endpoints';
import { apiClient, ApiClientError } from '@/lib/api';

interface HidePostParams {
  postId: string;
}

interface HidePostResponse {
  success: boolean;
  message?: string;
}

const hidePost = async ({
  postId,
}: HidePostParams): Promise<HidePostResponse> => {
  const response = await apiClient.post<HidePostResponse>(
    COMMUNITY_ENDPOINTS.POST_HIDE(postId.toString())
  );
  return response;
};

export const HIDE_POST_KEY = 'HIDE_POST_KEY';

type TUseHidePostParams = {
  config?: UseMutationOptions<HidePostResponse, ApiClientError, HidePostParams>;
};

export const useHidePost = ({ config }: TUseHidePostParams = {}) => {
  const queryClient = useQueryClient();

  const { mutate, data, error, isPending, isSuccess, isError, reset } =
    useMutation({
      mutationKey: [HIDE_POST_KEY],
      mutationFn: hidePost,
      onSuccess: (resp) => {
        if (resp?.success) {
          toast.success(resp.message || 'Post hidden successfully');
        } else {
          toast.error(resp?.message || 'Failed to hide post');
        }
        queryClient.invalidateQueries({ queryKey: ['community', 'posts'] });
      },
      onError: (err: ApiClientError) => {
        toast.error(err.message || 'Error hiding post');
        console.error('Error hiding post:', err);
      },
      ...config,
    });

  const invalidatePosts = () => {
    queryClient.invalidateQueries({ queryKey: ['community', 'posts'] });
  };

  const hidePostWithParams = (params: HidePostParams) => {
    mutate(params);
  };

  return {
    mutate,
    hidePost: mutate,
    hidePostWithParams,
    resetHidePost: reset,
    invalidatePosts,
    data,
    error,
    isPending,
    isSuccess,
    isError,
  };
};

export type { HidePostResponse };
