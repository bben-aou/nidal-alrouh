import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { COMMUNITY_ENDPOINTS } from '@/apis/config/endpoints';
import { apiClient, ApiClientError } from '@/lib/api';
import type { CommunityPostItem } from '@/types/community';

export const GET_POST_BY_ID_KEY = 'GET_POST_BY_ID_KEY';

export type GetPostByIdResponse = CommunityPostItem;

const getPostByIdApiCall = async (
  postId: string
): Promise<GetPostByIdResponse> => {
  const response = await apiClient.get<{ data: GetPostByIdResponse }>(
    COMMUNITY_ENDPOINTS.POST_BY_ID(postId.toString())
  );
  return response.data;
};

export const useGetPostById = ({
  postId,
  config,
}: {
  postId: string | undefined;
  config?: UseQueryOptions<GetPostByIdResponse, ApiClientError>;
}) => {
  const queryKey = ['community', 'post', postId];

  const { data, error, isLoading, isFetching, refetch, isError, isSuccess } =
    useQuery<GetPostByIdResponse, ApiClientError>({
      queryKey,
      queryFn: () => getPostByIdApiCall(postId as string),
      enabled: !!postId,
      staleTime: 2 * 60 * 1000,
      retry: false,
      ...config,
    });

  return {
    post: data,
    data,
    error,
    isLoading,
    isFetching,
    refetch,
    isError,
    isSuccess,
  };
};
