import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { JOURNAL_ENDPOINTS } from '@/apis/config/endpoints';
import { apiClient, ApiClientError } from '@/lib/api';
import {
  JournalAnalyticsResponse,
  GetJournalAnalyticsParams,
} from '@/types/journal';

export const GET_JOURNAL_ANALYTICS_KEY = 'GET_JOURNAL_ANALYTICS_KEY';

type TUseGetJournalAnalyticsParams = {
  params: GetJournalAnalyticsParams;
  config?: UseQueryOptions<JournalAnalyticsResponse, ApiClientError>;
};

const getJournalAnalyticsApiCall = async (
  params: GetJournalAnalyticsParams
): Promise<JournalAnalyticsResponse> => {
  const searchParams = new URLSearchParams();

  searchParams.append('startDate', params.startDate);
  searchParams.append('endDate', params.endDate);
  searchParams.append('granularity', params.granularity);

  const queryString = searchParams.toString();
  const endpoint = `${JOURNAL_ENDPOINTS.ANALYTICS}?${queryString}`;

  const response = await apiClient.get<{
    data: JournalAnalyticsResponse;
    message: string;
  }>(endpoint);
  return response.data;
};

export const useGetJournalAnalytics = ({
  params,
  config,
}: TUseGetJournalAnalyticsParams) => {
  return useQuery<JournalAnalyticsResponse, ApiClientError>({
    queryKey: [GET_JOURNAL_ANALYTICS_KEY, params],
    queryFn: () => getJournalAnalyticsApiCall(params),
    staleTime: 5 * 60 * 1000, // 5 minutes (analytics can be cached longer)
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: false,
    ...config,
  });
};
