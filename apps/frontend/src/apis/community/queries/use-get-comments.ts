import { useInfiniteQuery } from '@tanstack/react-query';

import { COMMUNITY_ENDPOINTS } from '@/apis/config/endpoints';
import { apiClient, ApiClientError } from '@/lib/api';
import { GetCommentsParams, GetCommentsResponse } from '@/types/community';

export const GET_COMMENTS_KEY = 'GET_COMMENTS_KEY';

const getCommentsApiCall = async (
  postId: string | number,
  params: GetCommentsParams = {}
): Promise<GetCommentsResponse> => {
  const searchParams = new URLSearchParams();

  if (params.cursor) searchParams.append('cursor', params.cursor);
  if (params.limit) searchParams.append('limit', params.limit.toString());

  const queryString = searchParams.toString();
  const endpoint = `${COMMUNITY_ENDPOINTS.POST_COMMENTS(postId.toString())}${
    queryString ? `?${queryString}` : ''
  }`;

  const response = await apiClient.get<GetCommentsResponse>(endpoint);
  return response;
};

export const useGetComments = (
  postId: string | number,
  params: Omit<GetCommentsParams, 'cursor'> = {}
) => {
  // Use a stable query key so cache updates from mutations and realtime handlers apply consistently
  const queryKey = ['community', 'comments', postId.toString()];

  return useInfiniteQuery<GetCommentsResponse, ApiClientError>({
    queryKey,
    queryFn: ({ pageParam }) =>
      getCommentsApiCall(postId, {
        ...params,
        cursor: pageParam as string | undefined,
      }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor || undefined,
    // staleTime: 30 * 1000, // 30 seconds
    retry: false,
  });
};
