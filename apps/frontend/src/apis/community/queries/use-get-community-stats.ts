import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { COMMUNITY_ENDPOINTS } from '@/apis/config/endpoints';
import { apiClient, ApiClientError } from '@/lib/api';
import {
  CommunityStatsResponse,
  GetCommunityStatsParams,
} from '@/types/community';

export const GET_COMMUNITY_STATS_KEY = 'GET_COMMUNITY_STATS_KEY';

type TUseGetCommunityStatsParams = {
  params?: GetCommunityStatsParams;
  config?: UseQueryOptions<CommunityStatsResponse, ApiClientError>;
};

const getCommunityStatsApiCall = async (
  params: GetCommunityStatsParams = {}
): Promise<CommunityStatsResponse> => {
  const searchParams = new URLSearchParams();

  if (params.period) searchParams.append('period', params.period);
  if (params.startDate) searchParams.append('startDate', params.startDate);
  if (params.endDate) searchParams.append('endDate', params.endDate);

  const queryString = searchParams.toString();
  const endpoint = `${COMMUNITY_ENDPOINTS.STATS}${queryString ? `?${queryString}` : ''}`;

  const response = await apiClient.get<{
    data: CommunityStatsResponse;
    message: string;
    success: boolean;
  }>(endpoint);

  return response.data;
};

export const useGetCommunityStats = ({
  params = {},
  config,
}: TUseGetCommunityStatsParams = {}) => {
  const {
    data,
    error,
    isLoading,
    isError,
    isSuccess,
    refetch,
    isFetching,
    status,
  } = useQuery<CommunityStatsResponse, ApiClientError>({
    queryKey: [GET_COMMUNITY_STATS_KEY, params],
    queryFn: () => getCommunityStatsApiCall(params),
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: false,
    ...config,
  });

  const fetchCommunityStats = () => {
    return refetch();
  };

  const refetchCommunityStats = () => {
    return refetch({ cancelRefetch: false });
  };

  return {
    communityStats: data,
    error,
    isLoading,
    isFetching,
    isError,
    isSuccess,
    status,
    fetchCommunityStats,
    refetchCommunityStats,
    refetch,
  };
};
