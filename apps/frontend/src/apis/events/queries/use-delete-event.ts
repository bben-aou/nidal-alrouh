import { useMutation } from '@tanstack/react-query';

import { apiClient } from '@/lib/api';

import { EVENTS_ENDPOINTS } from '../config/endpoints';

import type { UseMutationOptions } from '@tanstack/react-query';

interface UseDeleteEventOptions {
  config?: UseMutationOptions<void, Error, { eventId: string }>;
}

export const useDeleteEvent = ({ config }: UseDeleteEventOptions = {}) => {
  const { mutate: deleteEvent, isPending } = useMutation({
    mutationFn: async ({ eventId }) => {
      await apiClient.del(EVENTS_ENDPOINTS.DELETE(eventId));
    },
    ...config,
  });

  return { deleteEvent, isPending };
};
