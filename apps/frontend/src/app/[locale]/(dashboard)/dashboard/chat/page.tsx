'use client';
import { useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { io } from 'socket.io-client';

import {
  useGetMessages,
  GET_CHAT_MESSAGES_KEY,
} from '@/apis/chat/queries/use-get-messages';
import {
  useGetRooms,
  GET_CHAT_ROOMS_KEY,
} from '@/apis/chat/queries/use-get-rooms';
import { useMarkRead } from '@/apis/chat/queries/use-mark-read';
import { useSendMessage } from '@/apis/chat/queries/use-send-message';
import ChatLayout from '@/components/chat/chat-layout';
import ChatRoom from '@/components/chat/chat-room';
import ChatSidebar from '@/components/chat/chat-sidebar';
import { useAuth } from '@/contexts/auth-context';
import { getWsBaseUrl, CHAT_NAMESPACE } from '@/lib/ws';

export default function ChatPage() {
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const queryClient = useQueryClient();
  const {
    data: rooms = [],
    isPending: roomsLoading,
    error: roomsError,
  } = useGetRooms();
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(
    searchParams.get('roomId')
  );

  useEffect(() => {
    const rid = searchParams.get('roomId');
    if (rid) {
      setSelectedRoomId(rid);
    } else if (!selectedRoomId && rooms.length > 0) {
      setSelectedRoomId(rooms[0].id);
    }
  }, [searchParams, rooms.length]);

  const room = useMemo(
    () => rooms.find((r) => r.id === selectedRoomId) ?? null,
    [rooms, selectedRoomId]
  );

  const {
    data: messages = [],
    fetchOlder,
    isPending: messagesLoading,
    error: messagesError,
  } = useGetMessages({ roomId: selectedRoomId, limit: 50 });
  const { send } = useSendMessage();
  const { markRead, isPending: markReadPending } = useMarkRead();

  useEffect(() => {
    if (!selectedRoomId) return;
    const socket = io(`${getWsBaseUrl()}${CHAT_NAMESPACE}`, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
    });
    socket.emit('join-room', { roomId: selectedRoomId });

    const invalidate = () => {
      queryClient.invalidateQueries({
        queryKey: [GET_CHAT_MESSAGES_KEY, selectedRoomId],
      });
      queryClient.invalidateQueries({ queryKey: [GET_CHAT_ROOMS_KEY] });
    };

    socket.on('chat:message:created', (payload: { roomId: string }) => {
      if (payload.roomId === selectedRoomId) invalidate();
    });
    socket.on('chat:room:read', (payload: { roomId: string }) => {
      if (payload.roomId === selectedRoomId) invalidate();
    });

    return () => {
      socket.emit('leave-room', { roomId: selectedRoomId });
      socket.disconnect();
    };
  }, [selectedRoomId]);

  const myUserId = user?.id ?? '';

  const handleSend = (text: string) => {
    if (!selectedRoomId || !text.trim()) return;
    send({ roomId: selectedRoomId, content: text });
  };

  const handleMarkRead = () => {
    if (!selectedRoomId) return;
    if (markReadPending) return;
    const current = rooms.find((r) => r.id === selectedRoomId);
    if ((current?.unreadCount ?? 0) === 0) return;
    markRead({ roomId: selectedRoomId });
  };

  return (
    <div className="-my-6  overflow-hidden rounded-lg border bg-background">
      <ChatLayout
        sidebar={
          <ChatSidebar
            rooms={rooms}
            selectedId={selectedRoomId}
            onSelect={setSelectedRoomId}
            loading={roomsLoading}
            errorMessage={roomsError?.message}
          />
        }
      >
        <ChatRoom
          room={room ?? undefined}
          messages={messages}
          myUserId={myUserId}
          onSend={handleSend}
          onMarkRead={handleMarkRead}
          markReadPending={markReadPending}
          onLoadMore={async (cursor) => {
            await fetchOlder(cursor);
          }}
          messagesLoading={messagesLoading}
          messagesError={messagesError?.message}
        />
      </ChatLayout>
    </div>
  );
}
