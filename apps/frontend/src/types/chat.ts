export type RoomType = 'DM' | 'GROUP';

export interface Participant {
  id: string;
  name: string;
  avatarUrl?: string;
  isOnline?: boolean;
}

export interface ChatMessage {
  id: string;
  roomId: string;
  senderId: string;
  content: string;
  createdAt: string; // ISO timestamp
  status?: 'sent' | 'delivered' | 'read';
}

export interface TChatRoom {
  id: string;
  type: RoomType;
  name: string;
  participants: Participant[];
  lastMessage?: ChatMessage;
  unreadCount?: number;
}

// API DTO types (as returned by backend)
export interface ApiChatParticipant {
  id: string | number;
  name: string;
  avatarUrl?: string | null;
  isOnline?: boolean;
}

export interface ApiChatMessage {
  id: string | number;
  roomId: string | number;
  senderId: string | number;
  content: string;
  createdAt: string | Date;
  status?: 'sent' | 'delivered' | 'read';
}

export interface ApiChatRoom {
  id: string | number;
  type: RoomType;
  name?: string | null;
  participants: ApiChatParticipant[];
  lastMessage?: ApiChatMessage | null;
  unreadCount?: number;
}

export type GetRoomsResponse =
  | { rooms: ApiChatRoom[] }
  | { data: ApiChatRoom[] };

export type GetMessagesResponse =
  | { messages: ApiChatMessage[] }
  | { data: ApiChatMessage[] };
