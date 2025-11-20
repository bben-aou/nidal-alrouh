import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from '@tanstack/react-query';
import { toast } from 'sonner';

import { EVENTS_ENDPOINTS } from '@/apis/events/config/endpoints';
import { apiClient, ApiClientError } from '@/lib/api';
import { CommunityEvent } from '@/types/community';

import { GET_EVENT_BY_ID_KEY } from './use-get-event-by-id';
import { GET_EVENTS_KEY } from './use-get-events';

export const UNREGISTER_EVENT_KEY = 'UNREGISTER_EVENT_KEY';

const unregisterEventApiCall = async (
  eventId: string
): Promise<CommunityEvent> => {
  const endpoint = EVENTS_ENDPOINTS.UNREGISTER(eventId);
  const response = await apiClient.post<{ data: CommunityEvent }>(endpoint);
  return response.data;
};

export const useUnregisterForEvent = ({
  config,
}: {
  config?: UseMutationOptions<
    CommunityEvent,
    ApiClientError,
    { eventId: string }
  >;
} = {}) => {
  const queryClient = useQueryClient();

  const { mutate, data, error, isPending, isSuccess, isError, reset } =
    useMutation<CommunityEvent, ApiClientError, { eventId: string }>({
      mutationKey: [UNREGISTER_EVENT_KEY],
      mutationFn: ({ eventId }) => unregisterEventApiCall(eventId),
      onSuccess: (updatedEvent) => {
        toast.success('Registration cancelled successfully');
        queryClient.invalidateQueries({ queryKey: [GET_EVENTS_KEY] });
        queryClient.invalidateQueries({
          queryKey: [GET_EVENT_BY_ID_KEY, updatedEvent.id],
        });
      },
      onError: (err) => {
        toast.error(err?.message || 'Failed to cancel registration');
      },
      ...config,
    });

  return {
    mutate,
    unregisterForEvent: mutate,
    data,
    error,
    isPending,
    isSuccess,
    isError,
    reset,
  };
};
