import { useMutation } from '@tanstack/react-query';

import { apiClient } from '@/lib/api';
import { CreateEventData } from '@/types/community';

import { EVENTS_ENDPOINTS } from '../config/endpoints';

import type { UseMutationOptions } from '@tanstack/react-query';

export type UpdateEventRequestBody = CreateEventData;

export interface UpdateEventResponse extends CreateEventData {
  id: string;
  createdAt: string;
  updatedAt: string;
}

interface UseUpdateEventOptions {
  config?: UseMutationOptions<
    UpdateEventResponse,
    Error,
    { eventId: string; data: UpdateEventRequestBody }
  >;
}

export const useUpdateEvent = ({ config }: UseUpdateEventOptions = {}) => {
  const { mutate: updateEvent, isPending } = useMutation({
    mutationFn: async ({ eventId, data }) => {
      const response = await apiClient.patch<{ data: UpdateEventResponse }>(
        EVENTS_ENDPOINTS.UPDATE(eventId),
        data
      );
      return response.data;
    },
    ...config,
  });

  return { updateEvent, isPending };
};
