'use client';

import { MessageCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function CommunityEmptyState() {
  const t = useTranslations('dashboard');

  return (
    <div className="text-center py-12">
      <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-3">
        <MessageCircle className="h-6 w-6 text-muted-foreground" />
      </div>
      <p className="text-sm text-muted-foreground">
        {t('communityHighlights.noPosts')}
      </p>
    </div>
  );
}
