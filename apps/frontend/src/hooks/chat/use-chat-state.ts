'use client';
import { useCallback, useMemo, useState } from 'react';

import { ChatMessage, TChatRoom } from '@/types/chat';
import { MOCK_ROOMS, getMockMessages, MY_USER_ID } from '@/utils/mock/chat';

export interface UseChatState {
  rooms: TChatRoom[];
  selectedRoomId: string | null;
  messages: ChatMessage[];
  myUserId: string;
  typing: boolean;
  setSelectedRoomId: (id: string | null) => void;
  sendMessage: (text: string) => void;
  setTyping: (isTyping: boolean) => void;
  markRead: () => void;
}

export function useChatState(initialRoomId?: string | null): UseChatState {
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(
    initialRoomId ?? MOCK_ROOMS[0]?.id ?? null
  );

  // Seed rooms with lastMessage from mock messages
  const [rooms, setRooms] = useState<TChatRoom[]>(() => {
    return MOCK_ROOMS.map((r) => {
      const msgs = getMockMessages(r.id);
      return {
        ...r,
        lastMessage: msgs[msgs.length - 1],
      };
    });
  });

  const [messagesByRoom, setMessagesByRoom] = useState<
    Record<string, ChatMessage[]>
  >(() => {
    const map: Record<string, ChatMessage[]> = {};
    rooms.forEach((r) => {
      map[r.id] = getMockMessages(r.id);
    });
    return map;
  });

  const [typing, setTyping] = useState(false);

  const messages: ChatMessage[] = useMemo(() => {
    if (!selectedRoomId) return [];
    return messagesByRoom[selectedRoomId] ?? [];
  }, [messagesByRoom, selectedRoomId]);

  const sendMessage = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!selectedRoomId || trimmed.length === 0) return;
      const newMsg: ChatMessage = {
        id: `m-${Date.now()}`,
        roomId: selectedRoomId,
        senderId: MY_USER_ID,
        content: trimmed,
        createdAt: new Date().toISOString(),
        status: 'sent',
      };
      setMessagesByRoom((prev) => {
        const next = { ...prev };
        const list = next[selectedRoomId] ?? [];
        next[selectedRoomId] = [...list, newMsg];
        return next;
      });
      setRooms((prev) =>
        prev.map((r) =>
          r.id === selectedRoomId ? { ...r, lastMessage: newMsg } : r
        )
      );
      setTyping(false);
    },
    [selectedRoomId]
  );

  const markRead = useCallback(() => {
    if (!selectedRoomId) return;
    setRooms((prev) =>
      prev.map((r) => {
        if (r.id !== selectedRoomId) return r;
        if (!r.unreadCount || r.unreadCount === 0) return r;
        return { ...r, unreadCount: 0 };
      })
    );
  }, [selectedRoomId]);

  return {
    rooms,
    selectedRoomId,
    messages,
    myUserId: MY_USER_ID,
    typing,
    setSelectedRoomId,
    sendMessage,
    setTyping,
    markRead,
  };
}
