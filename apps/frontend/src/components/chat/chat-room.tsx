'use client';

import ChatRoomHeader from '@/components/chat/chat-room-header';
import EmptyState from '@/components/chat/empty-state';
import MessageComposer from '@/components/chat/message-composer';
import MessageList from '@/components/chat/message-list';
import TypingIndicator from '@/components/chat/typing-indicator';
import { ChatMessage, TChatRoom } from '@/types/chat';

interface ChatRoomProps {
  room?: TChatRoom | null;
  messages: ChatMessage[];
  myUserId: string;
  typing?: boolean;
  onSend?: (text: string) => void;
  onTypingChange?: (isTyping: boolean) => void;
  onMarkRead?: () => void;
  markReadPending?: boolean;
}

export default function ChatRoom({
  room,
  messages,
  myUserId,
  typing,
  onSend,
  onTypingChange,
  onMarkRead,
  markReadPending,
}: Readonly<ChatRoomProps>) {
  return (
    <div className="flex flex-col h-full">
      <ChatRoomHeader room={room} />
      {room ? (
        <>
          <TypingIndicator visible={!!typing} />
          <MessageList
            messages={messages}
            myUserId={myUserId}
            hasUnread={(room.unreadCount ?? 0) > 0}
            onMarkRead={onMarkRead}
            markReadPending={markReadPending}
          />
          <MessageComposer
            onSend={(text) => onSend?.(text)}
            onTypingChange={onTypingChange}
          />
        </>
      ) : (
        <EmptyState />
      )}
    </div>
  );
}
