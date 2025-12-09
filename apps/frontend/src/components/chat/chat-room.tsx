'use client';

import ChatRoomHeader from '@/components/chat/chat-room-header';
import EmptyState from '@/components/chat/empty-state';
import MessageComposer from '@/components/chat/message-composer';
import MessageList from '@/components/chat/message-list';
import { ChatMessage, TChatRoom } from '@/types/chat';

interface ChatRoomProps {
  room?: TChatRoom | null;
  messages: ChatMessage[];
  myUserId: string;
  onSend?: (text: string) => void;
  onMarkRead?: () => void;
  markReadPending?: boolean;
  onLoadMore?: (cursor: string) => Promise<void> | void;
  messagesLoading?: boolean;
  messagesError?: string;
}

export default function ChatRoom({
  room,
  messages,
  myUserId,
  onSend,
  onMarkRead,
  markReadPending,
  onLoadMore,
  messagesLoading,
  messagesError,
}: Readonly<ChatRoomProps>) {
  return (
    <div className="flex flex-col h-full">
      <ChatRoomHeader room={room} />
      {room ? (
        <>
          {(room.unreadCount ?? 0) > 0 && (
            <div className="px-3 py-2 bg-muted text-xs flex items-center gap-2">
              <span>{room.unreadCount} unread</span>
              <button
                className="rounded-md border px-2 py-1 text-xs hover:bg-background"
                onClick={() => onMarkRead?.()}
                disabled={markReadPending}
                title={markReadPending ? 'Marking…' : 'Mark as read'}
              >
                {markReadPending ? '…' : 'Mark as read'}
              </button>
            </div>
          )}
          {messagesLoading && (
            <div className="px-3 py-2 text-xs text-muted-foreground">
              Loading messages…
            </div>
          )}
          {messagesError && (
            <div className="px-3 py-2 text-xs text-destructive">
              {messagesError}
            </div>
          )}
          <MessageList
            messages={messages}
            myUserId={myUserId}
            hasUnread={(room.unreadCount ?? 0) > 0}
            onMarkRead={onMarkRead}
            markReadPending={markReadPending}
            onLoadMore={onLoadMore}
          />
          <MessageComposer onSend={(text) => onSend?.(text)} />
        </>
      ) : (
        <EmptyState />
      )}
    </div>
  );
}
