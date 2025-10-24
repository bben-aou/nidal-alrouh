'use client';

import { useTranslations } from 'next-intl';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export function MoodTrackerPreview() {
  const t = useTranslations('dashboard');

  return (
    <Card className="border-dashed">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>{t('moodTracker.title')}</span>
          <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded">
            {t('moodTracker.comingSoon')}
          </span>
        </CardTitle>
        <CardDescription>{t('moodTracker.description')}</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center gap-8 py-4">
        <span className="text-4xl">🙂</span>
        <span className="text-4xl">😐</span>
        <span className="text-4xl">☹️</span>
      </CardContent>
    </Card>
  );
}
