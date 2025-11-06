import { useInfiniteQuery } from '@tanstack/react-query';

import { COMMUNITY_ENDPOINTS } from '@/apis/config/endpoints';
import { apiClient, ApiClientError } from '@/lib/api';
import { GetPostsParams, GetPostsResponse } from '@/types/community';

export const GET_POSTS_INFINITE_KEY = 'GET_POSTS_INFINITE_KEY';

const getPostsApiCall = async (
  params: GetPostsParams = {}
): Promise<GetPostsResponse> => {
  const searchParams = new URLSearchParams();

  if (params.cursor) searchParams.append('cursor', params.cursor);
  if (params.limit) searchParams.append('limit', params.limit.toString());
  if (params.q) searchParams.append('q', params.q);

  const queryString = searchParams.toString();
  const endpoint = `${COMMUNITY_ENDPOINTS.POSTS}${queryString ? `?${queryString}` : ''}`;

  const response = await apiClient.get<GetPostsResponse>(endpoint);
  return response;
};

export const useGetPostsInfinite = (
  params: Omit<GetPostsParams, 'cursor'> & { locale?: string } = {}
) => {
  const queryKey = [
    'community',
    'posts',
    { locale: params.locale, q: params.q },
  ];

  return useInfiniteQuery<GetPostsResponse, ApiClientError>({
    queryKey,
    queryFn: ({ pageParam }) =>
      getPostsApiCall({ ...params, cursor: pageParam as string | undefined }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor || undefined,
    staleTime: 2 * 60 * 1000,
    retry: false,
  });
};
