'use client';
import { useTranslations } from 'next-intl';
import { useEffect, useRef } from 'react';

import { ChatMessage } from '@/types/chat';

import MessageItem from './message-item';

interface MessageListProps {
  messages: ChatMessage[];
  myUserId: string;
  hasUnread?: boolean;
  onMarkRead?: () => void;
  markReadPending?: boolean;
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function dayLabel(date: Date) {
  const now = new Date();
  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);
  if (isSameDay(date, now)) return 'Today';
  if (isSameDay(date, yesterday)) return 'Yesterday';
  return date.toLocaleDateString();
}

export default function MessageList({
  messages,
  myUserId,
  hasUnread,
  onMarkRead,
  markReadPending,
}: Readonly<MessageListProps>) {
  const t = useTranslations('chat');
  const containerRef = useRef<HTMLDivElement | null>(null);
  const lastAttemptAtRef = useRef<number>(0);
  const items: Array<{
    type: 'separator' | 'message';
    label?: string;
    message?: ChatMessage;
  }> = [];
  let lastDay: string | null = null;
  messages.forEach((m) => {
    const dRaw = dayLabel(new Date(m.createdAt));
    const d =
      dRaw === 'Today'
        ? t('list.daySeparator.today')
        : dRaw === 'Yesterday'
          ? t('list.daySeparator.yesterday')
          : dRaw;
    if (d !== lastDay) {
      items.push({ type: 'separator', label: d });
      lastDay = d;
    }
    items.push({ type: 'message', message: m });
  });

  useEffect(() => {
    if (messages.length === 0) return;
    const el = containerRef.current;
    if (el) {
      // auto-scroll to bottom when new messages arrive
      el.scrollTop = el.scrollHeight;
      attemptMarkReadIfNearBottom();
    }
  }, [messages.length]);

  const isNearBottom = (el: HTMLDivElement) => {
    const threshold = 24; // px
    return el.scrollHeight - el.scrollTop - el.clientHeight < threshold;
  };

  const attemptMarkReadIfNearBottom = () => {
    const el = containerRef.current;
    if (!el) return;
    if (!hasUnread) return;
    if (markReadPending) return;
    const now = Date.now();
    if (now - lastAttemptAtRef.current < 3000) return; // cooldown 3s
    if (isNearBottom(el)) {
      lastAttemptAtRef.current = now;
      onMarkRead?.();
    }
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handler = () => attemptMarkReadIfNearBottom();
    el.addEventListener('scroll', handler);
    return () => el.removeEventListener('scroll', handler);
  }, [hasUnread, markReadPending]);

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto px-3 py-4 space-y-2"
    >
      {items.map((item, idx) => {
        if (item.type === 'separator') {
          return (
            <div key={`sep-${idx}`} className="flex items-center gap-2 my-2">
              <div className="h-px flex-1 bg-border" />
              <div className="text-xs text-muted-foreground">{item.label}</div>
              <div className="h-px flex-1 bg-border" />
            </div>
          );
        }
        const m = item.message!;
        const isMe = m.senderId === myUserId;
        return <MessageItem key={m.id} message={m} isMe={isMe} />;
      })}
    </div>
  );
}
