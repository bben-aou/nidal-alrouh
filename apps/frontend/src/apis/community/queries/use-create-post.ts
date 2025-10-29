import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from '@tanstack/react-query';
import { toast } from 'sonner';

import { COMMUNITY_ENDPOINTS } from '@/apis/config/endpoints';
import { apiClient, ApiClientError } from '@/lib/api';

export const CREATE_POST_KEY = 'CREATE_POST_KEY';

export interface CreatePostRequestBody {
  content: string;
  tags?: string[];
  locale: string;
}

export interface CreatePostResponse {
  success: boolean;
  message?: string;
  data?: {
    id: string | number;
    content: string;
    tags: string[];
    createdAt: string;
    userId?: string | number;
  };
}

const createPostApiCall = async (
  body: CreatePostRequestBody
): Promise<CreatePostResponse> => {
  const response = await apiClient.post<CreatePostResponse>(
    COMMUNITY_ENDPOINTS.POSTS,
    body
  );
  return response;
};

type TUseCreatePostParams = {
  config?: UseMutationOptions<
    CreatePostResponse,
    ApiClientError,
    CreatePostRequestBody
  >;
};

export const useCreatePost = ({ config }: TUseCreatePostParams = {}) => {
  const queryClient = useQueryClient();

  const { mutate, data, error, isPending, isSuccess, isError, reset } =
    useMutation<CreatePostResponse, ApiClientError, CreatePostRequestBody>({
      mutationKey: [CREATE_POST_KEY],
      mutationFn: createPostApiCall,
      onSuccess: (data) => {
        toast.success(data?.message || 'Post created successfully');
        // Rely on page-level toasts for localization
        queryClient.invalidateQueries({ queryKey: ['community', 'posts'] });
      },
      onError: (error) => {
        toast.error(error?.message || 'Failed to create post');
      },
      ...config,
    });

  const invalidatePosts = () => {
    queryClient.invalidateQueries({ queryKey: ['community', 'posts'] });
  };

  const createPostWithParams = (params: CreatePostRequestBody) => {
    mutate(params);
  };

  return {
    mutate,
    createPost: mutate,
    createPostWithParams,
    resetCreatePost: reset,
    invalidatePosts,
    data,
    error,
    isPending,
    isSuccess,
    isError,
  };
};
