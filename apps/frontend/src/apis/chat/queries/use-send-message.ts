import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from '@tanstack/react-query';
import { toast } from 'sonner';

import { CHAT_ENDPOINTS } from '@/apis/config/endpoints';
import { apiClient, ApiClientError } from '@/lib/api';
import { ApiChatMessage } from '@/types/chat';

import { GET_CHAT_MESSAGES_KEY } from './use-get-messages';
import { GET_CHAT_ROOMS_KEY } from './use-get-rooms';

interface SendMessageParams {
  roomId: string;
  content: string;
}

interface SendMessageResponse {
  message: string;
  data: ApiChatMessage;
}

const sendMessageApiCall = async (
  params: SendMessageParams
): Promise<SendMessageResponse> => {
  const endpoint = CHAT_ENDPOINTS.ROOM_MESSAGES(params.roomId);
  const response = await apiClient.post<SendMessageResponse>(endpoint, {
    content: params.content,
  });
  return response;
};

export const SEND_CHAT_MESSAGE_KEY = 'SEND_CHAT_MESSAGE_KEY';

type TUseSendMessageParams = {
  config?: UseMutationOptions<
    SendMessageResponse,
    ApiClientError,
    SendMessageParams
  >;
};

export const useSendMessage = ({ config }: TUseSendMessageParams = {}) => {
  const queryClient = useQueryClient();

  const { mutate, data, error, isPending, isSuccess, isError, reset } =
    useMutation<SendMessageResponse, ApiClientError, SendMessageParams>({
      mutationKey: [SEND_CHAT_MESSAGE_KEY],
      mutationFn: sendMessageApiCall,
      onSuccess: (_resp, vars) => {
        // Invalidate both rooms and messages queries to trigger automatic refetch
        // This ensures UI stays in sync with actual server state
        queryClient.invalidateQueries({
          queryKey: [GET_CHAT_ROOMS_KEY],
          refetchType: 'active',
        });
        queryClient.invalidateQueries({
          queryKey: [GET_CHAT_MESSAGES_KEY, vars.roomId],
          refetchType: 'active',
        });
      },
      onError: (err: ApiClientError) => {
        toast.error(err.message || 'Failed to send message');
        console.error('Error sending message:', err);
      },
      ...config,
    });

  const send = (params: SendMessageParams) => mutate(params);

  return {
    mutate: send,
    send,
    resetSend: reset,
    data,
    error,
    isPending,
    isSuccess,
    isError,
  };
};
