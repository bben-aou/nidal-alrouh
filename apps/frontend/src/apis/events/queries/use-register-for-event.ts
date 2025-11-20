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

export interface RegisterEventRequestBody {
  notes?: string;
}

export const REGISTER_EVENT_KEY = 'REGISTER_EVENT_KEY';

const registerEventApiCall = async (
  eventId: string,
  body?: RegisterEventRequestBody
): Promise<CommunityEvent> => {
  const endpoint = EVENTS_ENDPOINTS.REGISTER(eventId);
  const response = await apiClient.post<{ data: CommunityEvent }>(
    endpoint,
    body ?? {}
  );
  return response.data;
};

export const useRegisterForEvent = ({
  config,
}: {
  config?: UseMutationOptions<
    CommunityEvent,
    ApiClientError,
    { eventId: string; body?: RegisterEventRequestBody }
  >;
} = {}) => {
  const queryClient = useQueryClient();

  const { mutate, data, error, isPending, isSuccess, isError, reset } =
    useMutation<
      CommunityEvent,
      ApiClientError,
      { eventId: string; body?: RegisterEventRequestBody }
    >({
      mutationKey: [REGISTER_EVENT_KEY],
      mutationFn: ({ eventId, body }) => registerEventApiCall(eventId, body),
      onSuccess: (updatedEvent) => {
        toast.success('Registered successfully');
        queryClient.invalidateQueries({ queryKey: [GET_EVENTS_KEY] });
        queryClient.invalidateQueries({
          queryKey: [GET_EVENT_BY_ID_KEY, updatedEvent.id],
        });
      },
      onError: (err) => {
        toast.error(err?.message || 'Failed to register for event');
      },
      ...config,
    });

  return {
    mutate,
    registerForEvent: mutate,
    data,
    error,
    isPending,
    isSuccess,
    isError,
    reset,
  };
};
