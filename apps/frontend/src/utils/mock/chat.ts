import { ChatMessage, TChatRoom, Participant } from '@/types/chat';

export const MY_USER_ID = 'me-123';

const participants: Participant[] = [
  { id: MY_USER_ID, name: 'You', avatarUrl: '/avatars/me.png', isOnline: true },
  {
    id: 'u-101',
    name: 'Amina',
    avatarUrl: '/avatars/amina.png',
    isOnline: true,
  },
  {
    id: 'u-102',
    name: 'Samir',
    avatarUrl: '/avatars/samir.png',
    isOnline: false,
  },
  {
    id: 'u-103',
    name: 'Counselor',
    avatarUrl: '/avatars/counselor.png',
    isOnline: true,
  },
];

export const MOCK_ROOMS: TChatRoom[] = [
  {
    id: 'r-1',
    type: 'DM',
    name: 'Amina',
    participants: [participants[0], participants[1]],
    unreadCount: 3,
  },
  {
    id: 'r-2',
    type: 'GROUP',
    name: 'Support Group',
    participants: [participants[0], participants[1], participants[2]],
    unreadCount: 0,
  },
  {
    id: 'r-3',
    type: 'DM',
    name: 'Counselor',
    participants: [participants[0], participants[3]],
    unreadCount: 1,
  },
];

const baseMessages: Record<string, ChatMessage[]> = {
  'r-1': [
    {
      id: 'm-1',
      roomId: 'r-1',
      senderId: MY_USER_ID,
      content: 'Hey! How are you?',
      createdAt: new Date().toISOString(),
      status: 'read',
    },
    {
      id: 'm-2',
      roomId: 'r-1',
      senderId: 'u-101',
      content: 'Doing well, thanks! You?',
      createdAt: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
      status: 'delivered',
    },
  ],
  'r-2': [
    {
      id: 'm-3',
      roomId: 'r-2',
      senderId: 'u-102',
      content: 'Welcome to the support group!',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
      status: 'delivered',
    },
    {
      id: 'm-4',
      roomId: 'r-2',
      senderId: MY_USER_ID,
      content: 'Glad to be here 🙌',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
      status: 'read',
    },
  ],
  'r-3': [
    {
      id: 'm-5',
      roomId: 'r-3',
      senderId: 'u-103',
      content: 'See you soon.',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      status: 'delivered',
    },
  ],
};

export function getMockMessages(roomId: string | null): ChatMessage[] {
  if (!roomId) return [];
  return baseMessages[roomId] ?? [];
}
