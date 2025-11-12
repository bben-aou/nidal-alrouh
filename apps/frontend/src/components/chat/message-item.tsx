'use client';
import { Check, CheckCheck } from 'lucide-react';

import { ChatMessage } from '@/types/chat';

interface MessageItemProps {
  message: ChatMessage;
  isMe: boolean;
}

export default function MessageItem({
  message,
  isMe,
}: Readonly<MessageItemProps>) {
  return (
    <div className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] rounded-lg px-3 py-2 text-sm leading-relaxed shadow-sm ${
          isMe
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted text-foreground'
        }`}
      >
        <div>{message.content}</div>
        <div
          className={`mt-1 flex items-center gap-1 text-[10px] opacity-80 ${isMe ? 'text-white' : 'text-muted-foreground'}`}
        >
          <span>
            {new Date(message.createdAt).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
          {isMe && (
            <span
              className="inline-flex items-center"
              aria-label={message.status ?? 'sent'}
              title={message.status ?? 'sent'}
            >
              {message.status === 'read' ? (
                <CheckCheck className="h-3 w-3 text-emerald-300" />
              ) : message.status === 'delivered' ? (
                <CheckCheck className="h-3 w-3 opacity-75" />
              ) : (
                <Check className="h-3 w-3 opacity-75" />
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
