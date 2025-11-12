'use client';
import { useTranslations } from 'next-intl';

interface TypingIndicatorProps {
  visible: boolean;
}

export default function TypingIndicator({
  visible,
}: Readonly<TypingIndicatorProps>) {
  const t = useTranslations('chat');
  if (!visible) return null;
  return (
    <div className="px-3 py-1 text-xs text-muted-foreground">
      {t('room.typing')}
    </div>
  );
}
