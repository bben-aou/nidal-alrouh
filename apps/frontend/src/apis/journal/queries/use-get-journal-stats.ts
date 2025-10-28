import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { JOURNAL_ENDPOINTS } from '@/apis/config/endpoints';
import { apiClient, ApiClientError } from '@/lib/api';
import { JournalStatsResponse, GetJournalStatsParams } from '@/types/journal';

export const GET_JOURNAL_STATS_KEY = 'GET_JOURNAL_STATS_KEY';

type TUseGetJournalStatsParams = {
  params?: GetJournalStatsParams;
  config?: UseQueryOptions<JournalStatsResponse, ApiClientError>;
};

const getJournalStatsApiCall = async (
  params: GetJournalStatsParams = {}
): Promise<JournalStatsResponse> => {
  const searchParams = new URLSearchParams();

  if (params.period) searchParams.append('period', params.period);
  if (params.startDate) searchParams.append('startDate', params.startDate);
  if (params.endDate) searchParams.append('endDate', params.endDate);

  const queryString = searchParams.toString();
  const endpoint = `${JOURNAL_ENDPOINTS.STATS}${queryString ? `?${queryString}` : ''}`;

  const response = await apiClient.get<{
    data: JournalStatsResponse;
    message: string;
    success: boolean;
  }>(endpoint);

  return response.data;
};

export const useGetJournalStats = ({
  params = {},
  config,
}: TUseGetJournalStatsParams = {}) => {
  const {
    data,
    error,
    isLoading,
    isError,
    isSuccess,
    refetch,
    isFetching,
    status,
  } = useQuery<JournalStatsResponse, ApiClientError>({
    queryKey: [GET_JOURNAL_STATS_KEY, params],
    queryFn: () => getJournalStatsApiCall(params),
    staleTime: 2 * 60 * 1000, // 2 minutes (stats can change frequently)
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
    ...config,
  });

  const fetchJournalStats = () => {
    return refetch();
  };

  const refetchJournalStats = () => {
    return refetch({ cancelRefetch: false });
  };

  return {
    journalStats: data,
    error,
    isLoading,
    isFetching,
    isError,
    isSuccess,
    status,
    fetchJournalStats,
    refetchJournalStats,
    refetch,
  };
};
