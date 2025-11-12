'use client';
import { useTranslations } from 'next-intl';

import { TChatRoom } from '@/types/chat';

interface ChatRoomHeaderProps {
  room?: TChatRoom | null;
}

export default function ChatRoomHeader({
  room,
}: Readonly<ChatRoomHeaderProps>) {
  const t = useTranslations('chat');
  return (
    <div className="flex items-center justify-between border-b p-3">
      <div>
        <div className="text-sm font-medium">
          {room?.name ?? t('room.empty.title')}
        </div>
        {room && (
          <div className="text-xs text-muted-foreground">
            {t('header.participants', { count: room.participants.length })}
          </div>
        )}
      </div>
      <div className="flex items-center gap-2">
        <button className="rounded-md border px-2 py-1 text-xs hover:bg-muted">
          {t('header.actions.mute')}
        </button>
        <button className="rounded-md border px-2 py-1 text-xs hover:bg-muted">
          {t('header.actions.info')}
        </button>
      </div>
    </div>
  );
}
