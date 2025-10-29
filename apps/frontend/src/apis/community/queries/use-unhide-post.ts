import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from '@tanstack/react-query';
import { toast } from 'sonner';

import { COMMUNITY_ENDPOINTS } from '@/apis/config/endpoints';
import { apiClient, ApiClientError } from '@/lib/api';

interface UnhidePostParams {
  postId: string;
}

interface UnhidePostResponse {
  success: boolean;
  message?: string;
}

const unhidePost = async ({
  postId,
}: UnhidePostParams): Promise<UnhidePostResponse> => {
  const response = await apiClient.post<UnhidePostResponse>(
    COMMUNITY_ENDPOINTS.POST_UNHIDE(postId.toString())
  );
  return response;
};

export const UNHIDE_POST_KEY = 'UNHIDE_POST_KEY';

type TUseUnhidePostParams = {
  config?: UseMutationOptions<
    UnhidePostResponse,
    ApiClientError,
    UnhidePostParams
  >;
};

export const useUnhidePost = ({ config }: TUseUnhidePostParams = {}) => {
  const queryClient = useQueryClient();

  const { mutate, data, error, isPending, isSuccess, isError, reset } =
    useMutation({
      mutationKey: [UNHIDE_POST_KEY],
      mutationFn: unhidePost,
      onSuccess: (resp) => {
        if (resp?.success) {
          toast.success(resp.message || 'Post unhidden successfully');
        } else {
          toast.error(resp?.message || 'Failed to unhide post');
        }
        queryClient.invalidateQueries({ queryKey: ['community', 'posts'] });
      },
      onError: (err: ApiClientError) => {
        toast.error(err.message || 'Error unhiding post');
        console.error('Error unhiding post:', err);
      },
      ...config,
    });

  const invalidatePosts = () => {
    queryClient.invalidateQueries({ queryKey: ['community', 'posts'] });
  };

  const unhidePostWithParams = (params: UnhidePostParams) => {
    mutate(params);
  };

  return {
    mutate,
    unhidePost: mutate,
    unhidePostWithParams,
    resetUnhidePost: reset,
    invalidatePosts,
    data,
    error,
    isPending,
    isSuccess,
    isError,
  };
};

export type { UnhidePostResponse };
