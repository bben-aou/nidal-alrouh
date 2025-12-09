'use client';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

import { useCreateDm } from '@/apis/chat/queries/use-create-dm';
import ChatNewChatDialog from '@/components/chat/chat-new-chat-dialog';
import { TChatRoom } from '@/types/chat';

interface ChatSidebarProps {
  rooms: TChatRoom[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  loading?: boolean;
  errorMessage?: string;
}

export default function ChatSidebar({
  rooms,
  selectedId,
  onSelect,
  loading,
  errorMessage,
}: Readonly<ChatSidebarProps>) {
  const t = useTranslations('chat');
  const [query, setQuery] = useState('');
  const [newChatOpen, setNewChatOpen] = useState(false);
  const { mutate: createDm } = useCreateDm();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rooms;
    return rooms.filter((r) => r.name.toLowerCase().includes(q));
  }, [rooms, query]);

  return (
    <div className="p-3 space-y-3">
      <div className="flex gap-2">
        <input
          type="text"
          placeholder={t('sidebar.searchPlaceholder')}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 rounded-md border px-3 py-2 text-sm bg-background"
        />
        <button
          className="rounded-md border px-3 py-2 text-sm hover:bg-muted"
          onClick={() => setNewChatOpen(true)}
          title={t('sidebar.newChat')}
        >
          {t('sidebar.newChat')}
        </button>
      </div>

      <ChatNewChatDialog
        open={newChatOpen}
        onOpenChange={setNewChatOpen}
        onStartChat={(payload) => {
          createDm(payload, {
            onSuccess: () => setNewChatOpen(false),
            onError: (err) =>
              toast.error(err.message || 'Failed to start chat'),
          });
        }}
      />

      <div className="space-y-1">
        {loading && (
          <div className="text-xs text-muted-foreground px-3 py-2">
            {t('sidebar.loading')}
          </div>
        )}
        {errorMessage && (
          <div className="text-xs text-destructive px-3 py-2">
            {errorMessage}
          </div>
        )}
        {filtered.map((room) => (
          <button
            key={room.id}
            onClick={() => onSelect(room.id)}
            className={`w-full text-left px-3 py-2 rounded-md border hover:bg-muted transition ${
              selectedId === room.id ? 'bg-muted' : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="font-medium text-sm">{room.name}</div>
              {room.unreadCount &&
              room.unreadCount > 0 &&
              selectedId !== room.id ? (
                <span className="inline-flex items-center justify-center text-xs rounded-full bg-primary text-primary-foreground w-6 h-6">
                  {room.unreadCount}
                </span>
              ) : null}
            </div>
            {room.lastMessage ? (
              <div className="text-xs text-muted-foreground truncate">
                {room.lastMessage.content}
              </div>
            ) : null}
          </button>
        ))}
        {filtered.length === 0 && (
          <div className="text-xs text-muted-foreground px-3 py-6">
            {t('sidebar.noResults')}
          </div>
        )}
      </div>
    </div>
  );
}
