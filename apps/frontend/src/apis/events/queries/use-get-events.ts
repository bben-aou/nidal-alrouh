import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { EVENTS_ENDPOINTS } from '@/apis/events/config/endpoints';
import { apiClient, ApiClientError } from '@/lib/api';
import {
  GetEventsParams,
  GetEventsResponse,
  CommunityEvent,
} from '@/types/community';

export const GET_EVENTS_KEY = 'GET_EVENTS_KEY';

const getEventsApiCall = async (
  params: GetEventsParams = {}
): Promise<GetEventsResponse> => {
  const searchParams = new URLSearchParams();
  if (params.limit) searchParams.append('limit', String(params.limit));
  if (params.cursor) searchParams.append('cursor', String(params.cursor));
  if (params.type) searchParams.append('type', params.type);
  if (params.status) searchParams.append('status', params.status);
  const queryString = searchParams.toString();
  const endpoint = `${EVENTS_ENDPOINTS.EVENTS}${queryString ? `?${queryString}` : ''}`;
  const response = await apiClient.get<{ data: CommunityEvent[] }>(endpoint);
  const items = response.data ?? [];
  return { items, nextCursor: undefined, total: items.length };
};

export const useGetEvents = ({
  params = {},
  config,
}: {
  params?: GetEventsParams;
  config?: UseQueryOptions<GetEventsResponse, ApiClientError>;
} = {}) => {
  const queryKey = [GET_EVENTS_KEY, params];
  const { data, error, isLoading, isFetching, refetch, isError, isSuccess } =
    useQuery<GetEventsResponse, ApiClientError>({
      queryKey,
      queryFn: () => getEventsApiCall(params),
      staleTime: 60 * 1000,
      retry: false,
      ...config,
    });
  const events = data?.items ?? [];
  return {
    events,
    data,
    error,
    isLoading,
    isFetching,
    refetch,
    isError,
    isSuccess,
  };
};
