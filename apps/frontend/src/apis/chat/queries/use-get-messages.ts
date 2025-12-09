import {
  useQuery,
  UseQueryOptions,
  useQueryClient,
} from '@tanstack/react-query';

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

const getMessagesApiCall = async (
  roomId: string,
  params?: { limit?: number; cursor?: string }
): Promise<ChatMessage[]> => {
  const base = CHAT_ENDPOINTS.ROOM_MESSAGES(roomId);
  const query = new URLSearchParams();
  if (params?.limit) query.set('limit', String(params.limit));
  if (params?.cursor) query.set('cursor', params.cursor);
  const endpoint = query.toString() ? `${base}?${query.toString()}` : base;
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
  limit?: number;
  config?: UseQueryOptions<ChatMessage[], ApiClientError>;
};

export const useGetMessages = ({
  roomId,
  limit = 50,
  config,
}: TUseGetMessagesParams) => {
  const queryClient = useQueryClient();

  const base = useQuery<ChatMessage[], ApiClientError>({
    queryKey: [GET_CHAT_MESSAGES_KEY, roomId],
    queryFn: () => getMessagesApiCall(String(roomId), { limit }),
    enabled: !!roomId,
    refetchOnMount: 'always',
    refetchOnReconnect: 'always',
    refetchOnWindowFocus: false,
    staleTime: 10 * 1000,
    gcTime: 10 * 60 * 1000,
    ...config,
  });

  const fetchOlder = async (cursor: string) => {
    if (!roomId) return [] as ChatMessage[];
    const older = await getMessagesApiCall(String(roomId), { limit, cursor });
    queryClient.setQueryData<ChatMessage[]>(
      [GET_CHAT_MESSAGES_KEY, roomId],
      (prev) => {
        const existing = Array.isArray(prev) ? prev : [];
        // Avoid duplicate IDs when prepending
        const existingIds = new Set(existing.map((m) => m.id));
        const toPrepend = older.filter((m) => !existingIds.has(m.id));
        return [...toPrepend, ...existing];
      }
    );
    return older;
  };

  return { ...base, fetchOlder };
};
