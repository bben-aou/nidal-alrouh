'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import { useGetMessages } from '@/apis/chat/queries/use-get-messages';
import { useGetRooms } from '@/apis/chat/queries/use-get-rooms';
import { useMarkRead } from '@/apis/chat/queries/use-mark-read';
import { useSendMessage } from '@/apis/chat/queries/use-send-message';
import ChatLayout from '@/components/chat/chat-layout';
import ChatRoom from '@/components/chat/chat-room';
import ChatSidebar from '@/components/chat/chat-sidebar';
import { useAuth } from '@/contexts/auth-context';

export default function ChatPage() {
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const { data: rooms = [] } = useGetRooms();
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(
    searchParams.get('roomId')
  );
  const [typing, setTyping] = useState<boolean>(false);

  // Keep selected room in sync with URL or default to first room
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

  const { data: messages = [] } = useGetMessages({ roomId: selectedRoomId });
  const { send } = useSendMessage();
  const { markRead, isPending: markReadPending } = useMarkRead();

  const myUserId = user?.id ?? '';

  const handleSend = (text: string) => {
    if (!selectedRoomId || !text.trim()) return;
    send({ roomId: selectedRoomId, content: text });
  };

  const handleMarkRead = () => {
    if (!selectedRoomId) return;
    if (markReadPending) return; // avoid spamming the API
    // Only call if we still have unread for the active room
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
          />
        }
      >
        <ChatRoom
          room={room ?? undefined}
          messages={messages}
          myUserId={myUserId}
          typing={typing}
          onSend={handleSend}
          onTypingChange={setTyping}
          onMarkRead={handleMarkRead}
          markReadPending={markReadPending}
        />
      </ChatLayout>
    </div>
  );
}
