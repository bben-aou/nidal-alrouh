import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { CHAT_ENDPOINTS } from '@/apis/config/endpoints';
import { apiClient, ApiClientError } from '@/lib/api';
import { ChatMessage, ApiChatMessage, GetMessagesResponse } from '@/types/chat';

export const GET_CHAT_MESSAGES_KEY = 'GET_CHAT_MESSAGES_KEY';

const normalizeMessage = (m: ApiChatMessage): ChatMessage => ({
  id: String(m.id),
  roomId: String(m.roomId),
  senderId: String(m.senderId),
  content: String(m.content ?? ''),
  createdAt:
    typeof m.createdAt === 'string'
      ? m.createdAt
      : new Date(m.createdAt).toISOString(),
  status: m.status ?? undefined,
});

const getMessagesApiCall = async (roomId: string): Promise<ChatMessage[]> => {
  const endpoint = CHAT_ENDPOINTS.ROOM_MESSAGES(roomId);
  const response = await apiClient.get<GetMessagesResponse>(endpoint);
  const raw: ApiChatMessage[] =
    'messages' in response
      ? response.messages
      : 'data' in response
        ? response.data
        : [];
  return raw.map(normalizeMessage);
};

type TUseGetMessagesParams = {
  roomId?: string | null;
  config?: UseQueryOptions<ChatMessage[], ApiClientError>;
};

export const useGetMessages = ({ roomId, config }: TUseGetMessagesParams) => {
  return useQuery<ChatMessage[], ApiClientError>({
    queryKey: [GET_CHAT_MESSAGES_KEY, roomId],
    queryFn: () => getMessagesApiCall(String(roomId)),
    enabled: !!roomId,
    staleTime: 10 * 1000, // 10s
    gcTime: 10 * 60 * 1000, // 10m
    ...config,
  });
};
