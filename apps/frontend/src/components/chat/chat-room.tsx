'use client';
import { ChatMessage, TChatRoom } from '@/types/chat';

import ChatRoomHeader from './chat-room-header';
import EmptyState from './empty-state';
import MessageComposer from './message-composer';
import MessageList from './message-list';
import TypingIndicator from './typing-indicator';

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
