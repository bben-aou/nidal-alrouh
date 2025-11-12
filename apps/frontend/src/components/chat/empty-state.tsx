import { MessageCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function EmptyState() {
  const t = useTranslations('chat');
  return (
    <div className="h-full flex flex-col items-center justify-center text-center p-8">
      <MessageCircle className="w-10 h-10 mb-3" />
      <h2 className="text-base font-medium">{t('room.empty.title')}</h2>
      <p className="text-sm text-muted-foreground mt-1 max-w-sm">
        {t('room.empty.description')}
      </p>
    </div>
  );
}
