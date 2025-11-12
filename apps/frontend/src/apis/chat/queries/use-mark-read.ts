import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from '@tanstack/react-query';
import { toast } from 'sonner';

import { CHAT_ENDPOINTS } from '@/apis/config/endpoints';
import { apiClient, ApiClientError } from '@/lib/api';
import { TChatRoom } from '@/types/chat';

import { GET_CHAT_ROOMS_KEY } from './use-get-rooms';

interface MarkReadParams {
  roomId: string;
}

interface MarkReadResponse {
  message: string;
  data?: { roomId: string };
}

const markReadApiCall = async (
  params: MarkReadParams
): Promise<MarkReadResponse> => {
  const endpoint = CHAT_ENDPOINTS.MARK_READ(params.roomId);
  const response = await apiClient.post<MarkReadResponse>(endpoint);
  return response;
};

export const MARK_CHAT_READ_KEY = 'MARK_CHAT_READ_KEY';

type TUseMarkReadParams = {
  config?: UseMutationOptions<MarkReadResponse, ApiClientError, MarkReadParams>;
};

export const useMarkRead = ({ config }: TUseMarkReadParams = {}) => {
  const queryClient = useQueryClient();

  const { mutate, data, error, isPending, isSuccess, isError, reset } =
    useMutation<MarkReadResponse, ApiClientError, MarkReadParams>({
      mutationKey: [MARK_CHAT_READ_KEY],
      mutationFn: markReadApiCall,
      onSuccess: (_resp, vars) => {
        // Zero out unreadCount in rooms cache for the marked room
        queryClient.setQueryData<TChatRoom[]>(
          [GET_CHAT_ROOMS_KEY],
          (oldRooms) => {
            if (!Array.isArray(oldRooms)) return oldRooms;
            return oldRooms.map((r: TChatRoom) =>
              r.id === vars.roomId ? { ...r, unreadCount: 0 } : r
            );
          }
        );
      },
      onError: (err: ApiClientError) => {
        toast.error(err.message || 'Failed to mark as read');
        console.error('Error marking read:', err);
      },
      ...config,
    });

  const markRead = (params: MarkReadParams) => mutate(params);

  return {
    mutate: markRead,
    markRead,
    resetMarkRead: reset,
    data,
    error,
    isPending,
    isSuccess,
    isError,
  };
};
