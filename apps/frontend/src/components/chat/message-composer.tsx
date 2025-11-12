'use client';
import { Paperclip, Smile } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

interface MessageComposerProps {
  onSend: (text: string) => void;
  onTypingChange?: (isTyping: boolean) => void;
}

export default function MessageComposer({
  onSend,
  onTypingChange,
}: Readonly<MessageComposerProps>) {
  const t = useTranslations('chat');
  const [text, setText] = useState('');
  const canSend = text.trim().length > 0;
  return (
    <div className="border-t p-3 flex  items-center gap-2 ">
      <button
        className="rounded-md border px-2 py-2 text-sm hover:bg-muted"
        aria-label={t('composer.attach')}
        title={t('composer.attach')}
      >
        <Paperclip className="h-4 w-4" />
      </button>
      <button
        className="rounded-md border px-2 py-2 text-sm hover:bg-muted"
        aria-label={t('composer.emoji')}
        title={t('composer.emoji')}
      >
        <Smile className="h-4 w-4" />
      </button>
      <textarea
        value={text}
        onChange={(e) => {
          const v = e.target.value;
          setText(v);
          onTypingChange?.(v.trim().length > 0);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (canSend) {
              onSend(text);
              setText('');
              onTypingChange?.(false);
            }
          }
        }}
        onBlur={() => onTypingChange?.(false)}
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
          onTypingChange?.(false);
        }}
      >
        {t('composer.send')}
      </button>
    </div>
  );
}
