'use client';

import { Calendar, MessageCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';

interface HelperStickyActionBarProps {
  isVisible: boolean;
  onMessage: () => void;
  onBook: () => void;
  isCreatingDm?: boolean;
  calUsername?: string;
}

const HelperStickyActionBar = ({
  isVisible,
  onMessage,
  onBook,
  isCreatingDm,
  calUsername,
}: Readonly<HelperStickyActionBarProps>) => {
  const t = useTranslations('helpers.discovery.profile');
  if (!isVisible) return null;
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t p-4 z-50 lg:hidden">
      <div className="container px-4 flex gap-3">
        <Button
          onClick={onMessage}
          disabled={!!isCreatingDm}
          className="flex-1"
        >
          <MessageCircle className="mr-2 h-4 w-4" />
          {t('message')}
        </Button>
        {calUsername && (
          <Button variant="secondary" onClick={onBook} className="flex-1">
            <Calendar className="mr-2 h-4 w-4" />
            {t('bookSession')}
          </Button>
        )}
      </div>
    </div>
  );
};

export default HelperStickyActionBar;
