'use client';

import { RotateCw, XCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { JournalReflection } from '@/components/journal/journal-reflection';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/components/ui/card';
import { JournalReflection as JournalReflectionType } from '@/lib/mock-data/journal';

interface JournalReflectionsListProps {
  reflections: JournalReflectionType[];
  isLoading: boolean;
  isError: boolean;
}

export function JournalReflectionsList({
  reflections,
  isLoading,
  isError,
}: Readonly<JournalReflectionsListProps>) {
  const t = useTranslations('journal');

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">{t('dashboard.loading')}</p>
      </div>
    );
  }

  if (isError) {
    return (
      <Card className="border-destructive/50 py-6">
        <CardContent>
          <div className="flex flex-col items-center gap-4">
            <div className="rounded-full bg-destructive/10 p-3">
              <XCircle className="h-6 w-6 text-destructive" />
            </div>
            <div className="text-center space-y-2">
              <CardTitle className="text-destructive">
                {t('dashboard.errorLoading')}
              </CardTitle>
              <CardDescription>{t('dashboard.tryAgainLater')}</CardDescription>
            </div>
            <Button
              variant="outline"
              className="mt-2"
              onClick={() => window.location.reload()}
            >
              <RotateCw className="mr-2 h-4 w-4" />
              {t('dashboard.retry')}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (reflections.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">{t('dashboard.noReflections')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reflections.map((entry) => (
        <JournalReflection key={entry.id} entry={entry} />
      ))}
    </div>
  );
}
