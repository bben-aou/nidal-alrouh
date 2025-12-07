import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { HELPERS_ENDPOINTS } from '@/apis/config/endpoints';
import { apiClient, ApiClientError } from '@/lib/api';
import { HelperStats } from '@/types/helpers';

export const GET_MY_HELPER_STATS_KEY = 'GET_MY_HELPER_STATS_KEY';

const getMyHelperStatsApiCall = async (): Promise<HelperStats> => {
  const response = await apiClient.get<HelperStats>(HELPERS_ENDPOINTS.ME);
  return response;
};

export const useGetMyHelperStats = (
  config?: Partial<UseQueryOptions<HelperStats, ApiClientError>>
) => {
  const queryKey = ['helpers', 'me', GET_MY_HELPER_STATS_KEY];

  const { data, error, isLoading, isFetching, refetch, isError, isSuccess } =
    useQuery<HelperStats, ApiClientError>({
      queryKey,
      queryFn: getMyHelperStatsApiCall,
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: false,
      ...config,
    });

  return {
    stats: data,
    data,
    error,
    isLoading,
    isFetching,
    refetch,
    isError,
    isSuccess,
  };
};
