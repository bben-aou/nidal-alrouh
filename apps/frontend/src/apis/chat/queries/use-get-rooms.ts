import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { CHAT_ENDPOINTS } from '@/apis/config/endpoints';
import { apiClient, ApiClientError } from '@/lib/api';
import {
  TChatRoom,
  ChatMessage,
  Participant,
  ApiChatParticipant,
  ApiChatMessage,
  ApiChatRoom,
  GetRoomsResponse,
} from '@/types/chat';

export const GET_CHAT_ROOMS_KEY = 'GET_CHAT_ROOMS_KEY';

const normalizeParticipant = (p: ApiChatParticipant): Participant => ({
  id: String(p.id),
  name: typeof p.name === 'string' ? p.name : '',
  avatarUrl: p.avatarUrl ?? undefined,
  isOnline: !!p.isOnline,
});

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

const normalizeRoom = (r: ApiChatRoom): TChatRoom => ({
  id: String(r.id),
  type: r.type === 'GROUP' ? 'GROUP' : 'DM',
  name: typeof r.name === 'string' ? r.name : 'Direct Message',
  participants: Array.isArray(r.participants)
    ? r.participants.map(normalizeParticipant)
    : [],
  lastMessage: r.lastMessage ? normalizeMessage(r.lastMessage) : undefined,
  unreadCount: typeof r.unreadCount === 'number' ? r.unreadCount : 0,
});

const getRoomsApiCall = async (): Promise<TChatRoom[]> => {
  const response = await apiClient.get<GetRoomsResponse>(CHAT_ENDPOINTS.ROOMS);
  const roomsRaw: ApiChatRoom[] =
    'rooms' in response
      ? response.rooms
      : 'data' in response
        ? response.data
        : [];
  return roomsRaw.map(normalizeRoom);
};

type TUseGetRoomsParams = {
  config?: UseQueryOptions<TChatRoom[], ApiClientError>;
};

export const useGetRooms = ({ config }: TUseGetRoomsParams = {}) => {
  return useQuery<TChatRoom[], ApiClientError>({
    queryKey: [GET_CHAT_ROOMS_KEY],
    queryFn: getRoomsApiCall,
    ...config,
  });
};
