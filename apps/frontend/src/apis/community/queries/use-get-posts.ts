import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { COMMUNITY_ENDPOINTS } from '@/apis/config/endpoints';
import { apiClient, ApiClientError } from '@/lib/api';
import { GetPostsParams, GetPostsResponse } from '@/types/community';

export const GET_POSTS_KEY = 'GET_POSTS_KEY';

const getPostsApiCall = async (
  params: GetPostsParams = {}
): Promise<GetPostsResponse> => {
  const searchParams = new URLSearchParams();

  if (params.q) searchParams.append('q', params.q);
  if (params.page) searchParams.append('page', params.page.toString());
  if (params.limit) searchParams.append('limit', params.limit.toString());

  const queryString = searchParams.toString();
  const endpoint = `${COMMUNITY_ENDPOINTS.POSTS}${queryString ? `?${queryString}` : ''}`;

  const response = await apiClient.get<GetPostsResponse>(endpoint);
  return response;
};

export const useGetPosts = ({
  params = {},
  config,
}: {
  params?: GetPostsParams;
  config?: UseQueryOptions<GetPostsResponse, ApiClientError>;
} = {}) => {
  const queryKey = ['community', 'posts', params];

  const { data, error, isLoading, isFetching, refetch, isError, isSuccess } =
    useQuery<GetPostsResponse, ApiClientError>({
      queryKey,
      queryFn: () => getPostsApiCall(params),
      staleTime: 2 * 60 * 1000, // 2 minutes
      retry: false,
      ...config,
    });

  const posts = data?.items ?? [];

  return {
    posts,
    data,
    error,
    isLoading,
    isFetching,
    refetch,
    isError,
    isSuccess,
  };
};
