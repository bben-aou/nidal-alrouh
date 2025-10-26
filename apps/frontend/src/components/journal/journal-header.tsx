'use client';

import { BarChart3 } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { CreateReflectionDialog } from '@/components/journal/create-reflection-dialog';
import { Button } from '@/components/ui/button';

export function JournalHeader() {
  const t = useTranslations('journal');

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-3xl font-bold">{t('dashboard.title')}</h1>
        <p className="text-muted-foreground">{t('dashboard.description')}</p>
      </div>
      <div className="flex gap-2">
        <CreateReflectionDialog />
        <Button variant="outline">
          <BarChart3 className="mr-2 h-4 w-4" />
          {t('dashboard.analytics')}
        </Button>
      </div>
    </div>
  );
}
