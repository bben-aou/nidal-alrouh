import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { EVENTS_ENDPOINTS } from '@/apis/events/config/endpoints';
import { apiClient, ApiClientError } from '@/lib/api';
import { CommunityEvent } from '@/types/community';

export const GET_EVENT_BY_ID_KEY = 'GET_EVENT_BY_ID_KEY';

const getEventByIdApiCall = async (
  eventId: string
): Promise<CommunityEvent> => {
  const endpoint = EVENTS_ENDPOINTS.EVENT_BY_ID(eventId);
  const response = await apiClient.get<{ data: CommunityEvent }>(endpoint);
  return response.data;
};

export const useGetEventById = ({
  eventId,
  config,
}: {
  eventId: string;
  config?: UseQueryOptions<CommunityEvent, ApiClientError>;
}) => {
  const queryKey = [GET_EVENT_BY_ID_KEY, eventId];
  const { data, error, isLoading, isFetching, refetch, isError, isSuccess } =
    useQuery<CommunityEvent, ApiClientError>({
      queryKey,
      queryFn: () => getEventByIdApiCall(eventId),
      enabled: Boolean(eventId),
      staleTime: 60 * 1000,
      retry: false,
      ...config,
    });

  return {
    event: data ?? null,
    data,
    error,
    isLoading,
    isFetching,
    refetch,
    isError,
    isSuccess,
  };
};
