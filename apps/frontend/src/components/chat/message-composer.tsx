'use client';
import { Paperclip, Smile } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'sonner';

interface MessageComposerProps {
  onSend: (text: string) => void;
}

export default function MessageComposer({
  onSend,
}: Readonly<MessageComposerProps>) {
  const t = useTranslations('chat');
  const [text, setText] = useState('');
  const canSend = text.trim().length > 0;
  return (
    <div className="border-t p-3 flex  items-center gap-2 ">
      <button
        className="rounded-md border px-2 py-2 text-sm hover:bg-muted disabled:opacity-50"
        aria-label={t('composer.attach')}
        title={t('composer.attach')}
        onClick={() => toast.info(t('composer.attachComingSoon'))}
        disabled
      >
        <Paperclip className="h-4 w-4" />
      </button>
      <button
        className="rounded-md border px-2 py-2 text-sm hover:bg-muted disabled:opacity-50"
        aria-label={t('composer.emoji')}
        title={t('composer.emoji')}
        onClick={() => toast.info(t('composer.emojiComingSoon'))}
        disabled
      >
        <Smile className="h-4 w-4" />
      </button>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (canSend) {
              onSend(text);
              setText('');
            }
          }
        }}
        placeholder={t('composer.placeholder')}
        className="flex-1 min-h-[40px] max-h-[120px] rounded-md border px-3 py-2 text-sm bg-background"
      />
      <button
        className="rounded-md border px-3 py-2 text-sm disabled:opacity-50 hover:bg-muted"
        disabled={!canSend}
        title={t('composer.send')}
        onClick={() => {
          if (!canSend) return;
          onSend(text);
          setText('');
        }}
      >
        {t('composer.send')}
      </button>
    </div>
  );
}
